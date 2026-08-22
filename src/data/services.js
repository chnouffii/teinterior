/**
 * Catalogue des prestations, rédigé comme un devis d'atelier :
 * chaque ligne décrit une opération réelle, sa durée et le produit utilisé.
 */
export const SERVICE_PACKS = [
  {
    id: 'interieur',
    ref: 'INT-01',
    name: 'Remise en état intérieur',
    subtitle: 'Sièges, moquettes, plastiques, cuir',
    price: 149,
    priceNote: 'citadine · +30 € berline · +60 € SUV / 7 places',
    duration: '3 h 30 à 4 h',
    immobilisation: 'Véhicule rendu le jour même',
    summary:
      'Extraction en profondeur des textiles et vapeur sur les plastiques. Utile sur un véhicule familial, un retour de LOA ou une voiture qui part à la vente.',
    steps: [
      {
        label: 'Aspiration et soufflage',
        detail: 'Coffre, rails de sièges, sous-tapis et joints de portes à la soufflette.',
        duration: '45 min',
      },
      {
        label: 'Injection-extraction textiles',
        detail: 'Kärcher Puzzi 10/1, détachage préalable des auréoles au pinceau.',
        duration: '1 h 15',
      },
      {
        label: 'Vapeur sèche 165 °C',
        detail: 'Plastiques, aérateurs, contours de boutons, ceintures et seuils.',
        duration: '45 min',
      },
      {
        label: 'Traitement du cuir',
        detail: 'Nettoyant pH 5,5 Colourlock puis lait nourrissant mat, sans effet brillant.',
        duration: '40 min',
      },
      {
        label: 'Vitres et contrôle final',
        detail: 'Vitres intérieures sans traces, reprise des détails sous lampe LED.',
        duration: '20 min',
      },
    ],
    products: ['Kärcher Puzzi 10/1', 'Koch-Chemie', 'Colourlock', 'Vapeur 165 °C'],
    note: 'Le traitement anti-odeurs à l’ozone (+39 €) est conseillé après un transport d’animaux ou un dégât des eaux.',
  },
  {
    id: 'correction-1',
    ref: 'EXT-02',
    name: 'Correction peinture — 1 passe',
    subtitle: 'Décontamination, cut, protection 4 mois',
    price: 229,
    priceNote: 'citadine · +40 € berline · +80 € SUV / 7 places',
    duration: '6 h',
    immobilisation: 'Dépose le matin, restitution en fin de journée',
    summary:
      'Une passe de correction qui retire 60 à 70 % des micro-rayures de lavage. Le vernis est mesuré avant intervention, aucune passe n’est faite à l’aveugle.',
    steps: [
      {
        label: 'Prélavage et lavage deux seaux',
        detail: 'Mousse active Koch-Chemie Green Star, gant microfibre, séchage air pulsé.',
        duration: '1 h',
      },
      {
        label: 'Décontamination ferreuse et mécanique',
        detail: 'Iron-X sur carrosserie et jantes, puis barre d’argile fine sur lubrifiant.',
        duration: '1 h 15',
      },
      {
        label: 'Mesure d’épaisseur du vernis',
        detail: 'Relevé jauge à 12 points, refus de passe sous 90 µm ou sur repeinte suspecte.',
        duration: '15 min',
      },
      {
        label: 'Passe de cut',
        detail: 'Rupes LHR 15 Mark III, Menzerna 2500 sur mousse jaune, contrôle Scangrip Sunmatch.',
        duration: '2 h 30',
      },
      {
        label: 'Protection et finitions',
        detail: 'Dégraissage IPA, scellant SiO2 Sonax PNS 4 mois, jantes et dressing pneus mat.',
        duration: '1 h',
      },
    ],
    products: ['Rupes LHR 15 Mark III', 'Menzerna 2500', 'Koch-Chemie Iron-X', 'Sonax PNS'],
    note: 'Sur peinture noire ou vernis mou (Mazda, Tesla), une seconde passe de finition est souvent nécessaire : +120 €.',
  },
  {
    id: 'integrale',
    ref: 'FULL-03',
    name: 'Rénovation intégrale + céramique',
    subtitle: 'Correction 2 à 3 passes, céramique 3 ans',
    price: 890,
    priceNote: 'à partir de — devis ferme après examen sous lampe',
    duration: '2 à 3 jours',
    immobilisation: 'Véhicule gardé en cabine le temps de la réticulation',
    summary:
      'Le protocole complet : intérieur repris, peinture corrigée en profondeur puis scellée sous céramique. C’est la prestation demandée avant une vente ou après une livraison de concession décevante.',
    steps: [
      {
        label: 'Intégralité des lignes INT-01',
        detail: 'Habitacle repris avant tout travail de carrosserie pour éviter les reprises.',
        duration: '4 h',
      },
      {
        label: 'Décontamination complète',
        detail: 'Chimique, mécanique, goudrons et résidus de colle sur bas de caisse.',
        duration: '2 h',
      },
      {
        label: 'Correction 2 à 3 passes',
        detail: 'Menzerna 300 sur mousse verte, finition 3800 sur mousse noire, 85 à 95 % des défauts.',
        duration: '8 à 12 h',
      },
      {
        label: 'Préparation et pose céramique',
        detail: 'Dégraissage IPA, 2 couches CarPro CQuartz UK 3.0, réticulation 12 h à 21 °C.',
        duration: '4 h + 12 h',
      },
      {
        label: 'Finitions et carnet de suivi',
        detail: 'Optiques, inox, jantes céramisées, remise du protocole d’entretien signé.',
        duration: '2 h',
      },
    ],
    products: ['CarPro CQuartz UK 3.0', 'Menzerna 300 / 3800', 'Rupes Mille', 'Scangrip'],
    note: 'Garantie 3 ans sur la céramique, conditionnée à un lavage pH neutre et à un contrôle annuel à l’atelier.',
    featured: true,
  },
];

export const SERVICE_OPTIONS = [
  { id: 'teintage', label: 'Teintage 4 vitres latérales', detail: 'Film 3M Colour Stable ou Solar Gard, pose à chaud sans découpe sur véhicule', price: 'dès 189 €', duration: '3 h' },
  { id: 'ceramique-seule', label: 'Céramique seule (sans correction)', detail: 'CQuartz UK 3.0 sur peinture déjà saine, 2 couches', price: '490 €', duration: '1 jour' },
  { id: 'optiques', label: 'Rénovation d’optiques', detail: 'Ponçage 800 à 3000, polissage, vernis UV 2K', price: '79 € la paire', duration: '1 h 30' },
  { id: 'pare-brise', label: 'Traitement hydrophobe pare-brise', detail: 'Nettoyage cérium puis Gtechniq G1, tenue 12 mois', price: '49 €', duration: '45 min' },
  { id: 'ozone', label: 'Désinfection ozone', detail: 'Générateur 10 g/h, 60 min de cycle + ventilation', price: '39 €', duration: '1 h 30' },
  { id: 'moteur', label: 'Nettoyage compartiment moteur', detail: 'Protection des connectiques, dégraissage et dressing plastiques', price: '69 €', duration: '1 h' },
];
