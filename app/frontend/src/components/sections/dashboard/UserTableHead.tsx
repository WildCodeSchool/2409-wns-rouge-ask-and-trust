export default function UserTableHead() {
	return (
		<thead className="bg-primary-50 uppercase">
			<tr className="border-border border-b">
				<th className="px-5 py-4">Nom d'utilisateur</th>
				<th className="px-5 py-4">Statut</th>
				<th className="px-5 py-4">Nombre d'enquêtes</th>
				<th className="px-5 py-4">Date de création</th>
				<th className="px-5 py-4">Email</th>
				<th className="px-5 py-4">Actions</th>
			</tr>
		</thead>
	)
}
