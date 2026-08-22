import { useEffect, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Barrière d'accès au panel.
 *
 * L'état de session vient du serveur : au premier rendu on ne sait pas encore
 * si le cookie est valide, on attend donc la réponse avant de rediriger. Sans
 * cette attente, un rafraîchissement de page renverrait systématiquement vers
 * l'écran de connexion alors que la session est ouverte.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const connecte = useAuthStore((state) => state.connecte);
  const verifierSession = useAuthStore((state) => state.verifierSession);

  useEffect(() => {
    if (connecte === null) verifierSession();
  }, [connecte, verifierSession]);

  if (connecte === null) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-faint">
        Vérification de la session…
      </div>
    );
  }

  if (!connecte) {
    return <Navigate to="/admin/connexion" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
