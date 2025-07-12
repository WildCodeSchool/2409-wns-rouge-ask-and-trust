import { Search } from "lucide-react"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

type SurveyTableSearchProps = {
	value: string
	setValue: (query: string) => void
}

export default function SurveyTableSearch({
	value,
	setValue,
}: SurveyTableSearchProps) {
	return (
		<form
			onSubmit={(e: React.FormEvent<HTMLFormElement>) =>
				e.preventDefault()
			}
			className="relative flex max-w-3xs flex-1 items-center justify-center max-sm:order-1"
		>
			<Button
				type="submit"
				variant="ghost"
				ariaLabel="Rechercher une enquête"
				className="absolute left-2 p-2"
			>
				<Search className="text-input-fg h-4 w-4" />
			</Button>
			<Label htmlFor="search" className="sr-only">
				Rechercher une enquête
			</Label>
			<Input
				type="search"
				id="search"
				placeholder="Rechercher une enquête"
				value={value}
				errorMessage=""
				onChange={e => setValue(e.target.value)}
				className="border-button-line-border text-input-fg h-10 bg-white pl-14 text-sm"
			/>
		</form>
	)
}
