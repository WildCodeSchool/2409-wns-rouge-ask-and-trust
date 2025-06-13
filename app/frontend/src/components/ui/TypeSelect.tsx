import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"

type TypeSelectProps<T extends FieldValues> = {
	control: Control<T>
	name: FieldPath<T>
	options: string[]
}

export default function TypeSelect<T extends FieldValues>({
	control,
	name,
	options,
}: TypeSelectProps<T>) {
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
						{options.map(option => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		/>
	)
}
