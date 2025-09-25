import { DELETE_SURVEY, GET_MY_SURVEYS } from "@/graphql/survey/survey"
import { useMutation } from "@apollo/client"
import { useToast } from "../useToast"
/**
 * Hook providing all surveys-related GraphQL mutations.
 *
 * @description
 * This hook encapsulates the logic to delete many surveys.
 * It uses Apollo Client's `useMutation` and provides loading states, errors, and error reset functions.
 *
 * @returns {Object} An object containing mutation functions and their corresponding states.
 *
 * @example
 * ```ts
 * const {
 *   deleteSurvey,
 *   isDeletingSurvey,
 *   deleteSurveysError,
 *   resetDeleteSurveysError,
 * } = useSurveyMutations();
 *
 * // Delete surveys
 * await deleteSurvey([surveyId1, surveyId2]);
 * ```
 */

export function useSurveysMutations() {
	const { showToast } = useToast()

	// ************************ DELETE ************************
	const [
		deleteSurveysMutation,
		{
			loading: isDeletingSurveys,
			error: deleteSurveysError,
			reset: resetDeleteSurveysError,
		},
	] = useMutation(DELETE_SURVEY, { refetchQueries: [GET_MY_SURVEYS] })

	const deleteSurveys = async (selectedSurveyIds: number[]) => {
		try {
			await Promise.all(
				selectedSurveyIds.map(id =>
					deleteSurveysMutation({
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

	return {
		// delete
		deleteSurveys,
		isDeletingSurveys,
		deleteSurveysError,
		resetDeleteSurveysError,
	}
}
