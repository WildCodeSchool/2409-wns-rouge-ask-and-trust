import { EmptyState } from "@/components/sections/canvas/empty-state"
import BuildQuestion from "@/components/sections/surveys/buildSurvey/question/BuildQuestion"
import { Button } from "@/components/ui/Button"
import { useQuestions } from "@/hooks/useQuestions"
import { useToast } from "@/hooks/useToast"
import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface CanvasProps {
	className?: string
	questions: { id: number }[]
}

export const Canvas: React.FC<CanvasProps> = ({
	className = "",
	questions = [],
}) => {
	const { addQuestion, isCreateQuestionLoading, createQuestionError } =
		useQuestions()
	const { id: surveyId } = useParams()
	const [newQuestionId, setNewQuestionId] = useState<number | null>(null)
	const [newQuestionElement, setNewQuestionElement] =
		useState<HTMLLIElement | null>(null)
	const { showToast } = useToast()

	// Scroll to the new question after creation and focus on it
	useEffect(() => {
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

	// Show a toast notification if there is an error
	useEffect(() => {
		if (createQuestionError) {
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré une erreur.",
				description: "Veuillez réessayer plus tard.",
			})
		}
	}, [createQuestionError, showToast])

	const handleAddQuestion = async () => {
		if (!surveyId) return
		try {
			const result = await addQuestion({
				surveyId: Number(surveyId),
			})
			if (result?.id) {
				showToast({
					type: "success",
					title: "Question ajoutée !",
				})
				setNewQuestionId(result.id)
			}
		} catch {
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré une erreur.",
				description: "Veuillez réessayer plus tard.",
			})
		}
	}

	return (
		<div className={`survey-canvas ${className} flex flex-col gap-10`}>
			{questions.length === 0 ? (
				<EmptyState />
			) : (
				questions.map((question: { id: number }) => (
					<BuildQuestion
						key={question.id}
						questionId={Number(question.id)}
						ref={
							// Set the ref only for the new question
							// Enable to scroll to it
							newQuestionId === question.id
								? el => setNewQuestionElement(el)
								: null
						}
					/>
				))
			)}
			<Button
				onClick={handleAddQuestion}
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
