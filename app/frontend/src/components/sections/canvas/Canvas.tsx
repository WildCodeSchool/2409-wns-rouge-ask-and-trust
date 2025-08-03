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

	// Handle scroll to the new question (after adding a new one) or current question (if click in Table of Content)
	const scrollTargetId = newQuestionId ?? currentQuestionId
	const resetScrollId = newQuestionId ? setNewQuestionId : undefined

	useScrollToElement(scrollTargetId, rootRef, questionRefs, resetScrollId)

	// For questions table content
	const scrollToQuestion = (id: number) => {
		setCurrentQuestionId(id)
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
