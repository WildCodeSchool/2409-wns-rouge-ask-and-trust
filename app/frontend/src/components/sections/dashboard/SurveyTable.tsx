import { Eye, Pencil, Trash2 } from "lucide-react"

export default function SurveyTable() {
	const surveys = [
		{
			id: 1,
			title: "Satisfaction Client",
			status: "Brouillon",
			createdAt: "2025-06-01",
			updatedAt: "2025-06-20",
		},
		{
			id: 2,
			title: "Feedback Produit",
			status: "Publiée",
			createdAt: "2025-05-15",
			updatedAt: "2025-06-10",
		},
		{
			id: 3,
			title: "Évaluation de la Formation",
			status: "Archivée",
			createdAt: "2025-05-15",
			updatedAt: "2025-06-10",
		},
		{
			id: 4,
			title: "Sondage Bien-être au Travail",
			status: "Censurée",
			createdAt: "2025-05-15",
			updatedAt: "2025-06-10",
		},
		{
			id: 5,
			title: "Étude sur les Habitudes Numériques",
			status: "Publiée",
			createdAt: "2025-05-15",
			updatedAt: "2025-06-10",
		},
	]

	return (
		<div className="overflow-x-auto rounded-lg shadow-md">
			<table className="min-w-full text-left text-sm text-gray-700">
				<thead className="bg-gray-100 text-xs uppercase">
					<tr>
						<th className="px-4 py-3">Titre de l'enquête</th>
						<th className="px-4 py-3">Statut</th>
						<th className="px-4 py-3">Date de création</th>
						<th className="px-4 py-3">Date de modification</th>
						<th className="px-4 py-3">Actions</th>
					</tr>
				</thead>
				<tbody>
					{surveys.map(survey => (
						<tr key={survey.id} className="border-border border-b">
							<td className="px-5 py-4">{survey.title}</td>
							<td className="px-5 py-4">{survey.status}</td>
							<td className="px-5 py-4">{survey.createdAt}</td>
							<td className="px-5 py-4">{survey.updatedAt}</td>
							<td className="flex items-center gap-5 px-5 py-4">
								<Eye />
								<Pencil />
								<Trash2 />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
