import { Button } from "@/components/ui/Button"
import { useQuestions } from "@/hooks/useQuestions"
import { PlusCircle } from "lucide-react"
import BuildQuestion from "../surveys/buildSurvey/question/Question"
import { EmptyState } from "./empty-state"

interface CanvasProps {
	className?: string
	questions: string[]
}

export const Canvas: React.FC<CanvasProps> = ({
	className = "",
	questions = [],
}) => {
	const { addQuestion } = useQuestions()

	return (
		<div className={`survey-canvas ${className} flex flex-col gap-10`}>
			{questions.length === 0 ? (
				<EmptyState />
			) : (
				questions.map(question => (
					<BuildQuestion questionId={Number(question)} />
				))
			)}
			<Button
				onClick={() => addQuestion({ surveyId: 1 })}
				ariaLabel="Add Question"
				icon={PlusCircle}
				className="self-center"
			>
				Ajouter une question
			</Button>
		</div>
	)
}
