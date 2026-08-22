export const DETAILING_PACKAGES = [
  {
    id: 'interieur',
    name: 'Intérieur Signature',
    tagline: 'Remise à neuf de l’habitacle',
    icon: 'Armchair',
    price: 149,
    priceSuffix: 'à partir de',
    duration: '3 à 4 h',
    accent: 'ice',
    popular: false,
    description:
      'Un habitacle assaini en profondeur : textiles, cuirs, plastiques et zones oubliées reprises une à une.',
    includes: [
      'Aspiration complète coffre, sièges, rails et sous-tapis',
      'Injection-extraction des moquettes et sièges tissu',
      'Nettoyage vapeur des plastiques, aérateurs et joints',
      'Nettoyage cuir pH neutre + lait nourrissant protecteur',
      'Traitement anti-odeurs par ozone (60 min)',
      'Vitres intérieures sans traces et rétroviseurs',
      'Détails à la brosse : boutons, coutures, seuils de portes',
    ],
    idealFor: 'Citadines et berlines familiales, retour de location, avant revente.',
  },
  {
    id: 'exterieur',
    name: 'Éclat Extérieur',
    tagline: 'Lavage, décontamination & lustrage',
    icon: 'Sparkles',
    price: 179,
    priceSuffix: 'à partir de',
    duration: '4 à 6 h',
    accent: 'brass',
    popular: false,
    description:
      'On efface le voile terne : la peinture retrouve sa profondeur et repart protégée pour plusieurs mois.',
    includes: [
      'Prélavage mousse active + lavage 2 seaux pH neutre',
      'Décontamination ferreuse et argile de surface',
      'Séchage air pulsé et microfibres premium',
      'Polissage 1 passe — correction 60 à 70 % des micro-rayures',
      'Jantes détaillées, passages de roues et étriers',
      'Dressing pneus finition satinée',
      'Cire hybride SiO2 — protection 3 à 4 mois',
    ],
    idealFor: 'Peintures ternes, traces de tourbillons, véhicules stationnés dehors.',
  },
  {
    id: 'integrale',
    name: 'Pack Rénovation Intégrale',
    tagline: 'Le traitement complet Teintérior',
    icon: 'Gem',
    price: 690,
    priceSuffix: 'à partir de',
    duration: '2 à 3 jours',
    accent: 'brass',
    popular: true,
    description:
      'Intérieur + extérieur + protections longue durée. La formule choisie avant une vente ou pour un véhicule de collection.',
    includes: [
      'Intégralité des formules Intérieur Signature et Éclat Extérieur',
      'Correction de peinture 2 à 3 passes — jusqu’à 90 % des défauts',
      'Protection céramique 9H garantie 3 ans (carnet de suivi)',
      'Teintage des 4 vitres latérales — film 3M au choix',
      'Rénovation des optiques et polissage des inox',
      'Céramique jantes et traitement hydrophobe pare-brise',
      'Reportage photo studio de 20 clichés offert',
    ],
    idealFor: 'Véhicules premium, préparation de vente, sorties de concession.',
  },
];

export const DETAILING_OPTIONS = [
  { id: 'teintage', label: 'Teintage vitres (film 3M, 5 à 70 %)', price: 'dès 189 €', icon: 'PanelTop' },
  { id: 'ceramique', label: 'Protection céramique 9H — 3 ans', price: 'dès 490 €', icon: 'ShieldCheck' },
  { id: 'optiques', label: 'Rénovation d’optiques (la paire)', price: '79 €', icon: 'Lightbulb' },
  { id: 'pare-brise', label: 'Traitement hydrophobe pare-brise', price: '49 €', icon: 'CloudRain' },
  { id: 'ozone', label: 'Désinfection ozone anti-odeurs', price: '39 €', icon: 'Wind' },
  { id: 'moteur', label: 'Nettoyage de compartiment moteur', price: '69 €', icon: 'Cog' },
];

export const BEFORE_AFTER = [
  {
    id: 'lustrage',
    label: 'Lustrage & correction de peinture',
    vehicle: 'Audi A5 Sportback — noir mythos',
    summary:
      'Deux passes de correction sur peinture marquée par le lavage automatique, puis scellement céramique.',
    scene: 'polish',
    beforeCaption: 'Micro-rayures & voile terne',
    afterCaption: 'Profondeur miroir + céramique',
    stats: [
      { label: 'Défauts corrigés', value: '92 %' },
      { label: 'Temps atelier', value: '11 h' },
    ],
  },
  {
    id: 'teintage',
    label: 'Teintage de vitres',
    vehicle: 'BMW Série 3 G20 — film 3M 20 %',
    summary:
      'Pose à chaud sans découpe sur véhicule, film anti-UV 99 % garanti à vie contre le décollement.',
    scene: 'tint',
    beforeCaption: 'Vitrage d’origine clair',
    afterCaption: 'Film 3M 20 % anti-UV',
    stats: [
      { label: 'UV bloqués', value: '99 %' },
      { label: 'Chaleur rejetée', value: '58 %' },
    ],
  },
  {
    id: 'interieur',
    label: 'Rénovation d’habitacle',
    vehicle: 'Volkswagen Golf VII — sellerie tissu',
    summary:
      'Injection-extraction complète, vapeur sur plastiques et traitement ozone après 120 000 km de trajets.',
    scene: 'interior',
    beforeCaption: 'Sellerie encrassée',
    afterCaption: 'Textiles assainis',
    stats: [
      { label: 'Taches traitées', value: '100 %' },
      { label: 'Séchage', value: '4 h' },
    ],
  },
];
