import { TypesOfQuestion, type ToolboxCategory } from "@/types/types"
import {
	AlignJustify,
	ArrowRightLeft,
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
				label: "liste déroulante",
				icon: <ListFilter className="text-primary-700 h-5 w-5" />,
				onClickType: TypesOfQuestion.Select,
			},
			{
				id: "checkboxes",
				label: "cases à cocher",
				icon: <CheckSquare className="text-primary-700 h-5 w-5" />,
				onClickType: TypesOfQuestion.Checkbox,
			},
			{
				id: "radio",
				label: "liste à choix unique",
				icon: (
					<div className="relative flex h-5 w-5 items-center justify-center">
						<Circle className="text-primary-700 h-5 w-5" />
						<span className="bg-primary-700 absolute z-10 h-[0.65rem] w-[0.65rem] rounded-full" />
					</div>
				),
				onClickType: TypesOfQuestion.Radio,
			},
		],
	},
	{
		id: "text-input",
		title: "Question à réponse libre",
		items: [
			{
				id: "single-line",
				label: "réponse courte",
				icon: <Type className="text-primary-700 h-5 w-5" />,
				onClickType: TypesOfQuestion.Text,
			},
			{
				id: "paragraph",
				label: "paragraphe",
				icon: <AlignJustify className="text-primary-700 h-5 w-5" />,
				onClickType: TypesOfQuestion.TextArea,
			},
			{
				id: "boolean",
				label: "Oui / Non",
				icon: <ArrowRightLeft className="text-primary-700 h-5 w-5" />,
				onClickType: TypesOfQuestion.Boolean,
			},
		],
	},
]
