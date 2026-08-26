import { useEffect, useRef, useState } from 'react';

/**
 * Fait défiler un nombre jusqu'à sa valeur, à l'entrée dans le viewport.
 *
 * Les chiffres sont l'argument de l'atelier — véhicules traités, rétrofits
 * posés, délai de réponse. Les voir se poser attire l'œil dessus, là où un
 * fondu les noyait dans le reste de la page.
 *
 * La valeur d'arrivée est rendue telle quelle tant que l'animation n'a pas
 * commencé : le texte est donc complet dans le HTML pré-rendu, et le compteur
 * ne s'active jamais si l'utilisateur a demandé moins d'animations.
 */
export default function useCompteur(texte, { duree = 1100 } = {}) {
  const ref = useRef(null);
  const [affiche, setAffiche] = useState(texte);

  useEffect(() => {
    const noeud = ref.current;
    if (!noeud) return undefined;

    // Un nombre, éventuellement entouré de texte : « 1 400 », « 24 h », « 4,9 ».
    const trouve = String(texte).match(/^(\D*?)([\d  ]+(?:[.,]\d+)?)(.*)$/s);
    const brut = trouve?.[2]?.replace(/[  ]/g, '').replace(',', '.');
    const cible = Number(brut);

    const moinsDeMouvement =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!trouve || !Number.isFinite(cible) || cible <= 0 || moinsDeMouvement) return undefined;

    const [, avant, source, apres] = trouve;
    const decimales = (source.split(/[.,]/)[1] ?? '').length;
    const separateur = source.includes(',') ? ',' : '.';
    const espace = /[  ]/.test(source);

    const ecrire = (valeur) => {
      let n = valeur.toFixed(decimales);
      if (decimales > 0) n = n.replace('.', separateur);
      if (espace) n = n.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      setAffiche(`${avant}${n}${apres}`);
    };

    let animation;
    let depart;
    const observateur = new IntersectionObserver(
      (entrees) => {
        if (!entrees.some((e) => e.isIntersecting)) return;
        observateur.disconnect();
        const avancer = (temps) => {
          depart ??= temps;
          const t = Math.min((temps - depart) / duree, 1);
          // Décélération franche : le nombre arrive vite puis se pose.
          ecrire(cible * (1 - (1 - t) ** 3));
          if (t < 1) animation = requestAnimationFrame(avancer);
        };
        animation = requestAnimationFrame(avancer);
      },
      { threshold: 0.4 }
    );

    observateur.observe(noeud);
    return () => {
      observateur.disconnect();
      cancelAnimationFrame(animation);
    };
  }, [texte, duree]);

  return [ref, affiche];
}
