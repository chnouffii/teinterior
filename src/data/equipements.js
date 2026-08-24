/**
 * Catalogue des équipements cochables sur une annonce.
 *
 * Volontairement générique : les intitulés propres à une marque — PASM, PDLS,
 * Drive Select — n'ont de sens que sur elle, et une liste qui mélange les
 * vocabulaires de six constructeurs devient illisible. Ce qui est spécifique à
 * un véhicule se saisit en équipement libre.
 *
 * L'identifiant est stable : c'est lui qui est enregistré sur la fiche. Changer
 * un libellé ne perd donc pas les annonces déjà renseignées.
 */
export const EQUIPEMENTS = [
  {
    id: 'conduite',
    label: 'Aides à la conduite',
    items: [
      { id: 'acc', label: 'Régulateur adaptatif (ACC)' },
      { id: 'regulateur', label: 'Régulateur de vitesse' },
      { id: 'limiteur', label: 'Limiteur de vitesse' },
      { id: 'angles-morts', label: 'Détection d’angles morts' },
      { id: 'franchissement', label: 'Alerte de franchissement de ligne' },
      { id: 'anticollision', label: 'Freinage d’urgence automatique' },
      { id: 'camera-recul', label: 'Caméra de recul' },
      { id: 'camera-360', label: 'Caméra 360°' },
      { id: 'radars-avant', label: 'Radars de stationnement avant' },
      { id: 'radars-arriere', label: 'Radars de stationnement arrière' },
      { id: 'stationnement-auto', label: 'Aide au stationnement automatique' },
      { id: 'panneaux', label: 'Reconnaissance des panneaux' },
      { id: 'vigilance', label: 'Détecteur de fatigue' },
    ],
  },
  {
    id: 'confort',
    label: 'Confort',
    items: [
      { id: 'clim-auto', label: 'Climatisation automatique' },
      { id: 'clim-multizone', label: 'Climatisation multizone' },
      { id: 'sieges-chauffants', label: 'Sièges chauffants' },
      { id: 'sieges-ventiles', label: 'Sièges ventilés' },
      { id: 'sieges-electriques', label: 'Sièges électriques' },
      { id: 'sieges-memoire', label: 'Sièges à mémoire' },
      { id: 'volant-chauffant', label: 'Volant chauffant' },
      { id: 'hayon-electrique', label: 'Hayon électrique' },
      { id: 'acces-mains-libres', label: 'Accès et démarrage sans clé' },
      { id: 'essuie-glaces-auto', label: 'Essuie-glaces automatiques' },
      { id: 'feux-auto', label: 'Allumage automatique des feux' },
      { id: 'retroviseur-electrochrome', label: 'Rétroviseur intérieur électrochrome' },
      { id: 'suspension-pilotee', label: 'Suspension pilotée' },
      { id: 'attelage', label: 'Attelage' },
    ],
  },
  {
    id: 'multimedia',
    label: 'Multimédia',
    items: [
      { id: 'ecran-tactile', label: 'Écran tactile' },
      { id: 'gps', label: 'Navigation GPS' },
      { id: 'carplay', label: 'Apple CarPlay' },
      { id: 'android-auto', label: 'Android Auto' },
      { id: 'carplay-sans-fil', label: 'CarPlay sans fil' },
      { id: 'bluetooth', label: 'Bluetooth' },
      { id: 'audio-premium', label: 'Système audio premium' },
      { id: 'affichage-tete-haute', label: 'Affichage tête haute' },
      { id: 'combine-numerique', label: 'Combiné d’instruments numérique' },
      { id: 'induction', label: 'Recharge à induction' },
      { id: 'usb-arriere', label: 'Prises USB à l’arrière' },
    ],
  },
  {
    id: 'exterieur',
    label: 'Extérieur',
    items: [
      { id: 'toit-ouvrant', label: 'Toit ouvrant' },
      { id: 'toit-panoramique', label: 'Toit panoramique' },
      { id: 'feux-led', label: 'Feux full LED' },
      { id: 'feux-matriciels', label: 'Feux matriciels' },
      { id: 'jantes-alu', label: 'Jantes alliage' },
      { id: 'vitres-surteintees', label: 'Vitres surteintées' },
      { id: 'barres-de-toit', label: 'Barres de toit' },
      { id: 'echappement-sport', label: 'Échappement sport' },
      { id: 'peinture-metallisee', label: 'Peinture métallisée' },
    ],
  },
  {
    id: 'interieur',
    label: 'Intérieur',
    items: [
      { id: 'sellerie-cuir', label: 'Sellerie cuir' },
      { id: 'sellerie-alcantara', label: 'Sellerie alcantara' },
      { id: 'sieges-sport', label: 'Sièges sport' },
      { id: 'volant-cuir', label: 'Volant cuir' },
      { id: 'volant-multifonction', label: 'Volant multifonction' },
      { id: 'palettes', label: 'Palettes au volant' },
      { id: 'vitres-electriques', label: 'Vitres électriques' },
      { id: 'retroviseurs-rabattables', label: 'Rétroviseurs rabattables électriquement' },
      { id: 'eclairage-ambiance', label: 'Éclairage d’ambiance' },
      { id: 'banquette-rabattable', label: 'Banquette arrière rabattable' },
      { id: 'seuils-eclaires', label: 'Seuils de porte éclairés' },
    ],
  },
];

/** Tous les équipements, à plat, indexés par identifiant. */
export const EQUIPEMENT_PAR_ID = new Map(
  EQUIPEMENTS.flatMap((groupe) => groupe.items.map((item) => [item.id, item]))
);

/** Nombre total d'équipements au catalogue. */
export const NOMBRE_EQUIPEMENTS = EQUIPEMENT_PAR_ID.size;

/**
 * Les équipements cochés d'un véhicule, regroupés par catégorie.
 *
 * Un identifiant retiré du catalogue mais encore coché sur une annonce est
 * ignoré : mieux vaut une ligne en moins qu'une case vide sur la fiche.
 */
export function equipementsDe(vehicle) {
  const coches = new Set(vehicle?.equipment ?? []);
  const groupes = EQUIPEMENTS.map((groupe) => ({
    label: groupe.label,
    items: groupe.items.filter((item) => coches.has(item.id)).map((item) => item.label),
  })).filter((groupe) => groupe.items.length > 0);

  const libres = (vehicle?.equipmentExtra ?? []).filter(Boolean);
  if (libres.length > 0) groupes.push({ label: 'Autres équipements', items: libres });

  return groupes;
}

/** Nombre d'équipements renseignés sur un véhicule. */
export const compterEquipements = (vehicle) =>
  (vehicle?.equipment ?? []).filter((id) => EQUIPEMENT_PAR_ID.has(id)).length +
  (vehicle?.equipmentExtra ?? []).filter(Boolean).length;
