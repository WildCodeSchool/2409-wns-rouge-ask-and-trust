import { useQuery, NetworkStatus } from "@apollo/client"
import { GET_USERS } from "@/graphql/auth"
import { useEffect, useMemo, useState } from "react"
import { User, RawUser } from "@/types/types"

export type UsersDashboard = {
	users: User[]
}

type NormalizedUser = User & { created_at: string; updated_at: string }

export function useUsers() {
	const [search, setSearch] = useState("")
	const [currentPage, setCurrentPage] = useState<number>(1)
	const PER_PAGE = 5

	const { data, loading, networkStatus, refetch } = useQuery<{
		getUsers: RawUser[]
	}>(GET_USERS, { notifyOnNetworkStatusChange: true })

	const isRefetching = networkStatus === NetworkStatus.refetch
	const isInitialLoading = loading && !data

	const normalized: NormalizedUser[] = useMemo(() => {
		const list = data?.getUsers || []
		return list.map(u => ({
			id: String(u.id),
			email: u.email,
			firstname: u.firstname,
			lastname: u.lastname,
			role: u.role as NormalizedUser["role"],
			surveys: (u.surveys || []) as NormalizedUser["surveys"],
			created_at: u.createdAt || "",
			updated_at: u.updatedAt || "",
			password: "",
		}))
	}, [data])

	const filtered = useMemo(() => {
		const list = normalized
		if (!search.trim()) return list
		const q = search.trim().toLowerCase()
		return list.filter(u =>
			[u.firstname, u.lastname, u.email].some(v =>
				v?.toLowerCase().includes(q)
			)
		)
	}, [normalized, search])

	const totalCount = filtered.length
	const start = (currentPage - 1) * PER_PAGE
	const paginatedUsers = filtered.slice(start, start + PER_PAGE)

	useEffect(() => {
		setCurrentPage(1)
	}, [search])

	return {
		users: paginatedUsers,
		allUsersCount: totalCount,
		currentPage,
		setCurrentPage,
		PER_PAGE,
		isRefetching,
		isInitialLoading,
		setSearch,
		refetch,
	}
}
