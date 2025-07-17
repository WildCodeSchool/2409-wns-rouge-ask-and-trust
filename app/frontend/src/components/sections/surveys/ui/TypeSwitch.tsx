import { Switch } from "@/components/ui/Switch"
import { QuestionUpdate } from "@/types/types"
import { useId } from "react"
import { Control, Controller } from "react-hook-form"

type Props = {
	label: string
	name: `answers.${number}.value` // @TODO check this
	control: Control<QuestionUpdate>
}

export default function TypeSwitch({ label, name, control }: Props) {
	const switchId = useId()

	return (
		<div className="flex items-center gap-2">
			<label htmlFor={switchId}>{label}</label>
			<Controller
				control={control}
				name={name} // @TODO fix this. Maybe answers.question2 ?
				defaultValue={"false"} // @TODO @ArthurVS05 Fix this not assignable in boolean defaultValue={false}
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
