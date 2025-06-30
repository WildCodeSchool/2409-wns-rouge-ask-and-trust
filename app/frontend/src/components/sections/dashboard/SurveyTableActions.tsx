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

	const onDelete = (surveyId: string) => {
		doDeleteSurvey({
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
