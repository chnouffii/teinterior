/**
 * Réaligne des sections de contenus du serveur sur celles du dépôt.
 *
 * À utiliser quand le code apporte de nouveaux contenus par défaut — un
 * catalogue de prestations réécrit, par exemple — alors que le serveur garde
 * les anciens. Le site affiche ceux du serveur : déployer ne suffit pas.
 *
 * N'écrit rien sans `--appliquer`. Par défaut il montre ce qu'il remplacerait,
 * parce qu'un outil qui écrase des contenus en production doit d'abord se
 * laisser regarder.
 *
 *   node scripts/realigner-contenus.mjs                      # aperçu
 *   node scripts/realigner-contenus.mjs --appliquer          # écrit
 *   node scripts/realigner-contenus.mjs --cles=packs,options --appliquer
 *
 * Le mot de passe est demandé à la saisie, sans écho. Le passer en variable
 * d'environnement sur la ligne de commande le laisserait dans l'historique du
 * shell.
 */
import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const option = (nom, defaut) =>
  args.find((a) => a.startsWith(`--${nom}=`))?.split('=').slice(1).join('=') ?? defaut;

const API = option('api', 'http://127.0.0.1:8787');
const EMAIL = option('email', process.env.TEINTERIOR_ADMIN_EMAIL || 'contact@teinterior.fr');
const CLES = option('cles', 'packs,options').split(',').map((c) => c.trim()).filter(Boolean);
const APPLIQUER = args.includes('--appliquer');

/** Saisie masquée : le mot de passe ne doit pas rester à l'écran. */
function demanderMotDePasse(invite) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const sortie = process.stdout;
    const ecrire = sortie.write.bind(sortie);
    let commence = false;
    sortie.write = (morceau, ...reste) => {
      if (commence && typeof morceau === 'string' && !morceau.includes('\n')) return true;
      return ecrire(morceau, ...reste);
    };
    rl.question(invite, (reponse) => {
      sortie.write = ecrire;
      sortie.write('\n');
      rl.close();
      resolve(reponse);
    });
    commence = true;
  });
}

/** Résumé lisible d'une section, pour comparer avant et après. */
function resumer(valeur) {
  if (Array.isArray(valeur)) {
    return valeur
      .map((v) => v?.name ?? v?.label ?? v?.title ?? v?.id ?? '—')
      .slice(0, 8)
      .join(' · ') + (valeur.length > 8 ? ` … (${valeur.length})` : ` (${valeur.length})`);
  }
  if (valeur && typeof valeur === 'object') return Object.keys(valeur).join(', ');
  return String(valeur);
}

const graine = JSON.parse(await readFile(path.join(racine, 'server/contenus-par-defaut.json'), 'utf8'));

const inconnues = CLES.filter((c) => !(c in graine));
if (inconnues.length > 0) {
  console.error(`Sections inconnues dans la graine : ${inconnues.join(', ')}`);
  console.error(`Sections disponibles : ${Object.keys(graine).join(', ')}`);
  process.exit(1);
}

/**
 * Sections qui contiennent le travail de l'atelier, pas du contenu éditorial.
 *
 * Les réaligner remplacerait les annonces réelles par les véhicules de
 * démonstration du dépôt. On refuse, sauf demande explicite : personne ne tape
 * `--oui-je-veux-ecraser-mes-donnees` par distraction.
 */
const SECTIONS_SENSIBLES = ['vehicles', 'leads', 'clients'];
const sensibles = CLES.filter((c) => SECTIONS_SENSIBLES.includes(c));

if (sensibles.length > 0 && !args.includes('--oui-je-veux-ecraser-mes-donnees')) {
  console.error(`\nRefus : ${sensibles.join(', ')} contient vos données réelles, pas du contenu éditorial.`);
  console.error('Les réaligner remplacerait vos annonces par les véhicules de démonstration du dépôt.');
  console.error('Si c’est bien ce que vous voulez, ajoutez --oui-je-veux-ecraser-mes-donnees.\n');
  process.exit(1);
}

const motDePasse =
  process.env.TEINTERIOR_ADMIN_MDP || (await demanderMotDePasse('Mot de passe du panel : '));

const connexion = await fetch(`${API}/api/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: motDePasse }),
});

if (!connexion.ok) {
  console.error(`Connexion refusée (${connexion.status}). Vérifiez l'email et le mot de passe.`);
  process.exit(1);
}

const cookie = (connexion.headers.getSetCookie?.() ?? [])
  .map((c) => c.split(';')[0])
  .join('; ');

const actuel = await (await fetch(`${API}/api/content`)).json();

console.log(`\nServeur : ${API}\n`);
for (const cle of CLES) {
  console.log(`  ${cle}`);
  console.log(`    actuel  ${resumer(actuel[cle])}`);
  console.log(`    dépôt   ${resumer(graine[cle])}`);
}

if (!APPLIQUER) {
  console.log('\nAperçu seulement. Ajoutez --appliquer pour écrire ces sections sur le serveur.');
  console.log('Les sections non listées ne sont pas touchées.\n');
  process.exit(0);
}

const reponse = await fetch(`${API}/api/content`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', cookie },
  body: JSON.stringify(Object.fromEntries(CLES.map((c) => [c, graine[c]]))),
});

if (!reponse.ok) {
  console.error(`\nÉchec de l'enregistrement (${reponse.status}).`);
  process.exit(1);
}

console.log(`\n${CLES.length} section(s) remplacée(s) : ${CLES.join(', ')}`);
console.log('Rechargez le site en navigation privée pour vérifier.\n');
