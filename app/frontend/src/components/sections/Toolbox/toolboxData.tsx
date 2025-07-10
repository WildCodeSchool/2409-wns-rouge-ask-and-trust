import type { ToolboxCategory } from "@/types/types"
import {
	ListFilter,
	CheckSquare,
	Circle,
	List,
	ImageIcon,
	Type,
	AlignLeft,
	Layers,
	FileText,
	Grid,
	Layout,
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
		title: "Choice-Based Questions",
		items: [
			{
				id: "dropdown",
				label: "Dropdown",
				icon: <ListFilter className="text-primary-700 h-5 w-5" />,
				onClickType: "dropdown",
			},
			{
				id: "checkboxes",
				label: "Checkboxes",
				icon: <CheckSquare className="text-primary-700 h-5 w-5" />,
				onClickType: "checkboxes",
			},
			{
				id: "radio",
				label: "Radio Button Group",
				icon: <Circle className="text-primary-700 h-5 w-5" />,
				onClickType: "radio",
			},
			{
				id: "multi-select",
				label: "Multi-Select Dropdown",
				icon: <List className="text-primary-700 h-5 w-5" />,
				onClickType: "multi-select",
			},
			{
				id: "image-picker",
				label: "Image Picker",
				icon: <ImageIcon className="text-primary-700 h-5 w-5" />,
				onClickType: "image-picker",
			},
		],
	},
	{
		id: "text-input",
		title: "Text Input Questions",
		items: [
			{
				id: "single-line",
				label: "Single-Line Input",
				icon: <Type className="text-primary-700 h-5 w-5" />,
				onClickType: "single-line",
			},
			{
				id: "multi-line",
				label: "Multi-Line Input",
				icon: <AlignLeft className="text-primary-700 h-5 w-5" />,
				onClickType: "multi-line",
			},
			{
				id: "multiple-textboxes",
				label: "Multiple Textboxes",
				icon: <Layers className="text-primary-700 h-5 w-5" />,
				onClickType: "multiple-textboxes",
			},
		],
	},
	{
		id: "read-only",
		title: "Read-Only Elements",
		items: [
			{
				id: "read-only",
				label: "Read-Only Elements",
				icon: <FileText className="text-primary-700 h-5 w-5" />,
				onClickType: "read-only",
			},
		],
	},
	{
		id: "matrices",
		title: "Matrices",
		items: [
			{
				id: "matrices",
				label: "Matrices",
				icon: <Grid className="text-primary-700 h-5 w-5" />,
				onClickType: "matrices",
			},
		],
	},
	{
		id: "panels",
		title: "Panels",
		items: [
			{
				id: "panels",
				label: "Panels",
				icon: <Layout className="text-primary-700 h-5 w-5" />,
				onClickType: "panels",
			},
		],
	},
]
