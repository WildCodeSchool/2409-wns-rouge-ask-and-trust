import { Button } from "@/components/ui/Button"
import { useQuestions } from "@/hooks/useQuestions"
import { useToast } from "@/hooks/useToast"
import { useToastOnChange } from "@/hooks/useToastOnChange"
import { Question } from "@/types/types"
import { Trash2 } from "lucide-react"
import { useState } from "react"

/**
 * Minimal question data required by the question header.
 * Includes the question ID, title, type, its index in the list, and the parent survey ID.
 */
type QuestionHeaderData = Pick<Question, "id" | "title" | "type"> & {
	index: number
	surveyId: number
}

/**
 * Props for the BuildQuestionHeader component.
 */
type BuildQuestionHeaderProps = {
	/** The question data used to display and manage the header */
	question: QuestionHeaderData
}

/**
 * Displays the header section for a question within a survey builder.
 * Includes the question index, title, and a toggleable delete button.
 *
 * @param {BuildQuestionHeaderProps} props - Component props
 * @returns {JSX.Element} The rendered question header
 */

export const BuildQuestionHeader = ({ question }: BuildQuestionHeaderProps) => {
	const { showToast } = useToast()
	// Show / hide delete question button
	const [openButtonDeleteQuestion, setOpenButtonDeleteQuestion] =
		useState(false)
	const {
		deleteQuestion,
		isDeleteQuestionLoading,
		deleteQuestionError,
		resetDeleteQuestionError,
	} = useQuestions()

	useToastOnChange({
		trigger: deleteQuestionError,
		resetTrigger: resetDeleteQuestionError,
		type: "error",
		title: "Failed to delete question",
		description: "La question n'a pas pu être supprimée",
	})

	const handleClickDelete = async (
		questionId: number | undefined,
		surveyId: number | undefined
	) => {
		if (!questionId || !surveyId) return null

		try {
			await deleteQuestion(questionId, surveyId)
			showToast({
				type: "success",
				title: "La question a été supprimée",
			})
		} catch {
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré une erreur",
				description: "La question n'a pas pu être supprimée",
			})
		} finally {
			setOpenButtonDeleteQuestion(false)
		}
	}

	return (
		<div>
			<div className="flex items-center justify-between">
				<div className="flex h-fit items-center justify-start gap-2">
					<span
						className={
							"bg-primary-700 border-primary-700 z-10 flex aspect-square h-6 items-center justify-center rounded-full border text-xs font-medium text-white transition-colors"
						}
					>
						{question.index}
					</span>
					<h3 className="my-0 flex-1 self-center py-0 text-lg leading-none font-bold">
						{question.title ?? "Nouvelle question"}
					</h3>
				</div>
				<Button
					variant="ghost_destructive"
					size="square_sm"
					ariaLabel="Supprimer cette option"
					type="button"
					onClick={() => {
						setOpenButtonDeleteQuestion(prev => !prev)
					}}
					icon={Trash2}
				/>
			</div>
			{openButtonDeleteQuestion && (
				<div className="flex flex-1 flex-col gap-3 md:flex-row">
					<Button
						type="button"
						variant="destructive"
						fullWidth
						ariaLabel="Supprimer la question"
						autoFocus={openButtonDeleteQuestion}
						disabled={isDeleteQuestionLoading}
						loadingSpinner={isDeleteQuestionLoading}
						onClick={() => {
							handleClickDelete(question.id, question.surveyId)
						}}
						icon={Trash2}
					>
						Supprimer la question
					</Button>
					<Button
						type="button"
						variant="outline"
						fullWidth
						ariaLabel="Annuler la suppression de la question"
						onClick={() => {
							setOpenButtonDeleteQuestion(false)
						}}
					>
						Annuler
					</Button>
				</div>
			)}
		</div>
	)
}
