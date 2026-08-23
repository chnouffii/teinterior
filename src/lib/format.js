/**
 * Formatage des champs pendant la saisie.
 *
 * L'utilisateur voit immédiatement si sa saisie prend la bonne forme, au lieu
 * de découvrir une erreur au moment de valider.
 */

/**
 * « 0750093639 » → « 07 50 09 36 39 ». Les paires se forment au fil de la frappe.
 * Un numéro collé au format international (+33 7 50…) est ramené au format
 * national plutôt que découpé n'importe comment.
 */
export function formaterTelephone(valeur) {
  let chiffres = String(valeur).replace(/\D/g, '');
  if (chiffres.startsWith('33') && chiffres.length > 9) chiffres = `0${chiffres.slice(2)}`;
  chiffres = chiffres.slice(0, 10);
  return chiffres.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

/**
 * « ab123cd » → « AB-123-CD ».
 * Les tirets n'apparaissent qu'une fois le groupe précédent complet, sinon ils
 * sauteraient devant le curseur pendant la frappe.
 */
export function formaterPlaque(valeur) {
  const propre = String(valeur).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
  const lettresAvant = propre.slice(0, 2).replace(/[^A-Z]/g, '');
  const reste = propre.slice(lettresAvant.length);
  const chiffres = reste.slice(0, 3).replace(/\D/g, '');
  const lettresApres = reste.slice(chiffres.length, chiffres.length + 2).replace(/[^A-Z]/g, '');

  return [lettresAvant, chiffres, lettresApres].filter(Boolean).join('-');
}

/** Espaces des milliers, pour les montants saisis à la main. */
export function formaterMontant(valeur) {
  const chiffres = String(valeur).replace(/\D/g, '').slice(0, 9);
  return chiffres ? Number(chiffres).toLocaleString('fr-FR') : '';
}

/** Retire le formatage avant envoi ou calcul. */
export const chiffresSeuls = (valeur) => String(valeur).replace(/\D/g, '');
