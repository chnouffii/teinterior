import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/** Barrière d'accès : renvoie vers la page de connexion si la session est absente ou expirée. */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  // On s'abonne à la session pour re-rendre après connexion / déconnexion.
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!session || !isAuthenticated()) {
    return <Navigate to="/admin/connexion" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
