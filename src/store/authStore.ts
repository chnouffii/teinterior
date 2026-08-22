import { create } from 'zustand';
import { api, ApiError } from '../lib/api.js';

/**
 * Session d'administration.
 *
 * L'authentification est entièrement côté serveur : le mot de passe est vérifié
 * par l'API (scrypt), et la session tient dans un cookie `HttpOnly` que le
 * JavaScript ne peut pas lire. Aucun identifiant, aucun condensé n'apparaît dans
 * le code envoyé au navigateur.
 *
 * Le serveur limite aussi les tentatives par adresse IP, ce qu'un contrôle côté
 * client ne pouvait pas faire.
 */

interface AuthState {
  email: string | null;
  /** `null` tant qu'on n'a pas encore interrogé le serveur. */
  connecte: boolean | null;
  erreur: string | null;
  enCours: boolean;

  /** Vérifie auprès du serveur si une session est encore ouverte. */
  verifierSession: () => Promise<void>;
  login: (email: string, motDePasse: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  email: null,
  connecte: null,
  erreur: null,
  enCours: false,

  verifierSession: async () => {
    try {
      const { email } = (await api.session()) as { email: string };
      set({ email, connecte: true });
    } catch {
      set({ email: null, connecte: false });
    }
  },

  login: async (email, motDePasse) => {
    set({ enCours: true, erreur: null });
    try {
      const session = (await api.connexion(email, motDePasse)) as { email: string };
      set({ email: session.email, connecte: true, enCours: false });
      return true;
    } catch (erreur) {
      const message =
        erreur instanceof ApiError && erreur.statut === 0
          ? "Serveur injoignable. Vérifiez que l'API tourne."
          : (erreur as Error).message;
      set({ erreur: message, enCours: false, connecte: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.deconnexion();
    } finally {
      set({ email: null, connecte: false });
    }
  },
}));
