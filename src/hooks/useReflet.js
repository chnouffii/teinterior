import { useCallback } from 'react';

/**
 * Fait suivre au reflet la position du curseur sur une carte.
 *
 * On écrit deux variables CSS plutôt que de piloter un style complet depuis
 * React : le navigateur repeint alors le seul dégradé, sans repasser par un
 * rendu de composant à chaque mouvement de souris.
 *
 * Rien n'est posé au clavier ni au toucher : la classe `reflet` allume déjà
 * une lueur centrée au focus, ce qui suffit.
 */
export default function useReflet() {
  return useCallback((evenement) => {
    const noeud = evenement.currentTarget;
    const cadre = noeud.getBoundingClientRect();
    noeud.style.setProperty('--reflet-x', `${((evenement.clientX - cadre.left) / cadre.width) * 100}%`);
    noeud.style.setProperty('--reflet-y', `${((evenement.clientY - cadre.top) / cadre.height) * 100}%`);
  }, []);
}
