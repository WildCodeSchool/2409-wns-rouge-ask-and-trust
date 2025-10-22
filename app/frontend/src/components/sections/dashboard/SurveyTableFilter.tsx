import { Chipset } from "@/components/ui/Chipset"
import { X } from "lucide-react"
import { SelectFilter } from "@/components/sections/dashboard/SelectFilter"
import { Button } from "@/components/ui/Button"
import { SurveyTableFilterProps } from "@/types/types"

export default function SurveyTableFilter({
	filters,
	setFilters,
}: SurveyTableFilterProps) {
	const allOptions = [
		{ value: "Brouillon", label: "Brouillon" },
		{ value: "Publiée", label: "Publiée" },
		{ value: "Archivée", label: "Archivée" },
		{ value: "Censurée", label: "Censurée" },

		{ value: "Plus récente", label: "Plus récente" },
		{
			value: "Plus ancienne",
			label: "Plus ancienne",
		},
	]

	const availableOptions = allOptions.filter(
		opt => !filters.includes(opt.value)
	)

	const addFilter = (val: string) => {
		const sortFilters = ["Plus récente", "Plus ancienne"]
		const isSort = sortFilters.includes(val)

		let updatedFilters = [...filters]

		if (isSort) {
			// Supprimer tout autre tri déjà présent
			updatedFilters = updatedFilters.filter(
				f => !sortFilters.includes(f)
			)
		}

		if (!updatedFilters.includes(val)) {
			setFilters([...updatedFilters, val])
		}
	}

	const removeFilter = (val: string) => {
		setFilters(filters.filter(f => f !== val))
	}

	const removeAllFilters = () => {
		setFilters([])
	}

	return (
		<div className="flex flex-wrap items-center gap-5 max-md:order-2">
			<SelectFilter
				value=""
				onChange={addFilter}
				options={availableOptions}
				ariaLabel="Ajouter un filtre sur votre tableau d'enquêtes"
			/>
			<div className="flex flex-wrap items-center gap-2.5">
				{filters.map(filter => (
					<Chipset
						key={filter}
						variant="filtered"
						ariaLabel={`Filtre appliqué : ${filter}`}
					>
						{filter}
						<X
							className="h-4 w-4 cursor-pointer"
							onClick={() => removeFilter(filter)}
						/>
					</Chipset>
				))}
				{filters.length >= 2 && (
					<Button
						ariaLabel="Supprimer tous les filtres"
						variant="ghost_destructive"
						onClick={removeAllFilters}
					>
						Supprimer tous les filtres
					</Button>
				)}
			</div>
		</div>
	)
}
