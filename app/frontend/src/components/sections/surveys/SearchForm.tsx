import { Search } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { useEffect, useState } from "react"

export default function SearchForm() {
	const [searchParams, setSearchParams] = useSearchParams()
	const [value, setValue] = useState<string>(searchParams.get("search") || "")

	useEffect(() => {
		if (value === "") {
			const newParams = new URLSearchParams(searchParams)
			newParams.delete("search")
			newParams.set("page", "1")
			setSearchParams(newParams)
		}
	}, [value])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const newParams = new URLSearchParams(searchParams)

		if (value.trim()) {
			newParams.set("search", value.trim())
			newParams.set("page", "1")
		} else {
			newParams.delete("search")
			newParams.set("page", "1")
		}

		setSearchParams(newParams)
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="relative flex flex-1 items-center justify-center"
		>
			<Label htmlFor="search" className="sr-only">
				Rechercher une enquête
			</Label>
			<Input
				id="search"
				placeholder="Rechercher une enquête..."
				type="search"
				value={value}
				errorMessage=""
				onChange={e => setValue(e.target.value)}
				className="h-11 w-full bg-white py-2 pr-10 pl-2 text-ellipsis whitespace-nowrap"
			/>
			<Button
				type="submit"
				ariaLabel="Rechercher une enquête"
				className="group absolute right-1.5 p-2"
			>
				<Search className="group-hover:text-primary-700 h-4 w-4 text-white transition-colors duration-200 ease-in-out" />
			</Button>
		</form>
	)
}
