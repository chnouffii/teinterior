import { useCallback } from 'react';

export const HEADER_OFFSET = 88;

/** Défilement fluide vers une ancre en compensant la hauteur du header fixe. */
export default function useSmoothScroll() {
  return useCallback((targetId) => {
    const element = document.getElementById(targetId);
    if (!element) return;

    const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    window.history.replaceState(null, '', `#${targetId}`);
  }, []);
}
