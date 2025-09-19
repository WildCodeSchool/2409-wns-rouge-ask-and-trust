# Guide de Déploiement - Ask and Trust

Guide concis pour déployer l'application Ask and Trust sur différents environnements.

## 🏗️ Architecture

L'application utilise Docker Compose avec 4 services :
- **Frontend** : React + Vite (port 5173)
- **Backend** : Node.js + Express + GraphQL (port 3310)
- **Database** : PostgreSQL 15
- **Nginx** : Reverse proxy

## 🚀 Environnements

### Développement Local
```bash
# Démarrer tous les services
docker compose up -d

# Accès : http://localhost:8080
```

### Staging
```bash
# Déploiement automatique
cd server/
./fetch-and-deploy-staging.sh

# Accès : http://localhost:8001
```

### Production
```bash
# Déploiement automatique
cd server/
./fetch-and-deploy-prod.sh

# Accès : http://localhost:8000
```

## �� Images Docker

Les images sont hébergées sur Docker Hub :
- `yohangh/askandtrust-frontend:${VERSION}`
- `yohangh/askandtrust-backend:${VERSION}`

## ⚙️ Configuration

### Variables d'environnement requises
```bash
# .env
VERSION=1.0.0
GATEWAY_PORT_STAGING=8001
GATEWAY_PORT_PROD=8000

# .database.env
POSTGRES_DB=your_POSTGRES_DB
POSTGRES_USER=your_POSTGRES_USER
POSTGRES_PASSWORD=your_password
```

### Ports par environnement
- **Dev** : 8080 (nginx)
- **Staging** : 8001 (nginx), 5433 (postgres)
- **Production** : 8000 (nginx), 5432 (postgres)

## 🔄 Processus de déploiement

1. **Build des images** (CI/CD)
2. **Push vers Docker Hub**
3. **Exécution du script de déploiement**
4. **Pull des nouvelles images**
5. **Redémarrage des services**

## 🛠️ Commandes utiles

```bash
# Voir les logs
docker compose logs -f [service]

# Arrêter un environnement
docker compose -f compose.[env].yaml down

# Redémarrer un service
docker compose restart [service]

# Nettoyer les volumes
docker volume prune
```

## 📋 Prérequis

- Docker & Docker Compose
- Accès au registre Docker Hub
- Variables d'environnement configurées
- Ports disponibles selon l'environnement
