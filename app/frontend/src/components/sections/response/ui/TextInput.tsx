import { Input } from "@/components/ui/Input"
import { SurveyResponseFormData } from "@/types/types"
import { UseFormRegister } from "react-hook-form"

type TextInputProps = {
	name: string
	register: UseFormRegister<SurveyResponseFormData>
	placeholder?: string
	error?: string
	required?: boolean
}

export function TextInput({
	name,
	register,
	placeholder,
	error,
	required = false,
}: TextInputProps) {
	return (
		<Input
			{...register(name, {
				required: required ? "Ce champ est obligatoire" : false,
			})}
			placeholder={placeholder}
			errorMessage={error}
		/>
	)
}
