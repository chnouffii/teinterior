import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../data/site.js';

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

    // Sans barre finale, sauf pour l'accueil : deux URL qui ne diffèrent que par
    // elle seraient traitées comme deux pages distinctes.
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;
    poser('link[rel="canonical"]', { tag: 'link', rel: 'canonical' }, url);
    poser('meta[property="og:url"]', { tag: 'meta', property: 'og:url' }, url);
  }, [title, description, pathname]);
}
