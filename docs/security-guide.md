# 🛡️ Guide de Sécurité Web - Ask&Trust

**Guide pratique de sécurité pour développeurs - Basé sur OWASP et les bonnes pratiques**

Ce document présente une approche pratique de la sécurité web, adaptée aux développeurs, en s'appuyant sur les standards OWASP (Open Web Application Security Project) et les recommandations de l'ANSSI.

---

## 📚 **1. Introduction à la Sécurité Web**

### **Qu'est-ce que la sécurité web ?**
La sécurité web consiste à protéger les applications contre les attaques malveillantes et à garantir la confidentialité, l'intégrité et la disponibilité des données.

### **Les 3 piliers de la sécurité (CIA)**
- **Confidentialité** : Seules les personnes autorisées peuvent accéder aux données
- **Intégrité** : Les données ne peuvent pas être modifiées sans autorisation
- **Disponibilité** : Les services restent accessibles aux utilisateurs légitimes

### **Pourquoi la sécurité est importante ?**
- Protection des données personnelles (RGPD)
- Réputation de l'entreprise
- Continuité des services
- Conformité réglementaire

---

## 🎯 **2. Les 10 Vulnérabilités OWASP les Plus Critiques (OWASP Top 10)**

### **📊 Aperçu des Vulnérabilités OWASP Top 10 2021**

| Rang | Vulnérabilité | Impact | Fréquence |
|------|---------------|--------|-----------|
| **A01** | **Contrôles d'accès défaillants** | 🔴 Critique | 3,81% des applications |
| **A02** | **Défaillances cryptographiques** | 🔴 Critique | Exposition données sensibles |
| **A03** | **Injection** | 🔴 Critique | 94% des applications testées |
| **A04** | **Conception non sécurisée** | 🟡 Élevé | Nouvelle catégorie 2021 |
| **A05** | **Mauvaise configuration de sécurité** | 🟡 Élevé | 90% des applications testées |
| **A06** | **Composants vulnérables et obsolètes** | 🟡 Élevé | 2ème dans l'enquête communautaire |
| **A07** | **Identification et authentification défaillantes** | 🟡 Élevé | Frameworks standardisés aident |
| **A08** | **Manque d'intégrité des données** | 🟡 Élevé | Nouvelle catégorie 2021 |
| **A09** | **Carence des systèmes de contrôle** | 🟡 Élevé | Impact visibilité et alertes |
| **A10** | **Falsification de requête côté serveur** | 🟡 Élevé | 1ère dans l'enquête communautaire |

---

## 🔧 **3. Mesures de Sécurité Implémentées dans Ask&Trust**

### **✅ Protection des Données**

#### **Requêtes Paramétrées**
```typescript
// Protection contre l'injection SQL
const query = "SELECT * FROM surveys WHERE title ILIKE :search"
const result = await connection.query(query, { 
    search: `%${searchTerm}%` 
})
```

#### **Hachage Sécurisé des Mots de Passe**
```typescript
// Utilisation d'Argon2 (algorithme moderne)
const hashedPassword = await argon2.hash(password)
```

### **🛠️ Patrons de Sécurité Implémentés**

#### **1. Authenticator Pattern**
**Objectif** : Centraliser l'authentification dans un service dédié.

```typescript
// JWT avec Cookies Sécurisés
cookies.set("token", token, {
    httpOnly: true,                    // Protection XSS
    secure: process.env.NODE_ENV === "production", // HTTPS en production
    sameSite: "strict",                // Protection CSRF
    signed: true,                      // Cookies signés
})
```

**Avantages** :
- ✅ Authentification centralisée dans `auth-service.ts`
- ✅ Vérification des rôles centralisée dans `auth-checker.ts`
- ✅ Réutilisable dans tous les resolvers

#### **2. Authorization Enforcer Pattern**
**Objectif** : Vérifier les permissions métier et techniques.

```typescript
// Contrôle d'Accès Basé sur les Rôles (RBAC)
@Authorized(Roles.Admin)
@Query(() => [User])
async getUsers(): Promise<User[]> {
    // Seuls les admins peuvent accéder
}
```

**Avantages** :
- ✅ Séparation des préoccupations (rôles vs permissions métier)
- ✅ Vérification granulaire des accès
- ✅ Réutilisabilité des règles d'autorisation

#### **3. Input Validator Pattern**
**Objectif** : Valider toutes les entrées utilisateur.

```typescript
// Validation des Mots de Passe
@IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
})
password!: string

// Validation des Emails
@IsEmail({}, { message: "The email must be valid." })
email!: string
```

**Avantages** :
- ✅ Validation automatique avec `class-validator`
- ✅ Décorateurs de validation sur tous les inputs
- ✅ Messages d'erreur personnalisés
- ✅ Validation des types, longueurs, formats
- ✅ Gestion centralisée des erreurs de validation

---

## ❌ **4. Mesures de Sécurité Manquantes (À Implémenter)**

### **🔴 Priorité Haute - Critiques**

#### **1. Rate Limiting (Limitation du Taux de Requêtes)**
**Problème** : Protection contre les attaques par déni de service.

**Solution** :
add rate limiting in the middleware
```

#### **2. Headers de Sécurité (Helmet.js)**
**Problème** : Protection contre les attaques courantes.

**Solution** :
```typescript
add 
```

#### **3. Configuration CORS**
**Problème** : Contrôle des origines autorisées.

**Solution** :
```typescript
add 
```

### **🟡 Priorité Moyenne**

#### **4. Logs de Sécurité**
```typescript
// Logger les tentatives d'accès non autorisées
```

#### **5. Timeout des Requêtes**
```typescript
// Limiter le temps d'exécution des requêtes
const timeout = setTimeout(() => {
  throw new Error('Request timeout')
}, 30000) // 30 secondes
```

### **🟢 Priorité Basse**

#### **6. Authentification à Deux Facteurs (2FA)**
#### **7. Audit Trail (Traçabilité)**
#### **8. Chiffrement des Données Sensibles**

---

## 🔄 **5. Résilience Informatique**

### **Définition**
La résilience informatique est la capacité d'un système à continuer de fonctionner même en cas de :
- Panne matérielle
- Surcharge d'activité
- Attaque informatique
- Incident technique

### **Mesures de Résilience**

#### **1. Gestion des Erreurs**
**✅ PARTIELLEMENT IMPLÉMENTÉ dans Ask&Trust** :

```typescript
// ✅ DÉJÀ IMPLÉMENTÉ - Classe AppError personnalisée
export class AppError extends Error implements IAppError {
  statusCode: number
  errorType?: string
  additionalInfo?: string
  isOperational: boolean
}

// ✅ DÉJÀ IMPLÉMENTÉ - Utilisation dans les resolvers
try {
  const surveys = await Survey.find()
  return surveys
} catch (error) {
  throw new AppError("Failed to fetch surveys", 500, "DatabaseError")
}

// ❌ MANQUANT - Logging structuré
// logger.error('Operation failed', { error: error.message })
```

#### **2. Circuit Breaker Pattern**
**❌ NON IMPLÉMENTÉ dans Ask&Trust** :

```typescript
// ❌ MANQUANT - Protection contre les services défaillants
class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private readonly threshold = 5
  private readonly timeout = 60000 // 1 minute

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open')
    }
    
    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }
}
```

**Recommandation** : Implémenter pour protéger les appels vers Stripe, base de données, etc.

#### **3. Retry Pattern**
**❌ NON IMPLÉMENTÉ dans Ask&Trust** :

```typescript
// ❌ MANQUANT - Gestion des pannes temporaires
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}
```

**Recommandation** : Implémenter pour les appels vers des services externes (Stripe, email, etc.).

---

## 🔧 **6. Sécurité des Technologies Préexistantes**

### **📦 Node.js et TypeScript**

**Node.js** protège contre :
- **Injection de code** : Sandboxing et isolation des processus
- **Déni de service** : Gestion asynchrone des requêtes
- **Fuites mémoire** : Garbage collector automatique

**TypeScript** protège contre :
- **Erreurs de type** : Vérification statique à la compilation
- **Références nulles** : Détection des accès non sécurisés
- **Bugs de logique** : Validation des interfaces et contrats

### **⚛️ React et Vite**

**React** protège contre :
- **XSS** : Échappement automatique des chaînes
- **Injection DOM** : Virtual DOM et réconciliation sécurisée
- **État corrompu** : Immutabilité et flux de données unidirectionnel

**Vite** protège contre :
- **Code malveillant** : Bundling sécurisé et tree-shaking
- **Fuites d'informations** : Minification et obfuscation
- **Vulnérabilités de build** : Isolation des dépendances

### **🗄️ PostgreSQL et TypeORM**

**PostgreSQL** protège contre :
- **Injection SQL** : Requêtes préparées et paramètres
- **Accès non autorisé** : Système de permissions granulaire
- **Corruption de données** : ACID et transactions

**TypeORM** protège contre :
- **Injection SQL** : ORM avec requêtes paramétrées
- **Erreurs de schéma** : Validation des entités
- **Conflits de données** : Gestion des migrations

### **🐳 Docker et Conteneurisation**

**Docker** protège contre :
- **Isolation des processus** : Namespaces et cgroups
- **Escalade de privilèges** : Utilisateurs non-root
- **Fuites de données** : Volumes et réseaux isolés

### **🔗 GraphQL et Apollo**

**GraphQL** protège contre :
- **Over-fetching** : Requêtes spécifiques uniquement
- **Introspection** : Désactivation en production
- **Complexité excessive** : Limitation de profondeur

**Apollo** protège contre :
- **CSRF** : Protection intégrée
- **Cache poisoning** : Cache borné et sécurisé
- **Logging sensible** : Filtrage des données

### **💳 Stripe et Paiements**

**Stripe** protège contre :
- **Fraude** : Détection automatique et 3D Secure
- **Vol de données** : Tokenisation des cartes
- **Manipulation** : Webhooks signés et validation

### **🌐 Nginx et Reverse Proxy**

**Nginx** protège contre :
- **Déni de service** : Rate limiting et connection limiting
- **Attaques SSL** : Configuration TLS sécurisée
- **Headers malveillants** : Filtrage et sanitisation
- **Exposition d'informations** : Masquage des versions

---


## 🔍 **7. Tests de Sécurité**

### **Tests Automatisés**
```typescript
describe('Security Tests', () => {
  test('should reject weak passwords', async () => {
    ad ...
  })
  
  test('should require authentication for protected routes', async () => {
    add ...
  })
})
```

### **Tests de Pénétration**
- Tests d'injection SQL
- Tests XSS
- Tests CSRF
- Tests d'élévation de privilèges

---

## 📚 **8. Ressources et Références**

### **Standards et Guides**
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ANSSI - Recommandations de sécurité](https://www.ssi.gouv.fr/)
- [RGPD - Protection des données](https://www.cnil.fr/)

### **Outils de Sécurité**
- **npm audit** : Vérification des vulnérabilités
- **Helmet.js** : Headers de sécurité
- **express-rate-limit** : Rate limiting
- **argon2** : Hachage des mots de passe

### **Formation Continue**
- Cours de sécurité web
- Veille technologique
- Participation aux conférences de sécurité
- Tests de pénétration réguliers

---

## 🎯 **9. Conclusion**

**Rappel important** : La sécurité n'est pas un produit fini, mais un processus d'amélioration continue.

---

Version : 1.0
Date : 2025-09-22
Projet : Ask&Trust Security Guide