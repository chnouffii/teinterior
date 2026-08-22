/**
 * Rétrofit CarPlay / Android Auto.
 * Le catalogue est organisé comme un sélecteur de pièces : marque > modèle >
 * système embarqué d'origine, chaque entrée portant sa référence d'interface.
 */

export const FITMENT = {
  plug: {
    id: 'plug',
    label: 'Plug and play',
    detail: 'L’interface se branche entre l’écran et le faisceau d’origine. Aucun câble coupé, aucun connecteur sertit.',
    tone: 'ok',
  },
  module: {
    id: 'module',
    label: 'Module dédié',
    detail: 'Boîtier vidéo spécifique à cette génération, logé derrière la façade, avec codage du véhicule.',
    tone: 'accent',
  },
  reserve: {
    id: 'reserve',
    label: 'Sous réserve',
    detail: 'Intégration possible mais une fonction d’origine reste limitée. Le détail est donné avant la réservation.',
    tone: 'warn',
  },
  etude: {
    id: 'etude',
    label: 'À vérifier',
    detail: 'Référence d’unité multimédia à confirmer sur photo avant commande de l’interface.',
    tone: 'neutral',
  },
};

export const RETROFIT_PROCESS = [
  {
    step: '01',
    label: 'Dépose de la façade',
    detail:
      'Outils plastique uniquement, agrafes contrôlées une à une. Les pièces déposées sont posées sur tapis feutré, jamais sur la sellerie.',
    duration: '25 min',
  },
  {
    step: '02',
    label: 'Repérage du faisceau',
    detail:
      'Identification du connecteur LVDS et du quadlock d’origine, relevé de la référence de l’unité multimédia.',
    duration: '15 min',
  },
  {
    step: '03',
    label: 'Intégration de l’interface',
    detail:
      'Branchement en série sur le faisceau d’origine, boîtier fixé par velcro industriel dans un espace ventilé. Rien n’est coupé ni dénudé.',
    duration: '40 min',
  },
  {
    step: '04',
    label: 'Codage et paramétrage',
    detail:
      'Activation de l’entrée vidéo, réglage de la résolution, appairage sans fil et test du micro d’origine.',
    duration: '30 min',
  },
  {
    step: '05',
    label: 'Essai routier',
    detail:
      'Contrôle du basculement radio / CarPlay, commandes au volant, caméra de recul et coupure au démarrage.',
    duration: '20 min',
  },
  {
    step: '06',
    label: 'Remontage et garantie',
    detail:
      'Remontage au couple, contrôle des jeux de façade, remise de la fiche d’intervention et de la garantie 2 ans.',
    duration: '20 min',
  },
];

export const RETROFIT_FACTS = [
  { label: 'Immobilisation moyenne', value: '2 h 30' },
  { label: 'Garantie pièces et pose', value: '2 ans' },
  { label: 'Retour à l’état d’origine', value: '30 min' },
  { label: 'Installations réalisées', value: '380' },
];

export const RETROFIT_KEEPS = [
  'Molette iDrive, MMI, COMAND ou tactile d’origine',
  'Commandes au volant et micro de série',
  'Caméra de recul et radars de stationnement',
  'Amplificateur et égalisation d’usine',
];

export const RETROFIT_CATALOGUE = [
  {
    id: 'bmw',
    brand: 'BMW',
    models: [
      {
        id: 'f20',
        model: 'Série 1 / Série 2',
        years: '2011 — 2019',
        systems: [
          {
            id: 'cic',
            name: 'CIC 6,5" / 8,8"',
            ref: 'TI-BMW-CIC',
            fitment: 'module',
            price: 449,
            duration: '2 h 30',
            harness: 'Nappe LVDS 4 voies + alimentation quadlock',
            note: 'Split-screen d’origine conservé, la molette pilote CarPlay après codage.',
          },
          {
            id: 'nbt-evo',
            name: 'NBT EVO ID5 / ID6',
            ref: 'TI-BMW-EVO',
            fitment: 'plug',
            price: 529,
            duration: '2 h',
            harness: 'Connecteur d’origine, aucun adaptateur',
            note: 'Si le véhicule est déjà équipé CarPlay d’usine, seule l’activation FSC est facturée : 149 €.',
          },
        ],
      },
      {
        id: 'f30',
        model: 'Série 3 / Série 4',
        years: '2012 — 2024',
        systems: [
          {
            id: 'nbt',
            name: 'NBT 6,5" / 8,8" (ID4)',
            ref: 'TI-BMW-NBT',
            fitment: 'plug',
            price: 499,
            duration: '2 h',
            harness: 'Nappe LVDS d’origine, branchement en série',
            note: 'La configuration la plus courante à l’atelier, aucune limitation constatée.',
          },
          {
            id: 'idrive7',
            name: 'iDrive 7 / Live Cockpit',
            ref: 'TI-BMW-ID7',
            fitment: 'module',
            price: 589,
            duration: '2 h 30',
            harness: 'Module vidéo + codage E-Sys',
            note: 'Ajout d’Android Auto sur les véhicules livrés CarPlay seul.',
          },
        ],
      },
      {
        id: 'x3x5',
        model: 'X1 / X3 / X5',
        years: '2011 — 2023',
        systems: [
          {
            id: 'cic-nbt',
            name: 'CIC ou NBT',
            ref: 'TI-BMW-SUV',
            fitment: 'plug',
            price: 519,
            duration: '2 h 15',
            harness: 'Nappe LVDS d’origine',
            note: 'Entrée caméra additionnelle disponible sur la même interface.',
          },
        ],
      },
    ],
  },
  {
    id: 'audi',
    brand: 'Audi',
    models: [
      {
        id: 'a3',
        model: 'A3 / S3',
        years: '2013 — 2024',
        systems: [
          {
            id: 'mib2',
            name: 'MMI MIB2 / Concert',
            ref: 'TI-AUD-MIB2',
            fitment: 'plug',
            price: 479,
            duration: '2 h',
            harness: 'Quadlock + LVDS d’origine',
            note: 'Sur MIB2 High, l’activation logicielle suffit parfois : 189 €.',
          },
          {
            id: 'mib3',
            name: 'MIB3 tactile',
            ref: 'TI-AUD-MIB3',
            fitment: 'reserve',
            price: 629,
            duration: '3 h',
            harness: 'Module HDMI dédié',
            note: 'Le mirroring vidéo est bridé par le constructeur : contournement par module, commandes vocales natives conservées.',
          },
        ],
      },
      {
        id: 'a4a5',
        model: 'A4 / A5',
        years: '2009 — 2023',
        systems: [
          {
            id: 'mmi3g',
            name: 'MMI 3G / 3G+',
            ref: 'TI-AUD-3G',
            fitment: 'module',
            price: 499,
            duration: '2 h 30',
            harness: 'Remplacement du lecteur DVD, faisceau intact',
            note: 'Micro externe fourni, entrée caméra AV incluse.',
          },
          {
            id: 'mib2-vc',
            name: 'MIB2 + Virtual Cockpit',
            ref: 'TI-AUD-VC',
            fitment: 'plug',
            price: 559,
            duration: '2 h',
            harness: 'Connecteur d’origine',
            note: 'Le report de la carte sur le combiné numérique reste actif.',
          },
        ],
      },
    ],
  },
  {
    id: 'mercedes',
    brand: 'Mercedes-Benz',
    models: [
      {
        id: 'w205',
        model: 'Classe C / GLC',
        years: '2014 — 2021',
        systems: [
          {
            id: 'ntg5',
            name: 'COMAND NTG 5.0 / 5.1',
            ref: 'TI-MB-NTG5',
            fitment: 'plug',
            price: 549,
            duration: '2 h 15',
            harness: 'Connecteur COMAND d’origine',
            note: 'Retour à l’interface d’usine par appui long sur la touche Media.',
          },
          {
            id: 'ntg55',
            name: 'COMAND NTG 5.5',
            ref: 'TI-MB-NTG55',
            fitment: 'module',
            price: 599,
            duration: '2 h 30',
            harness: 'Module vidéo + touchpad conservé',
            note: 'Caméra de recul rappelée automatiquement au passage de la marche arrière.',
          },
        ],
      },
      {
        id: 'w177',
        model: 'Classe A / CLA',
        years: '2019 — 2024',
        systems: [
          {
            id: 'mbux',
            name: 'MBUX',
            ref: 'TI-MB-MBUX',
            fitment: 'reserve',
            price: 649,
            duration: '3 h',
            harness: 'Module vidéo certifié, système fermé',
            note: 'Assistant vocal et écran tactile d’origine conservés, mirroring via module.',
          },
        ],
      },
    ],
  },
  {
    id: 'porsche',
    brand: 'Porsche',
    models: [
      {
        id: 'pcm4',
        model: 'Macan / Cayenne / 911',
        years: '2014 — 2018',
        systems: [
          {
            id: 'pcm41',
            name: 'PCM 4.0 / 4.1',
            ref: 'TI-POR-PCM4',
            fitment: 'plug',
            price: 719,
            duration: '2 h 30',
            harness: 'Faisceau PCM d’origine, aucune dépose de planche de bord',
            note: 'Alternative au kit officiel Porsche Classic, audio Burmester conservé.',
          },
        ],
      },
      {
        id: 'pcm6',
        model: '911 (992) / Cayenne (E3)',
        years: '2019 — 2023',
        systems: [
          {
            id: 'pcm60',
            name: 'PCM 6.0 tactile',
            ref: 'TI-POR-PCM6',
            fitment: 'module',
            price: 769,
            duration: '3 h',
            harness: 'Module + codage constructeur',
            note: 'Ajout d’Android Auto, absent d’origine sur une grande partie du parc.',
          },
        ],
      },
    ],
  },
  {
    id: 'volkswagen',
    brand: 'Volkswagen',
    models: [
      {
        id: 'golf7',
        model: 'Golf VII / Tiguan / Passat',
        years: '2013 — 2019',
        systems: [
          {
            id: 'discover',
            name: 'Composition / Discover Media',
            ref: 'TI-VW-MIB2',
            fitment: 'plug',
            price: 399,
            duration: '1 h 45',
            harness: 'Activation App-Connect ou interface MIB2',
            note: 'Souvent réalisable par activation logicielle seule : 149 €, certificat remis.',
          },
        ],
      },
      {
        id: 'golf8',
        model: 'Golf VIII',
        years: '2020 — 2024',
        systems: [
          {
            id: 'discoverpro',
            name: 'MIB3 Discover Pro',
            ref: 'TI-VW-MIB3',
            fitment: 'module',
            price: 489,
            duration: '2 h',
            harness: 'Module sans fil, widgets d’origine conservés',
            note: 'Compatible finitions GTI, GTD et R.',
          },
        ],
      },
    ],
  },
  {
    id: 'stellantis',
    brand: 'Renault / Peugeot',
    models: [
      {
        id: 'nac',
        model: '3008 / 508 / 208',
        years: '2017 — 2023',
        systems: [
          {
            id: 'nac-connect',
            name: 'NAC Peugeot Connect',
            ref: 'TI-PSA-NAC',
            fitment: 'plug',
            price: 419,
            duration: '2 h',
            harness: 'Mise à jour firmware NAC + module sans fil',
            note: 'i-Cockpit et commandes au volant inchangés.',
          },
        ],
      },
      {
        id: 'rlink',
        model: 'Mégane / Clio / Captur',
        years: '2016 — 2022',
        systems: [
          {
            id: 'rlink2',
            name: 'R-Link 2',
            ref: 'TI-REN-RL2',
            fitment: 'reserve',
            price: 449,
            duration: '2 h 30',
            harness: 'Interface filaire, mise à jour préalable parfois requise',
            note: 'Certaines versions demandent un passage en concession avant intervention.',
          },
        ],
      },
    ],
  },
];
