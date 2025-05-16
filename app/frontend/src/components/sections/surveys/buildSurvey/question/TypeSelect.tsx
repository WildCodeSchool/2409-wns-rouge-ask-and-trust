import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { QuestionUpdate } from "@/types/types"
import { Control, Controller } from "react-hook-form"

type Option = { value: string; label: string }

type TypeSelectProps = {
	control: Control<QuestionUpdate>
	name: `answers.${string}` // check this
	options: Option[]
}

export default function TypeSelect({
	control,
	name,
	options,
}: TypeSelectProps) {
	return (
		<Controller
			control={control}
			name={name}
			render={({ field }) => (
				<Select
					value={String(field.value ?? "")}
					onValueChange={field.onChange}
				>
					<SelectTrigger>
						<SelectValue placeholder="Sélectionner une option" />
					</SelectTrigger>
					<SelectContent>
						{options.map(opt => (
							<SelectItem key={opt.value} value={opt.value}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		/>
	)
}
