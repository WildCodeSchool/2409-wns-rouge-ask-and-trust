import { Switch } from "@/components/ui/Switch"
import { SurveyResponseFormData } from "@/types/types"
import { UseFormRegister } from "react-hook-form"
import { Input } from "@/components/ui/Input"

type BooleanInputProps = {
	name: string
	register: UseFormRegister<SurveyResponseFormData>
	error?: string
	value?: boolean
	onChange?: (value: boolean) => void
}

export function BooleanInput({
	name,
	register,
	error,
	value = false,
	onChange,
}: BooleanInputProps) {
	return (
		<div>
			<div className="flex items-center gap-4">
				<span className="text-black-600">Non</span>
				<Switch
					id={name}
					checked={value}
					onCheckedChange={onChange || (() => {})}
					aria-invalid={error ? "true" : "false"}
				/>
				<span className="text-black-600">Oui</span>
			</div>
			{/* Hidden input for react-hook-form */}
			<Input
				type="hidden"
				{...register(name)}
				value={value ? "true" : "false"}
				errorMessage={error}
			/>
			{error && (
				<p className="text-destructive-medium mt-1 text-sm">{error}</p>
			)}
		</div>
	)
}
