import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
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

// Les contenus viennent du serveur. La requête part maintenant, mais n'est
// appliquée qu'une fois l'hydratation terminée (voir `AppTree`) : changer
// l'état pendant que React reprend le balisage pré-rendu ferait diverger les
// deux rendus, et React jetterait tout le DOM figé.
// Si l'API est injoignable, le site reste sur les contenus du build.
useSiteStore.getState().precharger().catch(() => {});

const racine = document.getElementById('root');
const arbre = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Les pages publiques arrivent pré-rendues : on reprend le balisage existant
// au lieu de le reconstruire. Avec `createRoot`, React jetait tout le DOM figé
// pour le refaire à l'identique — le pré-rendu coûtait alors un rendu complet
// de plus au lieu d'en économiser un, et retardait le premier affichage.
// Le panel d'administration, lui, n'est pas pré-rendu : sa racine est vide.
if (racine.hasChildNodes()) hydrateRoot(racine, arbre);
else createRoot(racine).render(arbre);
