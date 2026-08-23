/**
 * Pré-rendu des pages publiques.
 *
 * Le site est une application monopage : le serveur renvoie le même
 * `index.html` vide pour toutes les URL, et le contenu n'apparaît qu'après le
 * téléchargement et l'exécution de 330 ko de JavaScript. Les robots qui
 * n'exécutent pas de script — la plupart des aperçus de liens, et Google lui
 * même lors de sa première passe — n'y voient qu'une page blanche.
 *
 * Ce script écrit un vrai fichier HTML par page, contenu et métadonnées
 * compris. Le JavaScript reprend ensuite la main normalement : `main.jsx`
 * utilise `createRoot`, pas `hydrateRoot`, donc le balisage figé est remplacé
 * au montage et aucune divergence d'hydratation n'est possible.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { LEGAL_ROUTE, ROUTES } from '../src/data/site.js';
import { VEHICLES } from '../src/data/vehicles.js';
import { VILLES, cheminVille } from '../src/data/villes.js';

const RACINE = process.cwd();
const DIST = path.join(RACINE, 'dist');

const echapper = (v) =>
  String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Les routes à figer : les pages publiques, jamais `/admin`. */
export function routesPubliques() {
  return [
    ROUTES.home,
    ROUTES.prestations,
    ROUTES.retrofit,
    ROUTES.vendre,
    ROUTES.vehicules,
    ROUTES.realisations,
    ROUTES.contact,
    LEGAL_ROUTE,
    ...VILLES.map((v) => cheminVille(v.slug)),
    ...VEHICLES.filter((v) => v.status !== 'vendu').map((v) => `${ROUTES.vehicules}/${v.id}`),
    // Page d'erreur figée, servie telle quelle par nginx en 404.
    '/404',
  ];
}

/**
 * Motif d'une balise meta ou link, tolérant aux retours à la ligne.
 *
 * `index.html` écrit certaines balises sur plusieurs lignes ; un motif qui
 * suppose `<meta property="..."` d'un seul tenant ne les trouve pas, et la
 * balise se retrouve alors en double dans la page.
 */
const motifBalise = (tag, attribut, valeur) =>
  new RegExp(`<${tag}\\s+${attribut}="${valeur}"[\\s\\S]*?\\/?>`, 'i');

/** Remplace la balise si elle existe, sinon l'ajoute avant `</head>`. */
function poser(html, motif, balise) {
  return motif.test(html) ? html.replace(motif, balise) : html.replace('</head>', `    ${balise}\n  </head>`);
}

/** Applique les métadonnées collectées pendant le rendu au gabarit. */
function appliquerMeta(html, meta) {
  let sortie = html;

  const meta_ = (attribut, valeur, contenu) =>
    poser(
      sortie,
      motifBalise('meta', attribut, valeur),
      `<meta ${attribut}="${valeur}" content="${contenu}" />`
    );

  if (meta.title) {
    const t = echapper(meta.title);
    sortie = sortie.replace(/<title>[\s\S]*?<\/title>/, `<title>${t}</title>`);
    sortie = meta_('property', 'og:title', t);
    sortie = meta_('name', 'twitter:title', t);
  }

  if (meta.description) {
    const d = echapper(meta.description);
    sortie = meta_('name', 'description', d);
    sortie = meta_('property', 'og:description', d);
    sortie = meta_('name', 'twitter:description', d);
  }

  sortie = poser(
    sortie,
    motifBalise('link', 'rel', 'canonical'),
    `<link rel="canonical" href="${meta.canonical}" />`
  );
  sortie = meta_('property', 'og:url', meta.canonical);

  return sortie;
}

/** Chemin du fichier à écrire pour une route donnée. */
const fichierPour = (route) =>
  route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.slice(1), 'index.html');

export default async function prerendre({ rendu }) {
  const gabarit = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const routes = routesPubliques();

  // Coquille vide, servie pour ce qui n'est pas pré-rendu : le panel
  // d'administration, et les fiches véhicule créées après le build. Servir
  // `index.html` à leur place donnerait à React un balisage d'accueil à
  // reprendre pour une autre page.
  await writeFile(path.join(DIST, 'app.html'), gabarit, 'utf8');

  for (const route of routes) {
    const { html, meta } = rendu(route);

    // La page 404 ne doit jamais être proposée à l'indexation.
    const base =
      route === '/404'
        ? gabarit.replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex" />')
        : gabarit;

    const page = appliquerMeta(base, meta).replace(
      '<div id="root"></div>',
      `<div id="root">${html}</div>`
    );

    const cible = fichierPour(route);
    await mkdir(path.dirname(cible), { recursive: true });
    await writeFile(cible, page, 'utf8');
  }

  return routes.length;
}
