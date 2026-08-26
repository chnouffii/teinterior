/** Domaine de production, utilisé pour les URL canoniques et le sitemap. */
export const SITE_URL = 'https://teinterior.fr';

export const BRAND = {
  name: 'Teintérior',
  baseline: 'Atelier automobile — Brumath',
  since: 2025,
};

export const ROUTES = {
  home: '/',
  prestations: '/prestations',
  retrofit: '/retrofit-carplay',
  vendre: '/vendre-sa-voiture',
  vehicules: '/vehicules',
  realisations: '/realisations',
  contact: '/contact',
};

export const LEGAL_ROUTE = '/mentions-legales';
export const ADMIN_ROUTE = '/admin';

export const NAV_LINKS = [
  { id: 'prestations', path: ROUTES.prestations, label: 'Prestations' },
  { id: 'retrofit', path: ROUTES.retrofit, label: 'Rétrofit CarPlay' },
  { id: 'vendre', path: ROUTES.vendre, label: 'Vendre sa voiture' },
  { id: 'vehicules', path: ROUTES.vehicules, label: 'Véhicules à vendre' },
  { id: 'realisations', path: ROUTES.realisations, label: 'Réalisations' },
  { id: 'contact', path: ROUTES.contact, label: 'Contact' },
];

/** Les trois métiers, présentés sur la page d'accueil. */
export const POLES = [
  {
    id: 'esthetique',
    index: '01',
    icon: 'Gem',
    accent: 'brass',
    title: 'Esthétique',
    lead: 'Lavage complet, remise en état de l’habitacle, cuir, plastiques et odeurs.',
    points: [
      'Injection-extraction et vapeur sèche 165 °C',
      'Cuir nourri au pH 5,5, plastiques rénovés mats',
      'Devis détaillé ligne par ligne, dès 49 €',
    ],
    to: ROUTES.prestations,
    cta: 'Voir le détail des packs',
  },
  {
    id: 'retrofit',
    index: '02',
    icon: 'MonitorSmartphone',
    accent: 'ice',
    title: 'Rétrofit multimédia',
    lead: 'CarPlay et Android Auto intégrés à l’écran d’usine, faisceau d’origine intact.',
    points: [
      '18 systèmes embarqués référencés',
      'Aucun câble coupé, retour d’origine en 30 min',
      'Garantie 2 ans pièces et pose',
    ],
    to: ROUTES.retrofit,
    cta: 'Chercher ma compatibilité',
  },
  {
    id: 'sourcing',
    index: '03',
    icon: 'Handshake',
    accent: 'brass',
    title: 'Vente et sourcing',
    lead: 'Dépôt-vente préparé et photographié, ou recherche du véhicule que vous cherchez.',
    points: [
      '23 jours de délai moyen de vente',
      'Fonds vérifiés avant remise des clés',
    ],
    to: ROUTES.vendre,
    cta: 'Faire estimer un véhicule',
  },
];

export const CONTACT = {
  /**
   * Les deux lignes de l'atelier. La première est celle affichée dans le header
   * et sur la barre d'appel mobile ; les deux apparaissent en pied de page et
   * sur la page contact. Modifiable depuis Admin → Contenu.
   */
  phones: [
    { id: 'ligne-1', label: 'Atelier', number: '07 50 09 36 39', href: 'tel:+33750093639' },
    { id: 'ligne-2', label: 'Second contact', number: '06 19 51 89 63', href: 'tel:+33619518963' },
  ],
  email: 'contact@teinterior.fr',
  emailHref: 'mailto:contact@teinterior.fr',
  whatsapp: 'https://wa.me/33750093639',
  address: {
    street: '4 rue des Carrières',
    zone: '',
    city: '67170 Brumath',
    /**
     * Coordonnées GPS exactes de l'atelier, pour le référencement local.
     * ⚠ À RENSEIGNER : clic droit sur votre porte dans Google Maps →
     * « Plus d'infos sur cet endroit » affiche latitude puis longitude.
     * Laissées vides volontairement : des coordonnées approximatives placeraient
     * votre point ailleurs dans Brumath sur la carte des résultats.
     */
    lat: null,
    lon: null,
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=4+rue+des+Carrieres+67170+Brumath',
  },
  hours: [
    { day: 'Lundi — Vendredi', value: '08h30 — 19h00' },
    { day: 'Samedi', value: '09h00 — 17h00' },
    { day: 'Dimanche', value: 'Sur rendez-vous' },
  ],
  socials: [
    { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/teinterior_/' },
  ],
};

/** Ligne principale — raccourci utilisé par le header et la barre d'appel. */
export const primaryPhone = (contact) => contact.phones?.[0] ?? { number: '', href: '' };

/**
 * Demandes qui ne correspondent à aucune prestation du catalogue.
 *
 * Le reste de la liste du formulaire de contact est construit à partir des
 * prestations et des options réellement publiées — voir `choixDePrestation`.
 * Cette liste-ci était autrefois complète et recopiait les noms des formules :
 * une prestation renommée, ajoutée ou supprimée depuis le panel ne changeait
 * rien au formulaire, et un visiteur pouvait demander un devis pour une
 * prestation qui n'existait plus.
 */
export const AUTRES_DEMANDES = [
  { value: 'retrofit', label: 'Rétrofit CarPlay / Android Auto' },
  { value: 'depot-vente', label: 'Dépôt-vente / estimation' },
  { value: 'sourcing', label: 'Recherche de véhicule' },
  { value: 'autre', label: 'Autre demande' },
];

/**
 * Le contenu du menu « Prestation souhaitée », groupé.
 *
 * La valeur de chaque entrée est l'identifiant de la prestation : c'est lui
 * que les boutons « Demander ce devis » transmettent, la sélection se fait donc
 * toute seule depuis la page Prestations.
 */
export function choixDePrestation(packs = [], options = []) {
  return [
    {
      groupe: 'Formules',
      items: packs.map((pack) => ({ value: pack.id, label: pack.name })),
    },
    {
      groupe: 'Options à la carte',
      items: options.map((option) => ({ value: option.id, label: option.label })),
    },
    { groupe: 'Autres demandes', items: AUTRES_DEMANDES },
  ].filter((groupe) => groupe.items.length > 0);
}

/** Libellé d'un identifiant de prestation, pour la demande enregistrée. */
export function libelleDePrestation(groupes, valeur) {
  for (const groupe of groupes) {
    const trouve = groupe.items.find((item) => item.value === valeur);
    if (trouve) return trouve.label;
  }
  return null;
}

export const LEGAL_LINKS = [
  { id: 'mentions', path: `${LEGAL_ROUTE}#mentions`, label: 'Mentions légales' },
  { id: 'cgv', path: `${LEGAL_ROUTE}#cgv`, label: 'CGV' },
  { id: 'confidentialite', path: `${LEGAL_ROUTE}#confidentialite`, label: 'Confidentialité' },
  { id: 'cookies', path: `${LEGAL_ROUTE}#cookies`, label: 'Cookies' },
];

export const COMPANY = {
  legalName: 'Teintérior',
  /**
   * ⚠ À COMPLÉTER avant toute mise en ligne — ces mentions sont obligatoires
   * (art. 6 III LCEN) et les valeurs ci-dessous sont volontairement vides
   * plutôt que fictives.
   */
  capital: '',
  siret: '',
  rcs: '',
  vat: '',
  director: 'Direction de la publication : le représentant légal de Teintérior',
  host: 'Hébergeur : OVHcloud, 2 rue Kellermann, 59100 Roubaix, France',
  insurance: '',
};
