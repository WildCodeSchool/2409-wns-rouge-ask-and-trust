import { AdaptiveToolbox } from "@/components/sections/Toolbox/AdaptativeToolbox"
import { toolboxCategories } from "@/components/sections/Toolbox/toolboxData"
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
	className = "",
}: {
	onAddQuestion: (type: QuestionType | undefined) => void
	className?: string
}) {
	const [searchValue, setSearchValue] = useState<string>("")

	// Inject the search value into the search input
	const categories: ToolboxCategory[] = toolboxCategories.map(category => ({
		...category,
		items: category.items.map(item => ({
			...item,
			onClick: () => onAddQuestion(item.onClickType), // @TODO update this question
		})),
	}))

	// Flatten the categories to get all items
	const allItems: ToolboxItem[] = categories.flatMap(
		category => category.items
	)

	return (
		<div className={`survey-toolbox ${className}`}>
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
