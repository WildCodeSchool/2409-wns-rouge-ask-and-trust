import { Button } from "@/components/ui/Button"
import Pagination from "@/components/ui/Pagination"
import { DELETE_SURVEY, GET_MY_SURVEYS } from "@/graphql/survey/survey"
import { useToast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import { SurveyTableNavProps } from "@/types/types"
import { useMutation } from "@apollo/client"

export default function SurveyTableNav({
	showDeleteButton,
	currentPage,
	sortedSurveys,
	surveysPerPage,
	setCurrentPage,
	selectedSurveyIds,
}: SurveyTableNavProps) {
	const { showToast } = useToast()

	const [doDeleteSurvey] = useMutation(DELETE_SURVEY, {
		refetchQueries: [GET_MY_SURVEYS],
	})

	const handleDeleteSurveys = async (selectedSurveyIds: number[]) => {
		try {
			await Promise.all(
				selectedSurveyIds.map(id =>
					doDeleteSurvey({
						variables: { surveyId: id.toString() },
					})
				)
			)

			showToast({
				type: "success",
				title: "Les enquêtes ont bien été supprimées !",
				description:
					"Vous pouvez poursuivre votre lecture du tableau de bord.",
			})
		} catch (error) {
			console.error("Erreur lors de la suppression :", error)

			showToast({
				type: "error",
				title: "Un problème est survenu pendant la suppression des enquêtes...",
				description: "Veuillez réessayer dans quelques instants.",
			})
		}
	}

	return (
		<div className="flex items-center justify-between max-lg:flex-wrap max-lg:justify-center max-lg:gap-x-10 max-lg:gap-y-5">
			<Button
				ariaLabel="Créer une enquête"
				variant="secondary"
				to="/surveys/create"
				role="link"
				className="max-lg:order-2"
			>
				Créer une enquête
			</Button>
			<Pagination
				className="m-0 w-max max-lg:order-1 max-lg:w-full"
				currentPage={currentPage}
				totalCount={sortedSurveys.length}
				perPage={surveysPerPage}
				onPageChange={setCurrentPage}
			/>
			<Button
				ariaLabel="Supprimer des enquêtes"
				variant="destructive"
				onClick={() => handleDeleteSurveys(selectedSurveyIds)}
				className={cn(
					"transition-all duration-200 ease-in-out max-lg:order-3",
					!showDeleteButton && "hidden"
				)}
			>
				Supprimer des enquêtes
			</Button>
		</div>
	)
}
