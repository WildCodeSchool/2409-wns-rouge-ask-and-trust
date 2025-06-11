import { Switch } from "@/components/ui/Switch"
import { QuestionDefinition } from "@/types/types"
import { useId } from "react"
import { Control, Controller } from "react-hook-form"

type Props = {
	label: string
	name: `answers.${string}` // check this
	control: Control<QuestionDefinition>
}

export default function TypeSwitch({ label, name, control }: Props) {
	const switchId = useId()

	return (
		<div className="flex items-center gap-2">
			<label htmlFor={switchId}>{label}</label>
			<Controller
				control={control}
				name={name} // fix this. Maybe answers.question2 ?
				defaultValue={false}
				render={({ field }) => (
					<Switch
						id={switchId}
						checked={!!field.value}
						onCheckedChange={field.onChange}
					/>
				)}
			/>
		</div>
	)
}
