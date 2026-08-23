import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { AppTree } from './App.jsx';
import { MetaContext, urlCanonique } from './hooks/usePageMeta.js';

/**
 * Rend une route en HTML, au moment du build.
 *
 * Les données viennent des modules statiques : `hydrater()` n'est pas appelé
 * ici. Le HTML figé contient donc les contenus du build, et le navigateur les
 * remplace par ceux de l'API dès qu'elle répond — exactement ce qui se passe
 * déjà aujourd'hui, mais avec une page lisible dès la première image.
 */
export function rendu(chemin) {
  const meta = { title: null, description: null, pathname: chemin };

  const html = renderToString(
    <MetaContext.Provider value={meta}>
      <StaticRouter location={chemin}>
        <AppTree prerendu />
      </StaticRouter>
    </MetaContext.Provider>
  );

  return { html, meta: { ...meta, canonical: urlCanonique(chemin) } };
}
