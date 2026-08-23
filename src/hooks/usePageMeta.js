import { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../data/site.js';

/**
 * Collecteur utilisé au pré-rendu.
 *
 * Les effets ne s'exécutent pas côté serveur : sans ce relais, les pages
 * pré-rendues porteraient toutes le titre et la canonique génériques
 * d'`index.html`. Le fournisseur n'existe qu'au build ; dans le navigateur le
 * contexte vaut `null` et seul le chemin par effet s'applique.
 */
export const MetaContext = createContext(null);

/** URL canonique d'un chemin, sans barre finale sauf pour l'accueil. */
export const urlCanonique = (pathname) =>
  `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;

/** Crée la balise si elle manque, puis lui donne sa valeur. */
function poser(selecteur, attributs, valeur) {
  let balise = document.head.querySelector(selecteur);
  if (!balise) {
    balise = document.createElement(attributs.tag);
    for (const [cle, val] of Object.entries(attributs)) {
      if (cle !== 'tag') balise.setAttribute(cle, val);
    }
    document.head.appendChild(balise);
  }
  balise.setAttribute(attributs.tag === 'link' ? 'href' : 'content', valeur);
}

/**
 * Titre, description et URL canonique de la page courante.
 *
 * La canonique doit suivre la route : `index.html` étant servi pour toutes les
 * URL, une canonique figée sur l'accueil dirait à Google que chaque page est un
 * doublon de la page d'accueil, et ferait sortir les pages internes de l'index.
 */
export default function usePageMeta({ title, description }) {
  const { pathname } = useLocation();
  const collecteur = useContext(MetaContext);

  // Au pré-rendu, on note ce que la page déclare pendant son rendu : c'est le
  // seul moment où le serveur voit passer l'information.
  if (collecteur) {
    if (title) collecteur.title = title;
    if (description) collecteur.description = description;
    collecteur.pathname = pathname;
  }

  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      poser('meta[name="description"]', { tag: 'meta', name: 'description' }, description);
      poser('meta[name="twitter:description"]', { tag: 'meta', name: 'twitter:description' }, description);
      poser('meta[property="og:description"]', { tag: 'meta', property: 'og:description' }, description);
    }

    if (title) {
      poser('meta[property="og:title"]', { tag: 'meta', property: 'og:title' }, title);
      poser('meta[name="twitter:title"]', { tag: 'meta', name: 'twitter:title' }, title);
    }

    const url = urlCanonique(pathname);
    poser('link[rel="canonical"]', { tag: 'link', rel: 'canonical' }, url);
    poser('meta[property="og:url"]', { tag: 'meta', property: 'og:url' }, url);
  }, [title, description, pathname]);
}
