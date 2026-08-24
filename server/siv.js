/**
 * Recherche des caractéristiques d'un véhicule par sa plaque.
 *
 * Les données du SIV ne sont pas publiques : leur accès direct passe par une
 * habilitation ANTS réservée aux professionnels agréés, avec plusieurs semaines
 * d'instruction. En pratique on passe par un revendeur, qui demande une clé
 * d'API et un abonnement. Sans clé configurée, la route répond simplement que
 * le service n'est pas branché, et le formulaire reste saisissable à la main.
 *
 * La clé vit ici, côté serveur, et jamais dans le JavaScript envoyé au
 * navigateur : elle y serait lisible par n'importe quel visiteur, et le quota
 * facturé à l'atelier.
 *
 * Configuration (voir DEPLOIEMENT.md) :
 *   TEINTERIOR_SIV_URL    modèle d'URL, avec {plaque} et {token}
 *   TEINTERIOR_SIV_TOKEN  la clé fournie par le prestataire
 */

const URL_MODELE = process.env.TEINTERIOR_SIV_URL || '';
const TOKEN = process.env.TEINTERIOR_SIV_TOKEN || '';

export const sivConfigure = () => Boolean(URL_MODELE && TOKEN);

/** Format français : AB-123-CD, ou l'ancien 1234-AB-56. */
export function normaliserPlaque(brut) {
  const s = String(brut ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(s)) return `${s.slice(0, 2)}-${s.slice(2, 5)}-${s.slice(5)}`;
  if (/^\d{1,4}[A-Z]{2,3}\d{2,3}$/.test(s)) return s;
  return null;
}

/** Première valeur non vide parmi plusieurs noms de champ possibles. */
function champ(source, ...noms) {
  for (const nom of noms) {
    for (const cle of Object.keys(source)) {
      if (cle.toLowerCase() === nom.toLowerCase()) {
        const v = source[cle];
        if (v !== null && v !== undefined && String(v).trim() !== '') return v;
      }
    }
  }
  return undefined;
}

const nombre = (v) => {
  const n = Number(String(v ?? '').replace(/[^\d.,-]/g, '').replace(',', '.'));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
};

/** Année à partir d'une date au format ISO ou français. */
function annee(v) {
  const s = String(v ?? '');
  const iso = s.match(/^(\d{4})-\d{2}-\d{2}/);
  if (iso) return Number(iso[1]);
  const fr = s.match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (fr) return Number(fr[3]);
  const seule = s.match(/\b(19|20)\d{2}\b/);
  return seule ? Number(seule[0]) : undefined;
}

const CARBURANTS = [
  [/^(es|essence|petrol|gasoline)$/i, 'Essence'],
  [/^(go|gazole|diesel)$/i, 'Diesel'],
  [/(hybride|hybrid|hy|eh|hh|pe|ee)/i, 'Hybride'],
  [/(electrique|électrique|electric|el)/i, 'Électrique'],
  [/(gpl|lpg)/i, 'GPL'],
];

function carburant(v) {
  const s = String(v ?? '').trim();
  if (!s) return undefined;
  for (const [motif, libelle] of CARBURANTS) if (motif.test(s)) return libelle;
  return s;
}

function boite(v) {
  const s = String(v ?? '').toLowerCase();
  if (!s) return undefined;
  if (/(auto|bva|dsg|pdk|tiptronic|s.?tronic|edc|cvt|robot)/.test(s)) return 'Automatique';
  if (/(man|bvm)/.test(s)) return 'Manuelle';
  return undefined;
}

/**
 * Ramène la réponse du prestataire au vocabulaire de la fiche véhicule.
 *
 * Les noms de champ varient d'un fournisseur à l'autre : on en accepte
 * plusieurs par donnée plutôt que de coder en dur ceux d'un seul, ce qui
 * obligerait à reprendre le code au moindre changement de prestataire.
 */
export function normaliserReponse(brut) {
  const d = brut && typeof brut === 'object' ? (brut.data ?? brut.vehicule ?? brut.result ?? brut) : {};
  if (!d || typeof d !== 'object') return {};

  const resultat = {
    brand: champ(d, 'marque', 'make', 'brand'),
    model: champ(d, 'modele', 'modèle', 'model'),
    trim: champ(d, 'version', 'finition', 'trim', 'variante', 'sourceModele'),
    year: annee(champ(d, 'date_mise_en_circulation', 'date1erCirFR', 'datePremiereMiseEnCirculation', 'mise_en_circulation', 'firstRegistrationDate')),
    fuel: carburant(champ(d, 'energie', 'énergie', 'carburant', 'fuel', 'energyLabel')),
    gearbox: boite(champ(d, 'boite_vitesse', 'boiteVitesse', 'transmission', 'gearbox', 'type_boite')),
    power: nombre(champ(d, 'puissance_din', 'puissanceDin', 'puissance_ch', 'puissanceCh', 'din', 'ch')),
    color: champ(d, 'couleur', 'color', 'couleur_vehicule'),
    // Repères internes, non publiés : ils aident à recouper la fiche.
    vin: champ(d, 'vin', 'numero_serie', 'numeroSerie'),
    fiscalPower: nombre(champ(d, 'puissance_fiscale', 'puissanceFiscale', 'cv_fiscaux')),
    doors: nombre(champ(d, 'nb_portes', 'nombre_portes', 'portes', 'doors')),
    co2: nombre(champ(d, 'emission_co_2', 'co2', 'emission_co2')),
  };

  return Object.fromEntries(
    Object.entries(resultat).filter(([, v]) => v !== undefined && String(v).trim() !== '')
  );
}

/**
 * Interroge le prestataire. Lève une erreur portant un `statut` HTTP à relayer.
 */
export async function chercherParPlaque(plaqueBrute) {
  const plaque = normaliserPlaque(plaqueBrute);
  if (!plaque) {
    const e = new Error('Plaque invalide. Format attendu : AB-123-CD.');
    e.statut = 400;
    throw e;
  }

  if (!sivConfigure()) {
    const e = new Error(
      'Recherche par plaque non configurée sur ce serveur. Renseignez TEINTERIOR_SIV_URL et TEINTERIOR_SIV_TOKEN.'
    );
    e.statut = 501;
    throw e;
  }

  const url = URL_MODELE.replace('{plaque}', encodeURIComponent(plaque)).replace(
    '{token}',
    encodeURIComponent(TOKEN)
  );

  // Un prestataire lent ne doit pas laisser le panel bloqué indéfiniment.
  const minuteur = AbortSignal.timeout(12000);
  let reponse;
  try {
    reponse = await fetch(url, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${TOKEN}` },
      signal: minuteur,
    });
  } catch (cause) {
    const e = new Error(
      cause.name === 'TimeoutError'
        ? 'Le service d’immatriculation n’a pas répondu à temps.'
        : `Service d’immatriculation injoignable : ${cause.message}`
    );
    e.statut = 502;
    throw e;
  }

  if (!reponse.ok) {
    const e = new Error(
      reponse.status === 404
        ? 'Aucun véhicule trouvé pour cette plaque.'
        : `Le service d’immatriculation a répondu ${reponse.status}.`
    );
    e.statut = reponse.status === 404 ? 404 : 502;
    throw e;
  }

  let charge;
  try {
    charge = await reponse.json();
  } catch {
    const e = new Error('Réponse illisible du service d’immatriculation.');
    e.statut = 502;
    throw e;
  }

  const champs = normaliserReponse(charge);
  if (Object.keys(champs).length === 0) {
    const e = new Error('Le service a répondu, mais sans donnée exploitable pour cette plaque.');
    e.statut = 404;
    throw e;
  }

  return { plaque, champs };
}
