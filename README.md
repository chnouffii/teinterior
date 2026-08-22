# Teintérior — Site vitrine & conversion

Application React + Vite + Tailwind CSS pour **Teintérior**, atelier d’esthétique automobile,
de rétrofit multimédia (CarPlay / Android Auto) et de courtage / dépôt-vente de véhicules.

Atelier situé à **Brumath (67)**. Thème sombre « carbone », accent laiton (brass) et bleu
glacier (ice), mobile-first, 100 % interactif avec des données mockées réalistes.

## Démarrage

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de production dans dist/
npm run preview  # prévisualisation du build
npm run typecheck # vérification TypeScript du store et du panel admin
```

Identifiants du panel d'administration (`/admin`) : `admin@teinterior.fr` / `teinterior2026`.

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
| `/admin/connexion` | `LoginPage` | Connexion au panel d'administration |
| `/admin/*` | `AdminLayout` | Panel d'administration protégé (voir plus bas) |

```
src/
├── App.jsx                     Router, layout global et déclaration des routes
├── main.jsx                    Point d'entrée React
├── index.css                   Base Tailwind, utilitaires (.panel, .field, .tap, .reveal…)
├── pages/                      Une page par route (titre + meta description dédiés)
├── store/                      TypeScript — source de vérité partagée
│   ├── siteStore.ts            Véhicules, prestations, contenus, leads (Zustand + persist)
│   ├── authStore.ts            Session d'administration (SHA-256 + sessionStorage)
│   └── types.ts                Types métier
├── admin/                      TypeScript — panel d'administration
│   ├── components/             Layout, modale, champs, toasts, formulaire véhicule
│   └── pages/                  Connexion, tableau de bord, showroom, prestations, contenu, leads
├── context/
│   └── QuoteContext.jsx        Pré-remplit le devis puis navigue vers /contact
├── hooks/
│   ├── usePageMeta.js          Titre et meta description par page
│   ├── useScrollPosition.js    Header compact, barre mobile, retour en haut
│   ├── useLockBodyScroll.js    Blocage du scroll (menu mobile)
│   └── useSmoothScroll.js      Ancres internes compensant le header fixe
├── data/
│   ├── site.js                 Marque, routes, pôles, coordonnées, mentions légales
│   ├── services.js             Packs detailing détaillés en opérations + options
│   ├── retrofit.js             Déroulé d'intervention + catalogue marque > modèle > système
│   ├── vehicles.js             Showroom (données publiques et internes)
│   ├── content.js              Accroche, atelier, avant/après, galerie, avis, pipeline
│   └── leads.js                Demandes entrantes de démonstration
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
| Comparateur avant / après | `ui/BeforeAfterSlider.jsx` | Banc de comparaison gradué, souris / tactile / clavier, accepte de vraies photos |
| Sélecteur de compatibilité | `sections/Retrofit.jsx` | Catalogue de pièces : marque → modèle → système embarqué, puis référence d'interface, tarif, durée |
| Estimation véhicule | `sections/Sourcing.jsx` | Validation au blur, fourchette calculée, création d'un lead visible en admin |
| Showroom | `sections/Showroom.jsx` | Filtres par statut, fiche détaillée sur sa propre page, réservation d'essai |
| Galerie | `sections/Gallery.jsx` | Filtres Detailing / CarPlay / Vente |
| Devis & contact | `sections/Contact.jsx` | Sélecteur de prestation, validation (email, téléphone, immatriculation), pièces jointes, création d'un lead |

Les boutons « Réserver cette formule », « Réserver l’installation » et « Réserver un essai »
alimentent le `QuoteContext` : l’utilisateur est envoyé sur `/contact` avec le formulaire
déjà pré-rempli (service + message contextualisé).

## Illustrations

Aucun asset externe n’est chargé : les visuels véhicules, habitacles et écrans multimédia sont
des SVG générés par `ui/CarVisual.jsx`, déclinés en variantes `before` / `after` pour alimenter
le comparateur. Seules les polices Google (Sora, Inter) sont chargées à distance.

## Direction artistique

Thème sombre **carbone** (`#06080B` → `#12171F`), fond plat sans voile ni grille.
Accent **laiton `#D9A441`** réservé aux rubriques de section, aux liens d'action et aux
boutons primaires — jamais en dégradé et jamais sur un titre coupé en deux couleurs.
Accent secondaire **ice `#7FD8FF`** pour le pôle rétrofit. Surfaces opaques, rayons courts
(`rounded-md` / `rounded-lg`), pas de halo ni de flou d'arrière-plan. Sora pour les titres,
Inter pour le texte.

Les en-têtes de page (`layout/PageHeader.jsx`) posent le titre et le chapô sur deux colonnes
à partir de `lg`, pour occuper toute la largeur au lieu de laisser la moitié droite vide.

Les pages publiques n'utilisent aucun tableau : formules, déroulé d'intervention et
pipeline sont présentés en cartes. Les tableaux denses sont réservés au panel admin.

- `design-system/teinterior/MASTER.md` — recommandations générées par la base de design
- `design-system/teinterior/pages/home.md` — **règles réellement appliquées** : palette avec
  ratios de contraste, écarts assumés, motion, cibles tactiles, formulaires

### Logo

Déposez le logo dans **`public/logo.png`** : le composant `ui/Logo.jsx` l'utilise
automatiquement dans le header et le pied de page. Sans ce fichier, un repli vectoriel
s'affiche : silhouette de coupé dans le dégradé bleu → violet de la marque. Voir
`public/README-logo.md`. Le `favicon.svg` reprend le même dessin.

### Illustrations de véhicules

`ui/CarVisual.jsx` expose cinq carrosseries (`berline`, `break`, `suv`, `citadine`,
`coupe`) via la prop `body`. Chaque véhicule du showroom et chaque réalisation porte sa
carrosserie et sa teinte, pour que deux fiches ne se ressemblent jamais.

## Panel d'administration (`/admin`)

Interface sombre dense, séparée du site public, protégée par une page de connexion.

| Écran | Rôle |
| --- | --- |
| `/admin` | Tableau de bord : stock, valeur, marge potentielle, dernières demandes |
| `/admin/vehicules` | CRUD complet : filtres par statut, formulaire, galerie photos, marge calculée, « marquer vendu » en un clic |
| `/admin/prestations` | Packs (nom, prix, temps, étapes, produits), options à la carte, forfaits rétrofit par système |
| `/admin/contenu` | CMS léger : accroche et compteurs du hero, présentation atelier, coordonnées (deux lignes téléphoniques), horaires, galerie avant/après, avis clients et note affichée, compte admin |
| `/admin/leads` | Demandes entrantes, filtres par type et statut (Nouveau, Contacté, RDV fixé, Clôturé) |

### État global

`src/store/siteStore.ts` (Zustand + `persist`) est la source de vérité unique : le site
public et le panel lisent le même état. Toute modification est répercutée instantanément
et sauvegardée dans `localStorage` sous la clé `teinterior-site`. Les fichiers de
`src/data/` servent de jeu de données initial, restaurable depuis Admin → Contenu →
Réinitialiser.

Les formulaires publics (devis et estimation) créent de vraies demandes dans le store :
elles apparaissent aussitôt dans `/admin/leads`.

### Sécurité — à lire avant mise en ligne

L'authentification est **côté client** (`src/store/authStore.ts`) : mot de passe stocké en
SHA-256 salé, session en `sessionStorage` expirant après 8 h, blocage temporaire après 5
échecs. Cela empêche un accès occasionnel, pas un utilisateur déterminé qui lirait le
bundle. Avant toute mise en ligne publique : remplacer `login()` par un appel serveur
renvoyant un JWT signé, et protéger les écritures côté API.

## Données à personnaliser avant mise en ligne

Les coordonnées (adresse, téléphones, email, Instagram) sont réelles. Restent **fictifs** :
les tarifs, les compatibilités rétrofit, les véhicules du showroom, les avis clients et les
compteurs du hero (« 1 400 véhicules », « 380 rétrofits », « 214 avis »). Tout cela se modifie
dans `src/data/` ou directement depuis Admin → Contenu.

⚠ **SIRET, TVA, RCS, capital et assurance sont volontairement vides** dans `data/site.js`
(`COMPANY`) : les mentions légales sont obligatoires et il valait mieux ne rien afficher que
d'afficher des numéros inventés. À renseigner avant toute mise en ligne.
Les formulaires n’envoient rien : brancher `handleSubmit` de `sections/Contact.jsx` et
`sections/Sourcing.jsx` sur l’API ou le service d’emailing de votre choix.
