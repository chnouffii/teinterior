/**
 * Génère le jeu d'icônes du site à partir de `public/favicon.svg` et
 * `public/logo.png`.
 *
 * Script ponctuel : les icônes changent une fois tous les cinq ans, alors que
 * `sharp` pèse une quarantaine de mégaoctets de binaire natif. Les fichiers
 * produits sont versionnés ; ce script ne sert qu'à les régénérer.
 *
 *     npm i --no-save sharp && node build/icones.mjs
 *
 * Le favicon d'onglet est un monogramme et non le logo complet : voir le
 * commentaire de `public/favicon.svg`.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const PUBLIC = new URL('../public/', import.meta.url);
const chemin = (nom) => new URL(nom, PUBLIC).pathname;

/** Zone utile du logo : le reste est du fond noir. Mesuré, pas deviné. */
const CADRE = { left: 41, top: 42, width: 224, height: 224 };

/** Assemble un .ico à partir de PNG déjà encodés (format accepté partout). */
function ico(images) {
  const entete = Buffer.alloc(6);
  entete.writeUInt16LE(0, 0); // réservé
  entete.writeUInt16LE(1, 2); // type : icône
  entete.writeUInt16LE(images.length, 4);

  let offset = 6 + images.length * 16;
  const entrees = images.map(({ taille, png }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(taille >= 256 ? 0 : taille, 0);
    e.writeUInt8(taille >= 256 ? 0 : taille, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // réservé
    e.writeUInt16LE(1, 4); // plans
    e.writeUInt16LE(32, 6); // bits par pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    return e;
  });

  return Buffer.concat([entete, ...entrees, ...images.map((i) => i.png)]);
}

const monogramme = (taille) =>
  sharp(chemin('favicon.svg'), { density: 600 }).resize(taille, taille).png().toBuffer();

const logoCarre = (taille) =>
  sharp(chemin('logo.png'))
    .extract(CADRE)
    .resize(taille, taille, { kernel: 'lanczos3' })
    .flatten({ background: '#0A0D12' })
    .png()
    .toBuffer();

const images = [];
for (const taille of [16, 32, 48]) images.push({ taille, png: await monogramme(taille) });
await writeFile(chemin('favicon.ico'), ico(images));

// Icônes de grande taille : le logo s'y lit, wordmark compris.
await writeFile(chemin('apple-touch-icon.png'), await logoCarre(180));
await writeFile(chemin('icon-192.png'), await logoCarre(192));
await writeFile(chemin('icon-512.png'), await logoCarre(512));

console.log('icônes régénérées');
