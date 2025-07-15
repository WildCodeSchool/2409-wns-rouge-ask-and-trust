import { SurveyTableProps } from "@/types/types"
import SurveyTableHead from "@/components/sections/dashboard/SurveyTableHead"
import SurveyTableRow from "./SurveyTableRow"

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
				<SurveyTableHead
					isHeaderChecked={isHeaderChecked}
					handleSelectAll={handleSelectAll}
				/>
				<tbody>
					{surveys.map(survey => (
						<SurveyTableRow
							key={survey.id}
							survey={survey}
							isChecked={selectedSurveyIds.includes(survey.id)}
							onCheckboxChange={checked =>
								handleSurveyCheckboxChange(survey.id, checked)
							}
							statusLabel={statusLabelMap[survey.status]}
							formatDate={formatDateToFrench}
						/>
					))}
				</tbody>
			</table>
		</div>
	)
}
