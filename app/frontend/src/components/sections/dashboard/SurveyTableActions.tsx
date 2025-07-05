import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useMutation } from "@apollo/client"
import { DELETE_SURVEY, GET_SURVEYS } from "@/graphql/survey/survey"
import { SurveyTableActionsProps } from "@/types/types"
import { useToast } from "@/hooks/useToast"

export const SurveyTableActions = ({
	surveyId,
	status,
}: SurveyTableActionsProps) => {
	const { showToast } = useToast()

	const [doDeleteSurvey] = useMutation(DELETE_SURVEY, {
		refetchQueries: [GET_SURVEYS],
	})

	const onDelete = async (surveyId: string) => {
		try {
			await doDeleteSurvey({
				variables: {
					surveyId: surveyId,
				},
			})

			showToast({
				type: "success",
				title: "L'enquête a bien été supprimée !",
				description:
					"Vous pouvez poursuivre votre lecture du tableau de bord.",
			})
		} catch (error) {
			if (error instanceof Error) {
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

	return (
		<div className="flex items-center gap-5">
			<Button
				ariaLabel="Visualiser cette enquête"
				variant="ghost"
				to={`/surveys/${surveyId}`}
				role="link"
				className="text-black-default p-0"
			>
				<Eye className="h-5 w-5 cursor-pointer" />
			</Button>
			{["published", "draft"].includes(status) && (
				<Button
					ariaLabel="Modifier cette enquête"
					variant="ghost"
					to={`/surveys/update/${surveyId}`}
					role="link"
					className="text-black-default p-0"
				>
					<Pencil className="h-5 w-5 cursor-pointer" />
				</Button>
			)}
			<Button
				ariaLabel="Supprimer cette enquête"
				variant="ghost"
				onClick={() => onDelete(surveyId.toString())}
				className="p-0"
			>
				<Trash2 className="text-destructive-medium h-5 w-5 cursor-pointer" />
			</Button>
		</div>
	)
}
