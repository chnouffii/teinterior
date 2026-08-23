# Logo

Déposez le logo Teintérior dans ce dossier sous le nom **`logo.png`**
(idéalement 256 × 256 px, fond transparent ou fond sombre comme sur l'original).

`src/components/ui/Logo.jsx` l'utilise automatiquement dès qu'il est présent, dans
le header et le pied de page. Tant que le fichier n'existe pas, un repli vectoriel
s'affiche : silhouette de coupé dans le dégradé bleu → violet de la marque.

## Icônes dérivées

L'icône d'onglet, l'icône d'écran d'accueil iOS et celles du manifeste sont
découpées dans ce même `logo.png`. Après tout changement de logo :

```bash
npm i --no-save sharp && node build/icones.mjs
```

Le script recadre sur la zone utile du logo (`CADRE` dans `build/icones.mjs`,
mesuré sur l'image actuelle : x 41→265, y 42→266). Si votre nouveau logo a des
marges différentes, ajustez ces valeurs, sinon l'icône sera mal centrée.

En dessous de 48 px, le script applique une légère accentuation : la réduction
adoucit les contours, et sur un logo qui contient du texte fin cela fait la
différence entre un mot qu'on devine et une tache grise. À 16 px — la taille
réelle d'un favicon dans un onglet — le mot « Teintérior » reste de toute façon
illisible : c'est une limite de la taille, pas du fichier.
