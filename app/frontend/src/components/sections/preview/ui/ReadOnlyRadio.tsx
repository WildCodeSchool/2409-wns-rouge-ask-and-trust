import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioButton"

type RadioInputProps = {
	options: string[]
	value?: string
}

export function ReadOnlyRadio({ options, value = "" }: RadioInputProps) {
	return (
		<div>
			<RadioGroup value={value} className="flex flex-col gap-3">
				{options.map((option, index) => {
					const optionId = `${name}_${index}`
					return (
						<div key={optionId} className="flex items-center gap-2">
							<RadioGroupItem
								value={option}
								id={optionId}
								disabled
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
			</RadioGroup>
			{/* Hidden input for react-hook-form */}
			<Input type="hidden" value={value} errorMessage="" />
		</div>
	)
}
