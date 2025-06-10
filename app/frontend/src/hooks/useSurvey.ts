import { useState } from "react"
import { SurveyCardType } from "@/types/types"

// Nombre d'éléments par page (modifiable selon besoin)
const PAGE_SIZE = 10

// Mock de données pour démarrer
type Survey = SurveyCardType
const mockSurveys: Survey[] = [
	{
		href: "/",
		picture: "/img/dev.webp",
		title: "Pratiquez vous une activité physique?",
		content:
			"Dites-nous si le sport fait partie de votre quotidien. Vos réponses aideront à mieux comprendre les habitudes d'activité physique.",
		tag: "Sport",
		estimateTime: 5,
		timeLeft: "Un mois",
	},
	// ... ajouter d'autres mocks si besoin
]

export function useSurvey() {
	const [surveys, setSurveys] = useState<Survey[]>(mockSurveys)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [page, setPage] = useState(1)
	const totalPages = Math.ceil(surveys.length / PAGE_SIZE)

	// Simule la récupération des surveys (à remplacer par un appel API)
	const fetchSurveys = async (pageToFetch: number = page) => {
		setIsLoading(true)
		setError(null)
		try {
			// Ici, remplacer par un appel API réel
			// Simule la pagination
			const start = (pageToFetch - 1) * PAGE_SIZE
			const end = start + PAGE_SIZE
			setSurveys(mockSurveys.slice(start, end))
			setPage(pageToFetch)
		} catch {
			setError("Erreur lors du chargement des enquêtes.")
		} finally {
			setIsLoading(false)
		}
	}

	// Ajoute une enquête (mock)
	const addSurvey = async (survey: Survey) => {
		setIsLoading(true)
		setError(null)
		try {
			setSurveys(prev => [survey, ...prev])
		} catch {
			setError("Erreur lors de l'ajout de l'enquête.")
		} finally {
			setIsLoading(false)
		}
	}

	// Modifie une enquête (mock)
	const updateSurvey = async (survey: Survey) => {
		setIsLoading(true)
		setError(null)
		try {
			setSurveys(prev =>
				prev.map(s => (s.href === survey.href ? survey : s))
			)
		} catch {
			setError("Erreur lors de la modification de l'enquête.")
		} finally {
			setIsLoading(false)
		}
	}

	// Supprime une enquête (mock)
	const deleteSurvey = async (href: string) => {
		setIsLoading(true)
		setError(null)
		try {
			setSurveys(prev => prev.filter(s => s.href !== href))
		} catch {
			setError("Erreur lors de la suppression de l'enquête.")
		} finally {
			setIsLoading(false)
		}
	}

	return {
		surveys,
		isLoading,
		error,
		page,
		totalPages,
		fetchSurveys,
		addSurvey,
		updateSurvey,
		deleteSurvey,
		setPage,
	}
}
