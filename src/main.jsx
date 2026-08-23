import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Polices auto-hébergées. Chargées depuis le domaine du site plutôt que depuis
// Google : la feuille de style tierce bloquait le premier rendu (168 ms mesurés
// quand elle échoue vite, 12,5 s quand elle traîne), et son chargement direct
// transmettait l'adresse IP de chaque visiteur à Google.
import '@fontsource/sora/latin-600.css';
import '@fontsource/sora/latin-700.css';
import '@fontsource/sora/latin-800.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import './index.css';
import { useSiteStore } from './store/siteStore';

// Les contenus viennent du serveur. On lance la requête avant le premier rendu :
// le site s'affiche avec les données du build, puis se met à jour dès la réponse.
// Si l'API est injoignable, il reste sur les données du build plutôt que de rester vide.
useSiteStore.getState().hydrater();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
