import { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Fenêtre modale d'affichage d'un chantier.
 *
 * Écrite à la main plutôt qu'avec `<dialog>` : l'élément natif ne se prête pas
 * au rendu serveur (il faut appeler `showModal()` en JavaScript, donc après
 * l'hydratation) et son fond ne se met pas en forme de la même manière selon
 * les navigateurs. Ce qu'il apporte est reproduit ici : fermeture au clavier,
 * focus rendu à son point de départ, et arrière-plan inerte.
 */
export default function Visionneuse({ ouvert, onFermer, titre, children }) {
  const boite = useRef(null);
  const declencheur = useRef(null);

  const fermer = useCallback(() => onFermer(), [onFermer]);

  useEffect(() => {
    if (!ouvert) return undefined;

    // Le focus revient d'où il vient à la fermeture : sans cela, le lecteur
    // d'écran repart du haut de la page et l'utilisateur au clavier perd sa
    // position dans la galerie.
    declencheur.current = document.activeElement;
    boite.current?.focus();

    const auClavier = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        fermer();
        return;
      }
      if (event.key !== 'Tab') return;

      // Le focus tourne en boucle dans la fenêtre : derrière elle, la page
      // est masquée aux lecteurs d'écran, y tabuler n'aurait aucun sens.
      const cibles = boite.current?.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!cibles || cibles.length === 0) return;
      const premier = cibles[0];
      const dernier = cibles[cibles.length - 1];
      if (event.shiftKey && document.activeElement === premier) {
        event.preventDefault();
        dernier.focus();
      } else if (!event.shiftKey && document.activeElement === dernier) {
        event.preventDefault();
        premier.focus();
      }
    };

    document.addEventListener('keydown', auClavier);
    const defilement = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', auClavier);
      document.body.style.overflow = defilement;
      if (declencheur.current instanceof HTMLElement) declencheur.current.focus();
    };
  }, [ouvert, fermer]);

  if (!ouvert) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-ink-950/85 p-4 backdrop-blur-sm sm:p-8"
      onMouseDown={(event) => {
        // `mousedown` et non `click` : un glisser commencé sur la photo et
        // relâché sur le fond aurait fermé la fenêtre en plein défilement.
        if (event.target === event.currentTarget) fermer();
      }}
    >
      <div
        ref={boite}
        role="dialog"
        aria-modal="true"
        aria-label={titre}
        tabIndex={-1}
        className="relative w-full max-w-4xl rounded-lg border border-white/10 bg-ink-900 shadow-2xl focus:outline-none"
      >
        <button
          type="button"
          onClick={fermer}
          aria-label="Fermer"
          className="tap absolute right-2 top-2 z-10 flex items-center justify-center rounded-full
            border border-white/15 bg-ink-950/80 text-fg backdrop-blur transition-colors hover:bg-ink-950"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
