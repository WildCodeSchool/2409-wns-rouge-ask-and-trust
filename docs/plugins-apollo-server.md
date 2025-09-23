#### **📚 Fonctionnement des Plugins Apollo Server**

Les plugins Apollo Server permettent d'intercepter et de modifier le cycle de vie des requêtes GraphQL. Notre middleware de timeout utilise cette architecture pour implémenter un contrôle temporel global.

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

##### **🔍 Comparaison avec d'autres approches**

| Approche | Avantages | Inconvénients |
|----------|-----------|---------------|
| **Plugin Apollo** | ✅ Global, transparent, performant | ❌ Complexité du cycle de vie |
| **Décorateur @Timeout** | ✅ Granulaire, flexible | ❌ Doit être ajouté manuellement |
| **Middleware Express** | ✅ Simple, HTTP natif | ❌ Pas spécifique à GraphQL |
| **withTimeout()** | ✅ Réutilisable, explicite | ❌ Doit être appelé manuellement |

##### **📋 Exemple d'utilisation avancée**

```typescript
// Configuration différentielle par type d'opération
const advancedTimeoutPlugin = {
  requestDidStart() {
    return Promise.resolve({
      didResolveOperation: async (requestContext) => {
        const operation = requestContext.request.operationName
        let timeoutMs = 30000 // Défaut
        
        // Timeouts spécifiques par opération
        if (operation?.includes('upload')) timeoutMs = 120000 // 2 minutes
        if (operation?.includes('search')) timeoutMs = 10000  // 10 secondes
        if (operation?.includes('report')) timeoutMs = 60000  // 1 minute
        
        requestContext.timeoutId = setTimeout(() => {
          // Logique de timeout avec contexte spécifique
        }, timeoutMs)
      }
    })
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

##### **⚠️ Considérations importantes**

1. **Gestion des WebSockets** : Les subscriptions GraphQL nécessitent une approche différente
2. **Fuites mémoire** : Toujours nettoyer les timers dans `willSendResponse`
3. **Concurrence** : Le `requestContext` est unique par requête, pas de conflit
4. **Erreurs réseau** : Le timeout ne s'applique qu'aux opérations GraphQL, pas au transport HTTP

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
