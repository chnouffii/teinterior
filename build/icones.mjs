/**
 * Génère le jeu d'icônes du site à partir de `public/logo.png`.
 *
 * Script ponctuel : les icônes changent une fois tous les cinq ans, alors que
 * `sharp` pèse une quarantaine de mégaoctets de binaire natif. Les fichiers
 * produits sont versionnés ; ce script ne sert qu'à les régénérer.
 *
 *     npm i --no-save sharp && node build/icones.mjs
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const PUBLIC = new URL('../public/', import.meta.url);
const chemin = (nom) => new URL(nom, PUBLIC).pathname;

/**
 * Zone utile du logo, mesurée et non devinée : le contenu occupe x 47→258 et
 * y 109→198 dans une image de 300 px, le reste est du fond noir. On prend le
 * carré centré le plus serré qui contienne toute la largeur du logo, pour que
 * la voiture et le mot remplissent la tuile au maximum.
 */
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

/**
 * Le logo réduit à la taille demandée.
 *
 * En dessous de 48 px, une légère accentuation est appliquée : la réduction
 * de Lanczos adoucit les contours, et sur un logo qui contient du texte fin
 * cela fait la différence entre un mot qu'on devine et une tache grise.
 */
async function logoCarre(taille) {
  let image = sharp(chemin('logo.png'))
    .extract(CADRE)
    .resize(taille, taille, { kernel: 'lanczos3' })
    .flatten({ background: '#0A0D12' });

  if (taille <= 48) image = image.sharpen({ sigma: 0.6, m1: 1.4, m2: 0.6 });

  return image.png({ compressionLevel: 9 }).toBuffer();
}

// Onglet du navigateur : le .ico couvre tous les navigateurs, les PNG
// permettent aux écrans à forte densité de piocher la bonne définition.
const images = [];
for (const taille of [16, 32, 48]) images.push({ taille, png: await logoCarre(taille) });
await writeFile(chemin('favicon.ico'), ico(images));

for (const taille of [32, 96]) {
  await writeFile(chemin(`favicon-${taille}.png`), await logoCarre(taille));
}

// Écran d'accueil iOS et manifeste : le logo s'y lit entièrement.
await writeFile(chemin('apple-touch-icon.png'), await logoCarre(180));
await writeFile(chemin('icon-192.png'), await logoCarre(192));
await writeFile(chemin('icon-512.png'), await logoCarre(512));

console.log('icônes régénérées');
