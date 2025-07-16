import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import { BuildListAnswers } from "@/components/sections/surveys/buildSurvey/question/BuildListAnswers"
import QuestionTypeSelect from "@/components/sections/surveys/buildSurvey/question/QuestionTypeSelection"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import {
	UpdateQuestionInput,
	useQuestion,
	useQuestions,
} from "@/hooks/useQuestions"
import { useToast } from "@/hooks/useToast"
import { QuestionType, QuestionUpdate, TypesOfQuestion } from "@/types/types"
import { Trash2 } from "lucide-react"
import { forwardRef, useEffect, useRef, useState } from "react"
import {
	FieldArrayWithId,
	FieldValues,
	useFieldArray,
	UseFieldArrayAppend,
	UseFieldArrayRemove,
	useForm,
	UseFormRegister,
	useWatch,
} from "react-hook-form"

type QuestionProps = {
	questionId: number
}

type RenderAnswerComponentProps = {
	questionType: QuestionType
	register: UseFormRegister<QuestionUpdate>
	errors: FieldValues
	fields: FieldArrayWithId<QuestionUpdate, "answers", "id">[]
	remove: UseFieldArrayRemove
	append: UseFieldArrayAppend<QuestionUpdate, "answers">
}

export function RenderAnswerComponent({
	questionType,
	register,
	errors,
	fields,
	remove,
	append,
}: RenderAnswerComponentProps) {
	// Render the appropriate answer component based on the question type
	switch (questionType) {
		case TypesOfQuestion.Text:
		case TypesOfQuestion.Boolean: // @TODO : render list answer for Boolean Question instead of null
			return null
		case TypesOfQuestion.Multiple_Choice:
		case TypesOfQuestion.Select:
			return (
				<BuildListAnswers
					register={register}
					errors={errors}
					fields={fields}
					remove={remove}
					append={append}
				/>
			)
		default:
			throw new Error(`Unsupported question type: ${questionType}`)
	}
}

const getDefaultAnswersForType = (type: QuestionType) => {
	// Provide default answers based on the question type
	// This is useful when the question type changes and there are no answers yet
	switch (type) {
		case TypesOfQuestion.Boolean:
			return [{ value: "Vrai" }, { value: "Faux" }]
		case TypesOfQuestion.Multiple_Choice:
		case TypesOfQuestion.Select:
			return [{ value: "Réponse 1" }, { value: "Réponse 2" }]
		default:
			return []
	}
}

function BuildQuestion(
	{ questionId }: QuestionProps,
	ref: React.Ref<HTMLLIElement> | null
) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<QuestionUpdate>()
	// Load question data from the API
	const { question, loading, error } = useQuestion(questionId)
	// Load question update and delete functions from the API
	const {
		updateQuestion,
		updateQuestionError,
		deleteQuestion,
		deleteQuestionError,
	} = useQuestions()
	// Show / hide delete question button
	const [openButtonDeleteQuestion, setOpenButtonDeleteQuestion] =
		useState(false)
	// Allow to manipulate answers as a dynamic array (no state needed)
	const { fields, append, remove } = useFieldArray({
		control,
		name: "answers",
	})
	const watchedType = useWatch({
		control,
		name: "type",
	})
	const prevTypeRef = useRef<QuestionType>(TypesOfQuestion.Text)
	const deleteButtonRef = useRef<HTMLButtonElement | null>(null)
	const { showToast } = useToast()

	// Handle toast notifications for loading states and errors
	useEffect(() => {
		if (updateQuestionError || deleteQuestionError || error) {
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré une erreur.",
				description: updateQuestionError
					? "La question n'a pas pu être mise à jour."
					: deleteQuestionError
						? "La question n'a pas pu être supprimée."
						: "Une erreur est survenue pour charger la question.",
			})
		}
	}, [updateQuestionError, deleteQuestionError, error, showToast])

	// Reset the form with the current question data
	// This ensures that the form is populated with the latest question data
	useEffect(() => {
		if (question && !loading && !error) {
			reset({
				title: question.title,
				type: question.type,
				answers: question.answers,
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [question?.id, loading, error, reset])

	// After saving question, if type has changed and there is no answer, provide default answers
	useEffect(() => {
		if (!watchedType || !question) return

		// Check if the type has changed and if there are no answers yet
		const hasTypeChanged =
			prevTypeRef.current && prevTypeRef.current !== watchedType
		const answersAreEmpty = fields.length === 0

		if (hasTypeChanged && answersAreEmpty) {
			// If the form has no answers, append default answers based on the type
			const defaults = getDefaultAnswersForType(watchedType)
			// Append default answers to the form
			for (const defaultAnswer of defaults) {
				append(defaultAnswer)
			}
		}
		// Always update the previous type reference after checking
		prevTypeRef.current = watchedType
	}, [append, fields.length, question, watchedType])

	// Focus the delete button when it is opened
	useEffect(() => {
		if (openButtonDeleteQuestion) {
			deleteButtonRef.current?.focus()
		}
	}, [openButtonDeleteQuestion])

	const handleClickDelete = async (
		questionId: number | undefined,
		surveyId: number | undefined
	) => {
		if (!questionId || !surveyId) return null

		try {
			await deleteQuestion(questionId, surveyId)
			showToast({
				type: "success",
				title: "La question a été supprimée.",
			})
		} catch {
			showToast({
				type: "error",
				title: "La question n'a pas pu être supprimée.",
				description: "Veuillez réessayer plus tard.",
			})
		} finally {
			setOpenButtonDeleteQuestion(false)
		}
	}

	const handleSubmitForm = async (formData: UpdateQuestionInput) => {
		if (!question?.id) return

		// Format answers to match the expected structure in API
		const formattedAnswers = formData.answers?.map(({ value }) => ({
			value,
		}))

		const { title, type } = formData

		try {
			// Call the updateQuestion function with the formatted data
			await updateQuestion({
				id: question.id,
				title: title,
				type: type,
				answers: formattedAnswers,
			})

			// Reset the form with the updated question data
			reset({
				title: formData.title,
				type: formData.type,
				answers:
					// If the question type is Text, empty answers
					type === TypesOfQuestion.Text
						? []
						: (formattedAnswers ?? []),
			})

			showToast({
				type: "success",
				title: "La question a été mise à jour.",
			})
		} catch {
			showToast({
				type: "error",
				title: "La question n'a pas pu être mise à jour.",
				description: "Veuillez réessayer plus tard.",
			})
		}
	}

	if (!question) return null

	return (
		<li className="list-none" ref={ref} tabIndex={-1}>
			<FormWrapper
				onSubmit={handleSubmit(handleSubmitForm)}
				className="md:max-w-[90vh]"
			>
				<div className="flex content-center justify-between">
					<h3 className="flex-1 self-center text-2xl font-bold">
						{question.title ?? "Nouvelle question"}
					</h3>
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
					<div className="flex flex-1 gap-3">
						<Button
							type="button"
							variant="destructive"
							fullWidth
							ariaLabel="Supprimer la question"
							ref={deleteButtonRef}
							onClick={() => {
								handleClickDelete(
									questionId,
									question.survey.id
								)
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
				<div className="flex flex-col gap-1">
					<Label htmlFor="title" required>
						Titre
					</Label>
					<Input
						id="title"
						placeholder="Titre de la question"
						{...register("title", {
							required: "Le titre est requis.",
						})}
						aria-invalid={errors.title ? "true" : "false"}
						errorMessage={errors?.title?.message}
					/>
				</div>
				{watchedType && (
					<>
						<QuestionTypeSelect control={control} errors={errors} />
						<RenderAnswerComponent
							questionType={watchedType}
							register={register}
							errors={errors}
							fields={fields}
							remove={remove}
							append={append}
						/>
					</>
				)}
				<Button
					role="submit"
					type="submit"
					ariaLabel="Enregistrer la question."
					fullWidth
				>
					Enregistrer
				</Button>
			</FormWrapper>
		</li>
	)
}

export default forwardRef<HTMLLIElement, QuestionProps>(BuildQuestion)
