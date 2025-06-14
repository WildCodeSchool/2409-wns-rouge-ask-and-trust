import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { CategoryOption } from "@/types/types"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

type TypeSelectProps<T extends FieldValues> = {
	control: Control<T>
	name: FieldPath<T>
	message: string
	selectSomething: string
	options: CategoryOption[]
	disabled?: boolean
}

export default function TypeSelect<T extends FieldValues>({
	control,
	name,
	message,
	selectSomething,
	options,
	disabled = false,
}: TypeSelectProps<T>) {
	return (
		<Controller
			control={control}
			name={name}
			rules={{ required: message }}
			render={({ field }) => (
				<Select
					value={String(field.value ?? "")}
					onValueChange={field.onChange}
					disabled={disabled}
				>
					<SelectTrigger>
						<SelectValue placeholder={selectSomething} />
					</SelectTrigger>
					<SelectContent>
						{options.map(option => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		/>
	)
}
