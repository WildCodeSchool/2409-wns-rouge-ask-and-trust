import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Search } from "lucide-react"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

type Props = {
	onSearch: (query: string) => void
}

export default function SurveyTableSearch({ onSearch }: Props) {
	const { register, watch } = useForm({
		defaultValues: { search: "" },
	})

	const searchValue = watch("search")

	useEffect(() => {
		const timeout = setTimeout(() => {
			onSearch(searchValue.trim())
		}, 400)

		return () => clearTimeout(timeout)
	}, [searchValue, onSearch])

	return (
		<form className="relative flex w-3xs max-w-3xs flex-1 items-center justify-center max-md:order-1 max-md:w-full max-md:max-w-none">
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
				className="border-button-line-border text-input-fg h-10 w-3xs bg-white pl-14 text-sm max-md:w-full"
			/>
		</form>
	)
}
