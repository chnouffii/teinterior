#!/usr/bin/env node
import { hacherMotDePasse } from './auth.js';

/**
 * Génère le condensé à placer dans TEINTERIOR_ADMIN_HASH.
 *
 *   node server/creer-mot-de-passe.js "mon mot de passe"
 */
const motDePasse = process.argv[2];

if (!motDePasse) {
  console.error('Usage : node server/creer-mot-de-passe.js "votre mot de passe"');
  process.exit(1);
}

if (motDePasse.length < 10) {
  console.error('Mot de passe trop court : 10 caractères minimum.');
  process.exit(1);
}

console.log(await hacherMotDePasse(motDePasse));
