import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { QuestionUpdate } from "@/types/types"
import { useForm } from "react-hook-form"
import QuestionTypeSelect from "./QuestionTypeSelect"
import TypeSelect from "./TypeSelect"
import TypeSwitch from "./TypeSwitch"
import TypeText from "./TypeText"

type QuestionProps = {
	questionId: string
	type: "boolean" | "text" | "checkbox" | "radio" | "text-area"
}

export default function Question({ questionId, type }: QuestionProps) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<QuestionUpdate>({
		defaultValues: {
			title: "Question's title",
			type: type ?? "text",
			description: "",
			answers: { [questionId]: type === "boolean" ? false : "" }, // if boolean type, Question doesn't have a list of possible answers.
		},
	})
	// useQuery() to get Question info (receive question id in props).
	// useMutation() to update Question.

	const onSubmit = (data: QuestionUpdate) => {
		const isBooleanQuestion = data.type === "boolean"

		if (isBooleanQuestion && data.answers.questionId === undefined) {
			data.answers.questionId = false
		}
		console.log("Form data", data)
		// Update / refetch logic here
		// give survey id
		// and data
	}

	// add conditional return : if type type "boolean" return switch, etc.

	// @TODO add real type
	// switch (type) {
	// 	case :

	// 		break;

	// 	default:
	// 		break;
	// }

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
				{/* INPUT DESCRIPTION ********************************************** */}
				<div className="flex flex-col gap-1">
					<Label htmlFor="description">Description</Label>
					<textarea
						{...register("description")}
						placeholder="Ajouter une description..."
						className="border-black-100 file:text-black-default placeholder:border-black-400 focus-visible:border-focus flex h-10 w-full rounded-lg border bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
					/>
				</div>
				<QuestionTypeSelect control={control} errors={errors} />
				{/* Depending on Question Type, return one of this components >> */}
				<TypeSwitch
					label="Êtes-vous d'accord ?"
					control={control}
					name={`answers.questionId`} // put true questionId
				/>
				<TypeText register={register} errors={errors} />
				<TypeSelect
					control={control}
					options={[
						{ value: "1", label: "Toto" },
						{ value: "2", label: "Patate" },
						{ value: "3", label: "Cailloux" },
					]}
					name={`answers.questionId2`} // put true questionId
				/>
				<Button
					type="submit"
					ariaLabel="Enregistrer la question et ses réponses possibles."
					fullWidth
				>
					Enregistrer
				</Button>
			</FormWrapper>
			{/* Add a delete button*/}
		</li>
	)
}
