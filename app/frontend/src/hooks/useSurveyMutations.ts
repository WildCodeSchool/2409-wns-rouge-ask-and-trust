import {
	CREATE_SURVEY,
	DELETE_SURVEY,
	GET_MY_SURVEYS,
	GET_SURVEY,
	GET_SURVEYS,
	UPDATE_SURVEY,
	UPDATE_SURVEY_STATUS,
} from "@/graphql/survey/survey"
import {
	CreateSurveyInput,
	SurveyStatusType,
	UpdateSurveyInput,
} from "@/types/types"
import { useMutation } from "@apollo/client"
import { useToast } from "./useToast"

export function useSurveyMutations() {
	const { showToast } = useToast()

	// ************************ CREATE ************************
	const [
		createSurveyMutation,
		{
			loading: isCreatingSurvey,
			error: createSurveyError,
			reset: resetCreateSurveyError,
		},
	] = useMutation(CREATE_SURVEY, { refetchQueries: [{ query: GET_SURVEYS }] })

	const addSurvey = async (survey: CreateSurveyInput) => {
		const result = await createSurveyMutation({
			variables: { data: survey },
		})
		return result.data?.createSurvey
	}

	// ************************ UPDATE ************************
	const [
		updateSurveyMutation,
		{
			loading: isUpdatingSurvey,
			error: updateSurveyError,
			reset: resetUpdateSurveyError,
		},
	] = useMutation(UPDATE_SURVEY, { refetchQueries: [{ query: GET_SURVEYS }] })

	const updateSurvey = async (id: string, survey: UpdateSurveyInput) => {
		const result = await updateSurveyMutation({
			variables: { data: { ...survey, id } },
		})
		return result.data?.updateSurvey
	}

	// ************************ STATUS ************************
	const [
		updateSurveyStatusMutation,
		{
			loading: isUpdatingStatus,
			error: updateSurveyStatusError,
			reset: resetUpdateSurveyStatusError,
		},
	] = useMutation(UPDATE_SURVEY_STATUS)

	const updateSurveyStatus = async (id: string, status: SurveyStatusType) => {
		const result = await updateSurveyStatusMutation({
			variables: { data: { id, status } },
			refetchQueries: [
				{ query: GET_SURVEY, variables: { surveyId: id } },
				{ query: GET_SURVEYS },
			],
			awaitRefetchQueries: true,
		})
		return result.data?.updateSurvey
	}

	// ************************ DELETE ************************
	const [
		deleteSurveyMutation,
		{
			loading: isDeletingSurvey,
			error: deleteSurveyError,
			reset: resetDeleteSurveyError,
		},
	] = useMutation(DELETE_SURVEY, { refetchQueries: [GET_MY_SURVEYS] })

	const deleteSurvey = async (surveyId: string) => {
		try {
			await deleteSurveyMutation({ variables: { surveyId } })
			showToast({
				type: "success",
				title: "L'enquête a bien été supprimée !",
				description:
					"Vous pouvez poursuivre votre lecture du tableau de bord.",
			})
		} catch (error) {
			if (error instanceof Error) {
				// @TODO check this. maybe use useToastOnChange() ?
				if (
					error.message.includes(
						"Access denied! You don't have permission for this action!"
					)
				) {
					showToast({
						type: "error",
						title: "Échec de la suppression",
						description: "Vous n'avez pas les droits nécessaires.",
					})
				} else {
					showToast({
						type: "error",
						title: "Erreur lors de la suppression",
						description:
							"Une erreur est survenue. Veuillez réessayer plus tard.",
					})
				}
			} else {
				showToast({
					type: "error",
					title: "Erreur inattendue",
					description: "Une erreur inconnue est survenue.",
				})
			}
		}
	}

	return {
		// create
		createSurvey: addSurvey,
		isCreatingSurvey,
		createSurveyError,
		resetCreateSurveyError,

		// update
		updateSurvey,
		isUpdatingSurvey,
		updateSurveyError,
		resetUpdateSurveyError,

		// status
		updateSurveyStatus,
		isUpdatingStatus,
		updateSurveyStatusError,
		resetUpdateSurveyStatusError,

		// delete
		deleteSurvey,
		isDeletingSurvey,
		deleteSurveyError,
		resetDeleteSurveyError,
	}
}
