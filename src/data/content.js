/** Contenus éditables depuis le panel admin (CMS léger). */

export const HERO = {
  kicker: 'Atelier indépendant — Brumath',
  title: 'Detailing, rétrofit CarPlay et vente de véhicules.',
  subtitle:
    'Un véhicule à la fois dans l’atelier. Habitacle repris en profondeur, faisceaux jamais coupés sur les intégrations multimédia, et des devis détaillés ligne par ligne.',
  primaryCta: 'Voir les prestations',
  secondaryCta: 'Faire estimer ma voiture',
  facts: [
    { label: 'Véhicules traités depuis 2025', value: '1 400' },
    { label: 'Rétrofits CarPlay posés', value: '380' },
    { label: 'Délai de réponse sur devis', value: '24 h' },
    { label: 'Note moyenne sur 214 avis', value: '4,9' },
  ],
};

/**
 * Le chantier mis en avant en page d'accueil, modifiable depuis
 * Admin → Page d'accueil.
 *
 * Sans photo, l'illustration générée par `CarVisual` reste affichée : le bloc
 * fonctionne dès l'installation, et gagne en crédibilité dès qu'une vraie photo
 * est déposée.
 */
export const LAST_JOB = {
  enabled: true,
  eyebrow: 'Dernier passage atelier',
  title: 'Détailing complet + traitement cuir',
  vehicle: '',
  badge: 'Livrée en 48 h',
  photos: [],
  coverIndex: 0,
};

export const WORKSHOP = {
  title: 'L’atelier',
  intro:
    'Un local de 180 m² à Brumath, chauffé et éclairé en 5 000 K pour ne rien laisser passer sur un habitacle.',
  points: [
    {
      label: 'Poste de travail',
      detail: 'Éclairage Scangrip multi-température, sol résiné, aspiration à la source.',
    },
    {
      label: 'Outillage',
      detail: 'Kärcher Puzzi 10/1, nettoyeur vapeur 165 °C, générateur d’ozone, soufflette et air pulsé.',
    },
    {
      label: 'Consommables',
      detail: 'Koch-Chemie, Colourlock, dressings mats et microfibres renouvelées à chaque véhicule.',
    },
    {
      label: 'Suivi',
      detail: 'Photos avant / après à chaque étape, fiche d’intervention remise avec les clés.',
    },
  ],
};

export const BEFORE_AFTER = [
  {
    id: 'interieur',
    label: 'Habitacle',
    vehicle: 'Volkswagen Golf VII — sellerie tissu',
    scene: 'interior',
    beforeCaption: 'Avant — 120 000 km d’usage',
    afterCaption: 'Après — injection-extraction',
    summary:
      'Sièges et moquettes extraits au Puzzi 10/1 après détachage manuel, plastiques repris à la vapeur, séchage soufflerie 4 h.',
    specs: [
      { label: 'Taches traitées', value: '100 %' },
      { label: 'Séchage', value: '4 h' },
      { label: 'Passages', value: '3' },
    ],
  },
  {
    id: 'cuir',
    label: 'Sellerie cuir',
    vehicle: 'BMW Série 3 G20 — cuir Dakota noir',
    scene: 'interior',
    beforeCaption: 'Avant — cuir encrassé et mat',
    afterCaption: 'Après — nettoyé et nourri',
    summary:
      'Nettoyage au pH 5,5 sur l’ensemble des assises et des contreportes, puis lait nourrissant mat. Aucun effet brillant : le cuir retrouve son toucher d’origine, pas un vernis.',
    specs: [
      { label: 'Assises traitées', value: '5' },
      { label: 'Temps atelier', value: '1 h 15' },
      { label: 'Finition', value: 'Mate' },
    ],
  },
  {
    id: 'odeurs',
    label: 'Odeurs',
    vehicle: 'Renault Scénic — transport d’animaux',
    scene: 'interior',
    beforeCaption: 'Avant — odeur tenace',
    afterCaption: 'Après — cycle ozone',
    summary:
      'Textiles extraits puis cycle d’ozone de 60 minutes, circuit de ventilation compris, suivi d’une aération complète. L’ozone détruit la molécule odorante au lieu de la masquer.',
    specs: [
      { label: 'Cycle ozone', value: '60 min' },
      { label: 'Débit', value: '10 g/h' },
      { label: 'Aération', value: '45 min' },
    ],
  },
];

export const SOURCING_PIPELINE = [
  {
    step: '01',
    label: 'Estimation',
    detail:
      'Relevé des ventes réelles sur les 90 derniers jours, état constaté et historique. Fourchette argumentée sous 24 h, sans engagement.',
    duration: '24 h',
  },
  {
    step: '02',
    label: 'Préparation et shooting',
    detail:
      'Detailing complet offert, puis 30 photos au 35 mm sur fond neutre et une vidéo verticale de 45 s pour les annonces.',
    duration: '1 à 2 jours',
  },
  {
    step: '03',
    label: 'Diffusion et visites',
    detail:
      'Annonce publiée sur 6 plateformes, filtrage des appels, essais accompagnés à l’atelier, négociation menée par nos soins.',
    duration: '23 jours en moyenne',
  },
  {
    step: '04',
    label: 'Sécurisation des fonds',
    detail:
      'Vérification du virement avant remise des clés, certificat de cession, déclaration en ligne et procès-verbal de livraison.',
    duration: 'Le jour de la vente',
  },
];

export const SOURCING_FACTS = [
  { value: '+12 %', label: 'de prix de vente moyen constaté après préparation' },
  { value: '23 j', label: 'de délai moyen de vente sur les 12 derniers mois' },
  { value: '4,9 %', label: 'de commission unique — rien à payer si le véhicule ne part pas' },
];

export const GALLERY_FILTERS = [
  { id: 'tous', label: 'Tout' },
  { id: 'detailing', label: 'Detailing' },
  { id: 'carplay', label: 'CarPlay' },
  { id: 'vente', label: 'Vente' },
];

export const GALLERY_ITEMS = [
  {
    id: 'r1',
    category: 'detailing',
    title: 'Audi RS4 — détailing complet',
    meta: '4 h atelier · habitacle repris · cuir nourri',
    scene: 'interior',
    palette: ['#2E1C22', '#6B3541'],
    body: 'berline',
  },
  {
    id: 'r2',
    category: 'carplay',
    title: 'BMW Série 3 F30 — interface NBT',
    meta: '2 h de pose · molette iDrive conservée · caméra ajoutée',
    scene: 'screen',
    palette: ['#182029', '#2F4A5E'],
  },
  {
    id: 'r3',
    category: 'vente',
    title: 'Porsche Macan S — dépôt-vente',
    meta: 'Vendue en 11 jours au prix demandé · 6 plateformes',
    scene: 'sale',
    palette: ['#1B2333', '#38496B'],
    body: 'suv',
  },
  {
    id: 'r4',
    category: 'detailing',
    title: 'Golf VIII — plastiques rénovés',
    meta: '1 h · plastiques extérieurs ternis · dressing mat',
    scene: 'interior',
    palette: ['#1A2226', '#33484F'],
    body: 'citadine',
  },
  {
    id: 'r5',
    category: 'detailing',
    title: 'Volvo XC60 — habitacle repris',
    meta: '6 h · cuir Colourlock · ozone 60 min',
    scene: 'interior',
    palette: ['#26211B', '#4E4335'],
  },
  {
    id: 'r6',
    category: 'carplay',
    title: 'Porsche Cayenne — PCM 4.1',
    meta: '2 h 30 · Android Auto ajouté · Burmester conservé',
    scene: 'screen',
    palette: ['#1A1F2B', '#333C57'],
  },
  {
    id: 'r7',
    category: 'vente',
    title: 'Mercedes Classe C break — sourcing',
    meta: 'Trouvée en Allemagne · expertise sur place · import géré',
    scene: 'sale',
    palette: ['#24282E', '#474F59'],
    body: 'break',
  },
  {
    id: 'r8',
    category: 'detailing',
    title: 'Tesla Model 3 — lavage complet',
    meta: '1 h 30 · deux seaux · séchage sans contact',
    scene: 'sale',
    palette: ['#2A2E32', '#5C646C'],
    body: 'berline',
  },
  {
    id: 'r9',
    category: 'carplay',
    title: 'Audi A5 B8 — MMI 3G',
    meta: '2 h 30 · micro externe · commandes au volant actives',
    scene: 'screen',
    palette: ['#1D2622', '#33514A'],
  },
];

/** Synthèse affichée au-dessus des avis. Modifiable depuis Admin → Contenu. */
export const REVIEW_SUMMARY = {
  rating: '4,9',
  scale: '5',
  count: '214',
};

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Julien M.',
    city: 'Vendenheim',
    service: 'Détailing complet',
    rating: 5,
    date: 'Juin 2026',
    text: "Ils m'ont montré ce qui partirait et ce qui ne partirait pas avant de commencer, tache par tache. C'est la première fois qu'un pro m'annonce une limite au lieu de me promettre du neuf.",
  },
  {
    id: 't2',
    name: 'Sabrina L.',
    city: 'Haguenau',
    service: 'Rétrofit CarPlay',
    rating: 5,
    date: 'Mai 2026',
    text: "CarPlay sans fil sur mon Q5 en deux heures, faisceau d'origine intact. Le tarif du configurateur était exactement le tarif facturé, sans supplément de dernière minute.",
  },
  {
    id: 't3',
    name: 'Marc D.',
    city: 'Schiltigheim',
    service: 'Dépôt-vente',
    rating: 5,
    date: 'Avril 2026',
    text: "Macan vendue en 11 jours au prix demandé. Ils ont géré les onze appels, les trois visites et le virement. Je n'ai signé que le certificat de cession.",
  },
  {
    id: 't4',
    name: 'Élodie P.',
    city: 'Hoerdt',
    service: 'Remise en état intérieur',
    rating: 5,
    date: 'Mars 2026',
    text: "Deux enfants et un chien pendant dix ans. Je pensais devoir changer la sellerie, l'injection-extraction a suffi. Aucune odeur au bout de trois mois.",
  },
  {
    id: 't5',
    name: 'Karim B.',
    city: 'Bischwiller',
    service: 'Traitement anti-odeurs',
    rating: 5,
    date: 'Février 2026',
    text: "Odeur de tabac dans une voiture achetée d'occasion. Cycle d'ozone et habitacle repris : plus rien au bout de six mois, et ils m'avaient prévenu que la ventilation devait y passer aussi.",
  },
  {
    id: 't6',
    name: 'Nathalie R.',
    city: 'Strasbourg',
    service: 'Sourcing',
    rating: 5,
    date: 'Janvier 2026',
    text: "Je cherchais un break récent avec un vrai historique. Ils l'ont trouvé, expertisé sur place et livré préparé. Deux mauvaises affaires évitées au passage.",
  },
];
