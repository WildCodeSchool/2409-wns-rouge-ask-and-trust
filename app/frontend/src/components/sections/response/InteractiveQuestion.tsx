import {
	Question,
	TypesOfQuestion,
	SurveyResponseFormData,
} from "@/types/types"
import { Label } from "@/components/ui/Label"
import { UseFormRegister, Control } from "react-hook-form"
import { TextInput } from "@/components/sections/response/ui/TextInput"
import { SelectInput } from "@/components/sections/response/ui/SelectInput"
import { BooleanInput } from "@/components/sections/response/ui/BooleanInput"
import { CheckboxInput } from "@/components/sections/response/ui/CheckboxInput"
import { TextareaInput } from "@/components/sections/response/ui/TextareaInput"
import { RadioInput } from "@/components/sections/response/ui/RadioInput"

type InteractiveQuestionProps = {
	question: Question
	register: UseFormRegister<SurveyResponseFormData>
	control: Control<SurveyResponseFormData>
	error?: string
	values?: Record<string, string | boolean | string[]>
	setValue?: (name: string, value: string | boolean | string[]) => void
}

export default function InteractiveQuestion({
	question,
	register,
	control,
	error,
	values,
	setValue,
}: InteractiveQuestionProps) {
	const fieldName = `question_${question.id}`
	const currentValue = values?.[fieldName]

	const renderQuestionInput = () => {
		switch (question.type) {
			case TypesOfQuestion.Text:
				return (
					<TextInput
						name={fieldName}
						register={register}
						placeholder="Votre réponse..."
						error={error}
					/>
				)

			case TypesOfQuestion.Boolean:
				return (
					<BooleanInput
						name={fieldName}
						register={register}
						error={error}
						value={
							typeof currentValue === "boolean"
								? currentValue
								: false
						}
						onChange={value => setValue?.(fieldName, value)}
					/>
				)

			case TypesOfQuestion.Select: {
				const selectOptions = [
					...new Set(question.answers.map(a => a.value)),
				]
				return (
					<SelectInput
						name={fieldName}
						control={control}
						options={selectOptions}
						placeholder="Sélectionnez une réponse"
						error={error}
						onChange={value => setValue?.(fieldName, value)}
					/>
				)
			}

			case TypesOfQuestion.Checkbox:
				return (
					<CheckboxInput
						name={fieldName}
						register={register}
						options={[
							...new Set(question.answers.map(a => a.value)),
						]}
						error={error}
						value={Array.isArray(currentValue) ? currentValue : []}
						onChange={value => setValue?.(fieldName, value)}
					/>
				)

			case TypesOfQuestion.TextArea:
				return (
					<TextareaInput
						name={fieldName}
						register={register}
						placeholder="Votre réponse..."
						error={error}
					/>
				)

			case TypesOfQuestion.Radio:
				return (
					<RadioInput
						name={fieldName}
						register={register}
						options={[
							...new Set(question.answers.map(a => a.value)),
						]}
						error={error}
						value={
							typeof currentValue === "string" ? currentValue : ""
						}
						onChange={val => setValue?.(fieldName, val)}
					/>
				)

			default:
				return (
					<div className="text-destructive-medium">
						Type de question non supporté: {question.type}
					</div>
				)
		}
	}

	return (
		<div className="border-black-200 mb-8 rounded-lg border bg-white p-6">
			<Label className="mb-4 block text-lg font-medium">
				{question.title}
			</Label>

			{renderQuestionInput()}

			{error && (
				<p className="text-destructive-medium mt-2 text-sm">{error}</p>
			)}
		</div>
	)
}
