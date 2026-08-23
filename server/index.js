import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { ContentStore } from './store.js';
import { MediaStore, TAILLE_MAX } from './media.js';
import { creerJeton, jetonValide, verifierMotDePasse, LimiteurConnexion } from './auth.js';

const ici = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.PORT || 8787);
const FICHIER = process.env.TEINTERIOR_DATA || path.join(ici, '..', 'data', 'contenus.json');
const CONDENSE = process.env.TEINTERIOR_ADMIN_HASH;
const EMAIL_ADMIN = process.env.TEINTERIOR_ADMIN_EMAIL || 'contact@teinterior.fr';
const SECRET = process.env.TEINTERIOR_SESSION_SECRET || randomBytes(32).toString('hex');
const COOKIE = 'teinterior_session';
// Derrière nginx en HTTPS, le cookie doit être `Secure`. En développement sur
// http://localhost, `Secure` empêcherait le navigateur de le conserver.
const PRODUCTION = process.env.NODE_ENV === 'production';

if (!CONDENSE) {
  console.error(
    'TEINTERIOR_ADMIN_HASH est absent. Générez-le avec :\n' +
      '  node server/creer-mot-de-passe.js "votre mot de passe"\n'
  );
  process.exit(1);
}
if (!process.env.TEINTERIOR_SESSION_SECRET) {
  console.warn(
    'TEINTERIOR_SESSION_SECRET absent : un secret temporaire est utilisé, ' +
      'les sessions seront invalidées à chaque redémarrage.'
  );
}

const store = new ContentStore(FICHIER);
// Les images vivent à côté du fichier de contenus : une sauvegarde du dossier
// suffit à tout conserver.
const MEDIA = process.env.TEINTERIOR_MEDIA || path.join(path.dirname(FICHIER), 'media');
const medias = new MediaStore(MEDIA);
const limiteur = new LimiteurConnexion();

/** Contenus initiaux : le jeu de données livré avec le site. */
async function valeursParDefaut() {
  const brut = await readFile(path.join(ici, 'contenus-par-defaut.json'), 'utf8');
  return JSON.parse(brut);
}

// ---------------------------------------------------------------- utilitaires

function json(reponse, code, corps, entetes = {}) {
  const charge = JSON.stringify(corps);
  reponse.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...entetes,
  });
  reponse.end(charge);
}

async function lireCorps(requete, limiteOctets = 2 * 1024 * 1024) {
  const morceaux = [];
  let taille = 0;
  for await (const morceau of requete) {
    taille += morceau.length;
    if (taille > limiteOctets) {
      const erreur = new Error('Contenu trop volumineux');
      erreur.code = 413;
      throw erreur;
    }
    morceaux.push(morceau);
  }
  if (morceaux.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(morceaux).toString('utf8'));
  } catch {
    const erreur = new Error('JSON invalide');
    erreur.code = 400;
    throw erreur;
  }
}

async function lireOctets(requete, limiteOctets) {
  const morceaux = [];
  let taille = 0;
  for await (const morceau of requete) {
    taille += morceau.length;
    if (taille > limiteOctets) {
      throw Object.assign(new Error('Image trop lourde.'), { code: 413 });
    }
    morceaux.push(morceau);
  }
  return Buffer.concat(morceaux);
}

function lireCookie(requete, nom) {
  const brut = requete.headers.cookie;
  if (!brut) return null;
  for (const partie of brut.split(';')) {
    const [cle, ...reste] = partie.trim().split('=');
    if (cle === nom) return decodeURIComponent(reste.join('='));
  }
  return null;
}

function authentifie(requete) {
  return jetonValide(lireCookie(requete, COOKIE), SECRET);
}

function ipDe(requete) {
  // nginx transmet l'adresse réelle via X-Forwarded-For.
  const transmise = requete.headers['x-forwarded-for'];
  if (typeof transmise === 'string' && transmise.length > 0) return transmise.split(',')[0].trim();
  return requete.socket.remoteAddress ?? 'inconnue';
}

function nouvelIdDemande(demandes) {
  const numeros = demandes
    .map((d) => Number.parseInt(String(d.id).replace(/\D/g, ''), 10))
    .filter(Number.isFinite);
  return `LD-${(numeros.length ? Math.max(...numeros) : 2600) + 1}`;
}

/** Champs acceptés pour une demande entrante, pour ne rien stocker d'arbitraire. */
const STATUTS_CLIENT = ['prospect', 'client', 'inactif'];
const STATUTS_DEPOT = ['a_estimer', 'estime', 'en_depot', 'en_vente', 'vendu', 'abandonne'];
const STATUTS_RECHERCHE = ['en_recherche', 'propositions', 'trouve', 'livre', 'abandonne'];

/** Nombre positif, ou `undefined` si la valeur n'en est pas un. */
function montant(valeur) {
  const n = Number(valeur);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function texte(valeur, max = 300) {
  return typeof valeur === 'string' ? valeur.trim().slice(0, max) : '';
}

function nouvelIdentifiant(prefixe, existants) {
  const nombres = existants
    .map((e) => Number.parseInt(String(e.id).replace(/\D/g, ''), 10))
    .filter(Number.isFinite);
  const max = nombres.length > 0 ? Math.max(...nombres) : 1000;
  return `${prefixe}-${max + 1}`;
}

/**
 * Ne conserve que les champs attendus d'une fiche client, et les borne.
 *
 * Ne renvoie **que les clés réellement présentes** dans le corps reçu : une
 * modification partielle (changer le statut, par exemple) ne doit pas remettre à
 * zéro les notes, les véhicules ou les interventions absents de la requête.
 */
function nettoyerClient(brut, { partiel = false } = {}) {
  const source = brut && typeof brut === 'object' ? brut : {};
  const fourni = (cle) => !partiel || Object.prototype.hasOwnProperty.call(source, cle);
  const resultat = {};

  const liste = (valeur, transforme, limite = 100) =>
    Array.isArray(valeur) ? valeur.slice(0, limite).map(transforme).filter(Boolean) : [];

  for (const cle of ['name', 'phone', 'email', 'city', 'source']) {
    if (fourni(cle)) {
      resultat[cle] = texte(source[cle], cle === 'email' ? 160 : 120);
    }
  }

  if (fourni('about')) {
    resultat.about = texte(source.about, 4000);
  }

  if (fourni('status')) {
    resultat.status = STATUTS_CLIENT.includes(source.status) ? source.status : 'prospect';
  }

  if (fourni('vehicles')) {
    resultat.vehicles = liste(source.vehicles, (v) => {
      const label = texte(v?.label, 160);
      if (!label) return null;
      return {
        id: texte(v?.id, 40) || randomBytes(6).toString('hex'),
        label,
        plate: texte(v?.plate, 20),
      };
    });
  }

  if (fourni('interventions')) {
    resultat.interventions = liste(source.interventions, (i) => {
      const label = texte(i?.label, 200);
      if (!label) return null;
      const montant = Number(i?.amount);
      return {
        id: texte(i?.id, 40) || randomBytes(6).toString('hex'),
        date: texte(i?.date, 20),
        label,
        ...(Number.isFinite(montant) && montant >= 0 ? { amount: montant } : {}),
      };
    });
  }

  if (fourni('notes')) {
    resultat.notes = liste(
      source.notes,
      (n) => {
        const contenu = texte(n?.text, 4000);
        if (!contenu) return null;
        return {
          id: texte(n?.id, 40) || randomBytes(6).toString('hex'),
          createdAt: texte(n?.createdAt, 40) || new Date().toISOString(),
          text: contenu,
        };
      },
      500
    );
  }

  if (fourni('consignments')) {
    resultat.consignments = liste(source.consignments, (d) => {
      const vehicule = texte(d?.vehicle, 200);
      if (!vehicule) return null;
      return {
        id: texte(d?.id, 40) || randomBytes(6).toString('hex'),
        vehicle: vehicule,
        plate: texte(d?.plate, 20),
        status: STATUTS_DEPOT.includes(d?.status) ? d.status : 'a_estimer',
        expectedPrice: montant(d?.expectedPrice),
        agreedPrice: montant(d?.agreedPrice),
        soldPrice: montant(d?.soldPrice),
        commission: montant(d?.commission),
        startedAt: texte(d?.startedAt, 20),
        soldAt: texte(d?.soldAt, 20),
        vehicleId: texte(d?.vehicleId, 60),
        notes: texte(d?.notes, 2000),
      };
    });
  }

  if (fourni('searches')) {
    resultat.searches = liste(source.searches, (r) => {
      const cahier = texte(r?.brief, 400);
      if (!cahier) return null;
      return {
        id: texte(r?.id, 40) || randomBytes(6).toString('hex'),
        brief: cahier,
        status: STATUTS_RECHERCHE.includes(r?.status) ? r.status : 'en_recherche',
        budgetMax: montant(r?.budgetMax),
        yearMin: montant(r?.yearMin),
        kmMax: montant(r?.kmMax),
        gearbox: texte(r?.gearbox, 20),
        fuel: texte(r?.fuel, 20),
        startedAt: texte(r?.startedAt, 20),
        notes: texte(r?.notes, 2000),
        candidates: Array.isArray(r?.candidates)
          ? r.candidates
              .slice(0, 50)
              .map((c) => {
                const libelle = texte(c?.label, 200);
                if (!libelle) return null;
                const lien = texte(c?.url, 500);
                return {
                  id: texte(c?.id, 40) || randomBytes(6).toString('hex'),
                  label: libelle,
                  price: montant(c?.price),
                  // Seuls http(s) : un lien `javascript:` collé depuis une
                  // annonce deviendrait exécutable au clic dans le panel.
                  url: /^https?:\/\//i.test(lien) ? lien : '',
                  note: texte(c?.note, 500),
                };
              })
              .filter(Boolean)
          : [],
      };
    });
  }

  if (fourni('leadIds')) {
    resultat.leadIds = liste(source.leadIds, (id) => texte(id, 40) || null);
  }

  if (fourni('nextAction')) {
    const date = texte(source.nextAction?.date, 20);
    // `null` ou une date vide annule la relance.
    resultat.nextAction = date
      ? { date, label: texte(source.nextAction?.label, 200) }
      : undefined;
  }

  return resultat;
}

function nettoyerDemande(brut) {
  const texte = (valeur, max = 2000) => String(valeur ?? '').slice(0, max);
  return {
    type: brut.type === 'estimation' ? 'estimation' : 'devis',
    name: texte(brut.name, 120),
    phone: texte(brut.phone, 40),
    email: texte(brut.email, 160),
    message: texte(brut.message),
    service: texte(brut.service, 160),
    plate: texte(brut.plate, 20),
    vehicle: texte(brut.vehicle, 200),
    expectedPrice: Number.isFinite(Number(brut.expectedPrice)) ? Number(brut.expectedPrice) : undefined,
  };
}

// -------------------------------------------------------------------- routage

const serveur = http.createServer(async (requete, reponse) => {
  const url = new URL(requete.url, `http://${requete.headers.host ?? 'localhost'}`);
  const chemin = url.pathname.replace(/\/+$/, '') || '/';
  const methode = requete.method ?? 'GET';

  try {
    // --- Contenus publics -------------------------------------------------
    if (chemin === '/api/content' && methode === 'GET') {
      // Cette route est publique : c'est elle qui alimente le site. Elle ne doit
      // renvoyer que ce qui est destiné à être affiché. Les demandes entrantes
      // et les fiches clients contiennent des données personnelles et ne sortent
      // que par leurs propres routes, derrière authentification.
      const { leads: _demandes, clients: _clients, ...publics } = store.lire();
      return json(reponse, 200, publics);
    }

    // --- Connexion --------------------------------------------------------
    if (chemin === '/api/login' && methode === 'POST') {
      const ip = ipDe(requete);
      if (limiteur.bloque(ip)) {
        return json(reponse, 429, {
          error: 'Trop de tentatives. Réessayez dans quelques minutes.',
        });
      }

      const { email, password } = await lireCorps(requete);
      const emailOk = String(email ?? '').trim().toLowerCase() === EMAIL_ADMIN.toLowerCase();
      const motDePasseOk = await verifierMotDePasse(String(password ?? ''), CONDENSE);

      if (!emailOk || !motDePasseOk) {
        limiteur.echec(ip);
        // Message unique : ne pas révéler lequel des deux champs est faux.
        return json(reponse, 401, { error: 'Identifiants incorrects.' });
      }

      limiteur.reussite(ip);
      const jeton = creerJeton(SECRET);
      return json(
        reponse,
        200,
        { email: EMAIL_ADMIN },
        {
          'Set-Cookie':
            `${COOKIE}=${encodeURIComponent(jeton)}; HttpOnly; SameSite=Strict; Path=/; ` +
            `Max-Age=${12 * 3600}${PRODUCTION ? '; Secure' : ''}`,
        }
      );
    }

    if (chemin === '/api/logout' && methode === 'POST') {
      return json(
        reponse,
        200,
        { ok: true },
        { 'Set-Cookie': `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0` }
      );
    }

    if (chemin === '/api/session' && methode === 'GET') {
      return authentifie(requete)
        ? json(reponse, 200, { email: EMAIL_ADMIN })
        : json(reponse, 401, { error: 'Session expirée.' });
    }

    // --- Images (lecture publique) ----------------------------------------
    // En production nginx sert ce dossier directement ; cette route couvre le
    // développement et sert de repli si le bloc nginx venait à manquer.
    const imageDemandee = chemin.match(/^\/media\/([^/]+)$/);
    if (imageDemandee && methode === 'GET') {
      const image = await medias.lire(decodeURIComponent(imageDemandee[1]));
      if (!image) return json(reponse, 404, { error: 'Image introuvable.' });
      reponse.writeHead(200, {
        'Content-Type': image.type,
        'Content-Length': image.octets.length,
        // Le nom de fichier est aléatoire et ne change jamais de contenu.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Last-Modified': image.modifie.toUTCString(),
      });
      return reponse.end(image.octets);
    }

    // --- Demandes entrantes (public en écriture) --------------------------
    if (chemin === '/api/leads' && methode === 'POST') {
      const brut = await lireCorps(requete);
      const demande = nettoyerDemande(brut);
      if (!demande.name || (!demande.phone && !demande.email)) {
        return json(reponse, 400, { error: 'Nom et moyen de contact requis.' });
      }

      let creee;
      await store.modifier((donnees) => {
        creee = {
          ...demande,
          id: nouvelIdDemande(donnees.leads ?? []),
          status: 'nouveau',
          createdAt: new Date().toISOString(),
        };
        return { ...donnees, leads: [creee, ...(donnees.leads ?? [])] };
      });
      return json(reponse, 201, creee);
    }

    // --- À partir d'ici, authentification obligatoire ----------------------
    if (chemin.startsWith('/api/')) {
      if (!authentifie(requete)) {
        return json(reponse, 401, { error: 'Authentification requise.' });
      }
    }

    if (chemin === '/api/content' && methode === 'PUT') {
      const corps = await lireCorps(requete);
      if (typeof corps !== 'object' || corps === null || Array.isArray(corps)) {
        return json(reponse, 400, { error: 'Contenus attendus sous forme d’objet.' });
      }
      // Les demandes ne se modifient que par leurs propres routes : une
      // sauvegarde de contenus ne doit pas pouvoir les écraser.
      const { leads: _demandes, clients: _clients, ...contenus } = corps;
      const suivant = await store.modifier((donnees) => ({ ...donnees, ...contenus }));
      return json(reponse, 200, suivant);
    }

    if (chemin === '/api/media' && methode === 'POST') {
      const octets = await lireOctets(requete, TAILLE_MAX + 1024);
      const nom = await medias.enregistrer(octets);
      return json(reponse, 201, { url: `/media/${nom}`, nom, taille: octets.length });
    }

    const imageCiblee = chemin.match(/^\/api\/media\/([^/]+)$/);
    if (imageCiblee && methode === 'DELETE') {
      await medias.supprimer(decodeURIComponent(imageCiblee[1]));
      // Idempotent : supprimer une image déjà absente n'est pas une erreur.
      return json(reponse, 204, {});
    }

    // Retire du disque les images qu'aucun véhicule ne référence plus.
    if (chemin === '/api/media/nettoyer' && methode === 'POST') {
      const contenus = JSON.stringify(store.lire());
      const resultat = await medias.nettoyer(contenus);
      return json(reponse, 200, resultat);
    }

    // --- Fiches clients ---------------------------------------------------
    // Comme les demandes, elles ont leurs propres routes : une sauvegarde de
    // contenus depuis le panel ne doit jamais pouvoir les écraser.
    if (chemin === '/api/clients' && methode === 'GET') {
      return json(reponse, 200, store.lire().clients ?? []);
    }

    if (chemin === '/api/clients' && methode === 'POST') {
      const champs = {
        vehicles: [],
        interventions: [],
        consignments: [],
        searches: [],
        notes: [],
        leadIds: [],
        status: 'prospect',
        phone: '',
        email: '',
        city: '',
        source: '',
        about: '',
        ...nettoyerClient(await lireCorps(requete)),
      };
      if (!champs.name) {
        return json(reponse, 400, { error: 'Le nom est obligatoire.' });
      }

      let creee;
      await store.modifier((donnees) => {
        const clients = donnees.clients ?? [];
        const maintenant = new Date().toISOString();
        creee = {
          ...champs,
          id: nouvelIdentifiant('CL', clients),
          createdAt: maintenant,
          updatedAt: maintenant,
        };
        return { ...donnees, clients: [creee, ...clients] };
      });
      return json(reponse, 201, creee);
    }

    const clientCible = chemin.match(/^\/api\/clients\/([A-Za-z0-9_-]+)$/);
    if (clientCible) {
      const id = clientCible[1];

      if (methode === 'PATCH') {
        const champs = nettoyerClient(await lireCorps(requete), { partiel: true });
        let modifiee = null;
        await store.modifier((donnees) => ({
          ...donnees,
          clients: (donnees.clients ?? []).map((c) => {
            if (c.id !== id) return c;
            modifiee = { ...c, ...champs, updatedAt: new Date().toISOString() };
            return modifiee;
          }),
        }));
        if (!modifiee) return json(reponse, 404, { error: 'Fiche introuvable.' });
        return json(reponse, 200, modifiee);
      }

      if (methode === 'DELETE') {
        await store.modifier((donnees) => ({
          ...donnees,
          clients: (donnees.clients ?? []).filter((c) => c.id !== id),
          // Les demandes rattachées survivent, mais perdent leur lien.
          leads: (donnees.leads ?? []).map((d) =>
            d.clientId === id ? { ...d, clientId: undefined } : d
          ),
        }));
        return json(reponse, 204, {});
      }
    }

    // Ajout d'une note : l'horodatage et l'identifiant sont posés par le
    // serveur, pour que le journal reste fiable.
    const noteCible = chemin.match(/^\/api\/clients\/([A-Za-z0-9_-]+)\/notes$/);
    if (noteCible && methode === 'POST') {
      const id = noteCible[1];
      const contenu = texte((await lireCorps(requete))?.text, 4000);
      if (!contenu) return json(reponse, 400, { error: 'Note vide.' });

      let note = null;
      await store.modifier((donnees) => ({
        ...donnees,
        clients: (donnees.clients ?? []).map((c) => {
          if (c.id !== id) return c;
          note = {
            id: randomBytes(8).toString('hex'),
            createdAt: new Date().toISOString(),
            text: contenu,
          };
          return { ...c, notes: [note, ...(c.notes ?? [])], updatedAt: note.createdAt };
        }),
      }));
      if (!note) return json(reponse, 404, { error: 'Fiche introuvable.' });
      return json(reponse, 201, note);
    }

    if (chemin === '/api/leads' && methode === 'GET') {
      return json(reponse, 200, store.lire().leads ?? []);
    }

    const correspondance = chemin.match(/^\/api\/leads\/([A-Za-z0-9_-]+)$/);
    if (correspondance) {
      const id = correspondance[1];

      if (methode === 'PATCH') {
        const corps = await lireCorps(requete);
        const modifications = {};

        if (corps.status !== undefined) {
          const permis = ['nouveau', 'contacte', 'rdv', 'cloture'];
          if (!permis.includes(corps.status)) {
            return json(reponse, 400, { error: 'Statut inconnu.' });
          }
          modifications.status = corps.status;
        }

        // `null` détache la demande de sa fiche client.
        if (corps.clientId !== undefined) {
          modifications.clientId = corps.clientId === null ? undefined : texte(corps.clientId, 40);
        }

        if (Object.keys(modifications).length === 0) {
          return json(reponse, 400, { error: 'Rien à modifier.' });
        }

        const suivant = await store.modifier((donnees) => ({
          ...donnees,
          leads: (donnees.leads ?? []).map((d) => (d.id === id ? { ...d, ...modifications } : d)),
        }));
        return json(reponse, 200, suivant.leads.find((d) => d.id === id) ?? null);
      }

      if (methode === 'DELETE') {
        await store.modifier((donnees) => ({
          ...donnees,
          leads: (donnees.leads ?? []).filter((d) => d.id !== id),
        }));
        return json(reponse, 204, {});
      }
    }

    return json(reponse, 404, { error: 'Route inconnue.' });
  } catch (erreur) {
    const code = erreur.code === 413 || erreur.code === 400 ? erreur.code : 500;
    if (code === 500) console.error('Erreur serveur :', erreur);
    return json(reponse, code, {
      error: code === 500 ? 'Erreur interne.' : erreur.message,
    });
  }
});

const defauts = await valeursParDefaut();
try {
  await store.init(defauts);
  await medias.init();
} catch (erreur) {
  console.error(erreur.message);
}

serveur.listen(PORT, '127.0.0.1', () => {
  console.log(`API Teintérior sur http://127.0.0.1:${PORT}`);
  console.log(`Contenus : ${FICHIER}`);
  console.log(`Images   : ${MEDIA}`);
});
