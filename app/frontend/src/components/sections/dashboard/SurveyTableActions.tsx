import { Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { SurveyTableActionsProps } from "@/types/types"
import { useSurvey } from "@/hooks/useSurvey"

export const SurveyTableActions = ({
	surveyId,
	status,
}: SurveyTableActionsProps) => {
	const { deleteSurvey } = useSurvey()
	const isEditable = status === "draft" || status === "published"
	const isPublished = status === "published"

	return (
		<div className="flex items-center gap-5">
			<Button
				ariaLabel="Visualiser cette enquête"
				variant="ghost"
				to={
					isPublished
						? `/surveys/respond/${surveyId}`
						: `/surveys/preview/${surveyId}`
				}
				role="link"
				className="text-black-default p-0"
			>
				<Eye className="h-5 w-5 cursor-pointer" />
			</Button>
			{isEditable && (
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
				onClick={() => deleteSurvey(surveyId.toString())}
				className="p-0"
			>
				<Trash2 className="text-destructive-medium h-5 w-5 cursor-pointer" />
			</Button>
		</div>
	)
}
