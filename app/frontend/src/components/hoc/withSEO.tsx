/**
 * @fileoverview Higher-Order Component (HOC) pour la gestion automatique du SEO
 *
 * Ce module fournit un HOC qui injecte automatiquement les métadonnées SEO
 * appropriées dans les composants React en utilisant react-helmet. Il supporte
 * les pages statiques, dynamiques, et les overrides personnalisés.
 */

import { ComponentRef, ComponentType, forwardRef, useEffect } from "react"
import { Helmet } from "react-helmet-async"
import {
	STATIC_PAGES_SEO,
	DYNAMIC_PAGES_SEO,
	DEFAULT_SEO,
	type SEOMetadata,
	type SurveyData,
} from "@/data/seo-metadata"

/**
 * Props injectées par le HOC withSEO dans les composants wrappés
 *
 * Ces props permettent de contrôler dynamiquement les métadonnées SEO
 * du composant sans avoir à les gérer manuellement.
 *
 * @interface WithSEOProps
 * @example
 * ```typescript
 * // Utilisation avec une clé SEO différente
 * <MyPage seoKey="custom-key" />
 *
 * // Utilisation avec données dynamiques
 * <SurveyPage dynamicData={{ title: "Mon enquête", description: "..." }} />
 *
 * // Utilisation avec SEO personnalisé
 * <SpecialPage customSEO={{ title: "Titre spécial", robots: "noindex" }} />
 * ```
 */
export interface WithSEOProps {
	/** Clé SEO alternative pour override la clé par défaut du HOC */
	seoKey?: string
	/** Données dynamiques pour la génération de métadonnées personnalisées */
	dynamicData?: SurveyData
	/** Métadonnées SEO personnalisées qui overrident la configuration par défaut */
	customSEO?: Partial<SEOMetadata>
}

/**
 * Higher-Order Component qui injecte automatiquement les métadonnées SEO
 *
 * @template P - Type des props du composant wrappé
 * @param {React.ComponentType<P>} WrappedComponent - Composant React à wrapper
 * @param {string} [defaultSEOKey] - Clé SEO par défaut pour ce composant
 * @returns {React.ComponentType<P & WithSEOProps>} - Composant wrappé avec injection SEO
 *
 * @example
 * ```typescript
 * // Page statique basique
 * const ContactPage = () => <div>Contact content</div>
 * export default withSEO(ContactPage, "contact")
 * ```
 *
 * @example
 * ```typescript
 * // Page dynamique avec données d'enquête
 * const SurveyResponsePage = () => <div>Survey response</div>
 * const SurveyResponseWithSEO = withSEO(SurveyResponsePage, "surveyResponse")
 *
 * // Utilisation avec données dynamiques
 * function App() {
 *   const survey = { title: "Mon enquête", description: "Description..." }
 *   return <SurveyResponseWithSEO dynamicData={survey} />
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Page avec SEO personnalisé
 * const SpecialPage = withSEO(MyComponent)
 *
 * function App() {
 *   return (
 *     <SpecialPage
 *       customSEO={{
 *         title: "Page Spéciale",
 *         description: "Une page avec des métadonnées personnalisées",
 *         robots: "noindex, nofollow"
 *       }}
 *     />
 *   )
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Override de clé SEO au runtime
 * const FlexiblePage = withSEO(MyComponent, "default")
 *
 * function App() {
 *   return <FlexiblePage seoKey="alternative" />
 * }
 * ```
 */
export function withSEO<P extends object>(
	WrappedComponent: ComponentType<P>,
	defaultSEOKey?: string
) {
	const WithSEOComponent = forwardRef<
		ComponentRef<typeof WrappedComponent>,
		P & WithSEOProps
	>(function WithSEOInner(
		{ seoKey, dynamicData, customSEO, ...props },
		ref
	): React.ReactElement {
		/**
		 * Détermine quelle clé SEO utiliser
		 * Priorité: prop seoKey > defaultSEOKey du HOC > undefined
		 */
		const resolvedSEOKey: string | undefined = seoKey || defaultSEOKey

		/**
		 * Résout les métadonnées SEO selon la priorité suivante:
		 * 1. customSEO (override complet)
		 * 2. DYNAMIC_PAGES_SEO[key] avec dynamicData
		 * 3. STATIC_PAGES_SEO[key]
		 * 4. DEFAULT_SEO (fallback)
		 */
		const getMetadata = (): SEOMetadata => {
			// Priorité 1: Override personnalisé complet
			if (customSEO) {
				return { ...DEFAULT_SEO, ...customSEO }
			}

			// Priorité 2: Générateur dynamique avec données
			if (resolvedSEOKey && DYNAMIC_PAGES_SEO[resolvedSEOKey]) {
				return DYNAMIC_PAGES_SEO[resolvedSEOKey](dynamicData)
			}

			// Priorité 3: Configuration statique
			if (resolvedSEOKey && STATIC_PAGES_SEO[resolvedSEOKey]) {
				return STATIC_PAGES_SEO[resolvedSEOKey]
			}

			// Priorité 4: Fallback par défaut
			return DEFAULT_SEO
		}

		const metadata: SEOMetadata = getMetadata()

		return (
			<>
				<Helmet>
					<title>{metadata.title}</title>
					<meta name="description" content={metadata.description} />
					{metadata.robots && (
						<meta name="robots" content={metadata.robots} />
					)}
					{metadata.keywords && (
						<meta name="keywords" content={metadata.keywords} />
					)}
					{metadata.canonical && (
						<link rel="canonical" href={metadata.canonical} />
					)}

					{/* Open Graph tags */}
					{metadata.ogTitle && (
						<meta property="og:title" content={metadata.ogTitle} />
					)}
					{metadata.ogDescription && (
						<meta
							property="og:description"
							content={metadata.ogDescription}
						/>
					)}
					{metadata.ogType && (
						<meta property="og:type" content={metadata.ogType} />
					)}

					{/* Twitter tags */}
					{metadata.twitterCard && (
						<meta
							name="twitter:card"
							content={metadata.twitterCard}
						/>
					)}
					{metadata.twitterTitle && (
						<meta
							name="twitter:title"
							content={metadata.twitterTitle}
						/>
					)}
					{metadata.twitterDescription && (
						<meta
							name="twitter:description"
							content={metadata.twitterDescription}
						/>
					)}
				</Helmet>

				<WrappedComponent {...(props as P)} ref={ref} />
			</>
		)
	})

	/**
	 * @description Display name du composant withSEO
	 * @displayName withSEO
	 * @section Notes importantes
	 * Un HOC (Higher-Order Component) "wrappe" un autre composant:
	 * Sans displayName, tous les composants wrappés s'appelleraient juste WithSEOComponent dans DevTools,
	 * ce qui ne t'indique pas quel composant est réellement concerné.
	 * ```typescript
	 *    withSEO(ContactPage) // Affichera "withSEO(ContactPage)" dans DevTools
	 *    withSEO(Landing) // Affichera "withSEO(Landing)" dans DevTools
	 * ```
	 */
	WithSEOComponent.displayName = `withSEO(${WrappedComponent.displayName || WrappedComponent.name})`

	return WithSEOComponent
}

/**
 * Hook React pour la mise à jour dynamique des métadonnées SEO
 *
 * Ce hook permet de mettre à jour les métadonnées SEO en temps réel
 * basé sur les changements d'état dans le composant. Particulièrement
 * utile pour les pages qui chargent du contenu de manière asynchrone.
 *
 * @param {string} seoKey - Clé du générateur SEO dynamique à utiliser
 * @param {SurveyData} [dynamicData] - Données pour générer les métadonnées
 *
 * @example
 * ```typescript
 * function SurveyPage() {
 *   const [survey, setSurvey] = useState(null)
 *
 *   // Met à jour automatiquement le SEO quand survey change
 *   useDynamicSEO("surveyResponse", survey)
 *
 *   useEffect(() => {
 *     // Simulation de chargement asynchrone
 *     loadSurveyData().then(setSurvey)
 *   }, [])
 *
 *   return <div>{survey?.title || "Chargement..."}</div>
 * }
 * ```
 *
 * @example
 * ```typescript
 * function DynamicContentPage() {
 *   const [content, setContent] = useState(null)
 *
 *   // Met à jour le titre de la page immédiatement
 *   useDynamicSEO("surveyCreator", content)
 *
 *   // Le titre change automatiquement quand content change
 *   return (
 *     <div>
 *       <button onClick={() => setContent({ title: "Nouveau titre" })}>
 *         Changer le titre
 *       </button>
 *     </div>
 *   )
 * }
 * ```
 *
 * @see {@link DYNAMIC_PAGES_SEO} pour les générateurs disponibles
 */
export function useDynamicSEO(seoKey: string, dynamicData?: SurveyData) {
	useEffect(() => {
		if (DYNAMIC_PAGES_SEO[seoKey]) {
			const metadata = DYNAMIC_PAGES_SEO[seoKey](dynamicData)

			// Update document title immediately for better UX
			document.title = metadata.title
		}
	}, [seoKey, dynamicData])
}

/**
 * Fonction utilitaire pour générer des métadonnées SEO de manière programmatique
 *
 * Cette fonction permet d'accéder aux métadonnées SEO sans utiliser le HOC,
 * utile pour l'accès programmatique, les tests, ou la génération côté serveur.
 *
 * @param {string} [seoKey] - Clé SEO pour identifier la configuration à utiliser
 * @param {SurveyData} [dynamicData] - Données pour les générateurs dynamiques
 * @param {Partial<SEOMetadata>} [customSEO] - Override personnalisé des métadonnées
 * @returns {SEOMetadata} - Métadonnées SEO générées
 *
 * @example
 * ```typescript
 * // Accès aux métadonnées d'une page statique
 * const contactMeta = generateSEOMetadata("contact")
 * console.log(contactMeta.title) // "Contactez-nous | Ask&Trust"
 * ```
 *
 * @example
 * ```typescript
 * // Génération avec données dynamiques
 * const surveyMeta = generateSEOMetadata(
 *   "surveyResponse",
 *   { title: "Mon enquête", description: "Description de l'enquête" }
 * )
 * console.log(surveyMeta.title) // "Mon enquête - Répondre à l'enquête | Ask&Trust"
 * ```
 *
 * @example
 * ```typescript
 * // Override avec métadonnées personnalisées
 * const customMeta = generateSEOMetadata(
 *   "contact",
 *   undefined,
 *   {
 *     title: "Contact Personnalisé",
 *     robots: "noindex, nofollow"
 *   }
 * )
 * // Titre personnalisé, autres champs de "contact" conservés
 * ```
 *
 * @example
 * ```typescript
 * // Utilisation pour les tests
 * describe("SEO Metadata", () => {
 *   it("should generate correct metadata for landing page", () => {
 *     const meta = generateSEOMetadata("landing")
 *     expect(meta.title).toBe("Accueil | Ask&Trust")
 *     expect(meta.robots).toBe("index, follow")
 *   })
 * })
 * ```
 *
 * @example
 * ```typescript
 * // Utilisation côté serveur (SSR)
 * export async function getServerSideProps({ params }) {
 *   const surveyData = await fetchSurvey(params.id)
 *   const seoMeta = generateSEOMetadata("surveyResponse", surveyData)
 *
 *   return {
 *     props: { surveyData, seoMeta }
 *   }
 * }
 * ```
 */
export function generateSEOMetadata(
	seoKey?: string,
	dynamicData?: SurveyData,
	customSEO?: Partial<SEOMetadata>
): SEOMetadata {
	if (customSEO) {
		return { ...DEFAULT_SEO, ...customSEO }
	}

	if (seoKey && DYNAMIC_PAGES_SEO[seoKey]) {
		return DYNAMIC_PAGES_SEO[seoKey](dynamicData)
	}

	if (seoKey && STATIC_PAGES_SEO[seoKey]) {
		return STATIC_PAGES_SEO[seoKey]
	}

	return DEFAULT_SEO
}

/**
 * @section Notes importantes
 *
 * 1. **Performance**: Les métadonnées sont calculées à chaque render.
 *    Pour les données dynamiques complexes, considérez la mémorisation.
 *
 * 2. **Fast Refresh**: Utilisez des exports nommés pour éviter les erreurs:
 *    ```typescript
 *    const MyPageWithSEO = withSEO(MyPage, "myPage")
 *    export default MyPageWithSEO
 *    ```
 *
 * 3. **Types**: Le HOC preserve les types des props du composant wrappé
 *    et ajoute les props SEO optionnelles.
 *
 * 4. **Debugging**: Utilisez generateSEOMetadata() pour inspecter
 *    les métadonnées générées en mode développement.
 *
 * @see {@link https://github.com/ask-trust/docs/seo-system-guide.md} Guide complet du système SEO
 * @see {@link STATIC_PAGES_SEO} Configuration des pages statiques
 * @see {@link DYNAMIC_PAGES_SEO} Générateurs dynamiques
 * @see {@link DEFAULT_SEO} Métadonnées par défaut
 */
