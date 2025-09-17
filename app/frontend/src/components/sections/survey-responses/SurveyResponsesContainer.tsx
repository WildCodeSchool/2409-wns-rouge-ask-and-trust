import { useState } from "react"
import { useSurveyResponses } from "@/hooks/useSurveyResponses"
import { SurveyResponsesList } from "@/components/sections/survey-responses/SurveyResponsesList"
import { SurveyResponsesFilters } from "@/components/sections/survey-responses/SurveyResponsesFilters"
import { SurveyResponsesStats } from "@/components/sections/survey-responses/SurveyResponsesStats"
import { SurveyResponseDetail } from "@/components/sections/survey-responses/SurveyResponseDetail"
import { Button } from "@/components/ui/Button"

interface SurveyResponsesContainerProps {
	surveyId: number
}

export function SurveyResponsesContainer({
	surveyId,
}: SurveyResponsesContainerProps) {
	const [selectedResponseId, setSelectedResponseId] = useState<string | null>(
		null
	)
	const [showFilters, setShowFilters] = useState(false)

	const {
		responses,
		stats,
		isLoadingResponses,
		isLoadingStats,
		responsesError,
		statsError,
		filters,
		updateFilters,
		goToPage,
		nextPage,
		previousPage,
	} = useSurveyResponses(surveyId)

	const handleResponseSelect = (responseId: string) => {
		setSelectedResponseId(responseId)
	}

	const handleBackToList = () => {
		setSelectedResponseId(null)
	}

	if (responsesError) {
		return (
			<div className="p-6">
				<div className="text-center text-red-600">
					<p>Erreur lors du chargement des réponses</p>
					<p className="mt-2 text-sm">{responsesError.message}</p>
				</div>
			</div>
		)
	}

	if (selectedResponseId) {
		const selectedResponse = responses?.responses.find(
			r => r.responseId === selectedResponseId
		)
		if (selectedResponse) {
			return (
				<SurveyResponseDetail
					response={selectedResponse}
					onBack={handleBackToList}
				/>
			)
		}
	}

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Réponses du sondage</h1>
					<p className="text-black-600 mt-1">
						Consultez et analysez les réponses reçues
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={() => setShowFilters(!showFilters)}
						ariaLabel="Afficher/masquer les filtres"
					>
						Filtres
					</Button>
				</div>
			</div>

			{/* Statistics */}
			{stats && (
				<SurveyResponsesStats
					stats={stats}
					isLoading={isLoadingStats}
					error={statsError}
				/>
			)}

			{/* Filters */}
			{showFilters && (
				<SurveyResponsesFilters
					filters={filters}
					onFiltersChange={updateFilters}
				/>
			)}

			{/* Responses List */}
			<SurveyResponsesList
				responses={responses}
				isLoading={isLoadingResponses}
				onResponseSelect={handleResponseSelect}
				onPageChange={goToPage}
				onNextPage={nextPage}
				onPreviousPage={previousPage}
			/>
		</div>
	)
}
