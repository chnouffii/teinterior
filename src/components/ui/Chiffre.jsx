import useCompteur from '../../hooks/useCompteur.js';

/** Un chiffre-clé, qui se pose à l'entrée dans le viewport. */
export default function Chiffre({ valeur, className = '' }) {
  const [ref, affiche] = useCompteur(valeur);
  return (
    <span ref={ref} className={className}>
      {affiche}
    </span>
  );
}
