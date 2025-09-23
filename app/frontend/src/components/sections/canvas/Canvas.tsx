import { EmptyState } from "@/components/sections/canvas/empty-state"
import { Button } from "@/components/ui/Button"
import { useScreenDetector } from "@/hooks/useScreenDetector"
import { useScrollToElement } from "@/hooks/useScroll"
import { cn } from "@/lib/utils"
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
	isCreateQuestionLoading: boolean
}

export const Canvas: React.FC<CanvasProps> = ({
	onAddQuestion,
	questions,
	focusedQuestionId,
	setFocusedQuestionId,
	isCreateQuestionLoading,
}) => {
	const { id: surveyId } = useParams()
	const canvasRef = useRef<HTMLDivElement>(null)
	const questionRefs = useRef<{ [key: number]: HTMLLIElement | null }>({})
	const { isMobile } = useScreenDetector()
	const [highlightedQuestionId, setHighlightedQuestionId] = useState<
		number | null
	>(questions[0]?.id ?? null)

	const resetScrollId = undefined

	useScrollToElement(
		focusedQuestionId,
		canvasRef,
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

	const showAsideComponents = !isMobile && questions && questions.length > 0
	const isNotQuestions = !questions || questions?.length === 0

	return (
		<>
			<div
				ref={canvasRef}
				className="relative flex h-full w-full flex-col gap-4 overflow-y-auto px-4 pt-2 pb-0 md:mx-[-0.75rem] md:px-[0.75rem]"
			>
				{isNotQuestions ? (
					<>
						<EmptyState />
						<ButtonAddQuestion
							onAddQuestion={onAddQuestion}
							loadingSpinner={isCreateQuestionLoading}
							isMobile={isMobile}
						/>
					</>
				) : (
					<>
						{questions.map((question, index) => {
							return (
								<li
									className="focus-visible:border-primary-600 w-full list-none rounded-xl focus-visible:ring-2 focus-visible:outline-none"
									tabIndex={0}
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
								</li>
							)
						})}
						<ButtonAddQuestion
							onAddQuestion={onAddQuestion}
							loadingSpinner={isCreateQuestionLoading}
							isMobile={isMobile}
						/>
					</>
				)}
			</div>
			{showAsideComponents && (
				<TableContentQuestions
					questions={questions}
					onQuestionClick={scrollToQuestion}
					currentQuestionId={focusedQuestionId}
					highlightedQuestionId={highlightedQuestionId}
				/>
			)}
		</>
	)
}

const ButtonAddQuestion = ({
	onAddQuestion,
	loadingSpinner,
	isMobile,
}: {
	onAddQuestion: (type: QuestionType | undefined) => Promise<void>
	loadingSpinner: boolean
	isMobile: boolean
}) => {
	return (
		<Button
			onClick={() => onAddQuestion("text")}
			disabled={loadingSpinner}
			ariaLabel="Add Question"
			icon={PlusCircle}
			loadingSpinner={loadingSpinner}
			className={cn(
				"self-center",
				isMobile && `sticky right-2 bottom-2 left-2 z-10 px-2 shadow-lg`
			)}
		>
			{!isMobile && "Ajouter une question"}
		</Button>
	)
}
