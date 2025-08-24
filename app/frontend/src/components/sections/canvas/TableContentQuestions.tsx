import { useScrollToElement } from "@/hooks/useScroll"
import { cn } from "@/lib/utils"
import { useRef } from "react"

type TableContentQuestionsProps = {
	questions: { id: number; title: string }[]
	onQuestionClick?: (id: number) => void
	currentQuestionId: number | null
	highlightedQuestionId: number | null
}

export const TableContentQuestions = ({
	questions,
	onQuestionClick,
	currentQuestionId,
	highlightedQuestionId,
}: TableContentQuestionsProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({})

	useScrollToElement(
		currentQuestionId ?? highlightedQuestionId,
		containerRef,
		buttonRefs,
		undefined
	)

	const activeQuestionId = currentQuestionId ?? highlightedQuestionId

	return (
		<aside
			ref={containerRef}
			className="border-black-50 shadow-default max-h-screen w-full overflow-y-auto rounded-xl border bg-white p-3"
		>
			<div className="relative flex flex-col gap-4 align-baseline">
				{/* Vertical line */}
				<div className="bg-primary-200 absolute inset-y-0 left-3 w-px" />
				{/* Questions with their number in a circle */}
				{questions.map((question, index) => {
					const shouldHighlight = question.id === activeQuestionId

					return (
						<button
							ref={el => {
								buttonRefs.current[question.id] = el
							}}
							key={question.id}
							onClick={() => onQuestionClick?.(question.id)}
							className={`group focus-visible:ring-primary-700 relative flex cursor-pointer items-center gap-2 rounded-md text-left transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
						>
							<span
								className={cn(
									"border-primary-300 text-primary-700 group-hover:bg-primary-100 group-hover:text-primary-800 z-10 flex aspect-square h-6 items-center justify-center rounded-full border bg-white text-xs font-medium transition-colors",
									shouldHighlight &&
										"bg-primary-700 border-primary-700 text-white"
								)}
							>
								{index + 1}
							</span>
							<span className="group-hover:text-primary-700 overflow-hidden text-sm text-ellipsis whitespace-nowrap text-gray-700 transition-colors group-hover:font-medium">
								{question.title}
							</span>
						</button>
					)
				})}
			</div>
		</aside>
	)
}
