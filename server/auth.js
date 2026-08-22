import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHmac } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCb);

const DUREE_SESSION_H = 12;

/**
 * Mot de passe administrateur : haché avec scrypt et un sel aléatoire.
 * Le condensé vit dans une variable d'environnement du serveur, jamais dans le
 * code envoyé au navigateur.
 *
 * Format : scrypt$<sel en hex>$<condensé en hex>
 */
export async function hacherMotDePasse(motDePasse) {
  const sel = randomBytes(16);
  const condense = await scrypt(motDePasse, sel, 64);
  return `scrypt$${sel.toString('hex')}$${condense.toString('hex')}`;
}

export async function verifierMotDePasse(motDePasse, stocke) {
  const [algo, selHex, condenseHex] = String(stocke).split('$');
  if (algo !== 'scrypt' || !selHex || !condenseHex) return false;

  const attendu = Buffer.from(condenseHex, 'hex');
  const obtenu = await scrypt(motDePasse, Buffer.from(selHex, 'hex'), attendu.length);
  // Comparaison à durée constante : une comparaison naïve laisserait deviner le
  // condensé caractère par caractère en mesurant le temps de réponse.
  return timingSafeEqual(attendu, obtenu);
}

/**
 * Jeton de session signé : `<expiration>.<signature>`. Aucun état à conserver
 * côté serveur, et un redémarrage n'invalide pas les sessions en cours.
 */
export function creerJeton(secret) {
  const expiration = Date.now() + DUREE_SESSION_H * 3600 * 1000;
  return `${expiration}.${signer(String(expiration), secret)}`;
}

export function jetonValide(jeton, secret) {
  if (typeof jeton !== 'string') return false;
  const [expiration, signature] = jeton.split('.');
  if (!expiration || !signature) return false;

  const attendue = Buffer.from(signer(expiration, secret));
  const fournie = Buffer.from(signature);
  if (attendue.length !== fournie.length) return false;
  if (!timingSafeEqual(attendue, fournie)) return false;

  return Number(expiration) > Date.now();
}

function signer(valeur, secret) {
  return createHmac('sha256', secret).update(valeur).digest('hex');
}

/**
 * Limitation des tentatives de connexion, par adresse IP. Sans elle, le mot de
 * passe est attaquable par force brute à la vitesse du réseau.
 */
export class LimiteurConnexion {
  #tentatives = new Map();
  #max;
  #fenetreMs;

  constructor({ max = 8, fenetreMinutes = 15 } = {}) {
    this.#max = max;
    this.#fenetreMs = fenetreMinutes * 60 * 1000;
  }

  bloque(cle) {
    const entree = this.#tentatives.get(cle);
    if (!entree) return false;
    if (Date.now() - entree.depuis > this.#fenetreMs) {
      this.#tentatives.delete(cle);
      return false;
    }
    return entree.nombre >= this.#max;
  }

  echec(cle) {
    const entree = this.#tentatives.get(cle);
    if (!entree || Date.now() - entree.depuis > this.#fenetreMs) {
      this.#tentatives.set(cle, { nombre: 1, depuis: Date.now() });
      return;
    }
    entree.nombre += 1;
  }

  reussite(cle) {
    this.#tentatives.delete(cle);
  }
}
