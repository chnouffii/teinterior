export const BRAND = {
  name: 'Teintérior',
  baseline: "L'art du détail automobile",
  claim: 'Esthétique · Rétrofit multimédia · Sourcing & dépôt-vente',
  foundedYear: 2018,
};

export const NAV_LINKS = [
  { id: 'prestations', path: '/prestations', label: 'Prestations' },
  { id: 'retrofit', path: '/retrofit-carplay', label: 'Rétrofit CarPlay' },
  { id: 'vendre', path: '/vendre-sa-voiture', label: 'Vendre sa voiture' },
  { id: 'vehicules', path: '/vehicules', label: 'Véhicules à vendre' },
  { id: 'realisations', path: '/realisations', label: 'Réalisations' },
  { id: 'contact', path: '/contact', label: 'Contact' },
];

export const ROUTES = {
  home: '/',
  prestations: '/prestations',
  retrofit: '/retrofit-carplay',
  vendre: '/vendre-sa-voiture',
  vehicules: '/vehicules',
  realisations: '/realisations',
  contact: '/contact',
};

/** Les trois pôles présentés sur la page d'accueil, chacun renvoyant vers sa page dédiée. */
export const POLES = [
  {
    id: 'esthetique',
    icon: 'Gem',
    eyebrow: 'Pôle 1',
    title: 'Esthétique automobile',
    text: 'Detailing intérieur et extérieur, correction de peinture, protection céramique 9H et teintage de vitres au film 3M.',
    bullets: ['3 formules dès 149 €', 'Céramique garantie 3 ans', 'Comparatif avant / après'],
    to: ROUTES.prestations,
    cta: 'Voir les formules',
    accent: 'brass',
  },
  {
    id: 'retrofit',
    icon: 'MonitorSmartphone',
    eyebrow: 'Pôle 2',
    title: 'Rétrofit CarPlay & Android Auto',
    text: 'Intégration sans fil dans votre écran d’usine, sans altérer le système d’origine ni couper le moindre faisceau.',
    bullets: ['40+ constructeurs couverts', 'Pose en 2 h en moyenne', 'Garantie 2 ans pièces & pose'],
    to: ROUTES.retrofit,
    cta: 'Tester ma compatibilité',
    accent: 'ice',
  },
  {
    id: 'sourcing',
    icon: 'Handshake',
    eyebrow: 'Pôle 3',
    title: 'Sourcing & dépôt-vente',
    text: 'Nous préparons, mettons en scène et vendons votre véhicule — ou nous recherchons celui que vous cherchez.',
    bullets: ['+12 % de prix de vente moyen', '23 jours de délai moyen', 'Transaction sécurisée'],
    to: ROUTES.vendre,
    cta: 'Faire estimer mon véhicule',
    accent: 'brass',
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
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=14+rue+de+la+Carrosserie+31200+Toulouse',
  },
  hours: [
    { day: 'Lundi — Vendredi', value: '08h30 — 19h00' },
    { day: 'Samedi', value: '09h00 — 17h00' },
    { day: 'Dimanche', value: 'Sur rendez-vous' },
  ],
  socials: [
    { id: 'instagram', label: 'Instagram', handle: '@teinterior', url: 'https://instagram.com' },
    { id: 'facebook', label: 'Facebook', handle: 'Teintérior Atelier', url: 'https://facebook.com' },
    { id: 'youtube', label: 'YouTube', handle: 'Teintérior TV', url: 'https://youtube.com' },
    { id: 'tiktok', label: 'TikTok', handle: '@teinterior', url: 'https://tiktok.com' },
  ],
};

export const REASSURANCE = [
  {
    id: 'soin',
    icon: 'Sparkles',
    title: 'Travail soigné',
    text: 'Un seul véhicule à la fois dans l’atelier, contrôle qualité photo avant restitution.',
  },
  {
    id: 'materiel',
    icon: 'Wrench',
    title: 'Matériel professionnel',
    text: 'Polisseuses Rupes, injection-extraction, films 3M et céramiques certifiées.',
  },
  {
    id: 'devis',
    icon: 'Timer',
    title: 'Devis rapide',
    text: 'Réponse chiffrée en moins de 24h ouvrées, sans engagement.',
  },
];

export const STATS = [
  { id: 'vehicules', value: '1 400+', label: 'Véhicules traités' },
  { id: 'note', value: '4,9/5', label: 'Note moyenne clients' },
  { id: 'retrofit', value: '380', label: 'Rétrofits CarPlay posés' },
  { id: 'delai', value: '24h', label: 'Délai de devis' },
];

export const SERVICE_OPTIONS = [
  { value: 'detailing-interieur', label: 'Soin intérieur / nettoyage profond' },
  { value: 'detailing-exterieur', label: 'Polissage / lustrage extérieur' },
  { value: 'renovation-integrale', label: 'Pack rénovation intégrale' },
  { value: 'ceramique', label: 'Protection céramique 9H' },
  { value: 'teintage', label: 'Teintage de vitres' },
  { value: 'retrofit', label: 'Rétrofit CarPlay / Android Auto' },
  { value: 'depot-vente', label: 'Dépôt-vente / estimation véhicule' },
  { value: 'sourcing', label: 'Recherche de véhicule (sourcing)' },
  { value: 'autre', label: 'Autre demande' },
];

export const LEGAL_LINKS = [
  { id: 'mentions', path: '/mentions-legales#mentions', label: 'Mentions légales' },
  { id: 'cgv', path: '/mentions-legales#cgv', label: 'Conditions générales de vente' },
  { id: 'confidentialite', path: '/mentions-legales#confidentialite', label: 'Politique de confidentialité' },
  { id: 'cookies', path: '/mentions-legales#cookies', label: 'Gestion des cookies' },
];

export const LEGAL_ROUTE = '/mentions-legales';

export const COMPANY = {
  legalName: 'Teintérior SAS',
  capital: '10 000 €',
  siret: '902 481 337 00018',
  rcs: 'RCS Toulouse 902 481 337',
  vat: 'FR38902481337',
  director: 'Direction de la publication : le représentant légal de Teintérior SAS',
  host: 'Hébergeur : OVHcloud, 2 rue Kellermann, 59100 Roubaix, France',
  insurance: 'Assurance responsabilité civile professionnelle : AXA France IARD, contrat n° 0928471',
};
