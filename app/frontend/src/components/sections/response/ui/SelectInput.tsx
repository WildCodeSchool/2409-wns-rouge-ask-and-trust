import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { SurveyResponseFormData } from "@/types/types"
import { Control, Controller, FieldPath } from "react-hook-form"

type SelectInputProps = {
	name: FieldPath<SurveyResponseFormData>
	control: Control<SurveyResponseFormData>
	options: string[]
	placeholder?: string
	error?: string
	value?: string
	onChange?: (value: string) => void
}

export function SelectInput({
	name,
	control,
	options,
	placeholder,
	error,
	onChange,
}: SelectInputProps) {
	return (
		<div>
			<Controller
				control={control}
				name={name}
				render={({ field }) => {
					return (
						<Select
							value={String(field.value || "")}
							onValueChange={value => {
								// Protection: prevent overriding a valid value with an empty string
								if (
									value === "" &&
									field.value &&
									field.value !== ""
								) {
									return
								}
								field.onChange(value)
								onChange?.(value)
							}}
						>
							<SelectTrigger
								className={
									error ? "border-destructive-medium" : ""
								}
								aria-invalid={error ? "true" : "false"}
							>
								<SelectValue
									placeholder={
										placeholder || "Sélectionnez une option"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{options.map((option, index) => (
									<SelectItem key={index} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)
				}}
			/>
			{error && (
				<p className="text-destructive-medium mt-1 text-sm">{error}</p>
			)}
		</div>
	)
}
