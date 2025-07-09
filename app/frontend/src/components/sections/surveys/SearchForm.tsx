import { Search } from "lucide-react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

interface SearchFormData {
	search: string
}

export default function SearchForm() {
	const {
		handleSubmit,
		formState: { errors },
	} = useForm<SearchFormData>()

	const onSubmit: SubmitHandler<SearchFormData> = data => {
		// TODO: Implement search functionality
		console.log("Search query:", data.search)
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="relative flex flex-1 items-center justify-center"
		>
			<Label htmlFor="search" className="sr-only">
				Rechercher une enquête
			</Label>
			<Input
				id="search"
				placeholder="Rechercher une enquête"
				className="text-input-fg focus:ring-primary-700 h-10 w-full overflow-hidden rounded-md border-0 bg-white py-1 pr-10 pl-2 text-ellipsis whitespace-nowrap outline-0 focus:ring-2 focus:ring-offset-2 focus:outline-none"
				type="search"
				errorMessage={errors.search?.message}
			/>
			<button
				type="submit"
				className="bg-primary-600 absolute right-2 cursor-pointer rounded-md p-2"
				aria-label="Rechercher"
			>
				<Search className="h-4 w-4 text-white" />
			</button>
		</form>
	)
}
