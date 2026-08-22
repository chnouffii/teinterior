# Override — Site public Teintérior (toutes pages)

> Ce fichier **prime sur** `../MASTER.md` pour l'ensemble des pages du site public :
> `/`, `/prestations`, `/retrofit-carplay`, `/vendre-sa-voiture`, `/vehicules`,
> `/vehicules/:id`, `/realisations`, `/contact`, `/mentions-legales` et la page 404.
> Il documente les écarts assumés avec les recommandations générées, et les règles
> réellement appliquées dans le code (`src/index.css`, `tailwind.config.js`).

## Écarts assumés avec MASTER.md

| Point | MASTER.md | Appliqué ici | Raison |
|---|---|---|---|
| Fond | `#F8FAFC` (clair) | `#06080B` → `#12171F` (carbone) | Brief client : dark theme obligatoire. Le style retenu (« Modern Dark / Cinema ») est lui-même *Dark Mode Primary* ; la palette « Automotive » livrée est sa déclinaison claire. |
| Accent CTA | `#DC2626` (action red) | `#D9A441` (laiton) | Sur fond carbone, le laiton porte le positionnement premium/detailing (palette DB « Luxury » : accent or `#A16207`/`#CA8A04`). Le rouge est réservé au **destructif** (erreurs de formulaire, `rose-400`). |
| Accent secondaire | — | `#7FD8FF` (ice) | Réservé au pôle technique (rétrofit CarPlay) pour séparer visuellement les deux métiers. Jamais utilisé comme CTA. |
| Typographie | Bodoni Moda / Jost | Sora / Inter | Bodoni (didone mode/luxe) lit « maison de couture » plutôt qu'« atelier automobile ». Sora conserve le registre premium avec un dessin géométrique plus technique. Le **système de précision** de la fiche « Modern Dark Cinema » est repris : tracking serré sur les titres, labels 500 uppercase +0.12em. |

## Règles appliquées

### Couleurs de texte (contraste vérifié sur `#06080B` → `#12171F`)

| Rôle | Classe | Ratio min. |
|---|---|---|
| Titres | `text-white` | 17,9:1 |
| Corps / listes | `text-slate-300` | 12,1:1 |
| Méta, labels, notes | `text-slate-400` | 7,0:1 |
| Accent / valeurs | `text-brass-light`, `text-gradient-brass` | 11,9:1 |
| Erreurs | `text-rose-400` | 6,6:1 |

`slate-500` (3,8:1) et `slate-600` (2,4:1) sont **interdits** pour du texte : ils échouent WCAG AA sur cette palette.

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
