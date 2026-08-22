import { AlertTriangle, Check, Loader2, WifiOff } from 'lucide-react';
import { useSiteStore } from '../../store/siteStore';

/**
 * Indicateur d'enregistrement.
 *
 * Les écrans d'édition n'ont pas de bouton « Enregistrer » : les modifications
 * partent au serveur d'elles-mêmes. Sans retour visible, on ne saurait pas si
 * un changement est publié — c'est le rôle de ce témoin.
 */
export default function EtatSync() {
  const enregistrement = useSiteStore((state) => state.enregistrement);
  const erreur = useSiteStore((state) => state.erreurSync);
  const horsLigne = useSiteStore((state) => state.horsLigne);

  if (horsLigne) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded border border-signal-danger/40 bg-signal-danger/10 px-2.5 py-1 text-[11px] font-medium text-signal-danger"
        role="status"
      >
        <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
        Serveur injoignable — modifications non enregistrées
      </span>
    );
  }

  if (erreur) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded border border-signal-danger/40 bg-signal-danger/10 px-2.5 py-1 text-[11px] font-medium text-signal-danger"
        role="alert"
        title={erreur}
      >
        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
        Échec de l’enregistrement
      </span>
    );
  }

  if (enregistrement) {
    return (
      <span
        className="inline-flex items-center gap-2 rounded border border-white/10 px-2.5 py-1 text-[11px] font-medium text-muted"
        role="status"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
        Enregistrement…
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2 rounded border border-signal-ok/30 bg-signal-ok/10 px-2.5 py-1 text-[11px] font-medium text-signal-ok"
      role="status"
    >
      <Check className="h-3.5 w-3.5" aria-hidden="true" />
      Publié
    </span>
  );
}
