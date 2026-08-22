import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HEADER_OFFSET } from '../../hooks/useSmoothScroll.js';

/**
 * Comportement de navigation attendu sur un site multipage :
 * retour en haut à chaque changement de page, ou défilement vers l'ancre demandée.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'auto' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return null;
}
