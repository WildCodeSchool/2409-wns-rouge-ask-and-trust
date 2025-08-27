import UserTable from "@/components/sections/dashboard/UserTable"
import UserTableNav from "@/components/sections/dashboard/UserTableNav"
import SurveyTableSearch from "@/components/sections/dashboard/SurveyTableSearch"
import { useUsers } from "@/hooks/useUsers"

export default function UserTableContainer() {
	const {
		users,
		allUsersCount,
		currentPage,
		setCurrentPage,
		PER_PAGE,
		isRefetching,
		isInitialLoading,
		setSearch,
	} = useUsers()

	const handleSearch = (query: string) => setSearch(query)

	if (isInitialLoading) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-black-default text-xl font-medium">
					Chargement des utilisateurs...
				</p>
			</div>
		)
	}

	return (
		<div className="flex w-full flex-col gap-10">
			<div className="flex items-start justify-end gap-5 max-md:flex-col">
				<SurveyTableSearch
					onSearch={handleSearch}
					placeholder="Rechercher un utilisateur"
					ariaLabel="Rechercher un utilisateur"
					label="Rechercher un utilisateur"
				/>
			</div>
			{isRefetching && (
				<div className="flex items-center justify-center py-4">
					<p className="text-lg text-gray-600">
						Chargement des résultats...
					</p>
				</div>
			)}
			<div>
				{allUsersCount > 0 ? (
					<UserTable users={users} />
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<p className="text-black-default text-xl font-medium">
							Aucun utilisateur ne correspond à votre recherche...
						</p>
					</div>
				)}
			</div>
			<UserTableNav
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				totalCount={allUsersCount}
				perPage={PER_PAGE}
			/>
		</div>
	)
}
