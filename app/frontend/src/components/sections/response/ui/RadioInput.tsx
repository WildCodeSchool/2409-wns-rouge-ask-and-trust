import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { UseFormRegister } from "react-hook-form"
import { SurveyResponseFormData } from "@/types/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioButton"

type RadioInputProps = {
	name: string
	register: UseFormRegister<SurveyResponseFormData>
	options: string[]
	error?: string
	value?: string
	onChange?: (value: string) => void
}

export function RadioInput({
	name,
	register,
	options,
	error,
	value = "",
	onChange,
}: RadioInputProps) {
	return (
		<div>
			<RadioGroup
				value={value}
				onValueChange={v => onChange?.(v)}
				aria-invalid={error ? "true" : "false"}
				className="flex flex-col gap-3"
			>
				{options.map((option, index) => {
					const optionId = `${name}_${index}`
					return (
						<div key={optionId} className="flex items-center gap-2">
							<RadioGroupItem value={option} id={optionId} />
							<Label
								htmlFor={optionId}
								className="text-sm font-normal"
							>
								{option}
							</Label>
						</div>
					)
				})}
			</RadioGroup>
			{/* Hidden input for react-hook-form */}
			<Input
				type="hidden"
				{...register(name)}
				value={value}
				errorMessage={error}
			/>
			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	)
}
