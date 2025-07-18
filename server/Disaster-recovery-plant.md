# 🚨 Ask&Trust - Plan de Reprise Après Incident (DRP)

**Document de Classification :** CONFIDENTIEL  
**Version :** 2.0  
**Dernière mise à jour :** 2025-01-17  
**Prochaine révision :** 2025-07-17  
**Responsable :** Équipe DevOps Ask&Trust

---

## 📋 Table des Matières

1. [🎯 Objectifs et Portée du Plan](#-objectifs-et-portée-du-plan)
2. [👥 Personnel et Contacts d'Urgence](#-personnel-et-contacts-durgence)
3. [🏗️ Profil d'Application et Infrastructure](#️-profil-dapplication-et-infrastructure)
4. [📊 Inventaire des Ressources Critiques](#-inventaire-des-ressources-critiques)
5. [⚡ Classification des Incidents](#-classification-des-incidents)
6. [🔄 Procédures de Sauvegarde](#-procédures-de-sauvegarde)
7. [🚨 Procédures de Reprise Après Incident](#-procédures-de-reprise-après-incident)
8. [🏠 Plan de Reprise Site Principal](#-plan-de-reprise-site-principal)
9. [🔥 Plan de Reprise Site de Secours (Hot Site)](#-plan-de-reprise-site-de-secours-hot-site)
10. [🔧 Restauration Complète du Système](#-restauration-complète-du-système)
11. [🏗️ Processus de Reconstruction](#️-processus-de-reconstruction)
12. [✅ Tests et Validation du Plan DRP](#-tests-et-validation-du-plan-drp)
13. [📝 Gestion des Modifications](#-gestion-des-modifications)
14. [📞 Annexes et Références](#-annexes-et-références)

---

## 🎯 Objectifs et Portée du Plan

### 🎯 Objectifs Majeurs

| **Objectif**                | **Description**                                   | **Délai Cible (RTO)** |
| --------------------------- | ------------------------------------------------- | --------------------- |
| **Continuité de Service**   | Maintenir les services Ask&Trust disponibles 24/7 | < 4 heures            |
| **Protection des Données**  | Aucune perte de données utilisateur (RPO)         | < 1 heure             |
| **Restauration Production** | Rétablir l'environnement de production complet    | < 8 heures            |
| **Communication**           | Informer toutes les parties prenantes             | < 30 minutes          |
| **Conformité Légale**       | Respecter GDPR et obligations réglementaires      | Immédiat              |

### 📊 Métriques de Performance

```
RTO (Recovery Time Objective) : 4 heures maximum
RPO (Recovery Point Objective) : 1 heure maximum
MTTR (Mean Time To Recovery) : 2 heures cible
Disponibilité Cible : 99.9% (8h46m d'indisponibilité/an)
```

### 🌐 Périmètre d'Application

**Services Couverts :**

- Application Ask&Trust (Production & Staging)
- Base de données PostgreSQL
- Infrastructure Docker/Nginx/Caddy
- Domaines : `092024-rouge-4.wns.wilders.dev`
- Données utilisateur et sondages

**Exclusions :**

- Environnements de développement local
- Services tiers (DockerHub, DNS externe)
- Infrastructure réseau WNS

---

## 👥 Personnel et Contacts d'Urgence

### 🚨 Équipe d'Intervention d'Urgence

| **Rôle**            | **Nom**     | **Téléphone**     | **Email**                | **Responsabilités**                        |
| ------------------- | ----------- | ----------------- | ------------------------ | ------------------------------------------ |
| **Responsable DRP** | [À DÉFINIR] | +33 X XX XX XX XX | drp-lead@askandtrust.dev | Coordination générale, décisions critiques |
| **Admin Système**   | [À DÉFINIR] | +33 X XX XX XX XX | sysadmin@askandtrust.dev | Infrastructure, serveurs, réseau           |
| **DBA**             | [À DÉFINIR] | +33 X XX XX XX XX | dba@askandtrust.dev      | Bases de données, sauvegardes              |
| **Dev Lead**        | [À DÉFINIR] | +33 X XX XX XX XX | dev-lead@askandtrust.dev | Applications, code, déploiements           |
| **Communication**   | [À DÉFINIR] | +33 X XX XX XX XX | comms@askandtrust.dev    | Communication externe, utilisateurs        |

### 📞 Contacts de Support

| **Service**       | **Contact**                | **Disponibilité** | **SLA** |
| ----------------- | -------------------------- | ----------------- | ------- |
| **WNS Hosting**   | support@wildcodeschool.com | 24/7              | 4h      |
| **DockerHub**     | support@docker.com         | 24/7              | 8h      |
| **Caddy Support** | Forum communautaire        | Business hours    | 24h     |

### 🔄 Escalade des Incidents

```
Niveau 1: Détection automatique → Astreinte technique (15 min)
Niveau 2: Échec récupération → Responsable DRP (30 min)
Niveau 3: Incident majeur → Direction + Communication (1h)
Niveau 4: Sinistre majeur → Toutes parties prenantes (2h)
```

---

## 🏗️ Profil d'Application et Infrastructure

### 🏛️ Architecture Ask&Trust

```mermaid
graph TB
    subgraph "Infrastructure Prod"
        Internet[Internet] --> Caddy[Caddy Proxy]
        Caddy --> |:8000| NginxProd[Nginx Production]
        NginxProd --> FrontProd[Frontend React]
        NginxProd --> BackProd[Backend GraphQL]
        BackProd --> DBProd[(PostgreSQL:5432)]
    end

    subgraph "Infrastructure Staging"
        Caddy --> |:8001| NginxStag[Nginx Staging]
        NginxStag --> FrontStag[Frontend Staging]
        NginxStag --> BackStag[Backend Staging]
        BackStag --> DBStag[(PostgreSQL:5433)]
    end
```

### 📊 Stack Technologique

| **Composant**        | **Technologie**   | **Version** | **Criticité** | **Dépendances** |
| -------------------- | ----------------- | ----------- | ------------- | --------------- |
| **Frontend**         | React + Vite      | 18.x        | CRITIQUE      | Nginx, Backend  |
| **Backend**          | Node.js + GraphQL | 20.x        | CRITIQUE      | PostgreSQL      |
| **Base de Données**  | PostgreSQL        | 15.x        | CRITIQUE      | Docker, Volume  |
| **Reverse Proxy**    | Nginx + Caddy     | Latest      | CRITIQUE      | Réseau          |
| **Conteneurisation** | Docker Compose    | Latest      | CRITIQUE      | Docker Engine   |
| **Orchestration**    | Docker Swarm      | N/A         | MOYEN         | -               |

### 🌐 Configuration Réseau

```bash
# Domains and Ports
Production:     092024-rouge-4.wns.wilders.dev → :8000
Staging:        staging.092024-rouge-4.wns.wilders.dev → :8001
Operations:     ops.092024-rouge-4.wns.wilders.dev → :9000

# Internal Services
PostgreSQL Prod:    localhost:5432
PostgreSQL Staging: localhost:5433
Backend Prod:       container:3310
Backend Staging:    container:3310
```

---

## 📊 Inventaire des Ressources Critiques

### 💾 Serveurs et Infrastructure

| **Ressource**         | **Spécifications** | **Localisation**  | **Rôle**            | **Criticité** |
| --------------------- | ------------------ | ----------------- | ------------------- | ------------- |
| **Serveur Principal** | [SPECS À DÉFINIR]  | WNS Datacenter    | Production/Staging  | CRITIQUE      |
| **Docker Engine**     | Latest             | Serveur Principal | Conteneurisation    | CRITIQUE      |
| **Volumes Docker**    | SSD Local          | /var/lib/docker   | Persistance données | CRITIQUE      |

### 📁 Données et Volumes

```bash
# Critical Docker Volumes
askandtrust-prod_db-data     → Production Database (CRITICAL)
askandtrust-staging_db-data  → Staging Database (IMPORTANT)
askandtrust-prod_logs        → Production Logs (IMPORTANT)
askandtrust-staging_logs     → Staging Logs (NORMAL)

# Backup Locations
~/backups/db/               → Local backups
/external/backup/           → External backups (TO CONFIGURE)
```

### 🔑 Certificats et Secrets

| **Secret**          | **Localisation**           | **Durée Validité** | **Propriétaire** |
| ------------------- | -------------------------- | ------------------ | ---------------- |
| **Certificats SSL** | Caddy Auto (Let's Encrypt) | 90 jours           | Caddy            |
| **DB Passwords**    | .env files                 | Permanent          | Admin Système    |
| **JWT Secrets**     | .env files                 | Permanent          | Dev Lead         |
| **API Keys**        | .env files                 | Variable           | Dev Lead         |

---

## ⚡ Classification des Incidents

### 🚨 Niveaux de Sévérité

| **Niveau**           | **Description**         | **Impact** | **Délai Response** | **Exemples**                |
| -------------------- | ----------------------- | ---------- | ------------------ | --------------------------- |
| **🔴 P1 - CRITIQUE** | Service indisponible    | Total      | 15 minutes         | Serveur down, DB corrompue  |
| **🟠 P2 - MAJEUR**   | Fonctionnalité dégradée | Partiel    | 1 heure            | API lente, erreurs 50x      |
| **🟡 P3 - MINEUR**   | Problème non-bloquant   | Minimal    | 4 heures           | Logs remplis, monitoring    |
| **🟢 P4 - INFO**     | Maintenance préventive  | Aucun      | 24 heures          | Mises à jour, optimisations |

### 🔍 Détection des Incidents

```bash
# Automatic Monitoring
# 1. HTTP Health Checks
curl -f https://092024-rouge-4.wns.wilders.dev/health

# 2. Database Monitoring
docker exec askandtrust-prod-db-1 pg_isready

# 3. Container Monitoring
docker ps --filter "name=askandtrust-prod" --format "table {{.Names}}\t{{.Status}}"

# 4. Resource Monitoring
free -h && df -h

# 5. Error Logs
tail -f ~/askandtrust-prod/apps/logs/error.log | grep -i error
```

### 📊 Matrice de Décision

```
Incident detected → Auto-recovery (5 min) → Success ? → END
                                        → Failure → Escalation Level 1
                                                → Manual repair (30 min)
                                                → Success ? → END
                                                → Failure → Escalation Level 2
                                                        → DRP activation
```

---

## 🔄 Procédures de Sauvegarde

### 📅 Planning de Sauvegarde

| **Fréquence**     | **Contenu**      | **Rétention** | **Localisation** | **Responsable** |
| ----------------- | ---------------- | ------------- | ---------------- | --------------- |
| **Toutes les 6h** | DB Production    | 7 jours       | Local + Externe  | Automatique     |
| **Quotidien**     | DB + Configs     | 30 jours      | Local + Externe  | Automatique     |
| **Hebdomadaire**  | Système complet  | 3 mois        | Externe          | Manuel          |
| **Mensuel**       | Archive complète | 1 an          | Externe sécurisé | Manuel          |

### 🛠️ Scripts de Sauvegarde

#### Sauvegarde Base de Données Production

```bash
#!/bin/bash
# backup-prod-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/backup/db"
FILENAME="askandtrust_prod_${DATE}.sql"

# Create directory
mkdir -p ${BACKUP_DIR}

# Backup
docker exec askandtrust-prod-db-1 pg_dump \
  -U ask_and_trust \
  -d ask_and_trust \
  --no-password \
  --clean \
  --if-exists > ${BACKUP_DIR}/${FILENAME}

# Compression
gzip ${BACKUP_DIR}/${FILENAME}

# Verification
if [ $? -eq 0 ]; then
    echo "✅ Backup successful: ${FILENAME}.gz"
    # Delete backups older than 7 days
    find ${BACKUP_DIR} -name "askandtrust_prod_*.sql.gz" -mtime +7 -delete
else
    echo "❌ Backup failed" >&2
    exit 1
fi
```

#### Sauvegarde Configuration Complète

```bash
#!/bin/bash
# backup-config.sh

set -e  # Stop script on error (fail fast)

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/backup/config"         # Safe and portable path
ARCHIVE="askandtrust_config_${DATE}.tar.gz"

mkdir -p "$BACKUP_DIR"

# Files/folders to backup
INCLUDES=()
[[ -d "$HOME/askandtrust-prod/apps" ]]     && INCLUDES+=("$HOME/askandtrust-prod/apps")
[[ -d "$HOME/askandtrust-staging/apps" ]]  && INCLUDES+=("$HOME/askandtrust-staging/apps")
[[ -f "/etc/caddy/Caddyfile" ]]            && INCLUDES+=("/etc/caddy/Caddyfile")
[[ -d "$HOME/.docker" ]]                   && INCLUDES+=("$HOME/.docker")

if [ "${#INCLUDES[@]}" -eq 0 ]; then
    echo "❌ No files/folders found to backup."
    exit 1
fi

tar -czf "$BACKUP_DIR/$ARCHIVE" "${INCLUDES[@]}" \
    --warning=no-file-changed \
    --ignore-failed-read

if [ $? -eq 0 ]; then
    echo "✅ Configuration backed up: $BACKUP_DIR/$ARCHIVE"
else
    echo "❌ Error during backup."
fi

```

### 🔄 Automatisation des Sauvegardes

```bash
# Crontab configuration
# crontab -e

# DB backup every 6 hours
0 */6 * * * /home/scripts/backup-prod-db.sh >> /var/log/backup.log 2>&1

# Config backup daily at 2am
0 2 * * * /home/scripts/backup-config.sh >> /var/log/backup.log 2>&1

# Clean old logs
0 1 * * 0 find /var/log -name "*.log" -mtime +30 -delete
```

### 🧪 Test de Restauration

```bash
#!/bin/bash
# test-restore.sh - Monthly restoration test

set -e

echo "🧪 DRP restoration test - $(date)"

# 1. Create test environment
docker run -d --rm --name test-db -p 5434:5432 \
  -e POSTGRES_DB=ask_and_trust \
  -e POSTGRES_USER=ask_and_trust \
  -e POSTGRES_PASSWORD=test_password \
  postgres:15

# 2. Find latest backup
LATEST_BACKUP=$(ls -t /home/backup/db/askandtrust_prod_*.sql.gz 2>/dev/null | head -1)
if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ No backup file found in /home/backup/db/" >&2
    docker stop test-db
    exit 1
fi

echo "Latest backup detected: $LATEST_BACKUP"

# 3. Wait for PostgreSQL to be ready (max 30s)
for i in {1..30}; do
    if docker exec test-db pg_isready -U ask_and_trust > /dev/null 2>&1; then
        break
    fi
    sleep 1
    if [ $i -eq 30 ]; then
        echo "❌ PostgreSQL not responding in container after 30s" >&2
        docker stop test-db
        exit 2
    fi
done

# 4. Restoration
set +e  # Temporarily disable exit-on-error to capture restoration
gunzip -c "${LATEST_BACKUP}" | docker exec -i test-db psql -U ask_and_trust -d ask_and_trust
RESTORE_EXIT_CODE=$?
set -e

if [ $RESTORE_EXIT_CODE -ne 0 ]; then
    echo "❌ SQL restoration failed" >&2
    docker stop test-db
    exit 3
fi

# 5. Verification
TABLES_COUNT=$(docker exec test-db psql -U ask_and_trust -d ask_and_trust -t -c \
    "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d '[:space:]')

if [[ "$TABLES_COUNT" =~ ^[0-9]+$ ]] && [ "$TABLES_COUNT" -gt 0 ]; then
    echo "✅ Restoration test successful: $TABLES_COUNT tables restored"
else
    echo "❌ Restoration test failed – no tables restored or SQL error" >&2
fi

# 6. Cleanup
docker stop test-db > /dev/null

echo "Test completed - $(date)"

```

---

## 🚨 Procédures de Reprise Après Incident

### 🚀 Procédure d'Urgence - Redémarrage Rapide

```bash
#!/bin/bash
# emergency-restart.sh - P1 Procedure

echo "🚨 EMERGENCY PROCEDURE ACTIVATED - $(date)"

# 1. Check current status
echo "📊 Service status..."
systemctl status caddy
docker ps --filter "name=askandtrust-prod"

# 2. Clean service shutdown
echo "🛑 Stopping services..."
cd ~/askandtrust-prod/apps
docker compose -f compose.prod.yml --project-name askandtrust-prod down

# 3. Volume verification
echo "💾 Data verification..."
docker volume ls | grep askandtrust-prod

# 4. Complete restart
echo "🚀 Production restart..."
docker compose -f compose.prod.yml --project-name askandtrust-prod up -d

# 5. Validation tests
echo "✅ Validation tests..."
sleep 30
curl -f http://localhost:8000 || echo "❌ Frontend unavailable"
docker exec askandtrust-prod-db-1 pg_isready || echo "❌ Database unavailable"

# 6. Restart Caddy if needed
sudo systemctl restart caddy

echo "🏁 Emergency procedure completed - $(date)"
```

### 🔧 Procédure de Diagnostic Avancé

```bash
#!/bin/bash
# advanced-diagnostics.sh

echo "🔍 ADVANCED DIAGNOSTICS - $(date)"

# 1. System status
echo "=== SYSTEM ==="
free -h
df -h
uptime

# 2. Network status
echo "=== NETWORK ==="
netstat -tulpn | grep -E "(8000|8001|5432|5433)"
curl -I https://092024-rouge-4.wns.wilders.dev

# 3. Docker status
echo "=== DOCKER ==="
docker system df
docker stats --no-stream
docker compose -f ~/askandtrust-prod/apps/compose.prod.yml ps

# 4. Database status
echo "=== DATABASE ==="
docker exec askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust -c "SELECT count(*) FROM users;"
docker exec askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust -c "SELECT count(*) FROM surveys;"

# 5. Recent logs
echo "=== RECENT LOGS ==="
tail -20 ~/askandtrust-prod/apps/logs/error.log
docker logs askandtrust-prod-backend-1 --tail 20

echo "🏁 Diagnostics completed - $(date)"
```

### 📋 Checklist de Reprise

**✅ Phase 1 - Évaluation (0-15 min)**

- [ ] Identification de la cause racine
- [ ] Évaluation de l'impact
- [ ] Classification du niveau d'incident
- [ ] Notification de l'équipe d'astreinte

**✅ Phase 2 - Containment (15-30 min)**

- [ ] Isolation des systèmes affectés
- [ ] Activation du mode maintenance si nécessaire
- [ ] Sauvegarde d'urgence si possible
- [ ] Communication aux utilisateurs

**✅ Phase 3 - Éradication (30-120 min)**

- [ ] Correction de la cause racine
- [ ] Vérification de l'intégrité des données
- [ ] Tests en environnement staging
- [ ] Préparation de la restauration

**✅ Phase 4 - Récupération (Variable)**

- [ ] Restauration du service de production
- [ ] Validation fonctionnelle complète
- [ ] Monitoring renforcé
- [ ] Communication de la résolution

**✅ Phase 5 - Post-incident (24h-1 semaine)**

- [ ] Post-mortem détaillé
- [ ] Plan d'amélioration
- [ ] Mise à jour de la documentation
- [ ] Test des procédures de reprise

---

## 🏠 Plan de Reprise Site Principal

### 🔧 Scénario 1: Panne de Service Applicatif

```bash
# Symptoms: 502 Bad Gateway, API non responsive
# RTO: 30 minutes | RPO: 5 minutes

echo "🔧 Application service recovery"

# 1. Quick diagnostics
docker logs askandtrust-prod-backend-1 --tail 50
docker logs askandtrust-prod-frontend-1 --tail 50

# 2. Selective restart
docker restart askandtrust-prod-backend-1
docker restart askandtrust-prod-frontend-1
docker restart askandtrust-prod-nginx-1

# 3. Validation
curl -f http://localhost:8000/api/graphql
curl -f http://localhost:8000
```

### 💾 Scénario 2: Corruption de Base de Données

```bash
# Symptoms: DB errors, corruption detected
# RTO: 2 hours | RPO: 6 hours max

echo "💾 Database recovery"

# 1. Immediate backend shutdown
docker stop askandtrust-prod-backend-1

# 2. Backup current state
docker exec askandtrust-prod-db-1 pg_dump -U ask_and_trust ask_and_trust > /tmp/corrupted_db_$(date +%Y%m%d_%H%M%S).sql

# 3. Restore from latest valid backup
LATEST_BACKUP=$(ls -t /home/backup/db/askandtrust_prod_*.sql.gz | head -1)
docker exec -i askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
gunzip -c ${LATEST_BACKUP} | docker exec -i askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust

# 4. Backend restart
docker start askandtrust-prod-backend-1

# 5. Validation tests
docker exec askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust -c "SELECT count(*) FROM users;"
```

### 🌐 Scénario 3: Panne Réseau/DNS

```bash
# Symptoms: Site inaccessible, DNS timeout
# RTO: 1 hour | RPO: 0

echo "🌐 Network/DNS recovery"

# 1. Connectivity tests
ping -c 3 8.8.8.8
nslookup 092024-rouge-4.wns.wilders.dev

# 2. Caddy verification
sudo systemctl status caddy
sudo caddy validate --config /etc/caddy/Caddyfile

# 3. Caddy restart
sudo systemctl restart caddy

# 4. Local tests
curl -f http://localhost:8000
curl -f https://092024-rouge-4.wns.wilders.dev
```

---

## 🔥 Plan de Reprise Site de Secours (Hot Site)

### 🏗️ Architecture de Secours

**🎯 Objectif :** Site de secours opérationnel en < 4 heures

```bash
# Hot Site configuration (TO IMPLEMENT)
# Backup server: backup.askandtrust.dev

# 1. Data synchronization
rsync -avz --delete ~/askandtrust-prod/ backup-server:~/askandtrust-prod/
rsync -avz --delete /home/backup/ backup-server:/home/backup/

# 2. Deployment on backup site
ssh backup-server "cd ~/askandtrust-prod/apps && ./fetch-and-deploy-prod.sh"

# 3. DNS failover (TO CONFIGURE)
# Update DNS A record: 092024-rouge-4.wns.wilders.dev → backup-server-ip
```

### 📋 Procédure de Bascule Hot Site

```bash
#!/bin/bash
# failover-to-hot-site.sh

echo "🔥 BACKUP SITE ACTIVATION - $(date)"

# 1. Immediate notification
echo "🚨 PRIMARY SITE DOWN - FAILOVER IN PROGRESS"

# 2. Final backup if possible
timeout 300 /home/scripts/backup-prod-db.sh || echo "⚠️ Final backup failed"

# 3. Synchronization to backup site
rsync -avz --timeout=60 ~/askandtrust-prod/ backup-server:~/askandtrust-prod/
rsync -avz --timeout=60 /home/backup/ backup-server:/home/backup/

# 4. Backup site activation
ssh backup-server "cd ~/askandtrust-prod/apps && ./emergency-restart.sh"

# 5. Validation tests
curl -f http://backup-server:8000 || echo "❌ Backup site unavailable"

# 6. DNS failover (MANUAL for now)
echo "⚠️ MANUAL: Switch DNS to backup site"
echo "A record: 092024-rouge-4.wns.wilders.dev → backup-server-ip"

echo "🏁 Failover completed - $(date)"
```

### 🔄 Procédure de Retour (Failback)

```bash
#!/bin/bash
# failback-to-primary.sh

echo "🔄 RETURN TO PRIMARY SITE - $(date)"

# 1. Primary site validation
curl -f http://primary-server:8000 || exit 1

# 2. Recent data synchronization
ssh backup-server "/home/scripts/backup-prod-db.sh"
rsync -avz backup-server:/home/backup/ /home/backup/

# 3. Restore recent data on primary site
LATEST_BACKUP=$(ssh backup-server "ls -t /home/backup/db/askandtrust_prod_*.sql.gz | head -1")
scp backup-server:${LATEST_BACKUP} /tmp/
gunzip -c /tmp/$(basename ${LATEST_BACKUP}) | docker exec -i askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust

# 4. Validation tests
docker exec askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust -c "SELECT count(*) FROM users;"

# 5. DNS failback (MANUAL)
echo "⚠️ MANUAL: Switch DNS back to primary site"
echo "A record: 092024-rouge-4.wns.wilders.dev → primary-server-ip"

echo "🏁 Return completed - $(date)"
```

---

## 🔧 Restauration Complète du Système

### 🏗️ Reconstruction à Zéro

```bash
#!/bin/bash
# full-system-restore.sh
# Usage in case of total loss of primary server

echo "🏗️ COMPLETE SYSTEM RESTORATION - $(date)"

# PREREQUISITES: New server with Docker installed

# 1. Structure restoration
mkdir -p ~/askandtrust-prod/apps
mkdir -p ~/askandtrust-staging/apps
mkdir -p /home/backup/db
mkdir -p /home/backup/config

# 2. Configuration recovery
# From external backup or backup site
rsync -avz backup-source:/home/backup/config/ /home/backup/config/
tar -xzf /home/backup/config/askandtrust_config_latest.tar.gz -C ~/

# 3. System dependencies installation
sudo apt update
sudo apt install -y curl postgresql-client

# 4. Caddy configuration
sudo cp /home/backup/config/Caddyfile /etc/caddy/
sudo systemctl enable caddy
sudo systemctl start caddy

# 5. Application deployment
cd ~/askandtrust-prod/apps
./fetch-and-deploy-prod.sh

cd ~/askandtrust-staging/apps
./fetch-and-deploy.sh

# 6. Data restoration
LATEST_DB_BACKUP=$(ls -t /home/backup/db/askandtrust_prod_*.sql.gz | head -1)
gunzip -c ${LATEST_DB_BACKUP} | docker exec -i askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust

# 7. Complete tests
./advanced-diagnostics.sh

echo "🏁 Complete restoration finished - $(date)"
```

### 📊 Checklist Restauration Complète

**✅ Phase 1 - Préparation (0-30 min)**

- [ ] Nouveau serveur provisionné
- [ ] Docker installé et configuré
- [ ] Accès réseau vérifié
- [ ] Sauvegardes récupérées

**✅ Phase 2 - Infrastructure (30-90 min)**

- [ ] Caddy installé et configuré
- [ ] DNS temporaire configuré
- [ ] Certificats SSL obtenus
- [ ] Firewall configuré

**✅ Phase 3 - Applications (90-180 min)**

- [ ] Conteneurs déployés
- [ ] Configuration vérifiée
- [ ] Bases de données restaurées
- [ ] Tests fonctionnels OK

**✅ Phase 4 - Validation (180-240 min)**

- [ ] Tests d'intégration complets
- [ ] Performance vérifiée
- [ ] Monitoring activé
- [ ] Utilisateurs notifiés

---

## 🏗️ Processus de Reconstruction

### 📊 Évaluation des Dommages

```bash
#!/bin/bash
# damage-assessment.sh

echo "📊 DAMAGE ASSESSMENT - $(date)"

# 1. Infrastructure assessment
echo "=== INFRASTRUCTURE ==="
systemctl list-units --failed
docker system df
df -h

# 2. Data assessment
echo "=== DATA ==="
docker exec askandtrust-prod-db-1 psql -U ask_and_trust -d ask_and_trust -c "\dt" 2>/dev/null || echo "❌ DB inaccessible"
ls -la ~/askandtrust-prod/apps/
ls -la /home/backup/db/

# 3. Configuration assessment
echo "=== CONFIGURATION ==="
sudo caddy validate --config /etc/caddy/Caddyfile 2>/dev/null || echo "❌ Caddy config invalid"
docker compose -f ~/askandtrust-prod/apps/compose.prod.yml config 2>/dev/null || echo "❌ Compose config invalid"

# 4. Network assessment
echo "=== NETWORK ==="
curl -f https://092024-rouge-4.wns.wilders.dev 2>/dev/null || echo "❌ Site inaccessible"
nslookup 092024-rouge-4.wns.wilders.dev

# 5. Final report
echo "=== REPORT ==="
echo "Timestamp: $(date)"
echo "Affected services: [TO COMPLETE MANUALLY]"
echo "Lost data: [TO COMPLETE MANUALLY]"
echo "Estimated downtime: [TO COMPLETE MANUALLY]"

echo "🏁 Assessment completed - $(date)"
```

### 🎯 Plan de Reconstruction Progressive

**🔵 Phase 1 - Stabilization (0-2h)**

```bash
# Objective: Minimal functional service
1. Critical services restart
2. Restore latest stable DB backup
3. Maintenance page if needed
4. User communication
```

**🟡 Phase 2 - Restoration (2-8h)**

```bash
# Objective: Complete service restored
1. Root cause correction
2. Complete data restoration
3. Full functional tests
4. Enhanced monitoring
```

**🟢 Phase 3 - Optimization (8-24h)**

```bash
# Objective: Performance and stability
1. Performance optimization
2. Security reinforcement
3. Monitoring improvement
4. Documentation update
```

---

## ✅ Tests et Validation du Plan DRP

### 📅 Planning des Tests

| **Type de Test**      | **Fréquence** | **Responsable**    | **Durée** | **Objectif**        |
| --------------------- | ------------- | ------------------ | --------- | ------------------- |
| **Test Sauvegarde**   | Hebdomadaire  | Admin Système      | 30 min    | Vérifier intégrité  |
| **Test Restauration** | Mensuel       | Équipe DRP         | 2 heures  | Vérifier procédures |
| **Simulation Panne**  | Trimestriel   | Équipe complète    | 4 heures  | Test complet        |
| **Test Hot Site**     | Semestriel    | Équipe + Direction | 1 jour    | Validation failover |

### 🧪 Test de Restauration Mensuel

```bash
#!/bin/bash
# monthly-drp-test.sh

echo "🧪 MONTHLY DRP TEST - $(date)"

# 1. Create test environment
docker network create drp-test-network
docker run -d --name drp-test-db --network drp-test-network \
  -e POSTGRES_DB=ask_and_trust \
  -e POSTGRES_USER=ask_and_trust \
  -e POSTGRES_PASSWORD=test_password \
  postgres:15

# 2. Restoration test
LATEST_BACKUP=$(ls -t /home/backup/db/askandtrust_prod_*.sql.gz | head -1)
echo "Using backup: ${LATEST_BACKUP}"

gunzip -c ${LATEST_BACKUP} | docker exec -i drp-test-db psql -U ask_and_trust -d ask_and_trust

# 3. Data validation
USERS_COUNT=$(docker exec drp-test-db psql -U ask_and_trust -d ask_and_trust -t -c "SELECT count(*) FROM users")
SURVEYS_COUNT=$(docker exec drp-test-db psql -U ask_and_trust -d ask_and_trust -t -c "SELECT count(*) FROM surveys")

echo "✅ Users restored: ${USERS_COUNT}"
echo "✅ Surveys restored: ${SURVEYS_COUNT}"

# 4. Performance test
START_TIME=$(date +%s)
docker exec drp-test-db psql -U ask_and_trust -d ask_and_trust -c "SELECT * FROM users LIMIT 100" > /dev/null
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "✅ Query performance: ${DURATION}s"

# 5. Cleanup
docker stop drp-test-db && docker rm drp-test-db
docker network rm drp-test-network

# 6. Report
cat << EOF > /home/reports/drp_test_$(date +%Y%m%d).md
# DRP Test - $(date)

## Results
- ✅ DB Restoration: OK
- ✅ Data: ${USERS_COUNT} users, ${SURVEYS_COUNT} surveys
- ✅ Performance: ${DURATION}s
- ✅ Procedures: OK

## Actions
- Next revision: $(date -d "+1 month" +%Y-%m-%d)
EOF

echo "🏁 DRP test completed - $(date)"
```

### 🔥 Simulation de Sinistre Trimestrielle

```bash
#!/bin/bash
# quarterly-disaster-simulation.sh

echo "🔥 QUARTERLY DISASTER SIMULATION - $(date)"

# WARNING: Test in staging environment only

# 1. Simulated staging shutdown
cd ~/askandtrust-staging/apps
docker compose -f compose.staging.yml --project-name askandtrust-staging down

# 2. Simulated "corruption" (rename)
docker volume ls | grep askandtrust-staging-db-data
mv /var/lib/docker/volumes/askandtrust-staging_db-data /var/lib/docker/volumes/askandtrust-staging_db-data.corrupted

# 3. Activate DRP procedures
./emergency-restart.sh

# 4. Recovery time measurement
START_TIME=$(date +%s)

# Restoration from backup
LATEST_BACKUP=$(ls -t /home/backup/db/askandtrust_staging_*.sql.gz | head -1)
gunzip -c ${LATEST_BACKUP} | docker exec -i askandtrust-staging-db-1 psql -U ask_and_trust -d ask_and_trust

# Validation test
curl -f http://localhost:8001 || echo "❌ Staging not functional"

END_TIME=$(date +%s)
RECOVERY_TIME=$((END_TIME - START_TIME))

echo "⏱️ Recovery time: ${RECOVERY_TIME}s (Target: < 14400s)"

# 5. Restore normal state
docker compose -f compose.staging.yml --project-name askandtrust-staging down
mv /var/lib/docker/volumes/askandtrust-staging_db-data.corrupted /var/lib/docker/volumes/askandtrust-staging_db-data
docker compose -f compose.staging.yml --project-name askandtrust-staging up -d

echo "🏁 Simulation completed - $(date)"
```

---

## 📝 Gestion des Modifications

### 📋 Processus de Mise à Jour du Plan

| **Déclencheur**           | **Responsable** | **Délai**  | **Approbation** |
| ------------------------- | --------------- | ---------- | --------------- |
| Changement infrastructure | Admin Système   | 48h        | Responsable DRP |
| Nouveau service           | Dev Lead        | 1 semaine  | Équipe DRP      |
| Incident majeur           | Équipe DRP      | 2 semaines | Direction       |
| Révision planifiée        | Responsable DRP | 1 mois     | Direction       |

### 📊 Journal des Modifications

```markdown
## 📅 Historique des Versions

### Version 2.0 - 2025-01-17

- **Ajout**: Procédures Hot Site
- **Amélioration**: Scripts d'automatisation
- **Correction**: Temps de récupération DB
- **Responsable**: YohanGH

### Version 1.5 - 2024-12-15

- **Ajout**: Tests automatisés
- **Amélioration**: Documentation procédures
- **Responsable**: Équipe DevOps

### Version 1.0 - 2024-10-01

- **Création**: Plan DRP initial
- **Responsable**: Équipe DevOps
```

### 🔄 Processus de Révision

```bash
#!/bin/bash
# drp-review-reminder.sh

# Script to run monthly via cron

LAST_UPDATE=$(stat -c %y "server/Disaster-recovery-plant.MD" | cut -d' ' -f1)
CURRENT_DATE=$(date +%Y-%m-%d)
DAYS_SINCE=$(( ($(date -d "$CURRENT_DATE" +%s) - $(date -d "$LAST_UPDATE" +%s)) / 86400 ))

if [ $DAYS_SINCE -gt 90 ]; then
    echo "⚠️ ALERT: DRP plan not updated for ${DAYS_SINCE} days"
    echo "Action required: DRP plan revision"
    # Send notification to team
fi
```

---

## 📞 Annexes et Références

### 🔗 Liens Utiles

- **Monitoring Uptime**: [À CONFIGURER]
- **Status Page**: [À CONFIGURER]
- **Documentation Technique**: https://github.com/askandtrust/docs
- **Runbooks**: `/home/scripts/runbooks/`

### 📊 Métriques de Performance

```bash
# Metrics to monitor
- Uptime: 99.9% minimum
- Response Time: < 2s average
- Database Response: < 500ms
- CPU Usage: < 80% average
- Memory Usage: < 85% average
- Disk Usage: < 90% maximum
```

### 📋 Templates d'Incident

#### Communication Incident Majeur

```
🚨 INCIDENT MAJEUR - Ask&Trust

Statut: [EN COURS/RÉSOLU]
Impact: [SERVICE COMPLET/PARTIEL/DÉGRADÉ]
Début: [TIMESTAMP]
Résolution estimée: [TIMESTAMP]

Description:
[DESCRIPTION DE L'INCIDENT]

Actions en cours:
- [ACTION 1]
- [ACTION 2]

Prochaine mise à jour: [TIMESTAMP]

Contact: drp-lead@askandtrust.dev
```

### 🔧 Scripts d'Urgence

**Location**: `/home/scripts/emergency/`

```bash
emergency-restart.sh        → Complete restart
advanced-diagnostics.sh     → Detailed diagnostics
backup-emergency.sh         → Emergency backup
failover-to-hot-site.sh    → Backup site failover
damage-assessment.sh        → Damage assessment
```

---

## 📈 Indicateurs de Performance DRP

### 🎯 KPI de Reprise

| **Indicateur**    | **Objectif** | **Actuel**  | **Tendance** |
| ----------------- | ------------ | ----------- | ------------ |
| **RTO Moyen**     | < 4h         | [À MESURER] | [À SUIVRE]   |
| **RPO Moyen**     | < 1h         | [À MESURER] | [À SUIVRE]   |
| **MTTR**          | < 2h         | [À MESURER] | [À SUIVRE]   |
| **Disponibilité** | 99.9%        | [À MESURER] | [À SUIVRE]   |
| **Tests DRP**     | 100% succès  | [À MESURER] | [À SUIVRE]   |

### 📊 Rapport Mensuel DRP

```bash
#!/bin/bash
# monthly-drp-report.sh

cat << EOF > /home/reports/drp_monthly_$(date +%Y%m).md
# Monthly DRP Report - $(date +%B %Y)

## Monthly Incidents
- Total count: [TO COMPLETE]
- P1 (Critical): [TO COMPLETE]
- P2 (Major): [TO COMPLETE]
- Average resolution time: [TO COMPLETE]

## Tests and Validations
- Backup tests: [OK/NOK]
- Restoration test: [OK/NOK]
- Documentation update: [OK/NOK]

## Improvement Actions
- [ACTION 1]
- [ACTION 2]

## Upcoming Deadlines
- Next quarterly test: $(date -d "+1 month" +%Y-%m-%d)
- Annual revision: $(date -d "+6 months" +%Y-%m-%d)

EOF
```

---

**🔒 FIN DU DOCUMENT - CONFIDENTIEL**

_Ce plan de reprise après incident est un document confidentiel de Ask&Trust. Sa diffusion est strictement limitée aux personnes autorisées. Toute reproduction ou divulgation non autorisée est interdite._

**Prochaine révision obligatoire : 2025-07-17**

---

_Maintenu par l'équipe DevOps Ask&Trust - Version 2.0_
