import type { ToolboxCategory } from "@/types/types"
import {
	AlignJustify,
	CheckSquare,
	Circle,
	ListFilter,
	Type,
} from "lucide-react"

/**
 * Definition of toolbox categories and items for the survey creator.
 * Each category groups types of questions or elements that can be added to a survey.
 *
 * @type {ToolboxCategory[]}
 */
export const toolboxCategories: ToolboxCategory[] = [
	{
		id: "choice-based",
		title: "Question avec réponses définies",
		items: [
			{
				id: "select",
				label: "Liste déroulante",
				icon: <ListFilter className="text-primary-700 h-5 w-5" />,
				onClickType: "select",
			},
			{
				id: "checkboxes",
				label: "Cases à cocher",
				icon: <CheckSquare className="text-primary-700 h-5 w-5" />,
				onClickType: "checkbox",
			},
			{
				id: "radio",
				label: "Liste à choix unique",
				icon: (
					<div className="relative flex h-5 w-5 items-center justify-center">
						<Circle className="text-primary-700 h-5 w-5" />
						<span className="bg-primary-700 absolute z-10 h-[0.65rem] w-[0.65rem] rounded-full" />
					</div>
				),
				onClickType: "radio",
			},
			// {
			// 	id: "multi-select",
			// 	label: "Multi-Select Dropdown",
			// 	icon: <List className="text-primary-700 h-5 w-5" />,
			// 	onClickType: "multi-select",
			// },
			// {
			// 	id: "image-picker",
			// 	label: "Image Picker",
			// 	icon: <ImageIcon className="text-primary-700 h-5 w-5" />,
			// 	onClickType: "image-picker",
			// },
		],
	},
	{
		id: "text-input",
		title: "Question à réponse libre",
		items: [
			{
				id: "single-line",
				label: "Réponse courte",
				icon: <Type className="text-primary-700 h-5 w-5" />,
				onClickType: "text",
			},
			{
				id: "paragraph",
				label: "Paragraphe",
				icon: <AlignJustify className="text-primary-700 h-5 w-5" />,
				onClickType: "text",
			},
			// {
			// 	id: "multi-line",
			// 	label: "Multi-Line Input",
			// 	icon: <AlignLeft className="text-primary-700 h-5 w-5" />,
			// 	onClickType: "multi-line",
			// },
			// {
			// 	id: "multiple-textboxes",
			// 	label: "Multiple Textboxes",
			// 	icon: <Layers className="text-primary-700 h-5 w-5" />,
			// 	onClickType: "multiple-textboxes",
			// },
		],
	},
	// {
	// 	id: "read-only",
	// 	title: "Read-Only Elements",
	// 	items: [
	// 		{
	// 			id: "read-only",
	// 			label: "Read-Only Elements",
	// 			icon: <FileText className="text-primary-700 h-5 w-5" />,
	// 			onClickType: "read-only",
	// 		},
	// 	],
	// },
	// {
	// 	id: "matrices",
	// 	title: "Matrices",
	// 	items: [
	// 		{
	// 			id: "matrices",
	// 			label: "Matrices",
	// 			icon: <Grid className="text-primary-700 h-5 w-5" />,
	// 			onClickType: "matrices",
	// 		},
	// 	],
	// },
	// {
	// 	id: "panels",
	// 	title: "Panels",
	// 	items: [
	// 		{
	// 			id: "panels",
	// 			label: "Panels",
	// 			icon: <Layout className="text-primary-700 h-5 w-5" />,
	// 			onClickType: "panels",
	// 		},
	// 	],
	// },
]
