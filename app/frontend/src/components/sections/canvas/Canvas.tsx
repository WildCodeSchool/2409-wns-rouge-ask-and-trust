import { EmptyState } from "@/components/sections/canvas/empty-state"
import { Button } from "@/components/ui/Button"
import { GET_SURVEY } from "@/graphql/survey/survey"
import { useQuestions } from "@/hooks/useQuestions"
import { useResponsivity } from "@/hooks/useResponsivity"
import { QuestionType, Survey } from "@/types/types"
import { useQuery } from "@apollo/client"
import { PlusCircle } from "lucide-react"
import {
	startTransition,
	useCallback,
	useEffect,
	useMemo,
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
}

export const Canvas: React.FC<CanvasProps> = ({
	onAddQuestion,
	newQuestionId,
	setNewQuestionId,
}) => {
	const { isCreateQuestionLoading } = useQuestions()
	const { id: surveyId } = useParams() //
	const { data, loading: loadingSurvey } = useQuery<{
		survey: Survey
	}>(GET_SURVEY, {
		variables: {
			surveyId,
		},
		fetchPolicy: "cache-first",
	})

	const questions = useMemo(() => {
		return data?.survey?.questions ?? []
	}, [data?.survey?.questions])

	console.log("Canvas render", newQuestionId, performance.now())

	const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})
	const { rootRef, isVerticalCompact, isHorizontalCompact } = useResponsivity(
		200,
		768
	)
	const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
		null
	)

	const isCompact = isVerticalCompact || isHorizontalCompact

	useEffect(() => {
		if (newQuestionId && questionRefs.current[newQuestionId]) {
			const el = questionRefs.current[newQuestionId]
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "center" })
				el.focus?.()

				startTransition(() => {
					setNewQuestionId(null)
				})
			}
		}
	}, [newQuestionId, setNewQuestionId])

	// For questions table content : scroll to question on click
	const scrollToQuestion = useCallback((id: number) => {
		const el = questionRefs.current[id]
		if (el) {
			setCurrentQuestionId(id)
			el.scrollIntoView({ behavior: "smooth", block: "center" })
			el.focus?.()
		}
	}, [])

	// do better than this
	if (!surveyId) return <p>L'id de l'enquête est manquante dans l'url</p>

	return (
		<>
			<div
				ref={rootRef}
				className="mx-[-0.75rem] flex h-screen w-full flex-col gap-10 overflow-y-scroll px-[0.75rem]"
			>
				{!questions || questions?.length === 0 ? (
					<EmptyState />
				) : (
					questions.map((question, index) => {
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
					})
				)}

				<Button
					onClick={() => onAddQuestion("text")}
					disabled={isCreateQuestionLoading}
					ariaLabel="Add Question"
					icon={PlusCircle}
					className="self-center"
				>
					Ajouter une question
				</Button>
			</div>
			{!isCompact && questions && questions.length > 0 && (
				<TableContentQuestions
					questions={questions}
					onQuestionClick={scrollToQuestion}
					currentQuestionId={currentQuestionId}
				/>
			)}
		</>
	)
}
