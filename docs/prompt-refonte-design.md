# Brief de refonte — site Teintérior

> À coller tel quel dans Claude Design.

---

## Ce que je te demande

Refais la direction artistique complète du site **Teintérior**, un atelier
automobile indépendant à Brumath (Bas-Rhin). Le site fonctionne, il est rapide
et bien référencé — ce qui ne va pas, c'est qu'il **ressemble à un site généré**.
Je veux une identité visuelle qui ait l'air d'avoir été dessinée par quelqu'un,
pour cet atelier-là.

Livre-moi des maquettes d'écrans, pas une refonte du code : je m'occuperai de
l'implémentation.

---

## L'atelier, en vrai

Teintérior existe depuis 2025, au 4 rue des Carrières à Brumath (67170), à
vingt minutes de Strasbourg. C'est **un homme, un atelier, une voiture à la
fois** — pas une chaîne, pas un centre auto. Trois métiers :

1. **Esthétique automobile** — remise en état intérieur, correction de peinture
   à la polisseuse, protection céramique, teintage de vitres. Le vernis est
   mesuré à la jauge avant chaque passe. Trois formules, de 149 € à 890 €.
2. **Rétrofit multimédia** — intégration d'Apple CarPlay et Android Auto dans
   l'écran d'origine du véhicule, sans couper un seul faisceau, réversible en
   trente minutes. Un configurateur en ligne donne la compatibilité par marque,
   modèle et système embarqué.
3. **Vente et sourcing** — dépôt-vente de véhicules préparés et photographiés,
   ou recherche du véhicule que le client cherche, en France et en Allemagne.

**Ce qui distingue cet atelier de ses concurrents, et que le design doit porter :
la précision et la preuve.** Devis détaillés ligne par ligne. Épaisseur de vernis
mesurée. Compte rendu photo à chaque étape. Rien n'est promis en gros, tout est
chiffré. Le client type n'achète pas du rêve, il achète du sérieux vérifiable.

**Le ton juste** : précis, sobre, un peu technique, jamais grandiloquent. Ni
« votre voiture mérite le meilleur », ni jargon de garage. Le vocabulaire du
site actuel est bon — garde-le comme référence de registre.

---

## Le site actuel : ce qu'il est, précisément

### Les pages

| Page | Rôle |
|---|---|
| Accueil | Accroche, les trois métiers, aperçu de trois véhicules, avis, appel à l'action |
| Prestations | Trois formules détaillées étape par étape, options à la carte, comparateur avant/après |
| Rétrofit CarPlay | Configurateur de compatibilité par marque → modèle → système, tarif, réservation |
| Vendre sa voiture | Formulaire d'estimation en deux temps, explication du dépôt-vente |
| Véhicules à vendre | Grille de fiches avec filtres par statut (disponible, réservé, vendu) |
| Fiche véhicule | Galerie photo, caractéristiques, historique, travaux réalisés, ~40 équipements par catégorie |
| Réalisations | Galerie de chantiers, avis clients |
| Contact | Formulaire de devis, coordonnées, horaires, plan |
| Pages locales | Strasbourg, Haguenau — contenu propre à chaque ville |
| Mentions légales | Bloc juridique |

### La palette actuelle

Fond carboné très sombre, un seul accent laiton chaud.

```
ink-950  #06080B   fond de page
ink-900  #0A0D12   surfaces
ink-850  #0E1219   cartes
ink-800  #12171F   éléments
ink-700  #212833   bordures marquées
fg       #FFFFFF   titres
muted    #CBD5E1   texte courant
faint    #94A3B8   texte secondaire
accent   #D9A441   laiton — boutons, chiffres, liens actifs
  soft   #F2CE85     dégradé clair
  deep   #A87526     dégradé foncé
  on     #06080B     texte sur fond laiton
ice      #7FD8FF   accent secondaire, réservé au pôle rétrofit
```

Les bordures sont des `white/10`, les surfaces se distinguent par des écarts de
luminosité très faibles. **Le laiton est le seul point de couleur chaude.**

### La typographie actuelle

- **Sora** en display (600, 700, 800) — titres, chiffres
- **Inter** (400, 500, 600) — texte courant
- Surtitres en capitales, 11 px, interlettrage 0.16em, gris pâle
- Chiffres en `tabular-nums` partout

### Le vocabulaire de formes actuel

- Coins arrondis modérés (`rounded-lg`, 8 px)
- Cartes : bordure 1 px blanche à 10 %, fond légèrement plus clair que la page
- Filets horizontaux `h-px bg-white/10` pour séparer
- Puces carrées de 4 px en laiton
- Pastilles d'état bordées et translucides (vert disponible, ambre réservé, gris vendu)
- Une seule animation : apparition en fondu + translation de 10 px à l'entrée
  dans le viewport, décalée de 60 à 90 ms par élément

### L'élément le plus distinctif à conserver ou réinventer

Des **silhouettes de voitures dessinées en SVG** (berline, break, SUV, citadine,
coupé) servent d'illustration quand une annonce n'a pas encore de photo. Elles
sont paramétrables en couleur. C'est aujourd'hui ce qui sauve le site de la
banalité — trouve mieux, ou porte cette idée plus loin.

---

## Pourquoi ça fait « IA », et ce que je ne veux plus

Le site actuel coche presque toutes les cases du design généré. Nomme-les pour
les éviter :

- **Fond sombre + accent unique + cartes bordées** : la recette exacte de tous
  les gabarits SaaS de 2023. Rien n'y est faux, tout y est déjà vu.
- **Symétrie systématique** : trois cartes identiques, quatre chiffres alignés,
  grilles régulières partout. Aucune hiérarchie visuelle réelle.
- **Une seule animation appliquée à tout** : le même fondu ascendant sur chaque
  bloc, ce qui revient à n'avoir aucune intention.
- **Aucune texture, aucun grain, aucune matière** — alors que le métier, c'est
  la peinture, le vernis, le reflet, le grain du cuir.
- **Les icônes génériques** (jeu Lucide) posées sur chaque titre.
- **Rien qui rattache visuellement à l'automobile** en dehors des silhouettes.

Ce que je refuse explicitement :
dégradés violet/bleu, verre dépoli partout, blobs abstraits, ombres portées
molles sur tout, illustrations d'archive, avatars inventés pour les avis,
emoji en guise d'icônes, coins ultra-arrondis, mise en page centrée molle.

---

## La direction que j'attends

Trouve une **idée directrice** et tiens-la sur tout le site. Quelques pistes que
je trouverais crédibles, à toi de choisir ou de proposer autre chose :

- **La fiche d'atelier** — typographie de document technique, numérotation des
  opérations, filets, mesures annotées, cotes. La précision comme esthétique.
- **La lumière sur la carrosserie** — le métier consiste à maîtriser un reflet.
  Une DA construite sur les dégradés de laque, la spécularité, le contre-jour
  d'atelier en 5 000 K.
- **Avant / après comme principe** — la révélation, le contraste, le passage
  d'un état à l'autre, appliqué au-delà du seul comparateur.

Quelle que soit la piste :

- **Casse la symétrie.** Que la hiérarchie se voie.
- **Donne de la matière** : grain, texture de laque, trame technique, papier.
- **Ose un contraste typographique fort** — un display avec du caractère, pas
  une géométrique neutre de plus. Le texte courant peut rester sobre.
- **Trouve un élément signature** qu'on reconnaisse d'un écran à l'autre.
- **La photo est reine** : les vraies photos de voitures doivent être l'élément
  le plus fort de chaque écran, jamais un ornement.
- Tu peux changer la palette. Le laiton n'est pas sacré — c'est un choix par
  défaut, pas une identité. Le logo est une silhouette de coupé bleu/violet sur
  fond sombre, tu peux t'en éloigner ou t'en inspirer.

### Les animations

Je veux qu'elles portent du sens, pas qu'elles décorent :

- Une **entrée en scène** différenciée selon la nature du bloc — un tarif ne
  devrait pas apparaître comme une photo.
- Des **transitions d'état lisibles** : filtres du showroom, changement de photo,
  passage d'étape dans le configurateur et le formulaire d'estimation.
- Un **comparateur avant / après** dont la manipulation soit un plaisir.
- Du **détail au survol** qui récompense l'attention, sans agiter la page.
- Tout doit rester **sobre au défilement** : pas de parallaxe généralisée, pas
  de blocs qui volent de tous les côtés.

---

## Contraintes techniques non négociables

Le site tourne sur des fondations qu'une refonte ne doit pas casser. Ces points
ne sont pas des préférences :

1. **Chaque page est pré-rendue en HTML au build.** Le design ne peut donc pas
   dépendre d'une mesure faite dans le navigateur pour son premier affichage.
2. **Zéro décalage de mise en page (CLS 0,000 aujourd'hui).** Toute image ou
   tout bloc dont la taille dépend du contenu doit avoir sa place réservée.
3. **Affichage à moins d'une seconde sur mobile** (LCP mesuré à 820 ms,
   processeur divisé par quatre). Les polices sont auto-hébergées ; pas d'appel
   à Google Fonts ni à un CDN tiers, pour la vitesse comme pour le RGPD.
4. **Contraste WCAG AA vérifié** sur l'ensemble des textes.
5. **Focus visible au clavier** sur tous les éléments interactifs, cibles
   tactiles d'au moins 44 px.
6. **`prefers-reduced-motion` respecté** : toute animation doit avoir une
   version neutralisée.
7. **Les photos de véhicules ne sont jamais recadrées** — elles sont montrées
   entières, le vide étant comblé par la photo elle-même agrandie et floutée.
   Contrainte demandée par le client, à respecter dans la nouvelle DA.
8. **Français intégral**, y compris les guillemets typographiques et les
   espaces insécables.
9. Un **panneau d'administration** existe derrière `/admin` : presque tout le
   contenu est éditable, et des sections entières peuvent être masquées. Le
   design doit donc tenir avec zéro avis, zéro véhicule ou zéro photo.

---

## Ce que j'attends comme livrable

1. **L'idée directrice en trois lignes** — ce qui fonde la DA et pourquoi elle
   convient à cet atelier plutôt qu'à n'importe quel commerce.
2. **La palette et la typographie**, avec les valeurs exactes et le rôle de
   chaque couleur.
3. **Les maquettes** : accueil, prestations, fiche véhicule, configurateur
   rétrofit, contact. En version large et en version mobile.
4. **Le vocabulaire de composants** : boutons, cartes, champs, pastilles
   d'état, surtitres, filets.
5. **Les animations décrites précisément** — quoi, quand, quelle durée, quelle
   courbe, et ce qu'elles deviennent en mouvement réduit.
6. **Ce que tu as écarté et pourquoi.** C'est ce qui me dira que la direction
   est un choix et non un défaut.
