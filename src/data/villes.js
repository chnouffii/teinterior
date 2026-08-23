/**
 * Pages locales.
 *
 * Chaque ville a son contenu propre : distance réelle depuis l'atelier, ce qui
 * amène concrètement les clients de là-bas, et les communes voisines. Dupliquer
 * un texte en changeant le nom de la ville produit du contenu que Google
 * identifie comme dupliqué et n'apporte rien au lecteur.
 */

export const VILLES = [
  {
    slug: 'strasbourg',
    nom: 'Strasbourg',
    prefixe: 'à',
    distance: '20 minutes',
    axe: 'par l’A4',
    titre: 'Detailing et rétrofit CarPlay à Strasbourg',
    // Description de référencement, distincte de l'accroche : Google tronque
    // au-delà d'environ 160 caractères, et l'accroche en fait le double.
    meta:
      'Atelier de detailing et rétrofit CarPlay à 20 minutes de Strasbourg par l’A4. Correction de peinture, céramique, dépôt-vente. Devis sous 24 h.',
    accroche:
      'Notre atelier est à Brumath, vingt minutes du centre de Strasbourg par l’A4. La plupart de nos clients strasbourgeois déposent leur voiture le matin et la récupèrent en fin de journée.',
    contexte:
      'Le stationnement de rue en centre-ville marque les carrosseries : rayures de portières, jantes frottées contre les bordures, traces de vernis sur les pare-chocs. Ce sont les trois quarts des corrections que nous faisons pour des véhicules strasbourgeois.',
    arguments: [
      {
        titre: 'Correction de peinture après stationnement urbain',
        detail:
          'Micro-rayures et traces de frottement reprises à la polisseuse, épaisseur de vernis mesurée avant chaque passe.',
      },
      {
        titre: 'Rétrofit CarPlay sur les véhicules de fonction',
        detail:
          'Beaucoup de véhicules de société de l’Eurométropole sortent sans CarPlay. L’intégration se fait sur l’écran d’origine, et se retire sans trace avant restitution.',
      },
      {
        titre: 'Dépôt-vente sans gérer les visites',
        detail:
          'Vendre en ville, c’est enchaîner les rendez-vous. Nous recevons les acheteurs à l’atelier et vous ne vous déplacez que pour signer.',
      },
    ],
    communes: ['Schiltigheim', 'Bischheim', 'Hoenheim', 'Illkirch-Graffenstaden', 'Ostwald'],
  },
  {
    slug: 'haguenau',
    nom: 'Haguenau',
    prefixe: 'à',
    distance: '15 minutes',
    axe: 'par la D1063',
    titre: 'Detailing et rétrofit CarPlay à Haguenau',
    meta:
      'Atelier de detailing et rétrofit CarPlay à 15 minutes de Haguenau par la D1063. Céramique, habitacle, recherche de véhicule. Devis sous 24 h.',
    accroche:
      'Quinze minutes séparent Haguenau de notre atelier de Brumath par la D1063. C’est le trajet le plus court de tout le nord du Bas-Rhin pour une prestation de ce niveau.',
    contexte:
      'Les véhicules qui nous arrivent de Haguenau et de sa périphérie roulent beaucoup, souvent sur route et autoroute : impacts de gravillons sur les faces avant, vernis terni par les kilomètres, habitacles marqués par les trajets quotidiens.',
    arguments: [
      {
        titre: 'Remise en état après forts kilométrages',
        detail:
          'Décontamination complète, correction du vernis et protection céramique, pour des voitures qui prennent l’autoroute tous les jours.',
      },
      {
        titre: 'Habitacle repris en profondeur',
        detail:
          'Injection-extraction des textiles, traitement du cuir, désinfection à l’ozone. Utile avant une reprise ou une revente.',
      },
      {
        titre: 'Recherche du véhicule que vous cherchez',
        detail:
          'Cahier des charges défini ensemble, prospection en France et en Allemagne, expertise sur place avant tout achat.',
      },
    ],
    communes: ['Bischwiller', 'Schweighouse-sur-Moder', 'Val de Moder', 'Brumath', 'Hochfelden'],
  },
];

/** Une ville par son identifiant d'URL. */
export const villeParSlug = (slug) => VILLES.find((v) => v.slug === slug) ?? null;

/**
 * Préfixe d'URL des pages locales : `/detailing/strasbourg`.
 *
 * Le segment dynamique occupe un segment entier de chemin, faute de quoi React
 * Router refuse la route — il n'accepte pas de paramètre partiel du type
 * `/detailing-:ville`.
 */
export const VILLE_BASE = '/detailing';

/** Chemin de la page locale d'une ville. */
export const cheminVille = (slug) => `${VILLE_BASE}/${slug}`;
