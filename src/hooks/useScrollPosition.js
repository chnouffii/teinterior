import { useEffect, useState } from 'react';

/** Indique si la page a dépassé un seuil de défilement (header compact, bouton retour en haut). */
export default function useScrollPosition(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}
