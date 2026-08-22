/**
 * Préparation des photos avant envoi au serveur.
 *
 * Une photo prise au téléphone pèse 5 à 8 Mo pour 4000 px de large, alors que
 * le site n'en affiche jamais plus de 1600. On la réduit donc dans le
 * navigateur : l'envoi est presque instantané même en 4G depuis l'atelier, les
 * pages se chargent vite, et le serveur n'a besoin d'aucune bibliothèque de
 * traitement d'image.
 */

/** Côté le plus long, en pixels, après réduction. */
const COTE_MAX = 1920;
const QUALITE = 0.82;

export const FORMATS_ACCEPTES = ['image/jpeg', 'image/png', 'image/webp'];
/** Garde-fou avant même de décoder : au-delà, c'est sûrement une erreur. */
export const POIDS_MAX_ENTREE = 25 * 1024 * 1024;

export class ImageError extends Error {}

function chargerImage(fichier) {
  return new Promise((resoudre, rejeter) => {
    const url = URL.createObjectURL(fichier);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resoudre(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      rejeter(new ImageError('Image illisible ou endommagée.'));
    };
    img.src = url;
  });
}

/**
 * Réduit une image et renvoie un Blob prêt à envoyer.
 * @param {File} fichier
 * @returns {Promise<Blob>}
 */
export async function preparerImage(fichier) {
  if (!FORMATS_ACCEPTES.includes(fichier.type)) {
    throw new ImageError(`« ${fichier.name} » n’est pas une image JPEG, PNG ou WebP.`);
  }
  if (fichier.size > POIDS_MAX_ENTREE) {
    throw new ImageError(`« ${fichier.name} » dépasse 25 Mo.`);
  }

  const img = await chargerImage(fichier);
  const facteur = Math.min(1, COTE_MAX / Math.max(img.width, img.height));

  // Déjà assez petite et déjà dans un format compact : inutile de la réencoder,
  // on éviterait juste une perte de qualité supplémentaire.
  if (facteur === 1 && fichier.type === 'image/jpeg' && fichier.size < 900 * 1024) {
    return fichier;
  }

  const largeur = Math.round(img.width * facteur);
  const hauteur = Math.round(img.height * facteur);

  const canevas = document.createElement('canvas');
  canevas.width = largeur;
  canevas.height = hauteur;
  const ctx = canevas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  // Fond blanc : un PNG transparent réencodé en JPEG virerait au noir.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, largeur, hauteur);
  ctx.drawImage(img, 0, 0, largeur, hauteur);

  const blob = await new Promise((resoudre) =>
    canevas.toBlob(resoudre, 'image/jpeg', QUALITE)
  );
  if (!blob) throw new ImageError('La conversion de l’image a échoué.');
  return blob;
}

/** Formate un poids en octets pour l'afficher. */
export function formaterPoids(octets) {
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`;
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
}
