import { mkdir, writeFile, unlink, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

/**
 * Stockage des photos de véhicules, sur le disque du serveur.
 *
 * Les fichiers restent chez vous : ils vivent à côté du fichier de contenus,
 * dans `media/`, et aucun service tiers n'est appelé. Une sauvegarde consiste
 * donc à copier ce dossier.
 *
 * Le service ne dépend d'aucune bibliothèque de traitement d'image : le
 * navigateur réduit la photo avant l'envoi (voir `src/lib/image.js`), le serveur
 * ne fait que vérifier et écrire.
 */

/** Limite haute. Après réduction dans le navigateur, une photo pèse ~300 Ko. */
export const TAILLE_MAX = 8 * 1024 * 1024;

/**
 * On identifie le type par les octets d'en-tête, jamais par l'en-tête
 * `Content-Type` ni par l'extension : tous deux sont fournis par le client et
 * peuvent mentir.
 */
const SIGNATURES = [
  { ext: 'jpg', type: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  {
    ext: 'png',
    type: 'image/png',
    test: (b) =>
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  {
    ext: 'webp',
    type: 'image/webp',
    test: (b) =>
      b.length > 12 &&
      b.toString('ascii', 0, 4) === 'RIFF' &&
      b.toString('ascii', 8, 12) === 'WEBP',
  },
];

const TYPES = Object.fromEntries(SIGNATURES.map((s) => [s.ext, s.type]));

/** Un nom de fichier valide, et rien d'autre : bloque la traversée de chemin. */
const NOM_VALIDE = /^[a-f0-9]{32}\.(jpg|png|webp)$/;

export class MediaStore {
  /** @param {string} dossier Chemin absolu du dossier de stockage. */
  constructor(dossier) {
    this.dossier = dossier;
  }

  async init() {
    await mkdir(this.dossier, { recursive: true });
  }

  /**
   * Écrit une image et renvoie son nom de fichier.
   * @param {Buffer} octets Contenu brut reçu.
   */
  async enregistrer(octets) {
    if (octets.length === 0) {
      throw Object.assign(new Error('Fichier vide.'), { code: 400 });
    }
    if (octets.length > TAILLE_MAX) {
      throw Object.assign(new Error('Image trop lourde.'), { code: 413 });
    }

    const signature = SIGNATURES.find((s) => s.test(octets));
    if (!signature) {
      throw Object.assign(
        new Error('Format non reconnu. Formats acceptés : JPEG, PNG et WebP.'),
        { code: 400 }
      );
    }

    const nom = `${randomBytes(16).toString('hex')}.${signature.ext}`;
    await writeFile(path.join(this.dossier, nom), octets);
    return nom;
  }

  /** Lit une image pour la servir. Renvoie `null` si le nom est invalide ou absent. */
  async lire(nom) {
    if (!NOM_VALIDE.test(nom)) return null;
    const complet = path.join(this.dossier, nom);
    try {
      const [octets, infos] = await Promise.all([readFile(complet), stat(complet)]);
      const ext = nom.split('.').pop();
      return { octets, type: TYPES[ext], modifie: infos.mtime };
    } catch {
      return null;
    }
  }

  async supprimer(nom) {
    if (!NOM_VALIDE.test(nom)) return false;
    try {
      await unlink(path.join(this.dossier, nom));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Supprime les images qu'aucun contenu ne référence plus.
   * Appelé à la demande depuis le panel : une photo retirée d'un véhicule
   * laisserait sinon son fichier sur le disque indéfiniment.
   *
   * @param {string} contenusSerialises Les contenus, en JSON, pour y chercher
   *   les noms de fichiers encore cités.
   */
  async nettoyer(contenusSerialises) {
    let fichiers;
    try {
      fichiers = await readdir(this.dossier);
    } catch {
      return { supprimes: 0 };
    }

    let supprimes = 0;
    for (const nom of fichiers) {
      if (!NOM_VALIDE.test(nom)) continue;
      if (contenusSerialises.includes(nom)) continue;
      if (await this.supprimer(nom)) supprimes++;
    }
    return { supprimes };
  }
}
