import { AdaptiveToolbox } from "@/components/sections/Toolbox/AdaptativeToolbox"
import { toolboxCategories } from "@/components/sections/Toolbox/toolboxData"
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
			className={cn(
				"border-black-50 transition-width shadow-default z-10 flex h-full w-fit flex-shrink-0 flex-col overflow-hidden rounded-xl border-1 bg-white duration-300 ease-in-out"
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
