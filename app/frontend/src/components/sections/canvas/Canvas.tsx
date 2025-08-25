import { EmptyState } from "@/components/sections/canvas/empty-state"
import { Button } from "@/components/ui/Button"
import { useQuestions } from "@/hooks/useQuestions"
import { useResponsivity } from "@/hooks/useResponsivity"
import { useToast } from "@/hooks/useToast"
import { PlusCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import BuildQuestion from "../surveys/buildSurvey/question/BuildQuestion"
import { TableContentQuestions } from "./TableContentQuestions"

interface CanvasProps {
	questions: { id: number; title: string }[]
	newQuestionId: number | null
	setNewQuestionId: (id: number | null) => void
}

export const Canvas: React.FC<CanvasProps> = ({
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
	const [newQuestionElement, setNewQuestionElement] =
		useState<HTMLDivElement | null>(null)
	const { showToast } = useToast()
	const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
	const { rootRef, isVerticalCompact, isHorizontalCompact } = useResponsivity(
		200,
		768
	)
	const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
		null
	)

	const isCompact = isVerticalCompact || isHorizontalCompact

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

	// For questions table content : scroll to question on click
	const scrollToQuestion = (id: number) => {
		const el = questionRefs.current[id]
		if (el) {
			setCurrentQuestionId(id)
			el.scrollIntoView({ behavior: "smooth", block: "center" })
			el.focus?.()
		}
	}

	return (
		<>
			<div
				ref={rootRef}
				className="mx-[-0.75rem] flex h-screen w-full flex-col gap-10 overflow-y-scroll px-[0.75rem]"
			>
				{questions.length === 0 ? (
					<EmptyState />
				) : (
					questions.map((question, index) => {
						const isNew = newQuestionId === question.id
						return (
							<div
								key={question.id}
								ref={el => {
									questionRefs.current[question.id] = el
									if (isNew) setNewQuestionElement(el)
								}}
							>
								<BuildQuestion
									questionId={question.id}
									index={index + 1}
								/>
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
			{!isCompact && (
				<TableContentQuestions
					questions={questions}
					onQuestionClick={scrollToQuestion}
					currentQuestionId={currentQuestionId}
				/>
			)}
		</>
	)
}
