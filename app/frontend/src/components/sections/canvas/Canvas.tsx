import { EmptyState } from "@/components/sections/canvas/empty-state"
import { Button } from "@/components/ui/Button"
import { ButtonsScrollControl } from "@/components/ui/ButtonsScrollControl"
import { useQuestions } from "@/hooks/useQuestions"
import { useToast } from "@/hooks/useToast"
import { PlusCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import BuildQuestion from "../surveys/buildSurvey/question/BuildQuestion"

interface CanvasProps {
	className?: string
	questions: { id: number }[]
	newQuestionId: number | null
	setNewQuestionId: (id: number | null) => void
}

export const Canvas: React.FC<CanvasProps> = ({
	className = "",
	questions = [],
	newQuestionId,
	setNewQuestionId,
}) => {
	const {
		addQuestion,
		isCreateQuestionLoading,
		createQuestionError,
		resetCreateQuestionError,
	} = useQuestions()
	const { id: surveyId } = useParams()
	const scrollContainerRef = useRef<HTMLDivElement | null>(null)
	const [newQuestionElement, setNewQuestionElement] =
		useState<HTMLDivElement | null>(null)
	const { showToast } = useToast()

	// @TODO fix this : should scroll in canvas and not in window
	useEffect(() => {
		if (newQuestionElement) {
			newQuestionElement.scrollIntoView({
				behavior: "smooth",
				block: "center",
			})

			newQuestionElement.focus() // Focus only if new question exists

			setNewQuestionId(null)
			setNewQuestionElement(null)
		}
	}, [newQuestionElement, newQuestionId, setNewQuestionId])

	useEffect(() => {
		if (createQuestionError) {
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré une erreur.",
				description: "Veuillez réessayer plus tard.",
			})
			resetCreateQuestionError()
		}
	}, [createQuestionError, resetCreateQuestionError, showToast])

	const handleAddQuestion = async () => {
		if (!surveyId) return
		const result = await addQuestion({ surveyId: Number(surveyId) })
		if (result?.id) {
			showToast({ type: "success", title: "Question ajoutée !" })
			setNewQuestionId(result.id)
		}
	}

	return (
		<>
			<div
				ref={scrollContainerRef}
				className={`survey-canvas ${className} flex max-h-[calc(100vh-160px)] flex-col gap-10 overflow-y-scroll px-3`}
			>
				{questions.length === 0 ? (
					<EmptyState />
				) : (
					questions.map(question => {
						const isNew = newQuestionId === question.id
						return (
							<div
								key={question.id}
								ref={
									isNew
										? el => setNewQuestionElement(el)
										: null
								}
							>
								<BuildQuestion questionId={question.id} />

								{/* <Suspense fallback={<div>Chargement...</div>}>
									<BuildQuestionLoader
										questionId={question.id}
									/>
								</Suspense> */}
							</div>
						)
					})
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

			<ButtonsScrollControl scrollContainerRef={scrollContainerRef} />
		</>
	)
}
