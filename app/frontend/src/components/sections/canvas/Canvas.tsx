import { Button } from "@/components/ui/Button"
import { useQuestions } from "@/hooks/useQuestions"
import { PlusCircle } from "lucide-react"
import { useParams } from "react-router-dom"
import BuildQuestion from "../surveys/buildSurvey/question/Question"
import { EmptyState } from "./empty-state"

interface CanvasProps {
	className?: string
	questions: { id: string }[]
}

export const Canvas: React.FC<CanvasProps> = ({
	className = "",
	questions = [],
}) => {
	const { addQuestion } = useQuestions()
	const { id: surveyId } = useParams()

	return (
		<div className={`survey-canvas ${className} flex flex-col gap-10`}>
			{questions.length === 0 ? (
				<EmptyState />
			) : (
				questions.map((question: { id: string }) => (
					<BuildQuestion questionId={Number(question.id)} />
				))
			)}
			<Button
				onClick={() => {
					if (!surveyId) return null
					addQuestion({ surveyId: Number(surveyId) })
				}}
				ariaLabel="Add Question"
				icon={PlusCircle}
				className="self-center"
			>
				Ajouter une question
			</Button>
		</div>
	)
}
