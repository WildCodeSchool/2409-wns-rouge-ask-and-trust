# Documentation Migrations TypeORM

## Configuration

`app/backend/.env` :
```env
POSTGRES_DB=DATABASE_NAME
POSTGRES_USER=DATABASE_USERNAME
POSTGRES_PASSWORD=DATABASE_PASSWORD
```

## Commandes

### Démarrer
```bash
docker compose up -d db backend
```

### Réinitialiser DB
```bash
docker compose down -v
docker compose up -d db backend
```

ou 

```bash
docker compose exec backend npx typeorm schema:drop -- -d ./src/database/config/datasource.ts
```

### Migrations Creation
```bash
# Exécuter
docker compose exec backend npm run migration:run

# Voir l'état
docker compose exec backend npm run migration:show

# Créer nouvelle migration - WARNING bien utiliser npx pour migration:generate et non npm
docker compose exec backend npx typeorm-ts-node-commonjs migration:generate src/database/migrations/NomMigration -d ./src/database/config/datasource.ts

# Annuler dernière
docker compose exec backend npm run migration:revert
```

### Vérification
```bash
# Tables créées
docker compose exec db psql -U DATABASE_USERNAME -d DATABASE_NAME -c "\dt"

# Données seed
docker compose exec db psql -U DATABASE_USERNAME -d DATABASE_NAME -c "SELECT * FROM category;"

# Migrations exécutées
docker compose exec db psql -U DATABASE_USERNAME -d DATABASE_NAME -c "SELECT * FROM migrations ORDER BY timestamp;"
```

## Ordre des migrations

- `1753601000000-InitSchema.ts` → **AVANT**
- `1753603523829-SeedDefaultCategories.ts`

Si nécessaire, renommer le fichier initial pour timestamp inférieur.

## Erreurs communes

### `password authentication failed`
```bash
docker compose down -v
docker compose up -d db backend
```

## Scripts npm

```json
{
  "migration:run": "typeorm-ts-node-commonjs migration:run -d ./src/database/config/datasource.ts",
  "migration:show": "typeorm-ts-node-commonjs migration:show -d ./src/database/config/datasource.ts",
  "migration:revert": "typeorm-ts-node-commonjs migration:revert -d ./src/database/config/datasource.ts"
}
```

## Test Production Local

```bash
# 1. Reset
docker compose down -v

# 2. Start
docker compose up -d db backend

# 3. Migrations
docker compose exec backend npm run migration:run

# 4. Verify
docker compose exec backend npm run migration:show
```

**Note :** `IS_DEV=false` → migrations manuelles, `IS_DEV=true` → synchronisation auto.

## Plan de Mise en Application des Migrations

### 1. Développement

#### Création d'une migration
```bash
# 1. Créer la migration
docker compose exec backend npx typeorm-ts-node-commonjs migration:generate src/database/migrations/NomDescriptif -d ./src/database/config/datasource.ts

# 2. Vérifier le contenu généré
# 3. Tester localement
docker compose exec backend npm run migration:run
```

#### Règles de nommage
- Format : `YYYYMMDDHHMMSS-NomDescriptif.ts`
- Exemple : `20241201143000-AddUserProfileFields.ts`
- Toujours descriptif et en anglais

### 2. Tests Obligatoires

#### Avant commit
```bash
# Test sur DB locale
docker compose down -v
docker compose up -d db backend
docker compose exec backend npm run migration:run
docker compose exec backend npm run migration:show
```

#### Tests fonctionnels
- Vérifier que les nouvelles tables/colonnes fonctionnent
- Tester les requêtes GraphQL impactées
- Valider les contraintes et index

### 3. Déploiement Staging

#### Procédure
```bash
# 1. Déployer sur staging
# 2. Exécuter migrations
docker compose -f compose.staging.yaml exec backend npm run migration:run

# 3. Vérifier
docker compose -f compose.staging.yaml exec backend npm run migration:show
```

#### Validation
- Tests automatisés passent
- Tests manuels sur les fonctionnalités impactées
- Performance acceptable

### 4. Déploiement Production

#### Préparation
```bash
# 1. Sauvegarde obligatoire
docker compose -f compose.prod.yaml exec db pg_dump -U DATABASE_USERNAME DATABASE_NAME > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Vérifier l'état actuel
docker compose -f compose.prod.yaml exec backend npm run migration:show
```

#### Exécution
```bash
# 1. Déployer le code
# 2. Exécuter migrations
docker compose -f compose.prod.yaml exec backend npm run migration:run

# 3. Vérifier
docker compose -f compose.prod.yaml exec backend npm run migration:show
```

#### Rollback
```bash
# Si problème détecté
docker compose -f compose.prod.yaml exec backend npm run migration:revert
# Restaurer la sauvegarde si nécessaire
```

### 6. Documentation

#### Changelog
- Date et heure de déploiement
- Migrations exécutées
- Impact sur les fonctionnalités
- Problèmes rencontrés et solutions

#### Communication
- Notifier l'équipe avant déploiement
- Rapport post-déploiement
- Formation des nouveaux développeurs

### 7. Sécurité

#### Bonnes pratiques
- Jamais de migrations en direct sur prod
- Toujours une sauvegarde avant migration
- Tests sur staging obligatoires
- Rollback planifié

#### Accès
- Seuls les DevOps/DBAs peuvent exécuter les migrations
- Logs de toutes les opérations
- Audit trail des changements
