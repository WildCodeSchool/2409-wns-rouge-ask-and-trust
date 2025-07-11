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
import { QuestionType, QuestionUpdate, TypesOfQuestion } from "@/types/types"
import { Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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

export default function BuildQuestion({ questionId }: QuestionProps) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
		// watch,
	} = useForm<QuestionUpdate>()
	// 	{
	// 	defaultValues: {
	// 		title: "Titre de la question",
	// 		type: TypesOfQuestion.Text,
	// 		answers: [],
	// 	},
	// }
	const [openButtonDeleteQuestion, setOpenButtonDeleteQuestion] =
		useState(false)

	const { question } = useQuestion(questionId)

	// Allow to manipulate answers as a dynamic array (no state needed)
	const { fields, append, remove } = useFieldArray({
		control,
		name: "answers",
	})
	const { updateQuestion, updateQuestionError, deleteQuestion } =
		useQuestions()

	const onSubmit = (formData: UpdateQuestionInput) => {
		console.log("updateQuestionError", updateQuestionError)
		if (!question?.id) return

		const formattedAnswers = formData.answers?.map(({ value }) => ({
			value,
		}))

		const { title, type } = formData

		updateQuestion({
			id: question.id,
			title: title,
			type: type,
			answers: formattedAnswers,
		})
	}

	// Fill form data with question's data from database
	useEffect(() => {
		if (question) {
			reset({
				title: question.title,
				type: question.type,
				answers: question.answers,
			})
		}
	}, [question, reset])

	const watchedType = useWatch({
		control,
		name: "type",
	})
	const prevTypeRef = useRef<QuestionType>(TypesOfQuestion.Text)

	// After saving question, if type has changed and there is no answer, provide default answers
	useEffect(() => {
		if (!watchedType) return

		const hasTypeChanged =
			prevTypeRef.current && prevTypeRef.current !== watchedType
		const answersAreEmpty = fields.length === 0

		if (hasTypeChanged && answersAreEmpty) {
			const defaults = getDefaultAnswersForType(watchedType)

			for (const defaultAnswer of defaults) {
				append(defaultAnswer)
			}
		}

		prevTypeRef.current = watchedType
	}, [watchedType, append, fields.length])

	const handleClickDelete = (
		questionId: number | undefined,
		surveyId: number | undefined
	) => {
		if (!questionId || !surveyId) return null
		deleteQuestion(questionId, surveyId)
	}

	if (!question) return null

	return (
		<li className="list-none">
			<FormWrapper
				onSubmit={handleSubmit(onSubmit)}
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
						onClick={() => {
							setOpenButtonDeleteQuestion(prev => !prev)
						}}
						icon={Trash2}
					/>
				</div>
				{openButtonDeleteQuestion && (
					// @TODO mettre focus sur delete
					<div className="flex flex-1 gap-3">
						<Button
							type="button"
							variant="destructive"
							fullWidth
							ariaLabel="Supprimer la question"
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
					ariaLabel="Enregistrer la question."
					fullWidth
				>
					Enregistrer
				</Button>
			</FormWrapper>
		</li>
	)
}
