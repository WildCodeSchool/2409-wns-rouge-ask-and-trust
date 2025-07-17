import { SurveyTableHeadProps } from "@/types/types"
import { Checkbox } from "@/components/ui/Checkbox"

export default function SurveyTableHead({
	isHeaderChecked,
	handleSelectAll,
}: SurveyTableHeadProps) {
	return (
		<thead className="bg-primary-50 uppercase">
			<tr className="border-border border-b">
				<th className="px-5 py-4">
					<div className="flex w-max items-center gap-2.5">
						<Checkbox
							className="border-border data-[state=checked]:bg-primary-default data-[state=checked]:text-white"
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
	)
}
