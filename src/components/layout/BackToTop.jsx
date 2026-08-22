import { ArrowUp } from 'lucide-react';
import useScrollPosition from '../../hooks/useScrollPosition.js';

export default function BackToTop() {
  const visible = useScrollPosition(900);

  const goTop = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Revenir en haut de la page"
      className={`fixed bottom-24 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full
        border border-white/15 bg-carbon-900/90 text-white shadow-card backdrop-blur transition-all duration-300
        hover:border-brass/50 hover:text-brass-light sm:bottom-8 ${
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
