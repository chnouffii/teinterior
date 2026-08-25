/**
 * Sections du site public qu'on peut afficher ou masquer.
 *
 * Chaque entrée gouverne un bloc réellement indépendant : le masquer ne laisse
 * ni page vide, ni lien de navigation qui ne mène nulle part. Les pages
 * entières — Prestations, Véhicules, Réalisations — n'y figurent donc pas :
 * les retirer demanderait aussi de les sortir du menu, du plan du site et des
 * liens internes, ce qu'un interrupteur ne saurait faire proprement.
 *
 * L'identifiant est stable ; seul le libellé peut changer.
 */
export const SECTIONS = [
  {
    id: 'avis',
    label: 'Avis clients',
    ou: 'Accueil, Réalisations et pages locales',
    detail:
      'Les témoignages et la note moyenne. Masqués, la note disparaît aussi partout où elle est citée.',
  },
  {
    id: 'metiers',
    label: 'Les trois métiers',
    ou: 'Accueil',
    detail: 'Les trois cartes qui renvoient vers Prestations, Rétrofit et Vendre sa voiture.',
  },
  {
    id: 'chiffresAccueil',
    label: 'Chiffres de l’accueil',
    ou: 'Accueil',
    detail: 'La bande de quatre chiffres sous l’accroche.',
  },
  {
    id: 'showroomAccueil',
    label: 'Véhicules sur l’accueil',
    ou: 'Accueil',
    detail:
      'L’aperçu de trois véhicules. La page Véhicules à vendre reste accessible par le menu.',
  },
  {
    id: 'avantApres',
    label: 'Comparateur avant / après',
    ou: 'Prestations',
    detail: 'Le curseur qui fait glisser la photo avant sur la photo après.',
  },
  {
    id: 'optionsCarte',
    label: 'Options à la carte',
    ou: 'Prestations',
    detail: 'Le tableau des prestations complémentaires, sous les formules.',
  },
  {
    id: 'bandeauDevis',
    label: 'Bandeau « Demander un devis »',
    ou: 'Bas de presque toutes les pages',
    detail: 'L’encart d’appel à l’action avant le pied de page.',
  },
];

/** Toutes visibles par défaut : un site neuf montre ce qu'il a. */
export const SECTIONS_PAR_DEFAUT = Object.fromEntries(SECTIONS.map((s) => [s.id, true]));

/**
 * Une section est visible sauf si elle a été explicitement masquée.
 *
 * Le sens du test compte : une section ajoutée par une nouvelle version du site
 * et absente du fichier de contenus du serveur doit s'afficher, pas disparaître.
 */
export const sectionVisible = (sections, id) => sections?.[id] !== false;
