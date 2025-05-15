import { Button } from "@/components/ui/Button"
import { ToolboxItem, ToolboxProps } from "@/types/types"
import { useResponsivity } from "@/hooks/useResponsivity"

/**
 * Composant AdaptiveToolbox
 *
 * Affiche une boîte à outils avec catégories, items, recherche et mode compact selon la hauteur.
 *
 * @param {ToolboxProps} props - Propriétés du composant.
 * @returns {JSX.Element} Le composant de boîte à outils adaptative.
 */
export function AdaptiveToolbox({
	className = "",
	categories = [],
	items = [],
	showSearch = false,
	searchManager,
	compactThreshold = 200,
	horizontalThreshold = 768,
	noResultsText = "Aucun résultat trouvé",
}: ToolboxProps) {
	const { rootRef, isVerticalCompact, isHorizontalCompact } = useResponsivity(
		compactThreshold,
		horizontalThreshold
	)
	const isCompact = isVerticalCompact || isHorizontalCompact

	/**
	 * Render the items of the toolbox
	 * @returns {JSX.Element} The rendered items
	 */
	const renderedItems =
		showSearch && searchManager?.value
			? items.filter((item: ToolboxItem) =>
					item.label
						.toLowerCase()
						.includes(searchManager.value.toLowerCase())
				)
			: items

	const hasResults = renderedItems.length > 0

	/**
	 * Render an item of the toolbox
	 * @param {ToolboxItem} item - The item to render
	 * @returns {JSX.Element} The rendered item
	 */
	const renderItem = (item: ToolboxItem) => (
		<Button
			key={item.id}
			className={`toolbox-item ${isCompact ? "compact" : ""}`}
			onClick={item.onClick}
			ariaLabel={item.label}
		>
			{item.icon && <span className="icon">{item.icon}</span>}
			{!isCompact && <span className="label">{item.label}</span>}
		</Button>
	)

	/**
	 * Render the categories of the toolbox
	 * @returns {JSX.Element} The rendered categories
	 */
	const renderCategories = () =>
		categories.map(category => (
			<div key={category.id} className="toolbox-category">
				<h3 className="category-title">{category.title}</h3>
				<div className="category-items">
					{renderedItems
						.filter((item: ToolboxItem) =>
							category.items.some(
								(cItem: ToolboxItem) => cItem.id === item.id
							)
						)
						.map(renderItem)}
				</div>
			</div>
		))

	return (
		<div
			ref={rootRef}
			className={`adaptive-toolbox ${className} ${isHorizontalCompact ? "horizontal-compact" : ""}`}
		>
			{showSearch && searchManager && (
				<div className="toolbox-search">
					<input
						type="text"
						value={searchManager.value}
						onChange={e => searchManager.onChange(e.target.value)}
						placeholder={searchManager.placeholder}
					/>
				</div>
			)}
			{!hasResults && <div className="no-results">{noResultsText}</div>}

			<div className="toolbox-content">
				{categories.length > 0
					? renderCategories()
					: renderedItems.map(renderItem)}
			</div>
		</div>
	)
}
