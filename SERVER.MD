# 🚀 Ask&Trust Server Documentation

Cette documentation complète couvre la gestion du serveur Ask&Trust, les configurations actuelles, les problèmes identifiés et leurs solutions.

## 📋 Table des Matières

1. [🔍 Analyse de Configuration Actuelle](#-analyse-de-configuration-actuelle)
2. [🛠️ Stack Technologique & Commandes](#️-stack-technologique--commandes)
3. [🔧 Configuration des Services](#-configuration-des-services)
4. [🐛 Problèmes Identifiés & Solutions](#-problèmes-identifiés--solutions)
5. [📖 Manuel pour Novices](#-manuel-pour-novices)
6. [🚨 Résolution des Erreurs](#-résolution-des-erreurs)
7. [📊 Monitoring & Logs](#-monitoring--logs)

---

## 🔍 Analyse de Configuration Actuelle

### 📁 Arborescence Serveur

```
.
├── askandtrust/
│   └── apps/
│       ├── CADDY_CMD.md
│       ├── compose.prod.yml
│       ├── database.env
│       ├── fetch-and-deploy.sh
│       ├── fetch-tag-dockerhub.sh
│       ├── logs/
│       │   ├── access.log
│       │   └── error.log
│       └── nginx/
│           └── nginx.conf
├── cheatsheet/
│   └── keysmap.md
└── scripts/
    ├── custom_welcome_message.sh
    └── vps-status.sh
```

### 🌐 Configuration DNS/Caddy Actuelle

```bash
# Domaines configurés dans /etc/caddy/Caddyfile
092024-rouge-4.wns.wilders.dev              → localhost:8000
staging.092024-rouge-4.wns.wilders.dev      → localhost:8001  ✅ Fonctionne
ops.092024-rouge-4.wns.wilders.dev          → localhost:9000
```

### 🐳 Ports Docker

```bash
# Port défini dans fetch-and-deploy.sh
GATEWAY_PORT=8001  # Used by staging environment
```

---

## 🛠️ Stack Technologique & Commandes

### Frontend (React + Vite)
```bash
# Navigation vers le frontend
cd /path/to/project/app/frontend

# Installation des dépendances
npm install

# Développement local
npm run dev

# Build production
npm run build

# Tests
npm run test

# Linting
npm run lint
```

### Backend (Node.js + GraphQL)
```bash
# Navigation vers le backend
cd /path/to/project/app/backend

# Installation des dépendances
npm install

# Développement avec hot reload
npm start

# Build TypeScript
npm run build

# Tests
npm test

# Création d'un admin
npm run create-admin
```

### Database (PostgreSQL)
```bash
# Connexion à la base de données
psql -h localhost -p 5432 -U ask_and_trust -d ask_and_trust

# Vérification du statut
pg_isready -U ask_and_trust -d ask_and_trust -h localhost

# Backup de la DB
pg_dump -h localhost -p 5432 -U ask_and_trust ask_and_trust > backup.sql

# Restauration de la DB
psql -h localhost -p 5432 -U ask_and_trust ask_and_trust < backup.sql
```

### Docker & Compose
```bash
# Développement local
docker compose up -d
docker compose logs -f [service_name]
docker compose down

# Production (staging)
cd /path/to/askandtrust/apps
./fetch-and-deploy.sh

# Manuel production
docker compose -f compose.prod.yml down
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d

# Monitoring conteneurs
docker ps
docker stats
docker logs [container_name]
```

---

## 🔧 Configuration des Services

### Caddy (Reverse Proxy)
```bash
# Vérification du statut
systemctl status caddy

# Restart Caddy
sudo systemctl restart caddy

# Rechargement config
sudo caddy reload --config /etc/caddy/Caddyfile

# Logs Caddy
sudo journalctl -u caddy -f

# Test configuration
sudo caddy validate --config /etc/caddy/Caddyfile
```

### Nginx (Dans Docker)
```bash
# Vérification config nginx dans le conteneur
docker exec -it [nginx_container] nginx -t

# Rechargement nginx
docker exec -it [nginx_container] nginx -s reload

# Logs nginx
docker logs [nginx_container]
```

### Monitoring Système
```bash
# Utilisation des ressources
htop
free -h
df -h

# Processus réseau
netstat -tulpn
ss -tulpn

# Logs système
journalctl -f
tail -f /var/log/syslog
```

---

## 📖 Manuel pour Novices

### 🚀 Démarrage Rapide

#### 1. Connexion au Serveur
```bash
# Connexion SSH (remplacer par vos identifiants)
ssh user@092024-rouge-4.wns.wilders.dev

# Vérification de la bienvenue Ask&Trust
# (doit s'afficher automatiquement)
```

#### 2. Navigation vers le Projet
```bash
cd ~/askandtrust/apps
pwd  # Vérifier que vous êtes dans le bon dossier
ls -la  # Voir les fichiers disponibles
```

#### 3. Vérification de l'État des Services
```bash
# Services système
sudo systemctl status caddy

# Conteneurs Docker
docker ps

# Utilisation des ressources
free -h
df -h
```

#### 4. Déploiement Standard
```bash
# Mise à jour et déploiement automatique
./fetch-and-deploy.sh

# Vérification des logs
docker compose -f compose.prod.yml logs -f
```

### 🔍 Commandes de Diagnostic

#### Vérification Réseau
```bash
# Tester la connectivité locale
curl http://localhost:8001
curl http://localhost:8001/api/v1

# Tester depuis l'extérieur
curl https://staging.092024-rouge-4.wns.wilders.dev
curl https://staging.092024-rouge-4.wns.wilders.dev/api/v1
```

#### Vérification Base de Données
```bash
# Status de PostgreSQL dans Docker
docker exec -it [db_container] pg_isready -U ask_and_trust

# Connexion à la DB
docker exec -it [db_container] psql -U ask_and_trust -d ask_and_trust
```

#### Vérification des Logs
```bash
# Logs de tous les services
docker compose -f compose.prod.yml logs

# Logs d'un service spécifique
docker compose -f compose.prod.yml logs frontend
docker compose -f compose.prod.yml logs backend
docker compose -f compose.prod.yml logs nginx

# Logs système
sudo journalctl -u caddy
tail -f logs/access.log
tail -f logs/error.log
```

### 📝 Checklist de Vérification

- [ ] **Services actifs**
  - [ ] Caddy: `systemctl status caddy`
  - [ ] Docker: `docker ps`
  - [ ] Base de données: Conteneur PostgreSQL running

- [ ] **Connectivité réseau**
  - [ ] Port 8001 ouvert: `netstat -tulpn | grep 8001`
  - [ ] DNS configuré: `nslookup staging.092024-rouge-4.wns.wilders.dev`

- [ ] **Fichiers de configuration**
  - [ ] `/etc/caddy/Caddyfile` correct
  - [ ] `nginx/nginx.conf` correct
  - [ ] `.env` avec bonnes variables

- [ ] **Ressources système**
  - [ ] RAM disponible: `free -h`
  - [ ] Espace disque: `df -h`
  - [ ] Load système: `uptime`

---

## 🚨 Résolution des Erreurs

### 502 Bad Gateway
```bash
# 1. Vérifier que le backend est accessible
docker exec -it [backend_container] curl http://localhost:3310/graphql

# 2. Vérifier la configuration nginx
docker exec -it [nginx_container] cat /etc/nginx/nginx.conf

# 3. Redémarrer nginx
docker restart [nginx_container]
```

### Service Unavailable
```bash
# 1. Vérifier Caddy
sudo systemctl status caddy
sudo systemctl restart caddy

# 2. Vérifier les ports
netstat -tulpn | grep -E "(8000|8001|9000)"

# 3. Vérifier les logs
sudo journalctl -u caddy -n 50
```

### Problèmes de Base de Données
```bash
# 1. Vérifier la connectivité
docker exec -it [db_container] pg_isready

# 2. Vérifier les variables d'environnement
docker exec -it [backend_container] env | grep DB

# 3. Redémarrer la base
docker restart [db_container]
```

---

## 📊 Monitoring & Logs

### 📈 Surveillance Continue
```bash
# Script de monitoring (utiliser vps-status.sh)
cd ~/scripts
./vps-status.sh

# Monitoring en temps réel
watch -n 5 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'

# Monitoring des ressources
watch -n 2 'free -h && echo && df -h'
```

### 📋 Logs Centralisés

#### Structure des Logs
```
logs/
├── access.log          # Logs d'accès Nginx
├── error.log           # Logs d'erreur Nginx
└── vps_status_*.log    # Rapports système périodiques
```

#### Commandes de Log
```bash
# Logs en temps réel
tail -f logs/access.log
tail -f logs/error.log

# Recherche dans les logs
grep "error" logs/error.log
grep "502" logs/access.log

# Logs Docker
docker compose -f compose.prod.yml logs --tail=100
```

### 🔔 Alertes et Notifications

#### Configuration d'Alertes Basiques
```bash
# Script de vérification automatique (à ajouter dans crontab)
#!/bin/bash
if ! curl -f -s http://localhost:8001 > /dev/null; then
    echo "Service down at $(date)" >> /var/log/service-alerts.log
    # Ajouter notification email/slack ici
fi
```

#### Crontab pour Monitoring
```bash
# Editer crontab
crontab -e

# Ajouter vérifications automatiques
*/5 * * * * /path/to/health-check.sh
0 2 * * * /path/to/scripts/vps-status.sh
```

---

## 🔧 Commandes de Maintenance

### Maintenance Préventive
```bash
# Nettoyage Docker
docker system prune -a

# Mise à jour des images
docker compose -f compose.prod.yml pull

# Backup de la base de données
docker exec [db_container] pg_dump -U ask_and_trust ask_and_trust > backup_$(date +%Y%m%d).sql

# Rotation des logs
logrotate /etc/logrotate.d/askandtrust
```

### Mise à Jour de Version
```bash
# 1. Récupérer la dernière version
./fetch-tag-dockerhub.sh

# 2. Vérifier la version
cat .env | grep VERSION

# 3. Déployer
./fetch-and-deploy.sh

# 4. Vérifier le déploiement
curl https://staging.092024-rouge-4.wns.wilders.dev
```

---

## 📞 Support et Références

### 🆘 En Cas de Problème

1. **Vérifier les logs** (voir section Monitoring)
2. **Redémarrer les services** dans l'ordre:
   ```bash
   docker compose -f compose.prod.yml restart
   sudo systemctl restart caddy
   ```
3. **Vérifier la configuration** (voir Checklist)
4. **Contacter l'équipe de développement**

### 📚 Références Utiles

- **Documentation Docker Compose**: https://docs.docker.com/compose/
- **Documentation Caddy**: https://caddyserver.com/docs/
- **Documentation Nginx**: https://nginx.org/en/docs/
- **Documentation PostgreSQL**: https://www.postgresql.org/docs/

---

*Documentation maintenue par YohanGH - Dernière mise à jour: $(date)*

## 🔧 Corrections Appliquées

### ✅ Corrections Automatiques Effectuées

#### 1. **Fix compose.prod.yaml - Variable GATEWAY_PORT**
```diff
- - ${{GATEAWAY_PORT}}:80
+ - ${GATEWAY_PORT}:80
```

#### 2. **Fix nginx.conf - Routage API GraphQL**
```diff
location /api/v1 {
-   proxy_pass http://backend:3310;
+   proxy_pass http://backend:3310/graphql;
+   proxy_set_header Host $host;
+   proxy_set_header X-Real-IP $remote_addr;
+   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
+   proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 🔧 Correction Manuelle Requise - Configuration Caddy

**Problème**: Le domaine principal ne fonctionne pas car il pointe vers un port inexistant.

**Configuration actuelle** (`/etc/caddy/Caddyfile`):
```caddyfile
092024-rouge-4.wns.wilders.dev {
    reverse_proxy localhost:8000  # ❌ Port 8000 n'existe pas
}
```

**Solutions proposées**:

**Option A** - Pointer vers staging (recommandé pour tests):
```caddyfile
092024-rouge-4.wns.wilders.dev {
    reverse_proxy localhost:8001
}
```

**Option B** - Créer un environnement de production séparé:
```caddyfile
092024-rouge-4.wns.wilders.dev {
    reverse_proxy localhost:8000
}
```
*Note: Nécessite de créer un nouveau déploiement sur le port 8000*

**Commandes pour appliquer la correction**:
```bash
# Éditer le Caddyfile
sudo nano /etc/caddy/Caddyfile

# Valider la configuration
sudo caddy validate --config /etc/caddy/Caddyfile

# Recharger Caddy
sudo caddy reload --config /etc/caddy/Caddyfile

# Vérifier le statut
systemctl status caddy
```

## 🎯 Récapitulatif et Prochaines Étapes

### ✅ Corrections Automatiques Appliquées
1. **compose.prod.yaml**: Typo GATEAWAY_PORT → GATEWAY_PORT corrigée
2. **nginx.conf**: Routage API corrigé vers `/graphql` avec headers appropriés

### 🔧 Actions Manuelles Requises

#### 1. **Correction Caddy (CRITIQUE)**
```bash
# Se connecter au serveur
ssh user@092024-rouge-4.wns.wilders.dev

# Éditer Caddyfile 
sudo nano /etc/caddy/Caddyfile

# Changer:
# 092024-rouge-4.wns.wilders.dev {
#     reverse_proxy localhost:8000
# }

# Vers:
# 092024-rouge-4.wns.wilders.dev {
#     reverse_proxy localhost:8001
# }

# Recharger Caddy
sudo caddy reload --config /etc/caddy/Caddyfile
```

#### 2. **Redéploiement avec Corrections**
```bash
# Aller dans le dossier de déploiement
cd ~/askandtrust/apps

# Redéployer avec les nouvelles configurations
./fetch-and-deploy.sh

# Vérifier les logs
docker compose -f compose.prod.yml logs -f
```

### 🧪 Tests de Validation

#### Tests à effectuer après corrections:
```bash
# 1. Test domaine principal
curl https://092024-rouge-4.wns.wilders.dev
# Attendu: Page d'accueil Ask&Trust

# 2. Test staging (doit toujours fonctionner)
curl https://staging.092024-rouge-4.wns.wilders.dev
# Attendu: Page d'accueil Ask&Trust

# 3. Test API GraphQL
curl -X POST https://staging.092024-rouge-4.wns.wilders.dev/api/v1 \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { queryType { name } } }"}'
# Attendu: Réponse GraphQL (plus d'erreur 502)

# 4. Test depuis le serveur
curl http://localhost:8001
curl http://localhost:8001/api/v1
```

### 📊 Statut des Problèmes

### 🚀 Après Validation

#### Si tout fonctionne:
```bash
# Commit des changements dans le repo
git add nginx/nginx.conf compose.prod.yaml SERVER.MD
git commit -m "fix: correct nginx API routing and compose.prod typo

- Fix nginx proxy_pass to point to /graphql endpoint
- Add proper proxy headers for nginx
- Correct GATEAWAY_PORT typo in compose.prod.yaml
- Add comprehensive server documentation"

git push origin develop
```

#### Surveillance Continue:
```bash
# Monitoring
watch -n 30 'curl -s -o /dev/null -w "%{http_code}" https://staging.092024-rouge-4.wns.wilders.dev'

# Logs
tail -f ~/askandtrust/apps/logs/access.log
docker compose -f ~/askandtrust/apps/compose.prod.yml logs -f
```

