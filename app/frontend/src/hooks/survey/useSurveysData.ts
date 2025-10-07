import { GET_MY_SURVEYS, GET_SURVEYS } from "@/graphql/survey/survey"
import {
	AllSurveysType,
	DateSortFilter,
	SurveysDashboardQuery,
	SurveyStatusType,
	SurveyTableType,
	UseSurveysMode,
} from "@/types/types"
import { NetworkStatus, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useDebounce } from "../useDebounce"

/**
 * Hook to fetch and manage multiple surveys' data.
 *
 * @description
 * This hook uses Apollo Client's `useQuery` to fetch surveys depending on the given mode.
 * It handles pagination, filters, search (with debounce), and sorting.
 * For fetching a single survey, use `useSurveyData()`.
 *
 * @param {UseSurveysMode} params - Object containing the mode ("home", "admin", or "profile")
 * @returns {Object} An object containing surveys data and query state
 *
 * @property {Survey[] | null} surveys - General surveys list (GET_SURVEYS)
 * @property {boolean} isLoadingSurveys - Loading state for general surveys
 * @property {Error | undefined} surveysError - Error from general surveys query
 * @property {() => Promise<void>} refetchSurveys - Refetch function for general surveys
 *
 * @property {Survey[] | null} mySurveys - User-specific surveys list (GET_MY_SURVEYS)
 * @property {boolean} isInitialLoadingMySurveys - True while mySurveys is initially loading
 * @property {boolean} isRefetchingMySurveys - True while mySurveys is being refetched
 * @property {Error | undefined} mySurveysError - Error from mySurveys query
 * @property {() => Promise<void>} refetchMySurveys - Refetch function for mySurveys
 *
 * @property {number} totalCount - Total number of surveys (from GET_SURVEYS)
 * @property {number} currentPage - Current pagination page
 * @property {(page: number) => void} setCurrentPage - Setter for current page
 * @property {string[]} filters - Active filters (statuses or date filters)
 * @property {(filters: string[]) => void} setFilters - Setter for filters
 * @property {string} sortTimeOption - Current sorting option
 * @property {(opt: string) => void} setSortTimeOption - Setter for sorting option
 * @property {string} debouncedSearch - Debounced search value
 * @property {(val: string) => void} setDebouncedSearch - Setter for search input
 *
 * @example
 * ```tsx
 * const {
 *   surveys, isLoadingSurveys, surveysError,
 *   mySurveys, isInitialLoadingMySurveys
 * } = useSurveysData({ mode: "home" });
 *
 * if (isLoadingSurveys) return <p>Loading...</p>;
 * if (surveysError) return <p>Error: {surveysError.message}</p>;
 *
 * return (
 *   <div>
 *     {surveys?.items.map(s => (
 *       <div key={s.id}>{s.title}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */

const statusLabelMap: Record<SurveyTableType["status"], string> = {
	draft: "Brouillon",
	published: "Publiée",
	archived: "Archivée",
	censored: "Censurée",
}

const DATE_SORT_FILTERS = ["Plus récente", "Plus ancienne"] as const

export function useSurveysData<T>({ mode }: UseSurveysMode) {
	const [searchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [sortTimeOption, setSortTimeOption] = useState<string>("")
	const [filters, setFilters] = useState<string[]>([])
	const [searchValue, setSearchValue] = useState(
		searchParams.get("search") || ""
	)

	const debouncedSearch = useDebounce(searchValue, 300)

	useEffect(() => {
		setSearchValue(searchParams.get("search") || "")
	}, [searchParams])

	const PER_PAGE = {
		home: 12,
		admin: 5,
		profile: 5,
	}

	const getLimit = () => {
		if (!mode || mode === "home") return PER_PAGE.home
		if (mode === "admin") return PER_PAGE.admin
		if (mode === "profile") return PER_PAGE.profile
		return PER_PAGE.home
	}

	const categoryId = searchParams.get("categoryId")

	const getSortParams = (sortTimeOption: string) => {
		if (!sortTimeOption)
			return { sortBy: "estimatedDuration", order: "DESC" }

		const [field, direction] = sortTimeOption.split("_")
		return {
			sortBy: field as "estimatedDuration" | "availableDuration",
			order: direction as "ASC" | "DESC",
		}
	}

	const { sortBy, order } = getSortParams(sortTimeOption)

	const selectedStatuses = filters.filter(f =>
		Object.values(statusLabelMap).includes(f)
	)

	const statusForSurveys: SurveyStatusType[] =
		mode === "home"
			? (["published"] as SurveyStatusType[])
			: (selectedStatuses.map(
					label =>
						Object.entries(statusLabelMap).find(
							([, v]) => v === label
						)?.[0]
				) as SurveyStatusType[])

	const selectedSort = filters.find((f): f is DateSortFilter =>
		DATE_SORT_FILTERS.includes(f as DateSortFilter)
	)

	const {
		data: surveysData,
		loading: isLoadingSurveys,
		error: surveysError,
		refetch: refetchSurveys,
	} = useQuery<AllSurveysType<T>>(GET_SURVEYS, {
		variables: {
			filters: {
				page: currentPage,
				limit: getLimit(),
				search: searchParams.get("search") || "",
				categoryIds: categoryId ? [parseInt(categoryId, 10)] : [],
				status: statusForSurveys,
				sortBy,
				order,
			},
		},
	})

	const totalCount = surveysData?.surveys.totalCount ?? 0

	const {
		data: mySurveysData,
		loading: isLoadingMySurveys,
		error: mySurveysError,
		refetch: refetchMySurveys,
		networkStatus,
	} = useQuery<SurveysDashboardQuery>(GET_MY_SURVEYS, {
		variables: {
			filters: {
				page: currentPage,
				limit: getLimit(),
				search: debouncedSearch,
				status: statusForSurveys,
				sortBy: "createdAt",
				order: selectedSort === "Plus ancienne" ? "ASC" : "DESC",
			},
			notifyOnNetworkStatusChange: true,
		},
	})

	const isRefetchingMySurveys = networkStatus === NetworkStatus.refetch
	const isInitialLoadingMySurveys = isLoadingMySurveys && !mySurveysData

	return {
		surveys: surveysData?.surveys || null,
		isLoadingSurveys,
		surveysError,
		refetchSurveys,
		mySurveys: mySurveysData?.mySurveys || null,
		isRefetchingMySurveys,
		isInitialLoadingMySurveys,
		mySurveysError,
		refetchMySurveys,
		totalCount,
		filters,
		setFilters,
		statusLabelMap,
		currentPage,
		setCurrentPage,
		PER_PAGE,
		sortTimeOption,
		setSortTimeOption,
		debouncedSearch,
		setDebouncedSearch: setSearchValue,
	}
}
