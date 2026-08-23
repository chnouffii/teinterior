/**
 * Lance le pré-rendu après `vite build`.
 *
 * Vite est chargé en mode intergiciel plutôt que via un second build SSR : il
 * résout ainsi le JSX, le TypeScript et les feuilles de style du projet sans
 * qu'on ait à décrire une deuxième configuration qui divergerait de la
 * première.
 */
import { createServer } from 'vite';
import prerendre from './prerendu.mjs';

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'warn',
});

try {
  const { rendu } = await vite.ssrLoadModule('/src/entry-server.jsx');
  const nombre = await prerendre({ rendu });
  console.log(`  pré-rendu     ${nombre} pages`);
} finally {
  await vite.close();
}
