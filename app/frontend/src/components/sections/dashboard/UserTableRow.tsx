import { Chipset } from "@/components/ui/Chipset"
import { Button } from "@/components/ui/Button"
import { User } from "@/types/types"
import { Trash2 } from "lucide-react"

export default function UserTableRow({
	user,
	formatDate,
}: {
	user: User
	formatDate: (date: string | Date) => string
}) {
	const roleLabel = user.role === "admin" ? "Admin" : "Utilisateur"
	const surveysCount = user.surveys?.length ?? 0

	return (
		<tr className="border-border border-b text-sm last-of-type:border-none">
			<td className="px-5 py-4">
				<p
					className="block max-w-60 truncate"
					title={`${user.firstname} ${user.lastname}`}
				>
					{user.firstname} {user.lastname}
				</p>
			</td>
			<td className="px-5 py-4">
				<Chipset
					ariaLabel="Statut utilisateur"
					variant={user.role === "admin" ? "primary" : "secondary"}
				>
					{roleLabel}
				</Chipset>
			</td>
			<td className="px-5 py-4">{surveysCount}</td>
			<td className="px-5 py-4">{formatDate(user.created_at)}</td>
			<td className="px-5 py-4">
				<p className="block max-w-60 truncate" title={user.email}>
					{user.email}
				</p>
			</td>
			<td className="px-5 py-4">
				<div className="flex items-center gap-5">
					<Button
						ariaLabel="Supprimer l'utilisateur"
						variant="ghost"
						role="button"
						className="p-0"
					>
						<Trash2 className="text-destructive-medium h-5 w-5 cursor-pointer" />
					</Button>
				</div>
			</td>
		</tr>
	)
}
