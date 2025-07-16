import {
	DateSortFilter,
	SurveysDashboardQuery,
	SurveyStatus,
	SurveyTableType,
} from "@/types/types"
import { CheckedState } from "@radix-ui/react-checkbox"
import { useCallback, useEffect, useState } from "react"
import SurveyTable from "@/components/sections/dashboard/SurveyTable"
import SurveyTableNav from "@/components/sections/dashboard/SurveyTableNav"
import SurveyTableFilter from "@/components/sections/dashboard/SurveyTableFilter"
import { NetworkStatus, useQuery } from "@apollo/client"
import { GET_MY_SURVEYS } from "@/graphql/survey/survey"
import SurveyTableSearch from "@/components/sections/dashboard/SurveyTableSearch"

const statusLabelMap: Record<SurveyTableType["status"], string> = {
	draft: "Brouillon",
	published: "Publiée",
	archived: "Archivée",
	censored: "Censurée",
}

const DATE_SORT_FILTERS = ["Plus récente", "Plus ancienne"] as const

export default function SurveyTableContainer() {
	const [selectedSurveyIds, setSelectedSurveyIds] = useState<number[]>([])
	const [isHeaderChecked, setIsHeaderChecked] = useState<CheckedState>(false)
	const [filters, setFilters] = useState<string[]>([])
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const [currentPage, setCurrentPage] = useState<number>(1)
	const surveysPerPage = 5

	const selectedStatuses = filters.filter(f =>
		Object.values(statusLabelMap).includes(f)
	)

	const selectedSort = filters.find((f): f is DateSortFilter =>
		DATE_SORT_FILTERS.includes(f as DateSortFilter)
	)

	const handleSearch = useCallback((query: string) => {
		setDebouncedSearch(query)
		setCurrentPage(1)
	}, [])

	const { data, loading, networkStatus } = useQuery<SurveysDashboardQuery>(
		GET_MY_SURVEYS,
		{
			variables: {
				filters: {
					page: currentPage,
					limit: surveysPerPage,
					search: debouncedSearch,
					status: selectedStatuses.map(
						label =>
							Object.entries(statusLabelMap).find(
								([, v]) => v === label
							)?.[0]
					) as SurveyStatus[],
					sortBy: "createdAt",
					order: selectedSort === "Plus ancienne" ? "ASC" : "DESC",
				},
				notifyOnNetworkStatusChange: true,
			},
		}
	)

	const isRefetching = networkStatus === NetworkStatus.refetch
	const isInitialLoading = loading && !data

	const [previousData, setPreviousData] =
		useState<SurveysDashboardQuery | null>(null)

	useEffect(() => {
		if (data && !isRefetching) {
			setPreviousData(data)
		}
	}, [data, isRefetching])

	const currentData = data || previousData
	const surveysData = currentData?.mySurveys?.surveys ?? []
	const totalCount = currentData?.mySurveys?.totalCount ?? 0
	const totalCountAll = currentData?.mySurveys?.totalCountAll ?? 0

	const handleSurveyCheckboxChange = (
		surveyId: number,
		checked: CheckedState
	) => {
		setSelectedSurveyIds(prev => {
			let updated: number[]

			if (checked === true) {
				updated = prev.includes(surveyId) ? prev : [...prev, surveyId]
			} else {
				updated = prev.filter(id => id !== surveyId)
			}

			if (updated.length === paginatedSurveys.length) {
				setIsHeaderChecked(true)
			} else if (updated.length === 0) {
				setIsHeaderChecked(false)
			}

			return updated
		})
	}

	const handleSelectAll = (checked: CheckedState) => {
		setIsHeaderChecked(checked)

		if (checked === true) {
			setSelectedSurveyIds(paginatedSurveys.map(s => s.id))
		} else if (checked === false) {
			setSelectedSurveyIds([])
		}
	}

	const atLeastTwoSelected = selectedSurveyIds.length >= 2

	const paginatedSurveys = surveysData

	useEffect(() => {
		setIsHeaderChecked(false)
		setSelectedSurveyIds([])
	}, [currentPage])

	if (isInitialLoading && !previousData) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-black-default text-xl font-medium">
					Chargement des enquêtes...
				</p>
			</div>
		)
	}

	if (totalCountAll === 0 && !isRefetching && currentData) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-black-default text-xl font-medium">
					Vous n'avez pas encore créé d'enquête...
				</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="flex items-start justify-between max-sm:flex-col max-sm:gap-5">
				<SurveyTableFilter filters={filters} setFilters={setFilters} />
				<SurveyTableSearch onSearch={handleSearch} />
			</div>
			{isRefetching && (
				<div className="flex items-center justify-center py-4">
					<p className="text-lg text-gray-600">
						Chargement des résultats...
					</p>
				</div>
			)}
			<div>
				{totalCount > 0 ? (
					<SurveyTable
						isHeaderChecked={isHeaderChecked}
						handleSelectAll={handleSelectAll}
						surveys={paginatedSurveys}
						selectedSurveyIds={selectedSurveyIds}
						handleSurveyCheckboxChange={handleSurveyCheckboxChange}
						statusLabelMap={statusLabelMap}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<p className="text-black-default text-xl font-medium">
							Aucune enquête ne correspond à votre recherche...
						</p>
					</div>
				)}
			</div>
			<SurveyTableNav
				showDeleteButton={atLeastTwoSelected}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				totalCount={totalCount}
				surveysPerPage={surveysPerPage}
				selectedSurveyIds={selectedSurveyIds}
			/>
		</div>
	)
}
