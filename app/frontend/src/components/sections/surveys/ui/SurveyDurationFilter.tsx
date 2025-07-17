import { Chipset } from "@/components/ui/Chipset"
import { X } from "lucide-react"
import { SelectFilter } from "@/components/sections/dashboard/SelectFilter"
import { SurveyDurationFilterProps } from "@/types/types"
import { cn } from "@/lib/utils"

export default function SurveyDurationFilter({
	sortTimeOption,
	setSortTimeOption,
	isHorizontalCompact,
}: SurveyDurationFilterProps) {
	const sortOptions = [
		{ value: "estimatedDuration_ASC", label: "Durée estimée croissante" },
		{
			value: "estimatedDuration_DESC",
			label: "Durée estimée décroissante",
		},
		{ value: "availableDuration_ASC", label: "Temps restant croissant" },
		{ value: "availableDuration_DESC", label: "Temps restant décroissant" },
	]

	const handleSortChange = (val: string) => {
		setSortTimeOption(val)
	}

	const clearSort = () => {
		setSortTimeOption("")
	}

	const label =
		sortOptions.find(opt => opt.value === sortTimeOption)?.label ||
		sortTimeOption

	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-5",
				isHorizontalCompact ? "mb-14" : "mb-20"
			)}
		>
			<SelectFilter
				value={sortTimeOption}
				onChange={handleSortChange}
				options={sortOptions}
				placeholder="Trier par durée"
			/>
			{sortTimeOption && (
				<div className="flex flex-wrap items-center gap-2.5">
					<Chipset
						variant="filtered"
						ariaLabel={`Tri appliqué : ${label}`}
					>
						{label}
						<X
							className="h-4 w-4 cursor-pointer"
							onClick={clearSort}
						/>
					</Chipset>
				</div>
			)}
		</div>
	)
}
