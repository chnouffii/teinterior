# Mise en ligne sur un VPS

Deux morceaux à installer :

- **Le site** — des fichiers HTML/CSS/JS construits une fois et servis par nginx.
- **L'API de contenus** — un petit service Node qui stocke les contenus et les
  demandes dans un fichier JSON. C'est lui qui rend le panel d'administration
  réellement utile : sans lui, vos modifications ne sortiraient pas de votre
  navigateur.

---

## 1. Avant la première mise en ligne

### La clé Web3Forms (obligatoire)

Sans elle, les formulaires de devis et d'estimation refusent l'envoi et invitent
le visiteur à téléphoner. Ils n'affichent **jamais** de fausse confirmation.

1. Créer un compte gratuit sur <https://web3forms.com> (250 envois/mois).
2. Y saisir l'adresse de réception : `contact@teinterior.fr`.
3. Copier la clé d'accès (`access key`).

### Les mentions légales

SIRET, TVA, RCS, capital et assurance sont **vides**. Ces mentions sont
obligatoires (art. 6 III LCEN). Une fois le site en ligne, remplissez-les dans
**Admin → Informations légales** : l'écran signale lui-même ce qui manque. Tant
qu'un champ est vide, il est masqué plutôt que rempli d'une approximation.

---

## 2. Préparer le VPS (une seule fois)

En SSH sur le serveur :

```bash
# Node 20 et nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git

# Récupérer le site
sudo mkdir -p /var/www
sudo git clone -b claude/site-current-overview-ivnv0r \
  https://github.com/chnouffii/teinterior.git /opt/teinterior
sudo chown -R "$USER" /opt/teinterior

# Config nginx (adapter server_name et root dans le fichier)
sudo cp /opt/teinterior/deploy/nginx.conf /etc/nginx/sites-available/teinterior
sudo ln -sf /etc/nginx/sites-available/teinterior /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### HTTPS

Une fois le domaine pointé sur l'IP du VPS :

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d teinterior.fr -d www.teinterior.fr
```

Certbot modifie la config nginx pour ajouter le HTTPS et la redirection.

---

## 3. Déployer, et redéployer à chaque modification

C'est **la commande à retenir**. En SSH sur le VPS :

```bash
cd /opt/teinterior
git pull origin claude/site-current-overview-ivnv0r
npm ci
VITE_WEB3FORMS_KEY=votre_cle VITE_ENABLE_ADMIN=true npm run build
sudo rsync -a --delete dist/ /var/www/teinterior/
sudo systemctl restart teinterior-api
```

Pas besoin de recharger nginx : il sert les fichiers du dossier, qui vient
d'être remplacé.

> `VITE_ENABLE_ADMIN=true` inclut le panel d'administration dans le build.
> C'est désormais sans danger : l'authentification est côté serveur. Voir la
> section 5.

### Pour éviter de retaper la clé

Créer `/opt/teinterior/.env` (ignoré par git) :

```bash
sudo tee /opt/teinterior/.env >/dev/null <<'ENV'
VITE_WEB3FORMS_KEY=votre_cle
VITE_ENABLE_ADMIN=true
ENV
```

Le déploiement se réduit alors à :

```bash
cd /opt/teinterior && git pull && npm ci && npm run build \
  && sudo rsync -a --delete dist/ /var/www/teinterior/ \
  && sudo systemctl restart teinterior-api
```

### Script tout-en-un

```bash
sudo tee /usr/local/bin/deploy-teinterior >/dev/null <<'SH'
#!/usr/bin/env bash
set -euo pipefail
cd /opt/teinterior
git pull origin claude/site-current-overview-ivnv0r
npm ci
npm run build
rsync -a --delete dist/ /var/www/teinterior/
systemctl restart teinterior-api
echo "Déployé : $(date '+%d/%m/%Y %H:%M')"
SH
sudo chmod +x /usr/local/bin/deploy-teinterior
```

Ensuite, un seul mot suffit : `sudo deploy-teinterior`.

---

## 4. Variante : construire sur le Mac

Si vous préférez ne pas installer Node sur le VPS. Depuis le dossier du projet
sur le Mac :

```bash
git pull
npm ci
VITE_WEB3FORMS_KEY=votre_cle npm run build
rsync -avz --delete dist/ utilisateur@IP_DU_VPS:/var/www/teinterior/
```

Remplacer `utilisateur` et `IP_DU_VPS`. Le `/` final après `dist` est
important : il copie le *contenu* du dossier, pas le dossier lui-même.

⚠ L'API de contenus doit malgré tout tourner sur le VPS (section 5) : c'est elle
qui sert les contenus au site et reçoit les demandes. Seule la construction du
site se fait alors sur le Mac.

---

## 5. L'API de contenus et le panel d'administration

Le panel écrit dans un fichier JSON sur le serveur, et le site lit ce fichier :
une modification faite dans `/admin` est visible par tous les visiteurs dès le
rafraîchissement suivant. C'est un petit service Node, sans base de données et
sans dépendance à installer.

### Installation (une seule fois)

```bash
# Dossier de données, écrit par le service
sudo mkdir -p /var/lib/teinterior
sudo chown www-data:www-data /var/lib/teinterior

# Mot de passe administrateur : générer le condensé
cd /opt/teinterior
node server/creer-mot-de-passe.js "un mot de passe long et unique"
# → scrypt$....  (copier la ligne entière)

# Secrets du service
sudo tee /etc/teinterior.env >/dev/null <<'ENV'
TEINTERIOR_ADMIN_EMAIL=contact@teinterior.fr
TEINTERIOR_ADMIN_HASH=collez_ici_le_condense_scrypt
TEINTERIOR_SESSION_SECRET=collez_ici_une_longue_chaine_aleatoire
TEINTERIOR_DATA=/var/lib/teinterior/contenus.json
PORT=8787
ENV
sudo chmod 600 /etc/teinterior.env

# Service systemd
sudo cp deploy/teinterior-api.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now teinterior-api
sudo systemctl status teinterior-api --no-pager
```

Pour le secret de session : `openssl rand -hex 32`.

L'API n'écoute que sur `127.0.0.1` : elle n'est pas joignable depuis
l'extérieur, seul nginx lui parle, via le bloc `location /api/` de la config.

### Changer le mot de passe

```bash
cd /opt/teinterior
node server/creer-mot-de-passe.js "nouveau mot de passe"
sudo nano /etc/teinterior.env      # remplacer TEINTERIOR_ADMIN_HASH
sudo systemctl restart teinterior-api
```

Le mot de passe lui-même n'est stocké nulle part, seulement son condensé scrypt.

### Sauvegarder les contenus

Tout tient dans un fichier :

```bash
sudo tar czf ~/sauvegarde-$(date +%F).tar.gz -C /var/lib teinterior
```

L'archive contient le fichier de contenus **et** le dossier `media/` avec les
photos des véhicules. Sauvegarder l'un sans l'autre laisserait des fiches
pointant vers des images disparues.

Une sauvegarde quotidienne automatique :

```bash
sudo tee /etc/cron.daily/teinterior-backup >/dev/null <<'SH'
#!/bin/sh
mkdir -p /var/backups/teinterior
tar czf /var/backups/teinterior/teinterior-$(date +%F).tar.gz -C /var/lib teinterior
find /var/backups/teinterior -name 'teinterior-*.tar.gz' -mtime +30 -delete
SH
sudo chmod +x /etc/cron.daily/teinterior-backup
```

### Les photos des véhicules

Dans **Showroom → un véhicule → Galerie photos**, les photos se glissent
directement depuis le bureau, ou se choisissent avec le sélecteur de fichiers.
Plusieurs à la fois. L'étoile désigne celle affichée dans le showroom, les
flèches réordonnent, la corbeille supprime.

Les fichiers sont stockés **sur votre serveur**, dans
`/var/lib/teinterior/media/`, à côté du fichier de contenus. Aucun service tiers
n'intervient et rien n'est envoyé ailleurs.

Chaque photo est réduite par le navigateur avant l'envoi — 1920 px sur le grand
côté, JPEG — parce qu'une photo de téléphone pèse 5 à 8 Mo pour une image que le
site n'affichera jamais au-delà de 1600 px. L'envoi est donc rapide même en 4G
depuis l'atelier, et les pages se chargent vite pour les visiteurs.

nginx sert ce dossier directement via le bloc `location /media/`. Vérifiez qu'il
est bien présent dans votre configuration, sinon les photos ne s'afficheront pas :

```bash
grep -A2 'location /media/' /etc/nginx/sites-available/teinterior
```

Si le dossier de données n'est pas `/var/lib/teinterior`, ajustez la ligne
`alias` du bloc, ainsi que `TEINTERIOR_MEDIA` dans `/etc/teinterior.env`.

Une photo retirée d'une fiche est effacée du disque dans la foulée. En cas de
fichiers restés orphelins (suppression interrompue, import raté), le bouton
**Nettoyer les images inutilisées** du tableau de bord repasse derrière.

### Le suivi client

L'écran **Clients** garde la mémoire de chaque personne passée à l'atelier :
coordonnées, véhicules, interventions réalisées avec leur montant, et un journal
de notes daté. La date de chaque note est posée par le serveur, pas par le
navigateur : l'historique reste fiable.

Deux types d'affaires se suivent dans le temps sur chaque fiche :

- **Dépôt-vente** — les véhicules que le client confie à l'atelier. Avancement
  (à estimer, estimé, en dépôt, en vente, vendu, abandonné), prix espéré par le
  client, prix d'affichage convenu, commission, et prix de vente réel une fois
  la vente faite. Une demande « vendre ma voiture » venue du site ouvre
  directement le dépôt correspondant quand on crée la fiche depuis la demande.
- **Recherche de véhicule** — les recherches menées pour le compte du client.
  Cahier des charges, budget maximum, année et kilométrage limites, boîte et
  énergie, puis la liste des véhicules proposés avec leur prix et le lien de
  l'annonce.

La liste des clients affiche une pastille par affaire en cours, et deux filtres
permettent de ne voir que les dépôts-vente ou que les recherches en cours.

Une **relance** peut être programmée sur une fiche (date + ce qu'il y a à faire).
Les relances arrivées à échéance s'affichent en haut de l'écran Clients.

Depuis une demande entrante (écran **Demandes**), le bloc « Fiche client » permet
de créer une fiche pré-remplie ou de rattacher la demande à une fiche existante.
Les fiches partageant le même téléphone, email ou nom sont proposées d'abord :
un même client qui redemande un devis six mois plus tard ne crée pas de doublon.

Supprimer une fiche efface ses notes et son historique, mais conserve les
demandes entrantes rattachées, qui perdent simplement leur lien.

⚠ **Ces fiches contiennent des données personnelles.** Elles ne sont accessibles
qu'après connexion et ne sont jamais servies au site public. Elles vivent dans le
même fichier que les contenus, donc dans la même sauvegarde. Pensez à supprimer
les fiches dont vous n'avez plus l'usage.

### Ce que le panel permet de modifier

| Écran | Contenus |
| --- | --- |
| Clients | Fiches de suivi : coordonnées, véhicules, interventions, dépôts-vente, recherches, notes, relances |
| Page d'accueil | Accroche, les quatre chiffres, les trois métiers et leurs arguments |
| Prestations | Formules, opérations, produits, options à la carte, forfaits rétrofit |
| Avant / après | Cas du comparateur, légendes, chiffres, adresses de vraies photos |
| Rétrofit CarPlay | Chiffres, déroulé de l'intervention, fonctions d'origine conservées |
| Vendre sa voiture | Étapes du dépôt-vente, chiffres du sourcing |
| Showroom | Véhicules : caractéristiques, prix, marge, statut, carrosserie, photos |
| Réalisations et avis | Galerie, filtres, témoignages, note affichée |
| Atelier et coordonnées | Présentation, adresse, deux téléphones, horaires, réseaux |
| Informations légales | SIRET, TVA, RCS, assurance, marque, menu de navigation |

Les modifications sont enregistrées automatiquement : un témoin en haut à droite
indique « Enregistrement… » puis « Publié ».

### Journal et diagnostic

```bash
sudo journalctl -u teinterior-api -f      # journal en direct
curl -s localhost:8787/api/content | head # l'API répond-elle ?
```

Si le panel affiche « Serveur injoignable », le service est arrêté ou le bloc
`location /api/` manque dans la config nginx.

## 6. Vérifier après déploiement

```bash
curl -I https://teinterior.fr/                    # 200
curl -I https://teinterior.fr/prestations         # 200 — et non 404
curl -s  https://teinterior.fr/api/content | head # les contenus doivent sortir
curl -I  https://teinterior.fr/admin/connexion    # 200
```

Si `/prestations` renvoie 404, c'est que le `try_files` de la config nginx
n'est pas actif : vérifier que le bon fichier est bien dans `sites-enabled`.

Puis, dans un navigateur :

1. Envoyer une demande depuis `/contact`, vérifier qu'elle apparaît dans
   **Admin → Demandes** et que l'email arrive sur `contact@teinterior.fr`.
2. Se connecter à `/admin`, modifier un chiffre de la page d'accueil, et
   recharger le site dans une fenêtre de navigation privée : la modification
   doit y être visible. C'est le test qui prouve que la publication fonctionne.
