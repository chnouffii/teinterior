/**
 * Client de l'API de contenus.
 *
 * En production, nginx relaie `/api/` vers le service Node. En développement,
 * `vite.config.js` fait le même relais vers http://127.0.0.1:8787.
 *
 * Toutes les requêtes envoient le cookie de session (`credentials: 'include'`),
 * qui est `HttpOnly` : le JavaScript ne peut pas le lire, seul le navigateur le
 * joint aux appels.
 */

const BASE = '/api';

export class ApiError extends Error {
  constructor(message, statut) {
    super(message);
    this.name = 'ApiError';
    this.statut = statut;
  }
}

async function appeler(chemin, options = {}) {
  let reponse;
  try {
    reponse = await fetch(`${BASE}${chemin}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Serveur injoignable.', 0);
  }

  if (reponse.status === 204) return null;

  const corps = await reponse.json().catch(() => ({}));
  if (!reponse.ok) {
    throw new ApiError(corps.error || `Erreur ${reponse.status}.`, reponse.status);
  }
  return corps;
}

export const api = {
  /** Contenus publics du site. */
  lireContenus: () => appeler('/content'),

  /** Enregistre une partie des contenus (fusion côté serveur). */
  enregistrerContenus: (partiel) =>
    appeler('/content', { method: 'PUT', body: JSON.stringify(partiel) }),

  connexion: (email, password) =>
    appeler('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  deconnexion: () => appeler('/logout', { method: 'POST' }),

  session: () => appeler('/session'),

  /**
   * Dépose une image et renvoie son URL. Le corps est le binaire brut : pas de
   * multipart, donc rien à analyser côté serveur.
   */
  deposerImage: async (blob) => {
    let reponse;
    try {
      reponse = await fetch(`${BASE}/media`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': blob.type || 'application/octet-stream' },
        body: blob,
      });
    } catch {
      throw new ApiError('Serveur injoignable.', 0);
    }
    const corps = await reponse.json().catch(() => ({}));
    if (!reponse.ok) {
      throw new ApiError(corps.error || `Erreur ${reponse.status}.`, reponse.status);
    }
    return corps;
  },

  supprimerImage: (nom) => appeler(`/media/${encodeURIComponent(nom)}`, { method: 'DELETE' }),

  /** Retire du disque les images qu'aucun contenu ne référence plus. */
  nettoyerImages: () => appeler('/media/nettoyer', { method: 'POST' }),

  /** Dépôt d'une demande entrante — accessible sans être connecté. */
  creerDemande: (demande) =>
    appeler('/leads', { method: 'POST', body: JSON.stringify(demande) }),

  lireDemandes: () => appeler('/leads'),

  changerStatutDemande: (id, status) =>
    appeler(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  supprimerDemande: (id) => appeler(`/leads/${id}`, { method: 'DELETE' }),
};
