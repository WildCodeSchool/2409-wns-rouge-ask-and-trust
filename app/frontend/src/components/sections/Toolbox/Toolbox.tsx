import { AdaptiveToolbox } from "@/components/sections/Toolbox/AdaptativeToolbox"
import { toolboxCategories } from "@/components/sections/Toolbox/toolboxData"
import { useResponsivity } from "@/hooks/useResponsivity"
import { cn } from "@/lib/utils"
import { QuestionType, ToolboxCategory, ToolboxItem } from "@/types/types"
import { useState } from "react"

/**
 * Toolbox component
 *
 * Displays the toolbox allowing users to add questions to a survey.
 *
 * @param {Object} props - Component properties.
 * @param {(type: string) => void} props.onAddQuestion - Function called when a question is added.
 * @param {string} [props.className] - Optional CSS class for the main container.
 * @returns {JSX.Element} The toolbox component.
 */
export function Toolbox({
	onAddQuestion,
}: {
	onAddQuestion: (type: QuestionType | undefined) => void
}) {
	const [searchValue, setSearchValue] = useState<string>("")
	const { rootRef, isVerticalCompact, isHorizontalCompact } = useResponsivity(
		200,
		768
	)
	const isCompact = isVerticalCompact || isHorizontalCompact

	// Inject the search value into the search input
	const categories: ToolboxCategory[] = toolboxCategories.map(category => ({
		...category,
		items: category.items.map(item => ({
			...item,
			onClick: () => onAddQuestion(item.onClickType),
		})),
	}))

	// Flatten the categories to get all items
	const allItems: ToolboxItem[] = categories.flatMap(
		category => category.items
	)
	return (
		<div
			ref={rootRef}
			className={cn(
				"border-black-50 transition-width z-10 flex h-screen flex-shrink-0 flex-col overflow-hidden rounded-xl border-1 bg-white shadow-md duration-300 ease-in-out",
				isCompact ? "w-14" : "w-72"
			)}
		>
			<AdaptiveToolbox
				categories={categories}
				items={allItems}
				showSearch={true}
				searchManager={{
					value: searchValue,
					onChange: setSearchValue,
					placeholder: "Rechercher un élément...",
				}}
				noResultsText="Aucun résultat trouvé"
			/>
		</div>
	)
}

export default Toolbox
