import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/Select"
import { ListFilter } from "lucide-react"

type FilterOption = {
	label: string
	value: string
}

type SelectFilterProps = {
	value: string
	onChange: (val: string) => void
	options: FilterOption[]
	placeholder?: string
	disabled?: boolean
}

export function SelectFilter({
	value,
	onChange,
	options,
	placeholder = "Ajouter un filtre",
	disabled = false,
}: SelectFilterProps) {
	const availableOptions = options.filter(opt => opt.value !== value)

	return (
		<Select onValueChange={onChange} value="" disabled={disabled}>
			<SelectTrigger
				className="border-button-line-border text-button-line-border max-w-52 border bg-white px-4 py-2"
				icon={
					<ListFilter className="text-button-line-border h-4 w-4" />
				}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{availableOptions.map(opt => (
					<SelectItem key={opt.value} value={opt.value}>
						{opt.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
