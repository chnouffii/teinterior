/**
 * Envoi des demandes entrantes vers Web3Forms, qui les relaie par email à
 * l'atelier. Aucun back-end à héberger.
 *
 * La clé est lue au build depuis `VITE_WEB3FORMS_KEY` (voir `.env.example`).
 * Si elle manque, on ne prétend pas avoir envoyé quoi que ce soit : l'appelant
 * reçoit une erreur explicite et invite le visiteur à téléphoner. Une fausse
 * confirmation ferait perdre des clients sans que personne ne s'en aperçoive.
 */

const ENDPOINT = 'https://api.web3forms.com/submit';
const CLE = import.meta.env.VITE_WEB3FORMS_KEY;

export const envoiConfigure = Boolean(CLE);

export class LeadError extends Error {
  constructor(message, { configuration = false } = {}) {
    super(message);
    this.name = 'LeadError';
    this.configuration = configuration;
  }
}

/**
 * @param {object} params
 * @param {string} params.sujet    Objet de l'email reçu par l'atelier.
 * @param {object} params.champs   Paires libellé → valeur, reprises dans l'email.
 * @param {string} [params.replyTo] Email du demandeur, pour répondre directement.
 */
export async function sendLead({ sujet, champs, replyTo }) {
  if (!CLE) {
    throw new LeadError(
      "L'envoi de formulaire n'est pas encore configuré sur ce site.",
      { configuration: true }
    );
  }

  const payload = {
    access_key: CLE,
    subject: sujet,
    from_name: 'Site Teintérior',
    ...(replyTo ? { replyto: replyTo } : {}),
    ...champs,
  };

  let reponse;
  try {
    reponse = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new LeadError(
      'Connexion impossible. Vérifiez votre réseau, ou appelez-nous directement.'
    );
  }

  const resultat = await reponse.json().catch(() => ({}));
  if (!reponse.ok || resultat.success === false) {
    throw new LeadError(
      resultat.message || "L'envoi a échoué. Appelez-nous, nous prenons la demande au téléphone."
    );
  }

  return resultat;
}
