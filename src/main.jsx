import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
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
