import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { GET_QUESTION } from "@/graphql/question"
import { QuestionType, QuestionUpdate, TypesOfQuestion } from "@/types/types"
import { useQuery } from "@apollo/client"
import { useEffect } from "react"
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
	questionId: string
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
			// return (
			// // input text
			// )
			break
		case TypesOfQuestion.Multiple_Choice:
		case TypesOfQuestion.Boolean:
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

export default function Question({ questionId }: QuestionProps) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<QuestionUpdate>({
		defaultValues: {
			title: "Titre de la question",
			type: TypesOfQuestion.Text,
			answers: [],
		},
	})

	const { data } = useQuery<{ question: QuestionUpdate }>(GET_QUESTION, {
		variables: { questionId },
	})

	// Allow to manipulate answers as a dynamic array (no state needed)
	const { fields, append, remove } = useFieldArray({
		control,
		name: "answers",
	})

	const onSubmit = (data: QuestionUpdate) => {
		// @TODO add logic to handle update question
		console.log("Form data", data)
	}

	useEffect(() => {
		if (data?.question) {
			reset({
				title: data.question.title,
				type: data.question.type,
				answers: data.question.answers,
			})
		}
	}, [data, reset])

	return (
		<li>
			<FormWrapper onSubmit={handleSubmit(onSubmit)}>
				{/*INPUT TITLE ********************************************** */}
				<div className="flex flex-col gap-1">
					<Label htmlFor="title" required>
						{/* @TODO add dynamic data */}
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
				{data?.question.type &&
					renderAnswerComponent(
						data.question.type,
						register,
						errors,
						fields,
						remove,
						append
					)}
				<Button
					type="submit"
					ariaLabel="Enregistrer la question."
					fullWidth
				>
					Enregistrer
				</Button>
			</FormWrapper>
			{/* Add a delete button*/}
		</li>
	)
}
