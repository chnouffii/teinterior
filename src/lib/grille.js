/**
 * Nombre de colonnes d'une grille de chiffres, selon ce qu'elle contient.
 *
 * Ces bandeaux posent un fond clair sous des cases opaques séparées d'un
 * pixel : le fond fait office de filet. Une colonne vide n'y est donc pas
 * neutre, elle laisse un aplat gris là où un chiffre devrait être. Comme les
 * listes sont renseignées depuis le panel, le compte doit suivre la saisie.
 *
 * Les classes sont écrites en toutes lettres : Tailwind lit le code source
 * pour décider quoi générer, et ne voit pas les noms construits à l'exécution.
 */
const SM = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
};

const LG = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
};

export const colonnesSm = (nombre) => SM[nombre] ?? 'sm:grid-cols-3';
export const colonnesLg = (nombre) => LG[nombre] ?? 'lg:grid-cols-4';
