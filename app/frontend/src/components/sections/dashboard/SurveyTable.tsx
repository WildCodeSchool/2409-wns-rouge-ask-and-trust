import { Checkbox } from "@/components/ui/Checkbox"
import { Chipset } from "@/components/ui/Chipset"
import { SurveyTableProps } from "@/types/types"
import { SurveyTableActions } from "@/components/sections/dashboard/SurveyTableActions"

export default function SurveyTable({
	isHeaderChecked,
	handleSelectAll,
	surveys,
	selectedSurveyIds,
	handleSurveyCheckboxChange,
	statusLabelMap,
}: SurveyTableProps) {
	const formatDateToFrench = (dateString: string): string => {
		const date = new Date(dateString)
		return date.toLocaleDateString("fr-FR")
	}

	return (
		<div className="border-border mb-10 overflow-x-auto rounded-xl border">
			<table className="text-black-default min-w-full text-left">
				<thead className="bg-primary-50 uppercase">
					<tr className="border-border border-b">
						<th className="px-5 py-4">
							<div className="flex w-max items-center gap-2.5">
								<Checkbox
									className="border-border data-[state=checked]:bg-primary-200 data-[state=checked]:text-border"
									checked={isHeaderChecked}
									onCheckedChange={handleSelectAll}
								/>
								Titre de l'enquête
							</div>
						</th>
						<th className="px-5 py-4">Statut</th>
						<th className="px-5 py-4">Date de création</th>
						<th className="px-5 py-4">Date de modification</th>
						<th className="px-5 py-4">Actions</th>
					</tr>
				</thead>
				<tbody>
					{surveys.map(survey => (
						<tr
							key={survey.id}
							className="border-border border-b text-sm last-of-type:border-none"
						>
							<td className="px-5 py-4">
								<div className="flex items-center gap-2.5">
									<Checkbox
										className="border-border data-[state=checked]:bg-primary-200 data-[state=checked]:text-border"
										checked={selectedSurveyIds.includes(
											survey.id
										)}
										onCheckedChange={checked =>
											handleSurveyCheckboxChange(
												survey.id,
												checked
											)
										}
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
									{statusLabelMap[survey.status]}
								</Chipset>
							</td>
							<td className="px-5 py-4">
								{formatDateToFrench(survey.createdAt)}
							</td>
							<td className="px-5 py-4">
								{formatDateToFrench(survey.updatedAt)}
							</td>
							<td className="px-5 py-4">
								<SurveyTableActions
									surveyId={survey.id}
									status={survey.status}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
