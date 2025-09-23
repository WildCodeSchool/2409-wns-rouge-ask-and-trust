import { Textarea } from "@/components/ui/Textarea"
import { SurveyResponseFormData } from "@/types/types"
import { UseFormRegister } from "react-hook-form"

type TextareaInputProps = {
	name: string
	register: UseFormRegister<SurveyResponseFormData>
	placeholder?: string
	error?: string
	required?: boolean
}

export function TextareaInput({
	name,
	register,
	placeholder,
	error,
	required = false,
}: TextareaInputProps) {
	return (
		<Textarea
			{...register(name, {
				required: required ? "Ce champ est obligatoire" : false,
			})}
			placeholder={placeholder}
			errorMessage={error}
		/>
	)
}
