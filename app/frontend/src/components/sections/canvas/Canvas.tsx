import { Button } from "@/components/ui/Button"
import { GET_SURVEY } from "@/graphql/survey"
import { useQuestions } from "@/hooks/useQuestions"
import { Survey } from "@/types/types"
import { useQuery } from "@apollo/client"
import { PlusCircle } from "lucide-react"
import BuildQuestion from "../surveys/buildSurvey/question/Question"

interface CanvasProps {
	className?: string
	questions: string[]
}

export const Canvas: React.FC<CanvasProps> = ({
	className = "",
	questions = [],
}) => {
	const { addQuestion } = useQuestions()

	console.log("questions", questions)

	const { data } = useQuery<{ survey: Survey }>(GET_SURVEY, {
		variables: { surveyId: "1" }, // @TODO add dynamic data
	})
	return (
		<div className={`survey-canvas ${className} flex flex-col gap-10`}>
			{/* 
				{questions.length === 0 ? (
					// Afficher l'état vide s'il n'y a pas de questions
					<EmptyState onAddQuestion={handleAddQuestion} />
				) : (
				/* Add logic to render questions - @ArthurVS05*/}
			{data?.survey.questions.map(question => (
				<BuildQuestion questionId={question.id} />
			))}
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
