import { EmptyState } from "@/components/sections/canvas/empty-state"
import { Button } from "@/components/ui/Button"
import { useQuestions } from "@/hooks/useQuestions"
import { useResponsivity } from "@/hooks/useResponsivity"
import { useScrollToElement } from "@/hooks/useScroll"
import { Question, QuestionType } from "@/types/types"
import { PlusCircle } from "lucide-react"
import { useRef, useState } from "react"
import { useParams } from "react-router-dom"
import MemoizedBuildQuestion from "../surveys/buildSurvey/question/BuildQuestion"
import { TableContentQuestions } from "./TableContentQuestions"

interface CanvasProps {
	onAddQuestion: (type: QuestionType | undefined) => Promise<void>
	questions: Question[]
	focusedQuestionId: number | null
	setFocusedQuestionId: (id: number | null) => void
}

export const Canvas: React.FC<CanvasProps> = ({
	onAddQuestion,
	questions,
	focusedQuestionId,
	setFocusedQuestionId,
}) => {
	const { isCreateQuestionLoading } = useQuestions()
	const { id: surveyId } = useParams()
	const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
	const { rootRef, isVerticalCompact, isHorizontalCompact } = useResponsivity(
		200,
		768
	)
	const [highlightedQuestionId, setHighlightedQuestionId] = useState<
		number | null
	>(questions[0]?.id ?? null)
	const isCompact = isVerticalCompact || isHorizontalCompact

	const resetScrollId = undefined

	useScrollToElement(
		focusedQuestionId,
		rootRef,
		questionRefs,
		resetScrollId,
		focusedQuestionId !== null
	)

	// For questions table content
	const scrollToQuestion = (id: number) => {
		setFocusedQuestionId(id) // focus the clicked question
		setHighlightedQuestionId(null)
		// Focus the question in the canvas
		const el = questionRefs.current[id]
		if (el) {
			el.focus()
		}
	}

	return (
		<>
			<div
				ref={rootRef}
				className="relative mx-[-0.75rem] flex h-full w-full flex-col gap-4 overflow-y-auto px-[0.75rem]"
			>
				{!questions || questions?.length === 0 ? (
					<EmptyState />
				) : (
					<>
						{questions.map((question, index) => {
							return (
								// @TODO maybe div in MemliozedBuildQuestion
								<div
									tabIndex={-1}
									key={question.id}
									ref={el => {
										questionRefs.current[question.id] = el
									}}
								>
									<MemoizedBuildQuestion
										question={question}
										surveyId={Number(surveyId)}
										index={index + 1}
										onClick={() => {
											setHighlightedQuestionId(
												question.id
											)
											setFocusedQuestionId(null)
										}}
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
						{/* @TODO add real logic to publish survey */}
						<Button
							ariaLabel="Publier l'enquête"
							variant="primary"
							fullWidth
						>
							Publier l'enquête
						</Button>
						{/* @TODO add real logic */}
						<Button
							ariaLabel="Enregistrer en brouillon"
							variant="outline"
							fullWidth
						>
							Garder en brouillon
						</Button>
					</div>
					<TableContentQuestions
						questions={questions}
						onQuestionClick={scrollToQuestion}
						currentQuestionId={focusedQuestionId}
						highlightedQuestionId={highlightedQuestionId}
					/>
				</div>
			)}
		</>
	)
}
