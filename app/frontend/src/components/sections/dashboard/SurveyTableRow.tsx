import { Checkbox } from "@/components/ui/Checkbox"
import { Chipset } from "@/components/ui/Chipset"
import { SurveyTableActions } from "@/components/sections/dashboard/SurveyTableActions"
import { SurveyTableRowProps } from "@/types/types"

export default function SurveyTableRow({
	survey,
	isChecked,
	onCheckboxChange,
	statusLabel,
	formatDate,
}: SurveyTableRowProps) {
	return (
		<tr className="border-border border-b text-sm last-of-type:border-none">
			<td className="px-5 py-4">
				<div className="flex items-center gap-2.5">
					<Checkbox
						className="border-border data-[state=checked]:bg-primary-default data-[state=checked]:text-white"
						checked={isChecked}
						onCheckedChange={onCheckboxChange}
					/>
					<p
						className="block max-w-60 truncate"
						title={survey.title}
						aria-label={`Titre de l'enquête : ${survey.title}`}
					>
						{survey.title}
					</p>
				</div>
			</td>
			<td className="px-5 py-4">
				<Chipset
					key={survey.id}
					ariaLabel="Statut de l'enquête"
					state={survey.status}
				>
					{statusLabel}
				</Chipset>
			</td>
			<td className="px-5 py-4">{formatDate(survey.createdAt)}</td>
			<td className="px-5 py-4">{formatDate(survey.updatedAt)}</td>
			<td className="px-5 py-4">
				<SurveyTableActions
					surveyId={survey.id}
					status={survey.status}
				/>
			</td>
		</tr>
	)
}
