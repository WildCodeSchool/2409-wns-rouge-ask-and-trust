import { Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

type SearchFormData = {
	search: string
}

type SurveyTableSearchProps = {
	onSearch: (query: string) => void
}

export default function SurveyTableSearch({
	onSearch,
}: SurveyTableSearchProps) {
	const { register, handleSubmit } = useForm<SearchFormData>({
		defaultValues: { search: "" },
	})

	const onFormSubmit = (data: SearchFormData) => {
		onSearch(data.search)
	}

	return (
		<form
			onSubmit={handleSubmit(onFormSubmit)}
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
				errorMessage=""
				{...register("search")}
				onChange={e => {
					const value = e.target.value
					onSearch(value)
				}}
				className="border-button-line-border text-input-fg h-10 bg-white pl-14 text-sm"
			/>
		</form>
	)
}
