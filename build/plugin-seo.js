import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { BRAND, CONTACT, LEGAL_ROUTE, ROUTES, SITE_URL } from '../src/data/site.js';
import { VEHICLES } from '../src/data/vehicles.js';

/**
 * Métadonnées et données structurées, injectées au moment du build.
 *
 * Le JSON-LD et le sitemap sont dérivés de `src/data/site.js`, qui reste la
 * source unique : recopier l'adresse et les horaires dans `index.html` aurait
 * garanti qu'ils divergent au premier déménagement.
 */

const echapper = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Convertit « 08h30 — 19h00 » en couple ISO attendu par schema.org. */
function plage(valeur) {
  const heures = String(valeur).match(/(\d{1,2})\s*h\s*(\d{2})?/g);
  if (!heures || heures.length < 2) return null;
  const iso = (h) => {
    const [, hh, mm = '00'] = h.match(/(\d{1,2})\s*h\s*(\d{2})?/);
    return `${hh.padStart(2, '0')}:${mm}`;
  };
  return { opens: iso(heures[0]), closes: iso(heures[1]) };
}

const JOURS = {
  lundi: 'Monday',
  mardi: 'Tuesday',
  mercredi: 'Wednesday',
  jeudi: 'Thursday',
  vendredi: 'Friday',
  samedi: 'Saturday',
  dimanche: 'Sunday',
};

/** « Lundi — Vendredi » → les cinq jours ; « Samedi » → un seul. */
function joursDe(libelle) {
  const trouves = Object.keys(JOURS).filter((j) => libelle.toLowerCase().includes(j));
  if (trouves.length !== 2) return trouves.map((j) => JOURS[j]);
  const ordre = Object.keys(JOURS);
  const [a, b] = trouves.map((j) => ordre.indexOf(j));
  return ordre.slice(Math.min(a, b), Math.max(a, b) + 1).map((j) => JOURS[j]);
}

function donneesStructurees() {
  const horaires = CONTACT.hours
    .map((creneau) => {
      const heures = plage(creneau.value);
      const jours = joursDe(creneau.day);
      if (!heures || jours.length === 0) return null;
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: jours.length === 1 ? jours[0] : jours,
        ...heures,
      };
    })
    .filter(Boolean);

  const [codePostal, ...ville] = CONTACT.address.city.split(' ');
  const { lat, lon } = CONTACT.address;

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${SITE_URL}/#atelier`,
    name: BRAND.name,
    description:
      'Atelier automobile à Brumath : detailing et céramique, rétrofit CarPlay et Android Auto ' +
      'sur écran d’origine, dépôt-vente et recherche de véhicule.',
    url: SITE_URL,
    image: `${SITE_URL}/og.jpg`,
    logo: `${SITE_URL}/logo.png`,
    telephone: CONTACT.phones.map((l) => l.href.replace('tel:', '')),
    email: CONTACT.email,
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address.street,
      postalCode: codePostal,
      addressLocality: ville.join(' '),
      addressRegion: 'Grand Est',
      addressCountry: 'FR',
    },
    // Omis tant que les coordonnées exactes ne sont pas relevées : un point
    // approximatif placerait l'atelier ailleurs dans Brumath sur la carte.
    ...(lat && lon ? { geo: { '@type': 'GeoCoordinates', latitude: lat, longitude: lon } } : {}),
    areaServed: [
      { '@type': 'City', name: 'Brumath' },
      { '@type': 'City', name: 'Strasbourg' },
      { '@type': 'City', name: 'Haguenau' },
      { '@type': 'City', name: 'Schiltigheim' },
      { '@type': 'City', name: 'Vendenheim' },
      { '@type': 'AdministrativeArea', name: 'Bas-Rhin' },
    ],
    openingHoursSpecification: horaires,
    sameAs: CONTACT.socials.map((r) => r.url),
    makesOffer: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Detailing et céramique automobile' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Rétrofit CarPlay et Android Auto' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dépôt-vente et recherche de véhicule' } },
    ],
  };
}

const META = () => `
    <link rel="canonical" href="${SITE_URL}/" />
    <meta property="og:site_name" content="${echapper(BRAND.name)}" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:url" content="${SITE_URL}/" />
    <meta property="og:image" content="${SITE_URL}/og.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Teintérior — atelier automobile à Brumath" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Teintérior — Detailing, rétrofit CarPlay et vente de véhicules" />
    <meta name="twitter:description" content="Atelier automobile à Brumath (67), près de Strasbourg. Devis détaillé sous 24 h ouvrées." />
    <meta name="twitter:image" content="${SITE_URL}/og.jpg" />
    <script type="application/ld+json">${JSON.stringify(donneesStructurees())}</script>`;

/** Pages publiques, avec leur priorité relative pour le sitemap. */
function urls() {
  const pages = [
    { chemin: ROUTES.home, priorite: '1.0', frequence: 'weekly' },
    { chemin: ROUTES.prestations, priorite: '0.9', frequence: 'monthly' },
    { chemin: ROUTES.retrofit, priorite: '0.9', frequence: 'monthly' },
    { chemin: ROUTES.vendre, priorite: '0.9', frequence: 'monthly' },
    { chemin: ROUTES.vehicules, priorite: '0.9', frequence: 'daily' },
    { chemin: ROUTES.realisations, priorite: '0.7', frequence: 'monthly' },
    { chemin: ROUTES.contact, priorite: '0.8', frequence: 'yearly' },
    { chemin: LEGAL_ROUTE, priorite: '0.3', frequence: 'yearly' },
  ];

  // Les véhicules vendus sortent du sitemap : inutile d'envoyer Google sur une
  // annonce qui n'a plus d'objet.
  const vehicules = VEHICLES.filter((v) => v.status !== 'vendu').map((v) => ({
    chemin: `${ROUTES.vehicules}/${v.id}`,
    priorite: '0.6',
    frequence: 'weekly',
  }));

  return [...pages, ...vehicules];
}

function sitemap() {
  const jour = new Date().toISOString().slice(0, 10);
  const entrees = urls()
    .map(
      ({ chemin, priorite, frequence }) => `  <url>
    <loc>${SITE_URL}${chemin === '/' ? '/' : chemin}</loc>
    <lastmod>${jour}</lastmod>
    <changefreq>${frequence}</changefreq>
    <priority>${priorite}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entrees}
</urlset>
`;
}

export default function seo() {
  let dossierSortie = 'dist';

  return {
    name: 'teinterior-seo',

    configResolved(config) {
      dossierSortie = config.build.outDir;
    },

    transformIndexHtml(html) {
      return html.replace('</head>', `${META()}\n  </head>`);
    },

    async closeBundle() {
      const cible = path.resolve(process.cwd(), dossierSortie, 'sitemap.xml');
      await writeFile(cible, sitemap(), 'utf8');
      console.log(`  sitemap.xml  ${urls().length} URL`);
    },
  };
}
