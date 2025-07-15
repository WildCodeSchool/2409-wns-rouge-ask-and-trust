import { EmptyState } from "@/components/sections/canvas/empty-state"
import BuildQuestion from "@/components/sections/surveys/buildSurvey/question/BuildQuestion"
import { Button } from "@/components/ui/Button"
import { useQuestions } from "@/hooks/useQuestions"
import { PlusCircle } from "lucide-react"
import { useLayoutEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface CanvasProps {
	className?: string
	questions: { id: number }[]
}

export const Canvas: React.FC<CanvasProps> = ({
	className = "",
	questions = [],
}) => {
	const { addQuestion, isCreateQuestionLoading } = useQuestions()
	const { id: surveyId } = useParams()
	const [newQuestionId, setNewQuestionId] = useState<number | null>(null)
	const [newQuestionElement, setNewQuestionElement] =
		useState<HTMLLIElement | null>(null)

	// Scroll to the new question after creation and focus on it
	useLayoutEffect(() => {
		if (newQuestionId != null && newQuestionElement) {
			newQuestionElement.scrollIntoView({
				behavior: "smooth",
				block: "center",
			})
			newQuestionElement.focus()
			setNewQuestionId(null)
			setNewQuestionElement(null)
		}
	}, [newQuestionId, newQuestionElement])

	return (
		<div className={`survey-canvas ${className} flex flex-col gap-10`}>
			{questions.length === 0 ? (
				<EmptyState />
			) : (
				questions.map((question: { id: number }) => {
					console.log("meme ids ?", newQuestionId === question.id)

					return (
						<BuildQuestion
							key={question.id}
							questionId={Number(question.id)}
							// Pass the ref to the BuildQuestion component
							ref={
								newQuestionId === question.id
									? el => setNewQuestionElement(el)
									: null
							}
						/>
					)
				})
			)}
			<Button
				onClick={async () => {
					if (!surveyId) return
					const result = await addQuestion({
						surveyId: Number(surveyId),
					})
					if (result?.id) {
						setNewQuestionId(result.id)
					}
				}}
				disabled={isCreateQuestionLoading}
				ariaLabel="Add Question"
				icon={PlusCircle}
				className="self-center"
			>
				Ajouter une question
			</Button>
		</div>
	)
}
