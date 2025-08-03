import { EmptyState } from "@/components/sections/canvas/empty-state"
import { Button } from "@/components/ui/Button"
import { useQuestions } from "@/hooks/useQuestions"
import { useResponsivity } from "@/hooks/useResponsivity"
import { Question, QuestionType } from "@/types/types"
import { PlusCircle } from "lucide-react"
import {
	startTransition,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"
import { useParams } from "react-router-dom"
import MemoizedBuildQuestion from "../surveys/buildSurvey/question/BuildQuestion"
import { TableContentQuestions } from "./TableContentQuestions"

interface CanvasProps {
	newQuestionId: number | null
	setNewQuestionId: (id: number | null) => void
	onAddQuestion: (type: QuestionType | undefined) => Promise<void>
	questions: Question[]
}

export const Canvas: React.FC<CanvasProps> = ({
	onAddQuestion,
	newQuestionId,
	setNewQuestionId,
	questions,
}) => {
	const { isCreateQuestionLoading } = useQuestions()
	const { id: surveyId } = useParams()

	const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
	const { rootRef, isVerticalCompact, isHorizontalCompact } = useResponsivity(
		200,
		768
	)
	const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
		null
	)

	const isCompact = isVerticalCompact || isHorizontalCompact

	// After creating a new question, scroll to the container's bottom to see the question
	useEffect(() => {
		if (newQuestionId && rootRef.current) {
			const container = rootRef.current

			container.scrollTo({
				top: container.scrollHeight,
				behavior: "smooth",
			})

			const el = questionRefs.current[newQuestionId]
			el?.focus?.()

			startTransition(() => {
				setNewQuestionId(null)
			})
		}
	}, [newQuestionId, rootRef, setNewQuestionId])

	// For questions table content : scroll to question on click
	const scrollToQuestion = useCallback((id: number) => {
		const el = questionRefs.current[id]
		if (el) {
			setCurrentQuestionId(id)
			el.scrollIntoView({ behavior: "smooth", block: "center" })
			el.focus?.()
		}
	}, [])

	return (
		<>
			<div
				ref={rootRef}
				className="mx-[-0.75rem] flex h-full w-full flex-col gap-4 overflow-y-auto px-[0.75rem]"
			>
				{!questions || questions?.length === 0 ? (
					<EmptyState />
				) : (
					<>
						{questions.map((question, index) => {
							return (
								<div
									key={question.id}
									ref={el => {
										questionRefs.current[question.id] = el
									}}
								>
									<MemoizedBuildQuestion
										question={question}
										surveyId={Number(surveyId)}
										index={index + 1}
									/>
								</div>
							)
						})}
						<Button
							onClick={() => onAddQuestion("text")}
							disabled={isCreateQuestionLoading}
							ariaLabel="Add Question"
							icon={PlusCircle}
							className="self-center"
						>
							Ajouter une question
						</Button>
					</>
				)}
			</div>
			{!isCompact && questions && questions.length > 0 && (
				<div className="flex max-w-52 flex-col gap-2">
					<div className="flex w-full flex-col items-center gap-2">
						<Button
							ariaLabel="Publier l'enquête"
							variant="primary"
							fullWidth
						>
							Publier l'enquête
						</Button>
						<Button
							ariaLabel="Enregistrer en brouillon"
							variant="outline"
							fullWidth
						>
							Enregistrer
						</Button>
					</div>
					<TableContentQuestions
						questions={questions}
						onQuestionClick={scrollToQuestion}
						currentQuestionId={currentQuestionId}
					/>
				</div>
			)}
		</>
	)
}
