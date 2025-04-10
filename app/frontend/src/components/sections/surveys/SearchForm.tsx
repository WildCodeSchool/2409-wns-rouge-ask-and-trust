import { Search } from "lucide-react"

export default function SearchForm() {
	return (
		<form className="relative flex flex-1 items-center justify-center">
			<label htmlFor="search" className="sr-only">
				Rechercher une enquête
			</label>
			<input
				className="text-input-fg focus:ring-primary-700 h-10 w-full overflow-hidden rounded-md border-0 bg-white py-1 pr-10 pl-2 text-ellipsis whitespace-nowrap outline-0 focus:ring-2 focus:ring-offset-2 focus:outline-none"
				type="search"
				id="search"
				name="search"
				placeholder="Rechercher une enquête"
			/>
			<div className="bg-primary-600 absolute right-2 cursor-pointer rounded-md p-2">
				<Search className="h-4 w-4 text-white" />
			</div>
		</form>
	)
}
