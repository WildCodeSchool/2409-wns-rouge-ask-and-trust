import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { SurveyResponseFormData } from "@/types/types"
import { UseFormRegister } from "react-hook-form"
import { Input } from "@/components/ui/Input"

type SelectInputProps = {
	name: string
	register: UseFormRegister<SurveyResponseFormData>
	options: string[]
	placeholder?: string
	error?: string
	value?: string
	onChange?: (value: string) => void
}

export function SelectInput({
	name,
	register,
	options,
	placeholder,
	error,
	value = "",
	onChange,
}: SelectInputProps) {
	return (
		<div>
			<Select onValueChange={onChange} value={value}>
				<SelectTrigger
					className={error ? "border-destructive-medium" : ""}
					aria-invalid={error ? "true" : "false"}
				>
					<SelectValue
						placeholder={placeholder || "Sélectionnez une option"}
					/>
				</SelectTrigger>
				<SelectContent>
					{options.map((option, index) => (
						<SelectItem key={`${option}_${index}`} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{/* Input caché pour react-hook-form */}
			<Input
				type="hidden"
				{...register(name)}
				value={value}
				errorMessage={error}
			/>
			{error && (
				<p className="text-destructive-medium mt-1 text-sm">{error}</p>
			)}
		</div>
	)
}
