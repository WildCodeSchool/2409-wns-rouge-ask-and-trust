#### **📚 Fonctionnement des Plugins Apollo Server**

Les plugins Apollo Server permettent d'intercepter et de modifier le cycle de vie des requêtes GraphQL. Notre middleware de timeout utilise cette architecture pour implémenter un contrôle temporel global avec **3 niveaux de priorité** :

1. **Décorateur `@Timeout`** (PRIORITÉ MAXIMALE)
2. **Mots-clés dans `operationTimeouts`** (PRIORITÉ MOYENNE)  
3. **Timeout par défaut** (PRIORITÉ MINIMALE)

##### **🔄 Cycle de vie d'une requête GraphQL**

```typescript
// Structure d'un plugin Apollo Server
const timeoutPlugin = {
  requestDidStart() {
    // 1. Appelé au début de chaque requête
    return Promise.resolve({
      
      didResolveOperation: async (requestContext) => {
        // 2. Appelé après la résolution de l'opération GraphQL
        // C'est ici qu'on démarre le timer de timeout
        requestContext.timeoutId = setTimeout(() => {
          // Créer une erreur de timeout si la requête dépasse la limite
          const timeoutError = new GraphQLError("Request timeout", {
            extensions: {
              code: "REQUEST_TIMEOUT",
              statusCode: 408,
              timeoutMs: 30000,
            },
          })
          
          // Injecter l'erreur dans la réponse
          requestContext.response.errors = [timeoutError]
          requestContext.response.data = null
        }, 30000)
      },
      
      willSendResponse: async (requestContext) => {
        // 3. Appelé juste avant l'envoi de la réponse
        // Nettoyer le timer pour éviter les fuites mémoire
        if (requestContext.timeoutId) {
          clearTimeout(requestContext.timeoutId)
        }
      },
      
      // Autres hooks disponibles :
      // - didResolveSource: Après résolution de la source
      // - didEncounterErrors: En cas d'erreurs
      // - responseForOperation: Pour personnaliser la réponse
      
    })
  },
}
```

##### **⚡ Points clés du fonctionnement**

1. **Interception globale** : Le plugin s'applique à toutes les requêtes GraphQL automatiquement
2. **Gestion du contexte** : Stockage du `timeoutId` dans le `requestContext` pour le nettoyage
3. **Injection d'erreurs** : Modification directe de `requestContext.response` en cas de timeout
4. **Nettoyage automatique** : Suppression des timers dans `willSendResponse` pour éviter les fuites

##### **🛠️ Avantages de cette approche**

- **Transparence** : Aucune modification nécessaire dans les resolvers existants
- **Performance** : Timeout géré au niveau du serveur, pas par requête
- **Cohérence** : Même comportement pour toutes les opérations GraphQL
- **Maintenance** : Configuration centralisée dans un seul endroit

##### **🎯 Système de Priorité des Timeouts**

Notre implémentation utilise un système de priorité à 3 niveaux :

```typescript
// 1. PRIORITÉ MAXIMALE - Décorateur @Timeout
@Timeout(5000) // 5 secondes - TOUJOURS appliqué
async myMethod() {
    // Timeout final : 5 secondes (peu importe le nom)
}

// 2. PRIORITÉ MOYENNE - Mots-clés dans operationTimeouts
async searchSurveys() { // Contient "search" → 10 secondes
    // Timeout : 10 secondes (si pas de décorateur)
}

// 3. PRIORITÉ MINIMALE - Timeout par défaut
async getSurveyById() { // Aucune correspondance → 30 secondes
    // Timeout : 30 secondes (défaut)
}
```

##### **🔍 Comparaison avec d'autres approches**

| Approche | Avantages | Inconvénients | Priorité |
|----------|-----------|---------------|----------|
| **Décorateur @Timeout** | ✅ Granulaire, explicite, priorité maximale | ❌ Doit être ajouté manuellement | **1** |
| **Mots-clés operationTimeouts** | ✅ Global, cohérent, automatique | ❌ Basé sur le nom de l'opération | **2** |
| **Plugin Apollo global** | ✅ Transparent, performant | ❌ Même timeout pour tout | **3** |
| **Middleware Express** | ✅ Simple, HTTP natif | ❌ Pas spécifique à GraphQL | - |
| **withTimeout()** | ✅ Réutilisable, explicite | ❌ Doit être appelé manuellement | - |

##### **📋 Exemples d'utilisation dans Ask&Trust**

**Configuration dans server.ts :**
```typescript
const timeoutMiddleware = new TimeoutMiddleware({
    timeoutMs: 30000, // 30 secondes par défaut
    enableMetrics: true,
    enableDebugLogging: process.env.NODE_ENV === 'development',
    operationTimeouts: {
        // Timeouts spécifiques par type d'opération
        upload: 120000,        // 2 minutes pour les uploads
        search: 10000,         // 10 secondes pour les recherches
        report: 60000,         // 1 minute pour les rapports
        export: 90000,         // 1.5 minutes pour les exports
        import: 180000,        // 3 minutes pour les imports
        survey: 45000,         // 45 secondes pour les sondages
        response: 20000,       // 20 secondes pour les réponses
        payment: 60000,        // 1 minute pour les paiements
    }
})
```

**Utilisation des décorateurs dans les resolvers :**
```typescript
@Resolver()
export class SurveysResolver {
    
    // ✅ Décorateur prioritaire - 10 secondes (override "search" = 10s)
    @Query(() => AllSurveysResult)
    @Timeout(10000) // Recherches complexes
    async surveys(@Arg("filters") filters: AllSurveysQueryInput) {
        // Timeout final : 10 secondes
    }
    
    // ✅ Décorateur prioritaire - 2 secondes (override défaut = 30s)
    @Query(() => Survey)
    @Timeout(2000) // Lecture simple
    async survey(@Arg("id") id: number) {
        // Timeout final : 2 secondes
    }
    
    // ✅ Mots-clés appliqués - 10 secondes (nom contient "search")
    async searchSurveys() {
        // Timeout : 10 secondes (operationTimeouts.search)
    }
    
    // ✅ Timeout par défaut - 30 secondes (aucune correspondance)
    async getSurveyById() {
        // Timeout : 30 secondes (défaut)
    }
}
```

##### **🐛 Debugging et Monitoring**

```typescript
// Plugin avec logging avancé pour le debugging
const debugTimeoutPlugin = {
  requestDidStart() {
    return Promise.resolve({
      didResolveOperation: async (requestContext) => {
        const startTime = Date.now()
        const operation = requestContext.request.operationName || 'anonymous'
        
        console.log(`🕐 [TIMEOUT] Starting timer for operation: ${operation}`)
        
        requestContext.timeoutId = setTimeout(() => {
          const duration = Date.now() - startTime
          console.error(`⏰ [TIMEOUT] Operation '${operation}' timed out after ${duration}ms`)
          
          // Métriques pour monitoring
          // metrics.increment('graphql.timeout', { operation })
          
          const timeoutError = new GraphQLError(`Operation '${operation}' timed out`, {
            extensions: {
              code: "REQUEST_TIMEOUT",
              statusCode: 408,
              operation,
              duration,
              timeoutMs: 30000,
            },
          })
          
          requestContext.response.errors = [timeoutError]
          requestContext.response.data = null
        }, 30000)
      },
      
      willSendResponse: async (requestContext) => {
        if (requestContext.timeoutId) {
          clearTimeout(requestContext.timeoutId)
          const operation = requestContext.request.operationName || 'anonymous'
          console.log(`✅ [TIMEOUT] Cleaned timer for operation: ${operation}`)
        }
      }
    })
  }
}
```

##### **📊 Timeouts configurés dans Ask&Trust**

| Type d'opération | Timeout | Méthode | Exemple |
|------------------|---------|---------|---------|
| **Lectures simples** | 2-3 secondes | `@Timeout(2000)` | `getSurveyById` |
| **Recherches** | 8-12 secondes | `@Timeout(10000)` | `surveys`, `mySurveys` |
| **Création** | 15 secondes | `@Timeout(15000)` | `createSurvey` |
| **Mise à jour** | 8-12 secondes | `@Timeout(12000)` | `updateSurvey` |
| **Suppression** | 5 secondes | `@Timeout(5000)` | `deleteSurvey` |
| **Paiements** | 5-10 secondes | `@Timeout(10000)` | `createPaymentIntent` |
| **Statistiques** | 8 secondes | `@Timeout(8000)` | `surveyResponseStats` |
| **Réponses** | 3-12 secondes | `@Timeout(3000)` | `surveyResponse` |

##### **⚠️ Considérations importantes**

1. **Priorité des timeouts** : Décorateur > Mots-clés > Défaut
2. **Gestion des WebSockets** : Les subscriptions GraphQL nécessitent une approche différente
3. **Fuites mémoire** : Toujours nettoyer les timers dans `willSendResponse`
4. **Concurrence** : Le `requestContext` est unique par requête, pas de conflit
5. **Erreurs réseau** : Le timeout ne s'applique qu'aux opérations GraphQL, pas au transport HTTP
6. **Logging et métriques** : Activés automatiquement en développement

##### **📊 Métriques recommandées**

```typescript
// Intégration avec un système de métriques
const metricsTimeoutPlugin = {
  requestDidStart() {
    return Promise.resolve({
      didResolveOperation: async (requestContext) => {
        const startTime = Date.now()
        
        requestContext.timeoutId = setTimeout(() => {
          // Enregistrer la métrique de timeout
          metrics.increment('apollo.timeout.exceeded', {
            operation: requestContext.request.operationName,
            timeout_ms: '30000'
          })
          
          // Log structuré pour l'observabilité
          logger.warn('GraphQL operation timeout', {
            operation: requestContext.request.operationName,
            variables: requestContext.request.variables,
            duration: Date.now() - startTime,
            timeout: 30000,
            user_id: requestContext.contextValue?.user?.id
          })
        }, 30000)
      }
    })
  }
}
```
