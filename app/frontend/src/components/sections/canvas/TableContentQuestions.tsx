type TableContentQuestionsProps = {
	questions: { id: number; title: string }[]
	onQuestionClick?: (id: number) => void
	currentQuestionId?: number | null
}

export const TableContentQuestions = ({
	questions,
	onQuestionClick,
	currentQuestionId,
}: TableContentQuestionsProps) => {
	return (
		<aside className="border-black-50 max-h-screen w-[32rem] overflow-y-auto rounded-xl border bg-white p-3 shadow-md">
			<div className="relative flex flex-col gap-4 align-baseline">
				{/* Vertical line */}
				<div className="bg-primary-200 absolute inset-y-0 left-3 w-px" />
				{/* Questions with their number in a circle */}
				{questions.map((question, index) => {
					const isCurrent = question.id === currentQuestionId
					const shouldHighlight =
						isCurrent || (!currentQuestionId && index === 0)

					return (
						<button
							key={question.id}
							onClick={() => onQuestionClick?.(question.id)}
							className="group focus-visible:ring-primary-700 relative flex cursor-pointer items-center gap-2 rounded-md text-left transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
						>
							<span
								className={`z-10 flex aspect-square h-6 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
									shouldHighlight
										? "bg-primary-700 border-primary-700 text-white" // cercle plein bleu, texte blanc
										: "border-primary-300 text-primary-700 group-hover:bg-primary-100 group-hover:text-primary-800 bg-white"
								} `}
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
