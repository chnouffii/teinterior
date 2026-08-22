# Override — Site public Teintérior (toutes pages)

> Ce fichier **prime sur** `../MASTER.md` pour l'ensemble des pages du site public :
> `/`, `/prestations`, `/retrofit-carplay`, `/vendre-sa-voiture`, `/vehicules`,
> `/vehicules/:id`, `/realisations`, `/contact`, `/mentions-legales` et la page 404.
> Il documente les écarts assumés avec les recommandations générées, et les règles
> réellement appliquées dans le code (`src/index.css`, `tailwind.config.js`).

## Écarts assumés avec MASTER.md

| Point | MASTER.md | Appliqué ici | Raison |
|---|---|---|---|
| Fond | `#F8FAFC` (clair) | `#0F1115` → `#22262E` (ardoise / graphite mat) | Brief client : thème sombre, sans noir pur. |
| Accent CTA | `#DC2626` (action red) | `#5B8DEF` (azur, repris du logo) | Le logo de la marque utilise un bleu ; l'accent en est extrait puis désaturé. Un seul accent sur tout le site, aucun dégradé, aucune lueur. |
| Typographie | Bodoni Moda / Jost | Inter (titres et corps) + JetBrains Mono (chiffres, références, durées) | Registre atelier technique plutôt que maison de couture. Le mono distingue les données mesurables du discours. |
| Rayons | — | `rounded` à `rounded-lg` (2 à 8 px) | Les grands rayons et les pilules lisaient « landing page générée ». |
| Ombres | — | aucune ombre portée diffuse, séparation par bordures `border-ink-700` | Suppression des effets de lueur. |

## Palette

| Rôle | Token | Hex | Contraste sur `#0F1115` |
|---|---|---|---|
| Fond | `ink-950` | `#0F1115` | — |
| Surfaces | `ink-900` / `ink-850` / `ink-800` | `#14171C` / `#191D23` / `#22262E` | — |
| Bordures | `ink-700` / `ink-600` | `#2C313A` / `#3A404B` | — |
| Texte principal | `fg` | `#F2F4F7` | 17,2:1 |
| Texte courant | `muted` | `#B4BAC4` | 9,7:1 |
| Texte secondaire | `faint` | `#8A919E` | 6,0:1 |
| Accent unique | `accent` | `#5B8DEF` | 5,9:1 |
| États | `signal.ok` / `warn` / `danger` | `#6FA980` / `#C9973F` / `#D2726B` | ≥ 5,7:1 |

Aucun texte ne descend sous 4,5:1. Interdits : dégradés multicolores, `box-shadow` de lueur,
noir pur `#000`, rayons supérieurs à 8 px sur les blocs de contenu.

### Typographie

- Display/H1 `font-display` (Sora) 700, `letter-spacing: -0.03em`
- H2 -0.022em · H3/H4 -0.015em · corps Inter 400 / 16px / 1.5
- Labels : 11-12px, 600, uppercase, tracking 0.12-0.22em
- Taille minimale de texte : **11px** (badges uppercase uniquement), 12px pour toute phrase

### Motion (dial 6/10 — Standard)

- Révélation au scroll : `opacity 0→1`, `translateY(24px)→0`, `scale(0.985)→1`, 550 ms, `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out)
- Stagger de grille : 80-90 ms par carte (équivalent GSAP `stagger: { each: 0.06 }`)
- Hover : 300 ms max · Press : `active:scale-[0.97]`
- Budget d'animation permanente : **2 éléments par vue maximum** (les deux cartes flottantes du hero)
- `prefers-reduced-motion: reduce` neutralise transitions et animations

### Cibles tactiles

- Boutons : `min-h-[44px]` (taille `sm`/`md`/`lg` : 44 / 46 / 52 px)
- Puces de filtre : utilitaire `.tap` (44×44 min)
- Liens texte en pied de page et cartes de contact : `min-h-[40px]`
- Case à consentement : 20 px, mais le `<label>` entier (44px+) est cliquable

### Formulaires

- Validation **au blur** puis à l'envoi (jamais uniquement à l'envoi)
- Label visible au-dessus de chaque champ, erreur sous le champ concerné
- `aria-invalid` + `aria-describedby` sur tout champ en erreur
- Focus déplacé sur le premier champ invalide à la soumission

### Navigation (site multipage)

- Une intention = une page. La page d'accueil ne fait qu'annoncer les trois pôles et renvoie
  vers leur page dédiée (`PoleOverview`), avec un aperçu limité (3 véhicules, 3 avis).
- Chaque page porte un `PageHeader` : fil d'Ariane, **un seul H1**, accroche propre à la page.
- Chaque page de service se termine par une `CtaBand` orientée conversion vers `/contact`.
- Retour en haut automatique à chaque changement de route, ancre respectée si l'URL en contient une.
- État actif du lien de navigation via `NavLink`, sur desktop comme dans le menu mobile.
- Titre et meta description dédiés par page (`usePageMeta`).
