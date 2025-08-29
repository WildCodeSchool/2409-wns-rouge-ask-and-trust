import UserTableHead from "./UserTableHead"
import UserTableRow from "./UserTableRow"
import { User } from "@/types/types"

export default function UserTable({ users }: { users: User[] }) {
	const formatDateToFrench = (date: string | Date): string => {
		const dateObj = new Date(date)
		return dateObj.toLocaleDateString("fr-FR")
	}

	return (
		<div className="border-border overflow-x-auto rounded-xl border">
			<table className="text-black-default min-w-full text-left">
				<UserTableHead />
				<tbody>
					{users.map(u => (
						<UserTableRow
							key={u.id}
							user={u}
							formatDate={formatDateToFrench}
						/>
					))}
				</tbody>
			</table>
		</div>
	)
}
