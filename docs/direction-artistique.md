# Direction artistique

Ce que le site cherche à être, et pourquoi. À lire avant de toucher au style.

## L'idée directrice : la fiche d'atelier

Le métier de Teintérior consiste à **mesurer avant d'agir** — épaisseur de
vernis à la jauge, temps d'immobilisation, kilométrage, compatibilité d'un
système embarqué. Le client n'achète pas une promesse, il achète un relevé.

La direction artistique reprend ce geste : **la précision comme esthétique**.
Graduations, chiffres qui se posent, typographie de signalétique, matière
plutôt qu'aplats parfaits.

## Ce qu'on évite, délibérément

Le site précédent cochait les cases du gabarit générique : fond sombre, accent
unique, cartes bordées, trois colonnes symétriques, un seul fondu appliqué à
tout. Rien n'y était faux ; tout y était déjà vu.

Sont donc proscrits : dégradés violet/bleu, verre dépoli généralisé, blobs
abstraits, ombres molles sur tout, avatars inventés, emoji en guise d'icônes,
coins ultra-arrondis, mises en page centrées molles.

## Typographie

**Archivo Variable** en titres, sur son axe de chasse — 118 % pour les `h1`,
115 % pour les `h2`. Élargies, les capitales prennent une allure de signalétique
d'atelier. L'interlettrage est resserré à mesure que la chasse augmente, sinon
les titres se délitent.

Le choix compte : Sora, la géométrique neutre d'avant, se retrouve sur un site
sur deux. Un axe de chasse est une signature ; une géométrique neutre n'en est
pas une.

**Inter** reste au texte courant. Chiffres en `tabular-nums` partout.

Un seul fichier variable (88 ko) porte les graisses 100 à 900 et les chasses
62 à 125 %. Il coûte environ 70 ms de LCP de plus que les trois graisses fixes
qu'il remplace — le prix assumé d'une identité.

## Matière

- **Grain de pellicule** sur toute la page, opacité 0,035, produit par un filtre
  SVG en URL de données. Aucune requête, aucun coût au défilement. Un aplat
  sombre parfaitement lisse est ce qui trahit le plus un gabarit : aucune
  surface réelle n'est propre à ce point.
- **Graduation de pied à coulisse** en signature, sous chaque rubrique de
  section, à la place du filet uniforme. Dessinée en SVG : des dégradés empilés
  donnaient un semis irrégulier, l'arrondi des positions au pixel ne tombant pas
  juste.

## Mouvement

Quatre entrées en scène, **selon la nature de ce qui apparaît** — un tarif ne
doit pas arriver comme une photographie :

| Variante | Pour | Geste | Durée |
|---|---|---|---|
| `titre` | Titres | Dévoilé par le bas, comme une plaque | 720 ms |
| `carte` | Cartes, blocs | Montée courte et ferme, sans rebond | 550 ms |
| `image` | Photos, visuels | Légère avancée, comme une mise au point | 900 ms |
| `trait` | Filets, graduations | Tracé de gauche à droite | 850 ms |

Les **chiffres-clés se posent** en s'incrémentant à l'entrée dans le viewport
(`useCompteur`) : ce sont eux l'argument de l'atelier, un fondu les noyait.

Au survol, un **reflet spéculaire** suit le curseur sur les cartes, et un
**balayage** passe une fois sur les boutons pleins. Le métier consiste à
maîtriser un reflet sur une carrosserie ; une ombre portée générique n'aurait
rien dit.

### Deux pièges rencontrés

1. **`clip-path` empêche la révélation.** Un élément entièrement découpé n'est
   plus considéré comme visible par l'observateur d'intersection, qui ne se
   déclenche donc jamais : le titre restait invisible pour toujours. Les
   variantes `titre` et `trait` utilisent un **masque**, qui n'affecte que la
   peinture. Vérifié : `clip-path` donne un ratio d'intersection de 0,
   `mask-image` de 1.
2. **Le défilement doux fausse les tests.** Des appels rapprochés à `scrollTo`
   s'annulent mutuellement et la page n'atteint jamais le bas. Les vérifications
   automatisées défilent en `behavior: 'instant'`.

## Ce que le mouvement ne doit jamais coûter

Tout est conditionné à la classe `js`, posée par un script en ligne avant le
premier rendu. **Sans JavaScript, rien n'est masqué** : le HTML pré-rendu est
lisible tel quel, ce qui est la raison d'être du pré-rendu.

`prefers-reduced-motion` neutralise les quatre variantes, le compteur, le
balayage et le reflet — pas seulement les transitions.

## Mesures à ne pas dégrader

Relevées après refonte, mobile avec processeur divisé par quatre :

| Page | LCP | CLS |
|---|---|---|
| Accueil | 896 ms | 0,000 |
| Prestations | 932 ms | 0,015 |
| Véhicules | 900 ms | 0,000 |
| Contact | 792 ms | 0,000 |

Contraste AA vérifié sur 381 textes, aucun débordement de 390 à 1440 px,
focus visible au clavier sur tous les éléments interactifs.
