# Teintérior — Site vitrine & conversion

Application React + Vite + Tailwind CSS pour **Teintérior**, atelier d’esthétique automobile,
de rétrofit multimédia (CarPlay / Android Auto) et de courtage / dépôt-vente de véhicules.

Thème sombre « ardoise carbone », accent laiton (brass) et bleu glacier (ice), mobile-first,
100 % interactif avec des données mockées réalistes.

## Démarrage

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # prévisualisation du build
```

## Structure

Site **multipage** (React Router 6) : une page d'accueil qui présente les trois pôles,
puis une page dédiée par service.

| Route | Page | Contenu |
| --- | --- | --- |
| `/` | `HomePage` | Hero, les 3 pôles, aperçu de 3 véhicules, 3 avis, bande CTA |
| `/prestations` | `PrestationsPage` | Formules detailing, options, comparateur avant / après |
| `/retrofit-carplay` | `RetrofitPage` | Bénéfices du rétrofit + configurateur de compatibilité |
| `/vendre-sa-voiture` | `VendrePage` | Étapes du dépôt-vente + formulaire d'estimation |
| `/vehicules` | `VehiculesPage` | Showroom complet, filtres par statut |
| `/vehicules/:vehicleId` | `VehiculeDetailPage` | Fiche véhicule, caractéristiques, essai, suggestions |
| `/realisations` | `RealisationsPage` | Galerie filtrable + tous les avis clients |
| `/contact` | `ContactPage` | Formulaire de devis, coordonnées, horaires, plan d'accès |
| `/mentions-legales` | `LegalPage` | Mentions légales, CGV, confidentialité, cookies |
| `*` | `NotFoundPage` | 404 avec réorientation vers les pages principales |

```
src/
├── App.jsx                     Router, layout global et déclaration des routes
├── main.jsx                    Point d'entrée React
├── index.css                   Base Tailwind, utilitaires (.panel, .field, .tap, .reveal…)
├── pages/                      Une page par route (titre + meta description dédiés)
├── context/
│   └── QuoteContext.jsx        Pré-remplit le devis puis navigue vers /contact
├── hooks/
│   ├── usePageMeta.js          Titre et meta description par page
│   ├── useScrollPosition.js    Header compact, barre mobile, retour en haut
│   ├── useLockBodyScroll.js    Blocage du scroll (menu mobile)
│   └── useSmoothScroll.js      Ancres internes compensant le header fixe
├── data/
│   ├── site.js                 Marque, routes, pôles, coordonnées, horaires, mentions
│   ├── packages.js             Formules detailing, options, cas avant/après
│   ├── retrofit.js             6 marques → modèles → générations (compatibilité, tarif)
│   ├── vehicles.js             Showroom, étapes du dépôt-vente, listes énergies / boîtes
│   └── gallery.js              Réalisations filtrables + témoignages clients
└── components/
    ├── layout/                 Header, Footer, PageHeader, ScrollToTop, barre mobile, retour en haut
    ├── sections/               Blocs réutilisables : Hero, PoleOverview, Detailing, Retrofit,
    │                           Sourcing, Showroom, Gallery, Testimonials, Contact, CtaBand
    └── ui/                     Button, SectionHeading, Reveal, Icon, Logo, StarRating,
                                BeforeAfterSlider, CarVisual (illustrations SVG générées)
```

Les blocs de `sections/` acceptent `hideHeading` (le titre H1 est alors porté par `PageHeader`)
et, pour `Showroom` / `Gallery` / `Testimonials`, un `limit` permettant l'aperçu en page d'accueil.

### Hébergement statique

Le routage se fait côté client : toute URL doit être servie par `index.html`.
`public/_redirects` (Netlify) et `vercel.json` (Vercel) sont fournis. Sur Apache ou nginx,
configurer une réécriture équivalente vers `/index.html`.

## Modules interactifs

| Module | Emplacement | Comportement |
| --- | --- | --- |
| Comparateur avant / après | `ui/BeforeAfterSlider.jsx` | Curseur souris, tactile et clavier (flèches, Home/End), 3 cas de figure |
| Configurateur rétrofit | `sections/Retrofit.jsx` | 3 étapes : marque → modèle & année → compatibilité, tarif, durée, réservation |
| Estimation véhicule | `sections/Sourcing.jsx` | Validation complète, fourchette de prix calculée, récapitulatif et référence |
| Showroom | `sections/Showroom.jsx` | Filtres par statut, fiche détaillée sur sa propre page, réservation d'essai |
| Galerie | `sections/Gallery.jsx` | Filtres Detailing / CarPlay / Vente |
| Devis & contact | `sections/Contact.jsx` | Sélecteur de service, validation (email, téléphone, immatriculation AB-123-CD), pièces jointes |

Les boutons « Réserver cette formule », « Réserver l’installation » et « Réserver un essai »
alimentent le `QuoteContext` : l’utilisateur est envoyé sur `/contact` avec le formulaire
déjà pré-rempli (service + message contextualisé).

## Illustrations

Aucun asset externe n’est chargé : les visuels véhicules, habitacles et écrans multimédia sont
des SVG générés par `ui/CarVisual.jsx`, déclinés en variantes `before` / `after` pour alimenter
le comparateur. Seules les polices Google (Sora, Inter) sont chargées à distance.

## Design system

Le système de design est documenté et versionné :

- `design-system/teinterior/MASTER.md` — recommandations générées (pattern de conversion,
  style « Modern Dark / Cinema », palette, typographie, effets, checklist de livraison)
- `design-system/teinterior/pages/home.md` — **override appliqué au site** : écarts assumés
  (fond carbone, accent laiton plutôt que rouge, Sora/Inter plutôt que Bodoni/Jost) et règles
  réellement en vigueur (contraste, échelle typographique, motion, cibles tactiles, formulaires)

En cas de doute sur une décision visuelle, `pages/home.md` prime sur `MASTER.md`.

### Garde-fous vérifiés

- Contraste : tout texte ≥ 7:1 sur fond carbone (`slate-500` et `slate-600` bannis)
- Cibles tactiles ≥ 44 px sur les boutons et puces de filtre, ≥ 40 px sur les liens texte
- Validation de formulaire au blur + à l'envoi, focus porté sur le premier champ invalide
- Budget d'animation : 2 éléments animés en permanence maximum, `prefers-reduced-motion` respecté
- Aucun débordement horizontal à 375 / 768 / 1024 / 1440 px

## Données à personnaliser avant mise en ligne

Les contenus sont des **données mockées réalistes** : adresse, téléphone, email, SIRET, tarifs,
compatibilités rétrofit, véhicules du showroom et témoignages. Tout se modifie dans `src/data/`.
Les formulaires n’envoient rien : brancher `handleSubmit` de `sections/Contact.jsx` et
`sections/Sourcing.jsx` sur l’API ou le service d’emailing de votre choix.
