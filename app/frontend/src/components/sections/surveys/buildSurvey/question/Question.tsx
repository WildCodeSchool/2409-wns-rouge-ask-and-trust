import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { GET_QUESTION } from "@/graphql/question"
import { UpdateQuestionInput, useQuestions } from "@/hooks/useQuestions"
import { QuestionType, QuestionUpdate, TypesOfQuestion } from "@/types/types"
import { useQuery } from "@apollo/client"
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
} from "react-hook-form"
import { BuildSelect } from "./BuildSelect"
import QuestionTypeSelect from "./QuestionTypeSelection"

type QuestionProps = {
	questionId: number
}

const renderAnswerComponent = (
	questionType: QuestionType,
	register: UseFormRegister<QuestionUpdate>,
	errors: FieldValues,
	fields: FieldArrayWithId<QuestionUpdate, "answers", "id">[],
	remove: UseFieldArrayRemove,
	append: UseFieldArrayAppend<QuestionUpdate, "answers">
) => {
	switch (questionType) {
		case TypesOfQuestion.Text:
			break
		case TypesOfQuestion.Multiple_Choice:
			// return (
			// component checkbox
			// )
			break
		case TypesOfQuestion.Boolean:
			// return (
			// component switch
			break
		case TypesOfQuestion.Select:
			return (
				<BuildSelect
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
		watch,
	} = useForm<QuestionUpdate>({
		defaultValues: {
			title: "Titre de la question",
			type: TypesOfQuestion.Text,
			answers: [],
		},
	})
	const [openButtonDeleteQuestion, setOpenButtonDeleteQuestion] =
		useState(false)

	// @TODO add error handling
	const { data } = useQuery<{ question: QuestionUpdate }>(GET_QUESTION, {
		variables: { questionId },
	})
	// Allow to manipulate answers as a dynamic array (no state needed)
	const { fields, append, remove } = useFieldArray({
		control,
		name: "answers",
	})
	const { updateQuestion, deleteQuestion } = useQuestions()

	const onSubmit = (formData: UpdateQuestionInput) => {
		if (!data?.question.id) return
		// @TODO add logic to handle update question

		const formattedAnswers = formData.answers?.map(({ value }) => ({
			value,
		}))

		const { title, type } = formData

		updateQuestion({
			id: data.question.id,
			title: title,
			type: type,
			answers: formattedAnswers,
			// surveyId: surveyId,
		})
	}

	// Fill form data with question's data from database
	useEffect(() => {
		if (data?.question) {
			reset({
				title: data.question.title,
				type: data.question.type,
				answers: data.question.answers,
			})
		}
	}, [data, reset])

	const watchedType = watch("type")
	const prevTypeRef = useRef<QuestionType>(TypesOfQuestion.Text)

	useEffect(() => {
		if (!watchedType) return

		const hasTypeChanged =
			prevTypeRef.current && prevTypeRef.current !== watchedType
		const answersAreEmpty = fields.length === 0

		if (hasTypeChanged && answersAreEmpty) {
			const defaults = getDefaultAnswersForType(watchedType)
			defaults.forEach(answer => append(answer))
		}

		prevTypeRef.current = watchedType
	}, [watchedType, append, fields.length])

	const handleClickDelete = (
		questionId: number | undefined,
		surveyId: number | undefined
	) => {
		console.log("questionId", questionId, "surveyId", surveyId)
		if (!questionId || !surveyId) return null
		deleteQuestion(questionId, surveyId)
	}

	if (!data) return null

	return (
		<li className="list-none">
			<FormWrapper
				onSubmit={handleSubmit(onSubmit)}
				className="md:max-w-[90vh]"
			>
				<div className="flex content-center justify-between">
					<h3 className="flex-1 self-center text-2xl font-bold">
						{data?.question.title ?? "Nouvelle question"}
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
					// mettre focus sur delete
					<div className="flex flex-1 gap-3">
						<Button
							type="button"
							variant="destructive"
							fullWidth
							ariaLabel="Supprimer la question"
							onClick={() => {
								handleClickDelete(
									questionId,
									data?.question.survey.id
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
				<QuestionTypeSelect control={control} errors={errors} />
				{watchedType &&
					renderAnswerComponent(
						watchedType,
						register,
						errors,
						fields,
						remove,
						append
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
