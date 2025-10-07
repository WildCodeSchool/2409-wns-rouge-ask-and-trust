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
# Déploiement Staging
cd server/
./fetch-and-deploy-staging.sh

# Accès : http://localhost:8001
```

### Production
```bash
# Déploiement Production
cd server/
./fetch-and-deploy-prod.sh

# Accès : http://localhost:8000
```

## Images Docker

Les images sont hébergées sur Docker Hub :
- `yohangh/askandtrust-frontend:${VERSION}`
- `yohangh/askandtrust-backend:${VERSION}`

## ⚙️ Configuration

### Variables d'environnement requises
```bash
# .env
# Application Configuration
APP_PORT=YOUR_PORT
APP_PORT_FRONTEND=YOUR_PORT_FRONTEND
VITE_PORT=5173
NODE_ENV=development
IS_DEV=DEV_MODE_TRUE_OR_FALSE

# Database
DB_HOST=db
DB_PORT=5432
POSTGRES_DB=YOUR_DB
POSTGRES_USER=YOUR_USER
POSTGRES_PASSWORD=YOUR_PASSWORD

# JWT
JWT_SECRET=YOUR_SECRET_KEY

# Cookie
COOKIE_SECRET=YOUR_SECRET_KEY

# AdminUser
ADMIN_EMAIL=ADMIN_EMAIL
ADMIN_PASSWORD=ADMIN_PASSWORD
ADMIN_FIRSTNAME=ADMIN_FIRSTNAME
ADMIN_LASTNAME=ADMIN_LASTNAME
ADMIN_ROLE=ADMIN_ROLE

# Stripe test
STRIPE_SECRET_KEY=MY_STRIPE_SECRET_KEY
STRIPE_API_VERSION=MY_STRIPE_API_VERSION

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

## 📋 Prérequis

- Docker & Docker Compose
- Accès au registre Docker Hub
- Variables d'environnement configurées
- Ports disponibles selon l'environnement
