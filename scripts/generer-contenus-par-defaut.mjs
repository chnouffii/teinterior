/**
 * Produit `server/contenus-par-defaut.json` à partir des fichiers de `src/data/`.
 *
 * C'est ce fichier que l'API charge au tout premier démarrage, quand aucun
 * `contenus.json` n'existe encore. Le régénérer après toute modification des
 * données du site :
 *
 *   npm run generer:contenus
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const site = await import(path.join(racine, 'src/data/site.js'));
const content = await import(path.join(racine, 'src/data/content.js'));
const services = await import(path.join(racine, 'src/data/services.js'));
const retrofit = await import(path.join(racine, 'src/data/retrofit.js'));
const vehicles = await import(path.join(racine, 'src/data/vehicles.js'));
const leads = await import(path.join(racine, 'src/data/leads.js'));

const contenus = {
  brand: site.BRAND,
  navLinks: site.NAV_LINKS,
  poles: site.POLES,
  contact: site.CONTACT,
  company: site.COMPANY,

  hero: content.HERO,
  lastJob: content.LAST_JOB,
  workshop: content.WORKSHOP,
  beforeAfter: content.BEFORE_AFTER,
  pipeline: content.SOURCING_PIPELINE,
  sourcingFacts: content.SOURCING_FACTS,
  galleryFilters: content.GALLERY_FILTERS,
  gallery: content.GALLERY_ITEMS,
  reviewSummary: content.REVIEW_SUMMARY,
  testimonials: content.TESTIMONIALS,

  packs: services.SERVICE_PACKS,
  options: services.SERVICE_OPTIONS,

  retrofitProcess: retrofit.RETROFIT_PROCESS,
  retrofitFacts: retrofit.RETROFIT_FACTS,
  retrofitKeeps: retrofit.RETROFIT_KEEPS,
  catalogue: retrofit.RETROFIT_CATALOGUE,

  vehicles: vehicles.VEHICLES,

  leads: leads.LEADS,
};

/**
 * Garde-fou : la graine doit couvrir exactement les sections que le site
 * enregistre.
 *
 * Ce fichier a dérivé deux fois en silence — une section ajoutée au site mais
 * pas ici, et une autre pointant vers un export supprimé, donc écrite à `null`.
 * Dans les deux cas une installation neuve démarrait avec des contenus
 * incomplets, sans le moindre message. On lit la liste depuis le store lui-même
 * plutôt que d'en tenir une copie, qui dériverait à son tour.
 */
const { createServer } = await import('vite');
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
let CLES_CONTENU;
try {
  ({ CLES_CONTENU } = await vite.ssrLoadModule('/src/store/siteStore.ts'));
} finally {
  await vite.close();
}

const manquantes = CLES_CONTENU.filter((cle) => contenus[cle] === undefined || contenus[cle] === null);
const superflues = Object.keys(contenus).filter(
  (cle) => cle !== 'leads' && !CLES_CONTENU.includes(cle)
);

if (manquantes.length > 0 || superflues.length > 0) {
  if (manquantes.length > 0) console.error(`Sections absentes de la graine : ${manquantes.join(', ')}`);
  if (superflues.length > 0) console.error(`Sections inconnues du site : ${superflues.join(', ')}`);
  process.exit(1);
}

const destination = path.join(racine, 'server/contenus-par-defaut.json');
await writeFile(destination, `${JSON.stringify(contenus, null, 2)}\n`, 'utf8');

const tailleKo = (JSON.stringify(contenus).length / 1024).toFixed(0);
console.log(`Écrit : ${path.relative(racine, destination)} (${tailleKo} ko)`);
console.log(`Clés : ${Object.keys(contenus).join(', ')}`);
