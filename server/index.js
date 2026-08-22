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
      return json(reponse, 200, store.lire());
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
      const { leads: _ignore, ...contenus } = corps;
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

    if (chemin === '/api/leads' && methode === 'GET') {
      return json(reponse, 200, store.lire().leads ?? []);
    }

    const correspondance = chemin.match(/^\/api\/leads\/([A-Za-z0-9_-]+)$/);
    if (correspondance) {
      const id = correspondance[1];

      if (methode === 'PATCH') {
        const { status } = await lireCorps(requete);
        const permis = ['nouveau', 'contacte', 'rdv', 'cloture'];
        if (!permis.includes(status)) {
          return json(reponse, 400, { error: 'Statut inconnu.' });
        }
        const suivant = await store.modifier((donnees) => ({
          ...donnees,
          leads: (donnees.leads ?? []).map((d) => (d.id === id ? { ...d, status } : d)),
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
