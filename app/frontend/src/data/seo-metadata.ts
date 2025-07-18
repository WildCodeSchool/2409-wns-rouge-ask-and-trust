/**
 * @fileoverview Centralized SEO metadata configuration for all pages
 *
 * ```
 * [Page React]
    |
    |--(HOC withSEO)
        |
        |--[clé SEO]---->[STATIC_PAGES_SEO]---->[SEOMetadata]
        |
        |--[clé SEO dynamique]--->[DYNAMIC_PAGES_SEO]--(SurveyData)-->[SEOMetadata]
        |
        |--[customSEO]-->[merge avec DEFAULT_SEO]-->[SEOMetadata]
        |
        |--(Fallback)-->[DEFAULT_SEO]
 * ```
 */

/**
 * Interface représentant la structure complète des métadonnées SEO
 *
 * @interface SEOMetadata
 * @example
 * ```typescript
 * const metadata: SEOMetadata = {
 *   title: "Ma Page | Ask&Trust",
 *   description: "Description de ma page",
 *   robots: "index, follow",
 *   ogTitle: "Ma Page sur Ask&Trust",
 *   ogDescription: "Description pour les réseaux sociaux",
 *   ogType: "website",
 *   twitterCard: "summary"
 * }
 * ```
 */
export interface SEOMetadata {
	/** Titre principal de la page (balise <title>) - Max 60 caractères recommandés */
	title: string
	/** Description de la page (meta description) - Max 160 caractères recommandés */
	description: string
	/** Directives pour les robots d'indexation (ex: "index, follow", "noindex, nofollow") */
	robots?: string
	/** Titre pour Open Graph (réseaux sociaux) - Peut différer du titre principal */
	ogTitle?: string
	/** Description pour Open Graph (réseaux sociaux) */
	ogDescription?: string
	/** Type de contenu Open Graph (ex: "website", "article") */
	ogType?: string
	/** Type de Twitter Card (ex: "summary", "summary_large_image") */
	twitterCard?: string
	/** Titre spécifique pour Twitter */
	twitterTitle?: string
	/** Description spécifique pour Twitter */
	twitterDescription?: string
	/** URL canonique de la page (pour éviter le contenu dupliqué) */
	canonical?: string
	/** Mots-clés de la page (séparés par des virgules) */
	keywords?: string
}

/**
 * Interface pour les données d'enquête utilisées dans la génération dynamique de SEO
 *
 * @interface SurveyData
 * @example
 * ```typescript
 * const surveyData: SurveyData = {
 *   title: "Enquête sur la satisfaction client",
 *   description: "Une enquête pour mesurer la satisfaction de nos clients",
 *   id: "survey-123"
 * }
 * ```
 */
export interface SurveyData {
	/** Titre de l'enquête */
	title?: string
	/** Description de l'enquête */
	description?: string
	/** Identifiant unique de l'enquête */
	id?: string
}

/**
 * Type de fonction pour générer des métadonnées SEO dynamiques
 *
 * @typedef DynamicSEOGenerator
 * @param {SurveyData} [data] - Données optionnelles pour personnaliser les métadonnées
 * @returns {SEOMetadata} - Métadonnées SEO générées
 *
 * @example
 * ```typescript
 * const surveyGenerator: DynamicSEOGenerator = (survey) => ({
 *   title: survey?.title ? `${survey.title} | Ask&Trust` : "Enquête | Ask&Trust",
 *   description: survey?.description || "Participez à cette enquête",
 *   robots: "noindex, nofollow"
 * })
 * ```
 */
export interface DynamicSEOGenerator {
	(data?: SurveyData): SEOMetadata
}

/**
 * Configuration des métadonnées SEO pour les pages statiques
 *
 * @constant {Record<string, SEOMetadata>} STATIC_PAGES_SEO
 *
 * @example
 * ```typescript
 * // Utilisation avec withSEO
 * export default withSEO(ContactPage, "contact")
 *
 * // Accès programmatique
 * const contactMeta = STATIC_PAGES_SEO.contact
 * console.log(contactMeta.title) // "Contactez-nous | Ask&Trust"
 * ```
 *
 * @example
 * ```typescript
 * // Ajouter une nouvelle page statique
 * export const STATIC_PAGES_SEO = {
 *   // ... pages existantes
 *   newPage: {
 *     title: "Nouvelle Page | Ask&Trust",
 *     description: "Description de la nouvelle page",
 *     robots: "index, follow",
 *     ogTitle: "Nouvelle Page | Ask&Trust",
 *     ogDescription: "Description de la nouvelle page",
 *     ogType: "website",
 *     twitterCard: "summary"
 *   }
 * }
 * ```
 */
export const STATIC_PAGES_SEO: Record<string, SEOMetadata> = {
	landing: {
		title: "Accueil | Ask&Trust",
		description:
			"Page d'accueil du site Ask&Trust - Créez et partagez vos enquêtes facilement",
		robots: "index, follow",
		ogTitle: "Accueil | Ask&Trust",
		ogDescription:
			"Page d'accueil du site Ask&Trust - Créez et partagez vos enquêtes facilement",
		ogType: "website",
		twitterCard: "summary",
		twitterTitle: "Accueil | Ask&Trust",
		twitterDescription:
			"Page d'accueil du site Ask&Trust - Créez et partagez vos enquêtes facilement",
		keywords: "enquête, sondage, formulaire, Ask&Trust",
	},

	contact: {
		title: "Contactez-nous | Ask&Trust",
		description:
			"Contactez l'équipe Ask&Trust pour toute question ou demande d'assistance",
		robots: "index, follow",
		ogTitle: "Contactez-nous | Ask&Trust",
		ogDescription:
			"Contactez l'équipe Ask&Trust pour toute question ou demande d'assistance",
		ogType: "website",
		twitterCard: "summary",
		twitterTitle: "Contactez-nous | Ask&Trust",
		twitterDescription:
			"Contactez l'équipe Ask&Trust pour toute question ou demande d'assistance",
	},

	surveys: {
		title: "Enquêtes | Ask&Trust",
		description: "Découvrez toutes les enquêtes disponibles sur Ask&Trust",
		robots: "index, follow",
		ogTitle: "Enquêtes | Ask&Trust",
		ogDescription:
			"Découvrez toutes les enquêtes disponibles sur Ask&Trust",
		ogType: "website",
		twitterCard: "summary",
		twitterTitle: "Enquêtes | Ask&Trust",
		twitterDescription:
			"Découvrez toutes les enquêtes disponibles sur Ask&Trust",
	},

	auth: {
		title: "Connexion | Ask&Trust",
		description: "Connectez-vous à votre compte Ask&Trust",
		robots: "noindex, nofollow",
		ogTitle: "Connexion | Ask&Trust",
		ogDescription: "Connectez-vous à votre compte Ask&Trust",
		ogType: "website",
		twitterCard: "summary",
	},

	userProfile: {
		title: "Mon profil | Ask&Trust",
		description: "Gérez votre profil et vos informations personnelles",
		robots: "noindex, nofollow",
		ogTitle: "Mon profil | Ask&Trust",
		ogDescription: "Gérez votre profil et vos informations personnelles",
		ogType: "website",
		twitterCard: "summary",
	},

	surveyCreate: {
		title: "Créer une enquête | Ask&Trust",
		description: "Créez votre propre enquête personnalisée avec Ask&Trust",
		robots: "noindex, nofollow",
		ogTitle: "Créer une enquête | Ask&Trust",
		ogDescription:
			"Créez votre propre enquête personnalisée avec Ask&Trust",
		ogType: "website",
		twitterCard: "summary",
	},

	surveyUpdate: {
		title: "Modifier l'enquête | Ask&Trust",
		description: "Modifiez votre enquête existante",
		robots: "noindex, nofollow",
		ogTitle: "Modifier l'enquête | Ask&Trust",
		ogDescription: "Modifiez votre enquête existante",
		ogType: "website",
		twitterCard: "summary",
	},

	previewSurvey: {
		title: "Prévisualisation | Ask&Trust",
		description: "Prévisualisez votre enquête avant publication",
		robots: "noindex, nofollow",
		ogTitle: "Prévisualiser une enquête | Ask&Trust",
		ogDescription: "Prévisualisez votre enquête avant publication",
		ogType: "website",
		twitterCard: "summary",
	},

	payment: {
		title: "Paiement | Ask&Trust",
		description:
			"Procédez au paiement sécurisé pour vos services Ask&Trust",
		robots: "noindex, nofollow",
		ogTitle: "Paiement | Ask&Trust",
		ogDescription:
			"Procédez au paiement sécurisé pour vos services Ask&Trust",
		ogType: "website",
		twitterCard: "summary",
	},

	paymentConfirmation: {
		title: "Paiement confirmé | Ask&Trust",
		description: "Votre paiement a été traité avec succès",
		robots: "noindex, nofollow",
		ogTitle: "Paiement confirmé | Ask&Trust",
		ogDescription: "Votre paiement a été traité avec succès",
		ogType: "website",
		twitterCard: "summary",
	},

	termsOfUse: {
		title: "Conditions d'utilisation | Ask&Trust",
		description:
			"Consultez les conditions d'utilisation de la plateforme Ask&Trust",
		robots: "index, follow",
		ogTitle: "Conditions d'utilisation | Ask&Trust",
		ogDescription:
			"Consultez les conditions d'utilisation de la plateforme Ask&Trust",
		ogType: "website",
		twitterCard: "summary",
	},

	notFound: {
		title: "Page non trouvée | Ask&Trust",
		description: "La page que vous recherchez n'existe pas",
		robots: "noindex, nofollow",
		ogTitle: "Page non trouvée | Ask&Trust",
		ogDescription: "La page que vous recherchez n'existe pas",
		ogType: "website",
		twitterCard: "summary",
	},
}

/**
 * Générateurs de métadonnées SEO pour les pages avec contenu dynamique
 *
 * @constant {Record<string, DynamicSEOGenerator>} DYNAMIC_PAGES_SEO
 *
 * @example
 * ```typescript
 * // Utilisation avec withSEO et données dynamiques
 * const SurveyResponsePage = withSEO(SurveyResponse, "surveyResponse")
 *
 * // Dans le composant parent
 * const survey = { title: "Mon enquête", description: "Description..." }
 * return <SurveyResponsePage dynamicData={survey} />
 * ```
 *
 * @example
 * ```typescript
 * // Utilisation avec useDynamicSEO hook
 * function SurveyPage() {
 *   const [survey, setSurvey] = useState(null)
 *
 *   // Met à jour automatiquement le SEO quand survey change
 *   useDynamicSEO("surveyResponse", survey)
 *
 *   return <div>...</div>
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Ajouter un nouveau générateur dynamique
 * export const DYNAMIC_PAGES_SEO = {
 *   // ... générateurs existants
 *   articlePage: (article?: ArticleData): SEOMetadata => ({
 *     title: article?.title ? `${article.title} | Ask&Trust` : "Article | Ask&Trust",
 *     description: article?.excerpt || "Découvrez cet article sur Ask&Trust",
 *     robots: "index, follow",
 *     ogTitle: article?.title,
 *     ogDescription: article?.excerpt,
 *     ogType: "article"
 *   })
 * }
 * ```
 */
export const DYNAMIC_PAGES_SEO: Record<string, DynamicSEOGenerator> = {
	surveyResponse: (survey?: SurveyData): SEOMetadata => ({
		title: survey?.title
			? `${survey.title} - Répondre à l'enquête | Ask&Trust`
			: "Répondre à l'enquête | Ask&Trust",
		description: survey?.description
			? `Répondez à l'enquête: ${survey.description}`
			: "Participez à cette enquête Ask&Trust",
		robots: "noindex, nofollow",
		ogTitle: survey?.title
			? `${survey.title} - Enquête | Ask&Trust`
			: "Enquête | Ask&Trust",
		ogDescription:
			survey?.description || "Participez à cette enquête Ask&Trust",
		ogType: "website",
		twitterCard: "summary",
		twitterTitle: survey?.title ? `${survey.title} - Enquête` : "Enquête",
		twitterDescription:
			survey?.description || "Participez à cette enquête Ask&Trust",
	}),

	surveyCreator: (survey?: SurveyData): SEOMetadata => ({
		title: survey?.title
			? `Édition: ${survey.title} | Ask&Trust`
			: "Créateur d'enquête | Ask&Trust",
		description: survey?.description
			? `Éditez votre enquête: ${survey.description}`
			: "Créez et personnalisez votre enquête",
		robots: "noindex, nofollow",
		ogTitle: survey?.title
			? `Édition: ${survey.title}`
			: "Créateur d'enquête",
		ogDescription:
			survey?.description || "Créez et personnalisez votre enquête",
		ogType: "website",
		twitterCard: "summary",
	}),
}

/**
 * Métadonnées SEO par défaut utilisées comme fallback
 *
 * @constant {SEOMetadata} DEFAULT_SEO
 *
 * @example
 * ```typescript
 * // Utilisation automatique en fallback
 * const metadata = generateSEOMetadata("unknown-page") // Retourne DEFAULT_SEO
 * ```
 *
 * @example
 * ```typescript
 * // Utilisation comme base pour override
 * const customSEO = {
 *   ...DEFAULT_SEO,
 *   title: "Titre Personnalisé",
 *   description: "Description personnalisée"
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Utilisation avec customSEO prop
 * <MyPage customSEO={{
 *   title: "Titre spécial", // Override le titre par défaut
 *   // Autres champs héritent de DEFAULT_SEO
 * }} />
 * ```
 */
export const DEFAULT_SEO: SEOMetadata = {
	title: "Ask&Trust",
	description: "Plateforme de création et de partage d'enquêtes",
	robots: "index, follow",
	ogTitle: "Ask&Trust",
	ogDescription: "Plateforme de création et de partage d'enquêtes",
	ogType: "website",
	twitterCard: "summary",
}
