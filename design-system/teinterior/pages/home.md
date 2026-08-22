# Override — Site public Teintérior (toutes pages)

> Ce fichier **prime sur** `../MASTER.md` pour l'ensemble des pages du site public :
> `/`, `/prestations`, `/retrofit-carplay`, `/vendre-sa-voiture`, `/vehicules`,
> `/vehicules/:id`, `/realisations`, `/contact`, `/mentions-legales` et la page 404.
> Il documente les écarts assumés avec les recommandations générées, et les règles
> réellement appliquées dans le code (`src/index.css`, `tailwind.config.js`).

## Écarts assumés avec MASTER.md

| Point | MASTER.md | Appliqué ici | Raison |
|---|---|---|---|
| Fond | `#F8FAFC` (clair) | `#06080B` → `#12171F` (carbone), voile radial laiton | Brief client : thème sombre. |
| Accent CTA | `#DC2626` (action red) | `#D9A441` (laiton) | Choix du client, tenu après essai d'une variante bleue. Dégradés laiton et halos assumés sur les éléments actionnables. |
| Accent secondaire | — | `#7FD8FF` (ice) | Réservé au pôle rétrofit, cohérent avec le bleu du logo. Jamais utilisé comme CTA principal. |
| Typographie | Bodoni Moda / Jost | Sora (titres) + Inter (corps) | Sora garde le registre premium avec un dessin géométrique plus automobile que le didone. |
| Rayons | — | `rounded-3xl` sur les cartes, pilules sur les boutons | Rendu voulu haut de gamme plutôt qu'administratif. |
| Profondeur | — | `shadow-card`, `shadow-glow`, `backdrop-blur` | Le rendu totalement plat a été refusé en revue. |

> **Historique** — une variante sobre (ardoise mate, accent bleu unique, angles nets,
> tableaux denses, sans halo) a été implémentée puis abandonnée à la demande du client :
> jugée trop froide et pas assez premium. Ne pas y revenir sans validation explicite.
> Elle reste consultable dans l'historique git entre `cd0d645` et le retour arrière.

## Palette

| Rôle | Token | Hex | Contraste sur `#06080B` |
|---|---|---|---|
| Fond | `ink-950` | `#06080B` | — |
| Surfaces | `ink-900` / `ink-850` / `ink-800` | `#0A0D12` / `#0E1219` / `#12171F` | — |
| Texte principal | `fg` | `#FFFFFF` | 20,1:1 |
| Texte courant | `muted` | `#CBD5E1` | 13,5:1 |
| Texte secondaire | `faint` | `#94A3B8` | 7,8:1 |
| Accent | `accent` / `accent-soft` | `#D9A441` / `#F2CE85` | 8,9:1 / 13,3:1 |
| Accent technique | `ice` | `#7FD8FF` | 12,6:1 |
| États | `signal.ok` / `warn` / `danger` | `#34D399` / `#FCD34D` / `#FB7185` | ≥ 7,4:1 |

Bordures en `border-white/10`, séparateurs `.hairline` en dégradé. Interdits maintenus :
noir pur `#000`, texte sous 4,5:1, tableaux denses sur les pages publiques.

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
