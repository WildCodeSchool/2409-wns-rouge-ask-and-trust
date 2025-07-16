import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "react-router-dom"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { Search } from "lucide-react"

type FormValues = {
	search: string
}

export default function SearchForm() {
	const [searchParams, setSearchParams] = useSearchParams()

	const { register, handleSubmit, watch } = useForm<FormValues>({
		defaultValues: {
			search: searchParams.get("search") || "",
		},
	})

	const searchValue = watch("search")

	useEffect(() => {
		if (searchValue === "") {
			const newParams = new URLSearchParams(searchParams)
			newParams.delete("search")
			newParams.set("page", "1")
			setSearchParams(newParams)
		}
	}, [searchValue, searchParams, setSearchParams])

	const onSubmit = (data: FormValues) => {
		const newParams = new URLSearchParams(searchParams)

		if (data.search.trim()) {
			newParams.set("search", data.search.trim())
		} else {
			newParams.delete("search")
		}
		newParams.set("page", "1")

		setSearchParams(newParams)
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
				type="search"
				placeholder="Rechercher une enquête..."
				errorMessage=""
				{...register("search")}
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
