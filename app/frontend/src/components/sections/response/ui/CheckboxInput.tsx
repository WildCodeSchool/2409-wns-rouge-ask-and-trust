import { Checkbox } from "@/components/ui/Checkbox"
import { Label } from "@/components/ui/Label"
import { SurveyResponseFormData } from "@/types/types"
import { UseFormRegister } from "react-hook-form"
import { Input } from "@/components/ui/Input"

type CheckboxInputProps = {
	name: string
	register: UseFormRegister<SurveyResponseFormData>
	options: string[]
	error?: string
	value?: string[]
	onChange?: (values: string[]) => void
}

export function CheckboxInput({
	name,
	register,
	options,
	error,
	value = [],
	onChange,
}: CheckboxInputProps) {
	const currentValues = Array.isArray(value) ? value : []

	const handleOptionChange = (option: string, checked: boolean) => {
		if (!onChange) return

		let newValues: string[]
		if (checked) {
			newValues = [...currentValues, option]
		} else {
			newValues = currentValues.filter(val => val !== option)
		}
		onChange(newValues)
	}

	return (
		<div>
			<div className="space-y-3">
				{options.map((option, index) => {
					const optionId = `${name}_${index}`
					const isChecked = currentValues.includes(option)

					return (
						<div
							key={`${option}_${index}`}
							className="flex items-center space-x-2"
						>
							<Checkbox
								id={optionId}
								checked={isChecked}
								onCheckedChange={checked =>
									handleOptionChange(
										option,
										checked as boolean
									)
								}
								aria-invalid={error ? "true" : "false"}
							/>
							<Label
								htmlFor={optionId}
								className="text-sm font-normal"
							>
								{option}
							</Label>
						</div>
					)
				})}
			</div>
			{/* Hidden input for react-hook-form */}
			<Input
				type="hidden"
				{...register(name)}
				value={JSON.stringify(currentValues)}
				errorMessage={error}
			/>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	)
}
