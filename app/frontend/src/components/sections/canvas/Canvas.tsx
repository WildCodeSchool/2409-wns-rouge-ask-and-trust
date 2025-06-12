import { Button } from "@/components/ui/Button"
import { GET_SURVEY } from "@/graphql/survey"
import { useQuestions } from "@/hooks/useQuestions"
import { Survey } from "@/types/types"
import { useQuery } from "@apollo/client"
import { PlusCircle } from "lucide-react"
import Question from "../surveys/buildSurvey/question/Question"

interface Question {
	id: string
	type: string
}

interface CanvasProps {
	className?: string
	questions: string[]
	// onAddQuestion: (type: string) => void
}

export const Canvas: React.FC<CanvasProps> = ({
	className = "",
	questions = [],
	// onAddQuestion,
}) => {
	// const handleAddQuestion = () => {
	// 	// Default to single-line when using the button
	// 	onAddQuestion("single-line")
	// }
	const { addQuestion } = useQuestions()

	console.log("questions", questions)

	const { data } = useQuery<{ survey: Survey }>(GET_SURVEY, {
		variables: { surveyId: "1" }, // @TODO add dynamic data
	})

	// console.log("dataSurvey", data)
	return (
		<div className={`survey-canvas ${className} flex flex-col gap-10`}>
			{/* <div className="bg-primary-100 rounded-lg p-8">
				{questions.length === 0 ? (
					// Afficher l'état vide s'il n'y a pas de questions
					<EmptyState onAddQuestion={handleAddQuestion} />
				) : (
					// Afficher les questions s'il y en a
					<div>
						{/* Add logic to render questions - @ArthurVS05*/}
			{data?.survey.questions.map(question => (
				<Question questionId={question.id} />
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
