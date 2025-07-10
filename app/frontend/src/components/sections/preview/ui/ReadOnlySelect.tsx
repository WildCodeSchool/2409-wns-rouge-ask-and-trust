import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from "@/components/ui/Select"
import { Callout } from "@/components/ui/Callout"

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
						<SelectItem key={opt} value={opt}>
							{opt}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Callout type="question" title="Choix possibles">
				<ul className="list-disc pl-6 text-sm">
					{options.map(opt => (
						<li key={opt}>{opt}</li>
					))}
				</ul>
			</Callout>
		</div>
	)
}
