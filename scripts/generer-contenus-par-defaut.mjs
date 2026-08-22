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
  serviceOptions: site.SERVICE_OPTIONS,

  hero: content.HERO,
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

const destination = path.join(racine, 'server/contenus-par-defaut.json');
await writeFile(destination, `${JSON.stringify(contenus, null, 2)}\n`, 'utf8');

const tailleKo = (JSON.stringify(contenus).length / 1024).toFixed(0);
console.log(`Écrit : ${path.relative(racine, destination)} (${tailleKo} ko)`);
console.log(`Clés : ${Object.keys(contenus).join(', ')}`);
