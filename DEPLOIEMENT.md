# Mise en ligne sur un VPS

Le site est **statique** : on construit des fichiers HTML/CSS/JS, et nginx les sert.
Il n'y a aucun processus Node à faire tourner en permanence.

---

## 1. Avant la première mise en ligne

### La clé Web3Forms (obligatoire)

Sans elle, les formulaires de devis et d'estimation refusent l'envoi et invitent
le visiteur à téléphoner. Ils n'affichent **jamais** de fausse confirmation.

1. Créer un compte gratuit sur <https://web3forms.com> (250 envois/mois).
2. Y saisir l'adresse de réception : `contact@teinterior.fr`.
3. Copier la clé d'accès (`access key`).

### Les mentions légales

`src/data/site.js`, objet `COMPANY` : `siret`, `vat`, `rcs`, `capital` et
`insurance` sont **vides**. Ces mentions sont obligatoires (art. 6 III LCEN).
Les remplir avant d'ouvrir le site au public.

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
VITE_WEB3FORMS_KEY=votre_cle npm run build
sudo rsync -a --delete dist/ /var/www/teinterior/
```

Pas besoin de recharger nginx : il sert les fichiers du dossier, qui vient
d'être remplacé.

> `VITE_ENABLE_ADMIN` doit rester **non défini** : le panel d'administration
> est alors absent du build public. Voir la section 5.

### Pour éviter de retaper la clé

Créer `/opt/teinterior/.env` (ignoré par git) :

```bash
echo 'VITE_WEB3FORMS_KEY=votre_cle' > /opt/teinterior/.env
```

Le déploiement se réduit alors à :

```bash
cd /opt/teinterior && git pull && npm ci && npm run build \
  && sudo rsync -a --delete dist/ /var/www/teinterior/
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

---

## 5. Le panel d'administration

Il n'est **pas** inclus dans le build public, et c'est volontaire :
l'authentification est côté client, donc ses identifiants seraient lisibles
dans le JavaScript servi à tous les visiteurs. En production, `/admin` renvoie
simplement la page 404 du site.

Pour l'utiliser en local :

```bash
VITE_ENABLE_ADMIN=true npm run dev
```

Attention : les modifications faites dans le panel sont enregistrées dans le
`localStorage` **du navigateur utilisé**. Elles ne sont pas partagées avec les
visiteurs du site. Pour changer un contenu durablement, modifier les fichiers
de `src/data/`, committer, et redéployer.

---

## 6. Vérifier après déploiement

```bash
curl -I https://teinterior.fr/                # 200
curl -I https://teinterior.fr/prestations     # 200 — et non 404
curl -I https://teinterior.fr/admin           # doit servir la 404 du site
```

Si `/prestations` renvoie 404, c'est que le `try_files` de la config nginx
n'est pas actif : vérifier que le bon fichier est bien dans `sites-enabled`.

Puis, dans un navigateur : envoyer une demande depuis `/contact` et vérifier
que l'email arrive bien sur `contact@teinterior.fr`.
