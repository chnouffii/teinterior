import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import seo from './build/plugin-seo.js';

export default defineConfig({
  plugins: [react(), seo()],
  server: {
    port: 5173,
    open: true,
    // En développement, `/api` est relayé vers le service Node local, comme le
    // fait nginx en production. Le front n'a donc jamais d'URL absolue à gérer.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: false,
      },
      // Les photos déposées depuis le panel sont servies par l'API en
      // développement ; en production, nginx sert le dossier directement.
      '/media': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: false,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: false,
      },
      // Les photos déposées depuis le panel sont servies par l'API en
      // développement ; en production, nginx sert le dossier directement.
      '/media': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: false,
      },
    },
  },
});
