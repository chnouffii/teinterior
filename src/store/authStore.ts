import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Session d'administration.
 *
 * ⚠️ Sécurité : cette application n'a pas de back-end. Le contrôle d'accès est
 * donc côté client uniquement — il empêche un accès occasionnel au panel, pas un
 * utilisateur déterminé qui lirait le bundle. Avant une mise en production
 * publique, `login()` doit être remplacé par un appel serveur renvoyant un JWT
 * signé, et les routes d'écriture doivent être protégées côté API.
 *
 * Le mot de passe n'est jamais stocké en clair : seul un condensé SHA-256 salé
 * est conservé. Le jeton de session vit dans sessionStorage et expire au bout de
 * huit heures ou à la fermeture de l'onglet.
 */

const SALT = 'teinterior-admin-v1';
const SESSION_HOURS = 8;

/** Identifiants livrés par défaut — à changer depuis Admin → Contenu → Compte. */
export const DEFAULT_ADMIN_EMAIL = 'admin@teinterior.fr';
const DEFAULT_PASSWORD_HASH =
  'e83cbf6377fd8729442592752976048215e4c79612e498880fc632d831e8a584';

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${SALT}${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

interface Session {
  token: string;
  email: string;
  expiresAt: number;
}

const SESSION_KEY = 'teinterior-session';

/** Relit la session en cours dans sessionStorage (survit à un rechargement, pas à la fermeture). */
function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  try {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* stockage indisponible : la session reste en mémoire */
  }
}

interface AuthState {
  email: string;
  passwordHash: string;
  session: Session | null;
  failedAttempts: number;
  lockedUntil: number | null;

  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: () => boolean;
  changePassword: (
    current: string,
    next: string
  ) => Promise<{ ok: boolean; error?: string }>;
  changeEmail: (email: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash: DEFAULT_PASSWORD_HASH,
      session: readSession(),
      failedAttempts: 0,
      lockedUntil: null,

      login: async (email, password) => {
        const { lockedUntil } = get();
        if (lockedUntil && Date.now() < lockedUntil) {
          const seconds = Math.ceil((lockedUntil - Date.now()) / 1000);
          return { ok: false, error: `Trop de tentatives. Réessayez dans ${seconds} s.` };
        }

        const hash = await hashPassword(password);
        const state = get();
        const valid =
          email.trim().toLowerCase() === state.email.toLowerCase() &&
          hash === state.passwordHash;

        if (!valid) {
          const attempts = state.failedAttempts + 1;
          set({
            failedAttempts: attempts,
            lockedUntil: attempts >= 5 ? Date.now() + 60_000 : null,
          });
          return { ok: false, error: 'Identifiants incorrects.' };
        }

        const session: Session = {
          token: crypto.randomUUID(),
          email: state.email,
          expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
        };
        writeSession(session);
        set({ failedAttempts: 0, lockedUntil: null, session });
        return { ok: true };
      },

      logout: () => {
        writeSession(null);
        set({ session: null });
      },

      isAuthenticated: () => {
        const { session } = get();
        if (!session) return false;
        if (Date.now() > session.expiresAt) {
          writeSession(null);
          set({ session: null });
          return false;
        }
        return true;
      },

      changePassword: async (current, next) => {
        if (next.length < 10) {
          return { ok: false, error: 'Le nouveau mot de passe doit faire au moins 10 caractères.' };
        }
        const currentHash = await hashPassword(current);
        if (currentHash !== get().passwordHash) {
          return { ok: false, error: 'Mot de passe actuel incorrect.' };
        }
        set({ passwordHash: await hashPassword(next) });
        return { ok: true };
      },

      changeEmail: (email) => set({ email: email.trim().toLowerCase() }),
    }),
    {
      name: 'teinterior-auth',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // La session vit dans sessionStorage : elle disparaît à la fermeture de l'onglet.
      partialize: (state) => ({
        email: state.email,
        passwordHash: state.passwordHash,
      }),
    }
  )
);
