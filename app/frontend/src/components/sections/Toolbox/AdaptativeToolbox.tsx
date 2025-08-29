import { Button } from "@/components/ui/Button"
import { useScreenDetector } from "@/hooks/useScreenDetector"
import { cn } from "@/lib/utils"
import { SearchManager, ToolboxCategory, ToolboxItem } from "@/types/types"

export interface ToolboxProps {
	className?: string
	items?: ToolboxItem[]
	categories?: ToolboxCategory[]
	showSearch?: boolean
	searchManager?: SearchManager
	noResultsText?: string
}
/**
 * AdaptiveToolbox component
 *
 * Displays a toolbox with categories, items, search, and compact mode based on height.
 *
 * @param {ToolboxProps} props - Component properties.
 * @returns {JSX.Element} The adaptive toolbox component.
 */
export function AdaptiveToolbox({
	categories = [],
	items = [],
	showSearch = false,
	searchManager,
	noResultsText = "Aucun résultat trouvé",
}: ToolboxProps) {
	const { isMobile, isTablet, isDesktop } = useScreenDetector()

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
			className={cn(
				"align-center hover:bg-primary-100 text-black-700 flex w-full cursor-pointer justify-start rounded-md border-none bg-transparent px-2 py-1.5 text-start text-sm font-medium",
				isTablet && "justify-center"
			)}
			onClick={item.onClick}
			ariaLabel={`Ajouter une question de type ${item.label}`}
		>
			{item.icon && (
				<span className="flex justify-center align-middle">
					{item.icon}
				</span>
			)}
			{isDesktop && <span>{item.label}</span>}
		</Button>
	)

	/**
	 * Render the categories of the toolbox
	 * @returns {JSX.Element} The rendered categories
	 */

	const renderCategories = () =>
		categories.map(category => (
			<div key={category.id} className="flex w-full flex-col gap-1.5">
				{isDesktop && (
					<h3 className="text-primary-700 bg-primary-100 w-full px-4 py-1.5 text-sm font-semibold">
						{category.title}
					</h3>
				)}
				<div className={cn("px-2", isMobile && "px-0")}>
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

	const showSearchBar = isDesktop && showSearch && searchManager

	return (
		<div
			className={cn(
				"border-black-50 transition-width shadow-default z-10 flex h-full w-fit flex-shrink-0 flex-col overflow-hidden rounded-xl border-1 bg-white duration-300 ease-in-out",
				"w-fit overflow-hidden",
				isTablet && "w-14 p-2"
			)}
		>
			{showSearchBar && (
				<div className="p-3">
					<input
						type="text"
						className="border-black-100 file:text-black-default placeholder:border-black-400 focus-visible:border-primary-700 flex h-10 w-full rounded-lg border bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
						value={searchManager.value}
						onChange={e => searchManager.onChange(e.target.value)}
						placeholder={searchManager.placeholder}
					/>
				</div>
			)}
			{!hasResults && (
				<div className="text-black-200 size-3.5 p-4 text-center">
					{noResultsText}
				</div>
			)}

			<div
				className={cn(
					"flex flex-1 flex-col gap-1.5 overflow-y-auto bg-white",
					isMobile && "p-1.5"
				)}
			>
				{categories.length > 0
					? renderCategories()
					: renderedItems.map(renderItem)}
			</div>
		</div>
	)
}
