import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from "@/components/ui/Select"

export function ReadOnlySelect({
	options,
	value,
}: {
	options: string[]
	value?: string
}) {
	return (
		<div className="flex flex-col gap-2">
			<Select value={value}>
				<SelectTrigger className="w-full" />
				<SelectContent>
					{options.map(opt => (
						<SelectItem key={opt} value={opt} disabled>
							{opt}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
