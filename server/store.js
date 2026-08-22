import { readFile, writeFile, rename, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * Persistance des contenus dans un simple fichier JSON.
 *
 * Un fichier suffit largement ici : le volume est petit, un seul administrateur
 * écrit à la fois, et une sauvegarde se réduit à copier le fichier. Les
 * écritures passent par un fichier temporaire renommé ensuite, pour qu'une
 * coupure au mauvais moment ne laisse jamais un JSON tronqué.
 */
export class ContentStore {
  #fichier;
  #donnees = null;
  #enCours = Promise.resolve();

  constructor(fichier) {
    this.#fichier = path.resolve(fichier);
  }

  async init(valeursParDefaut) {
    await mkdir(path.dirname(this.#fichier), { recursive: true });

    if (!existsSync(this.#fichier)) {
      this.#donnees = valeursParDefaut;
      await this.#ecrire(valeursParDefaut);
      return;
    }

    const brut = await readFile(this.#fichier, 'utf8');
    try {
      this.#donnees = JSON.parse(brut);
    } catch (error) {
      // Un fichier illisible ne doit pas être écrasé en silence : on le met de
      // côté pour pouvoir le récupérer, et on repart des valeurs par défaut.
      const secours = `${this.#fichier}.corrompu-${Date.now()}`;
      await copyFile(this.#fichier, secours);
      this.#donnees = valeursParDefaut;
      await this.#ecrire(valeursParDefaut);
      throw new Error(
        `Contenus illisibles (${error.message}). Copie conservée dans ${secours}, ` +
          'redémarrage sur les valeurs par défaut.'
      );
    }

    // Les clés ajoutées par une nouvelle version du site doivent apparaître même
    // si le fichier a été écrit par une version antérieure.
    this.#donnees = { ...valeursParDefaut, ...this.#donnees };
  }

  lire() {
    return this.#donnees;
  }

  /** Applique une transformation et persiste, une écriture à la fois. */
  async modifier(transformation) {
    this.#enCours = this.#enCours.then(async () => {
      const suivant = transformation(this.#donnees);
      this.#donnees = suivant;
      await this.#ecrire(suivant);
      return suivant;
    });
    return this.#enCours;
  }

  async #ecrire(donnees) {
    const temporaire = `${this.#fichier}.tmp`;
    await writeFile(temporaire, JSON.stringify(donnees, null, 2), 'utf8');
    await rename(temporaire, this.#fichier);
  }
}
