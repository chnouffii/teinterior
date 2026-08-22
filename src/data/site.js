export const BRAND = {
  name: 'Teintérior',
  baseline: 'Atelier automobile — Toulouse',
  since: 2018,
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
    title: 'Esthétique',
    lead: 'Remise en état intérieur, correction de peinture, céramique et teintage.',
    points: [
      'Vernis mesuré à la jauge avant chaque passe',
      'Rupes LHR 15 Mark III, Menzerna, CarPro',
      'Devis détaillé ligne par ligne, dès 149 €',
    ],
    to: ROUTES.prestations,
    cta: 'Voir le détail des packs',
  },
  {
    id: 'retrofit',
    index: '02',
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
    title: 'Vente et sourcing',
    lead: 'Dépôt-vente préparé et photographié, ou recherche du véhicule que vous cherchez.',
    points: [
      '23 jours de délai moyen de vente',
      'Commission unique de 4,9 %, rien si pas de vente',
      'Fonds vérifiés avant remise des clés',
    ],
    to: ROUTES.vendre,
    cta: 'Faire estimer un véhicule',
  },
];

export const CONTACT = {
  phone: '06 32 18 47 90',
  phoneHref: 'tel:+33632184790',
  email: 'contact@teinterior.fr',
  emailHref: 'mailto:contact@teinterior.fr',
  whatsapp: 'https://wa.me/33632184790',
  address: {
    street: '14 rue de la Carrosserie',
    zone: 'ZA des Chênes — Bâtiment C',
    city: '31200 Toulouse',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=14+rue+de+la+Carrosserie+31200+Toulouse',
  },
  hours: [
    { day: 'Lundi — Vendredi', value: '08h30 — 19h00' },
    { day: 'Samedi', value: '09h00 — 17h00' },
    { day: 'Dimanche', value: 'Sur rendez-vous' },
  ],
  socials: [
    { id: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
    { id: 'facebook', label: 'Facebook', url: 'https://facebook.com' },
    { id: 'youtube', label: 'YouTube', url: 'https://youtube.com' },
  ],
};

export const SERVICE_OPTIONS = [
  { value: 'interieur', label: 'Remise en état intérieur' },
  { value: 'correction-1', label: 'Correction peinture — 1 passe' },
  { value: 'integrale', label: 'Rénovation intégrale + céramique' },
  { value: 'teintage', label: 'Teintage de vitres' },
  { value: 'retrofit', label: 'Rétrofit CarPlay / Android Auto' },
  { value: 'depot-vente', label: 'Dépôt-vente / estimation' },
  { value: 'sourcing', label: 'Recherche de véhicule' },
  { value: 'autre', label: 'Autre demande' },
];

export const LEGAL_LINKS = [
  { id: 'mentions', path: `${LEGAL_ROUTE}#mentions`, label: 'Mentions légales' },
  { id: 'cgv', path: `${LEGAL_ROUTE}#cgv`, label: 'CGV' },
  { id: 'confidentialite', path: `${LEGAL_ROUTE}#confidentialite`, label: 'Confidentialité' },
  { id: 'cookies', path: `${LEGAL_ROUTE}#cookies`, label: 'Cookies' },
];

export const COMPANY = {
  legalName: 'Teintérior SAS',
  capital: '10 000 €',
  siret: '902 481 337 00018',
  rcs: 'RCS Toulouse 902 481 337',
  vat: 'FR38902481337',
  director: 'Direction de la publication : le représentant légal de Teintérior SAS',
  host: 'Hébergeur : OVHcloud, 2 rue Kellermann, 59100 Roubaix, France',
  insurance:
    'Assurance responsabilité civile professionnelle : AXA France IARD, contrat n° 0928471',
};
