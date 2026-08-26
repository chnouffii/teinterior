/**
 * Catalogue des prestations, rédigé comme un devis d'atelier :
 * chaque ligne décrit une opération réelle, sa durée et le produit utilisé.
 *
 * Ne décrit que ce que l'atelier pratique aujourd'hui. La correction de
 * peinture, la protection céramique et le teintage de vitres en ont été
 * retirés : ils étaient vendus sur le site sans être proposés à l'atelier.
 * Ils se rajouteront depuis le panel le jour où ils le seront.
 */
export const SERVICE_PACKS = [
  {
    id: 'lavage-complet',
    ref: 'LAV-01',
    name: 'Lavage complet',
    subtitle: 'Extérieur à la main, intérieur repris',
    price: 49,
    priceNote: 'citadine · +10 € berline · +20 € SUV / 7 places',
    duration: '1 h 30',
    immobilisation: 'Véhicule rendu dans la foulée',
    summary:
      'Le lavage soigné qu’un rouleau ne fera jamais : deux seaux, gant microfibre, séchage sans contact. L’habitacle est repris en même temps.',
    steps: [
      {
        label: 'Prélavage et lavage deux seaux',
        detail: 'Mousse active, gant microfibre, rinçage complet des passages de roues.',
        duration: '40 min',
      },
      {
        label: 'Séchage sans contact',
        detail: 'Air pulsé dans les joints et les rétroviseurs, microfibre pour les surfaces.',
        duration: '15 min',
      },
      {
        label: 'Aspiration de l’habitacle',
        detail: 'Sièges, moquettes, coffre, rails et sous-tapis.',
        duration: '20 min',
      },
      {
        label: 'Plastiques et vitres',
        detail: 'Dépoussiérage des plastiques, vitres intérieures et extérieures sans traces.',
        duration: '15 min',
      },
    ],
    products: ['Koch-Chemie', 'Gant microfibre', 'Air pulsé'],
    note: 'Idéal en entretien régulier. Pour un habitacle marqué, passez à la formule intérieure.',
  },
  {
    id: 'interieur',
    ref: 'INT-02',
    name: 'Nettoyage intérieur approfondi',
    subtitle: 'Textiles, plastiques, vitres',
    price: 69,
    priceNote: 'citadine · +15 € berline · +30 € SUV / 7 places',
    duration: '2 h 30',
    immobilisation: 'Véhicule rendu le jour même',
    summary:
      'Extraction en profondeur des textiles et vapeur sur les plastiques. Utile sur un véhicule familial, un retour de LOA ou une voiture qui part à la vente.',
    steps: [
      {
        label: 'Aspiration et soufflage',
        detail: 'Coffre, rails de sièges, sous-tapis et joints de portes à la soufflette.',
        duration: '40 min',
      },
      {
        label: 'Injection-extraction textiles',
        detail: 'Kärcher Puzzi 10/1, détachage préalable des auréoles au pinceau.',
        duration: '1 h',
      },
      {
        label: 'Vapeur sèche 165 °C',
        detail: 'Plastiques, aérateurs, contours de boutons, ceintures et seuils.',
        duration: '35 min',
      },
      {
        label: 'Vitres et contrôle final',
        detail: 'Vitres intérieures sans traces, reprise des détails sous lampe LED.',
        duration: '15 min',
      },
    ],
    products: ['Kärcher Puzzi 10/1', 'Koch-Chemie', 'Vapeur 165 °C'],
    note: 'Le traitement anti-odeurs à l’ozone (+39 €) est conseillé après un transport d’animaux ou un dégât des eaux.',
  },
  {
    id: 'detailing-complet',
    ref: 'DET-03',
    name: 'Détailing complet',
    subtitle: 'Intérieur, extérieur, cuir et plastiques',
    price: 99,
    priceNote: 'citadine · +20 € berline · +40 € SUV / 7 places',
    duration: '4 h',
    immobilisation: 'Véhicule rendu le jour même',
    summary:
      'La formule complète : lavage extérieur soigné, habitacle repris en profondeur, cuir nourri et plastiques rénovés. La prestation demandée avant une vente ou après une livraison décevante.',
    steps: [
      {
        label: 'Lavage extérieur deux seaux',
        detail: 'Mousse active, jantes et passages de roues, séchage à l’air pulsé.',
        duration: '50 min',
      },
      {
        label: 'Intérieur en profondeur',
        detail: 'Injection-extraction des textiles, vapeur sèche sur l’ensemble des plastiques.',
        duration: '1 h 30',
      },
      {
        label: 'Traitement du cuir',
        detail: 'Nettoyant pH 5,5 Colourlock puis lait nourrissant mat, sans effet brillant.',
        duration: '40 min',
      },
      {
        label: 'Rénovation des plastiques',
        detail: 'Plastiques intérieurs et extérieurs ternis, dressing mat sans surbrillance.',
        duration: '45 min',
      },
      {
        label: 'Finitions et contrôle',
        detail: 'Vitres, seuils, joints et reprise des détails sous lampe LED.',
        duration: '15 min',
      },
    ],
    products: ['Kärcher Puzzi 10/1', 'Koch-Chemie', 'Colourlock', 'Vapeur 165 °C'],
    note: 'Sur un habitacle très marqué ou une odeur tenace, comptez une demi-journée supplémentaire.',
    featured: true,
  },
];

export const SERVICE_OPTIONS = [
  { id: 'ozone', label: 'Désinfection ozone', detail: 'Générateur 10 g/h, 60 min de cycle + ventilation — odeurs de tabac, d’animaux ou d’humidité', price: '39 €', duration: '1 h 30' },
  { id: 'plastiques', label: 'Rénovation des plastiques extérieurs', detail: 'Plastiques ternis ou blanchis repris, dressing mat longue tenue sans surbrillance', price: '49 €', duration: '1 h' },
  { id: 'cuir', label: 'Traitement cuir approfondi', detail: 'Nettoyage pH 5,5 Colourlock, nourrissage et protection mate des assises et contreportes', price: '59 €', duration: '1 h 15' },
  { id: 'optiques', label: 'Rénovation d’optiques', detail: 'Ponçage progressif puis finition, sur optiques jaunies ou piquées', price: '79 € la paire', duration: '1 h 30' },
  { id: 'moteur', label: 'Nettoyage compartiment moteur', detail: 'Protection des connectiques, dégraissage et dressing plastiques', price: '69 €', duration: '1 h' },
];
