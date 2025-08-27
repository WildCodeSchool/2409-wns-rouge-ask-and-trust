# Documentation Migrations TypeORM

## ⚠️ IMPORTANT - Prérequis Docker

Ce projet utilise **Docker Compose** pour PostgreSQL. Les migrations doivent être lancées depuis l'environnement Docker.

### Configuration

Le fichier `.env` contient :

```env
DB_HOST=db
DB_PORT=5432
POSTGRES_DB=YOUR_DB
POSTGRES_USER=YOUR_USER
POSTGRES_PASSWORD=YOUR_PASSWORD
```

## 🐳 Commandes Docker Migrations

### 1. Démarrer PostgreSQL

Avant toute migration, démarrer la base de données :

```bash
docker-compose up -d db
```

Ou lancer le server :

```bash
npm start
```

### 2. Exécuter les migrations

```bash
# Si vous avez un service backend dans docker-compose.yml
docker-compose exec backend npm run migration:run

# OU depuis l'host si Docker expose le port 5432
docker-compose up -d db
npm run migration:run
```

### 3. Autres commandes de migration

```bash
# Voir l'état des migrations
docker-compose exec backend npm run migration:show

# Créer une nouvelle migration
docker-compose exec backend npm run migration:create src/database/migrations/NomDeLaMigration

# Annuler la dernière migration
docker-compose exec backend npm run migration:revert
```

## 📝 Scripts npm disponibles

Dans `package.json` :

```json
{
	"scripts": {
		"migration:run": "typeorm-ts-node-commonjs migration:run -d src/database/config/datasource.ts",
		"migration:create": "typeorm-ts-node-commonjs migration:create",
		"migration:revert": "typeorm-ts-node-commonjs migration:revert -d src/database/config/datasource.ts",
		"migration:show": "typeorm-ts-node-commonjs migration:show -d src/database/config/datasource.ts"
	}
}
```

## 🗂️ Structure des fichiers

```
src/
├── database/
│   ├── config/
│   │   └── datasource.ts     # Configuration TypeORM
│   ├── entities/             # Entités TypeORM
│   │   └── *.ts
│   ├── migrations/           # Fichiers de migration
│   │   └── *.ts
│   └── results/              # Fichiers pour les filtres
│       └── *.ts
```

## 📋 Workflow type

1. **Générer la migration automatiquement**

    ```bash
    docker-compose exec backend npm run migration:generate src/database/migrations/AddUserEntity
    ```

2. **Vérifier le fichier généré**

    - Contrôler que la migration est correcte
    - Ajouter des données de seed si nécessaire

3. **Exécuter la migration**

    ```bash
    docker-compose exec backend npm run migration:run
    ```

4. **Vérifier l'état**
    ```bash
    docker-compose exec backend npm run migration:show
    ```

## ❌ Erreurs communes

### `Error: ENOTFOUND db`

- **Cause** : PostgreSQL Docker non démarré
- **Solution** : `docker-compose up -d db`

### `SASL: client password must be a string`

- **Cause** : Variables d'environnement non chargées
- **Solution** : Vérifier que `config()` est appelé dans `datasource.ts`

### `MODULE_NOT_FOUND './cli.js'`

- **Cause** : Ancienne syntaxe TypeORM
- **Solution** : Utiliser `typeorm-ts-node-commonjs` au lieu de `ts-node ./node_modules/typeorm/cli.js`

## 🔒 Sécurité

- **Toujours** ajouter `.env` au `.gitignore`
- **Jamais** committer les mots de passe
- Utiliser `synchronize: false` en production
- Tester les migrations sur une copie avant la production

--

**📌 Rappel important :** Ce projet utilise Docker, donc toujours démarrer `docker-compose up -d db` o `npm start` avant les migrations !
