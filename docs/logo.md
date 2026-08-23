# Logo

Déposez le logo Teintérior dans ce dossier sous le nom **`logo.png`**
(idéalement 256 × 256 px, fond transparent ou fond sombre comme sur l'original).

`src/components/ui/Logo.jsx` l'utilise automatiquement dès qu'il est présent, dans
le header et le pied de page. Tant que le fichier n'existe pas, un repli vectoriel
s'affiche : silhouette de coupé dans le dégradé bleu → violet de la marque.

Pour le remplacer aussi dans l'onglet du navigateur, éditez `favicon.svg`
(actuellement une version simplifiée du même dessin).
