# 🚀 Ask&Trust Server Documentation

Cette documentation complète couvre la gestion du serveur Ask&Trust, les configurations actuelles, les problèmes identifiés et leurs solutions.

## 📋 Table des Matières

1. [🔍 Analyse de Configuration Actuelle](#-analyse-de-configuration-actuelle)
2. [🛠️ Stack Technologique & Commandes](#️-stack-technologique--commandes)
3. [🔧 Configuration des Services](#-configuration-des-services)
4. [🐳 Gestion des Environnements](#-gestion-des-environnements)
5. [🐛 Problèmes Identifiés & Solutions](#-problèmes-identifiés--solutions)
6. [📖 Manuel pour Novices](#-manuel-pour-novices)
7. [🚨 Résolution des Erreurs](#-résolution-des-erreurs)
8. [📊 Monitoring & Logs](#-monitoring--logs)

---

## 🔍 Analyse de Configuration Actuelle

### 📁 Arborescence Serveur

```
.
├── askandtrust-prod/           # Environnement de production
│   └── apps/
│       ├── CADDY_CMD.md
│       ├── compose.prod.yml
│       ├── fetch-and-deploy-prod.sh
│       ├── fetch-tag-dockerhub.sh
│       ├── logs/
│       │   ├── access.log
│       │   └── error.log
│       └── nginx/
│           └── nginx.conf
├── askandtrust-staging/        # Environnement de staging
│   └── apps/
│       ├── CADDY_CMD.md
│       ├── compose.staging.yml
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
092024-rouge-4.wns.wilders.dev              → localhost:8000  # Production
staging.092024-rouge-4.wns.wilders.dev      → localhost:8001  # Staging
ops.092024-rouge-4.wns.wilders.dev          → localhost:9000  # Operations
```

### 🐳 Ports Docker par Environnement

```bash
# Production (askandtrust-prod)
GATEWAY_PORT_PROD=8000

# Staging (askandtrust-staging)  
GATEWAY_PORT_STAGING=8001

# Base de données
PostgreSQL Production: 5432
PostgreSQL Staging: 5433
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
# Connexion à la base de données production
psql -h localhost -p 5432 -U ask_and_trust -d ask_and_trust

# Connexion à la base de données staging
psql -h localhost -p 5433 -U ask_and_trust -d ask_and_trust

# Vérification du statut production
pg_isready -U ask_and_trust -d ask_and_trust -h localhost -p 5432

# Vérification du statut staging
pg_isready -U ask_and_trust -d ask_and_trust -h localhost -p 5433

# Backup de la DB production
pg_dump -h localhost -p 5432 -U ask_and_trust ask_and_trust > backup_prod.sql

# Backup de la DB staging
pg_dump -h localhost -p 5433 -U ask_and_trust ask_and_trust > backup_staging.sql

# Restauration de la DB
psql -h localhost -p 5432 -U ask_and_trust ask_and_trust < backup.sql
```

### Docker & Compose
```bash
# Développement local
docker compose up -d
docker compose logs -f [service_name]
docker compose down

# Production
cd ~/askandtrust-prod/apps
./fetch-and-deploy-prod.sh

# Staging
cd ~/askandtrust-staging/apps
./fetch-and-deploy.sh

# Manuel production
docker compose -f compose.prod.yml --project-name askandtrust-prod down
docker compose -f compose.prod.yml --project-name askandtrust-prod pull
docker compose -f compose.prod.yml --project-name askandtrust-prod up -d

# Manuel staging
docker compose -f compose.staging.yml --project-name askandtrust-staging down
docker compose -f compose.staging.yml --project-name askandtrust-staging pull
docker compose -f compose.staging.yml --project-name askandtrust-staging up -d

# Monitoring conteneurs
docker ps
docker stats
docker logs [container_name]

# Voir les projets séparés
docker compose ls
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
# Vérification config nginx production
docker exec -it askandtrust-prod-nginx-1 nginx -t

# Vérification config nginx staging
docker exec -it askandtrust-staging-nginx-1 nginx -t

# Rechargement nginx production
docker exec -it askandtrust-prod-nginx-1 nginx -s reload

# Rechargement nginx staging
docker exec -it askandtrust-staging-nginx-1 nginx -s reload

# Logs nginx production
docker logs askandtrust-prod-nginx-1

# Logs nginx staging
docker logs askandtrust-staging-nginx-1
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

## 🐳 Gestion des Environnements

### 🔄 Déploiement Production
```bash
# Navigation vers l'environnement production
cd ~/askandtrust-prod/apps

# Déploiement automatique
./fetch-and-deploy-prod.sh

# Vérification des conteneurs production
docker ps --filter "name=askandtrust-prod"

# Logs production
docker compose -f compose.prod.yml --project-name askandtrust-prod logs -f
```

### 🔄 Déploiement Staging
```bash
# Navigation vers l'environnement staging
cd ~/askandtrust-staging/apps

# Déploiement automatique
./fetch-and-deploy.sh

# Vérification des conteneurs staging
docker ps --filter "name=askandtrust-staging"

# Logs staging
docker compose -f compose.staging.yml --project-name askandtrust-staging logs -f
```

### 🔍 Vérification des Environnements
```bash
# Voir tous les conteneurs avec leur projet
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"

# Voir les projets Docker Compose
docker compose ls

# Voir les réseaux par environnement
docker network ls | grep askandtrust

# Voir les volumes par environnement
docker volume ls | grep askandtrust
```

### 🛠️ Maintenance des Environnements
```bash
# Nettoyage production
docker compose -f compose.prod.yml --project-name askandtrust-prod down
docker system prune -f

# Nettoyage staging
docker compose -f compose.staging.yml --project-name askandtrust-staging down
docker system prune -f

# Redémarrage complet production
cd ~/askandtrust-prod/apps
./fetch-and-deploy-prod.sh

# Redémarrage complet staging
cd ~/askandtrust-staging/apps
./fetch-and-deploy.sh
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

#### 2. Navigation vers les Environnements
```bash
# Production
cd ~/askandtrust-prod/apps
pwd  # Vérifier que vous êtes dans le bon dossier
ls -la  # Voir les fichiers disponibles

# Staging
cd ~/askandtrust-staging/apps
pwd  # Vérifier que vous êtes dans le bon dossier
ls -la  # Voir les fichiers disponibles
```

#### 3. Vérification de l'État des Services
```bash
# Services système
sudo systemctl status caddy

# Conteneurs Docker - Production
docker ps --filter "name=askandtrust-prod"

# Conteneurs Docker - Staging
docker ps --filter "name=askandtrust-staging"

# Utilisation des ressources
free -h
df -h
```

#### 4. Déploiement Standard
```bash
# Production
cd ~/askandtrust-prod/apps
./fetch-and-deploy-prod.sh

# Staging
cd ~/askandtrust-staging/apps
./fetch-and-deploy.sh

# Vérification des logs
docker compose -f compose.prod.yml --project-name askandtrust-prod logs -f
docker compose -f compose.staging.yml --project-name askandtrust-staging logs -f
```

### 🔍 Commandes de Diagnostic

#### Vérification Réseau
```bash
# Tester la connectivité production
curl http://localhost:8000
curl http://localhost:8000/api/v1

# Tester la connectivité staging
curl http://localhost:8001
curl http://localhost:8001/api/v1

# Tester depuis l'extérieur - Production
curl https://092024-rouge-4.wns.wilders.dev
curl https://092024-rouge-4.wns.wilders.dev/api/v1

# Tester depuis l'extérieur - Staging
curl https://staging.092024-rouge-4.wns.wilders.dev
curl https://staging.092024-rouge-4.wns.wilders.dev/api/v1
```

#### Vérification Base de Données
```bash
# Status de PostgreSQL production
docker exec -it askandtrust-prod-db-1 pg_isready -U ask_and_trust

# Status de PostgreSQL staging
docker exec -it askandtrust-staging-db-1 pg_isready -U ask_and_trust

# Connexion à la DB production
docker exec -it askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust

# Connexion à la DB staging
docker exec -it askandtrust-staging-db-1 psql -U ask_and_trust -d ask_and_trust
```

#### Vérification des Logs
```bash
# Logs production
docker compose -f compose.prod.yml --project-name askandtrust-prod logs

# Logs staging
docker compose -f compose.staging.yml --project-name askandtrust-staging logs

# Logs d'un service spécifique - Production
docker compose -f compose.prod.yml --project-name askandtrust-prod logs frontend
docker compose -f compose.prod.yml --project-name askandtrust-prod logs backend
docker compose -f compose.prod.yml --project-name askandtrust-prod logs nginx

# Logs d'un service spécifique - Staging
docker compose -f compose.staging.yml --project-name askandtrust-staging logs frontend
docker compose -f compose.staging.yml --project-name askandtrust-staging logs backend
docker compose -f compose.staging.yml --project-name askandtrust-staging logs nginx

# Logs système
sudo journalctl -u caddy
tail -f ~/askandtrust-prod/apps/logs/access.log
tail -f ~/askandtrust-staging/apps/logs/access.log
```

### 📝 Checklist de Vérification

- [ ] **Services actifs**
  - [ ] Caddy: `systemctl status caddy`
  - [ ] Docker: `docker ps`
  - [ ] Base de données production: Conteneur PostgreSQL running sur port 5432
  - [ ] Base de données staging: Conteneur PostgreSQL running sur port 5433

- [ ] **Connectivité réseau**
  - [ ] Port 8000 ouvert (production): `netstat -tulpn | grep 8000`
  - [ ] Port 8001 ouvert (staging): `netstat -tulpn | grep 8001`
  - [ ] DNS production configuré: `nslookup 092024-rouge-4.wns.wilders.dev`
  - [ ] DNS staging configuré: `nslookup staging.092024-rouge-4.wns.wilders.dev`

- [ ] **Fichiers de configuration**
  - [ ] `/etc/caddy/Caddyfile` correct
  - [ ] `~/askandtrust-prod/apps/nginx/nginx.conf` correct
  - [ ] `~/askandtrust-staging/apps/nginx/nginx.conf` correct
  - [ ] `.env` avec bonnes variables dans chaque environnement

- [ ] **Ressources système**
  - [ ] RAM disponible: `free -h`
  - [ ] Espace disque: `df -h`
  - [ ] Load système: `uptime`

---

## 🚨 Résolution des Erreurs

### 502 Bad Gateway
```bash
# 1. Vérifier que le backend production est accessible
docker exec -it askandtrust-prod-backend-1 curl http://localhost:3310/graphql

# 2. Vérifier que le backend staging est accessible
docker exec -it askandtrust-staging-backend-1 curl http://localhost:3310/graphql

# 3. Vérifier la configuration nginx production
docker exec -it askandtrust-prod-nginx-1 cat /etc/nginx/nginx.conf

# 4. Vérifier la configuration nginx staging
docker exec -it askandtrust-staging-nginx-1 cat /etc/nginx/nginx.conf

# 5. Redémarrer nginx production
docker restart askandtrust-prod-nginx-1

# 6. Redémarrer nginx staging
docker restart askandtrust-staging-nginx-1
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
# 1. Vérifier la connectivité production
docker exec -it askandtrust-prod-db-1 pg_isready

# 2. Vérifier la connectivité staging
docker exec -it askandtrust-staging-db-1 pg_isready

# 3. Vérifier les variables d'environnement production
docker exec -it askandtrust-prod-backend-1 env | grep DB

# 4. Vérifier les variables d'environnement staging
docker exec -it askandtrust-staging-backend-1 env | grep DB

# 5. Redémarrer la base production
docker restart askandtrust-prod-db-1

# 6. Redémarrer la base staging
docker restart askandtrust-staging-db-1
```

---

## 📊 Monitoring & Logs

### 📈 Surveillance Continue
```bash
# Script de monitoring (utiliser vps-status.sh)
cd ~/scripts
./vps-status.sh

# Monitoring en temps réel - Production
watch -n 5 'docker ps --filter "name=askandtrust-prod" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'

# Monitoring en temps réel - Staging
watch -n 5 'docker ps --filter "name=askandtrust-staging" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'

# Monitoring des ressources
watch -n 2 'free -h && echo && df -h'
```

### 📋 Logs Centralisés

#### Structure des Logs
```
askandtrust-prod/apps/logs/
├── access.log          # Logs d'accès Nginx production
└── error.log           # Logs d'erreur Nginx production

askandtrust-staging/apps/logs/
├── access.log          # Logs d'accès Nginx staging
└── error.log           # Logs d'erreur Nginx staging

scripts/
└── vps_status_*.log    # Rapports système périodiques
```

#### Commandes de Log
```bash
# Logs en temps réel - Production
tail -f ~/askandtrust-prod/apps/logs/access.log
tail -f ~/askandtrust-prod/apps/logs/error.log

# Logs en temps réel - Staging
tail -f ~/askandtrust-staging/apps/logs/access.log
tail -f ~/askandtrust-staging/apps/logs/error.log

# Recherche dans les logs production
grep "error" ~/askandtrust-prod/apps/logs/error.log
grep "502" ~/askandtrust-prod/apps/logs/access.log

# Recherche dans les logs staging
grep "error" ~/askandtrust-staging/apps/logs/error.log
grep "502" ~/askandtrust-staging/apps/logs/access.log

# Logs Docker - Production
docker compose -f compose.prod.yml --project-name askandtrust-prod logs --tail=100

# Logs Docker - Staging
docker compose -f compose.staging.yml --project-name askandtrust-staging logs --tail=100
```

### 🔔 Alertes et Notifications

#### Configuration d'Alertes Basiques
```bash
# Script de vérification automatique production (à ajouter dans crontab)
#!/bin/bash
if ! curl -f -s http://localhost:8000 > /dev/null; then
    echo "Production service down at $(date)" >> /var/log/service-alerts.log
    # Ajouter notification email/slack ici
fi

# Script de vérification automatique staging (à ajouter dans crontab)
#!/bin/bash
if ! curl -f -s http://localhost:8001 > /dev/null; then
    echo "Staging service down at $(date)" >> /var/log/service-alerts.log
    # Ajouter notification email/slack ici
fi
```

#### Crontab pour Monitoring
```bash
# Editer crontab
crontab -e

# Ajouter vérifications automatiques
*/5 * * * * /path/to/health-check-prod.sh
*/5 * * * * /path/to/health-check-staging.sh
0 2 * * * /path/to/scripts/vps-status.sh
```

---

## 🔧 Commandes de Maintenance

### Maintenance Préventive
```bash
# Nettoyage Docker
docker system prune -a

# Mise à jour des images production
docker compose -f compose.prod.yml --project-name askandtrust-prod pull

# Mise à jour des images staging
docker compose -f compose.staging.yml --project-name askandtrust-staging pull

# Backup de la base de données production
docker exec askandtrust-prod-db-1 pg_dump -U ask_and_trust ask_and_trust > backup_prod_$(date +%Y%m%d).sql

# Backup de la base de données staging
docker exec askandtrust-staging-db-1 pg_dump -U ask_and_trust ask_and_trust > backup_staging_$(date +%Y%m%d).sql

# Rotation des logs
logrotate /etc/logrotate.d/askandtrust
```

### Mise à Jour de Version
```bash
# 1. Récupérer la dernière version - Production
cd ~/askandtrust-prod/apps
./fetch-tag-dockerhub.sh

# 2. Récupérer la dernière version - Staging
cd ~/askandtrust-staging/apps
./fetch-tag-dockerhub.sh

# 3. Vérifier la version
cat .env | grep VERSION

# 4. Déployer production
cd ~/askandtrust-prod/apps
./fetch-and-deploy-prod.sh

# 5. Déployer staging
cd ~/askandtrust-staging/apps
./fetch-and-deploy.sh

# 6. Vérifier le déploiement
curl https://092024-rouge-4.wns.wilders.dev
curl https://staging.092024-rouge-4.wns.wilders.dev
```

---

## 📞 Support et Références

### 🆘 En Cas de Problème

1. **Vérifier les logs** (voir section Monitoring)
2. **Redémarrer les services** dans l'ordre:
   ```bash
   # Production
   docker compose -f compose.prod.yml --project-name askandtrust-prod restart
   
   # Staging
   docker compose -f compose.staging.yml --project-name askandtrust-staging restart
   
   # Caddy
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

*Documentation maintenue par YohanGH - Dernière mise à jour: 17-01-2025*