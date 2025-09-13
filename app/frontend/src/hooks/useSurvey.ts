import { GET_CATEGORIES } from "@/graphql/survey/category"
import {
	CREATE_SURVEY,
	DELETE_SURVEY,
	GET_MY_SURVEYS,
	GET_SURVEY,
	GET_SURVEYS,
	UPDATE_SURVEY,
	UPDATE_SURVEY_STATUS,
} from "@/graphql/survey/survey"
import {
	AllSurveysHome,
	CreateSurveyInput,
	DateSortFilter,
	SurveysDashboardQuery,
	SurveyStatusType,
	SurveyTableType,
	UpdateSurveyInput,
} from "@/types/types"
import { NetworkStatus, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useToast } from "./useToast"

const statusLabelMap: Record<SurveyTableType["status"], string> = {
	draft: "Brouillon",
	published: "Publiée",
	archived: "Archivée",
	censored: "Censurée",
}

const DATE_SORT_FILTERS = ["Plus récente", "Plus ancienne"] as const

/**
 * Hook for the survey management.
 */
export function useSurvey(surveyId?: string) {
	const [searchParams] = useSearchParams()
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [sortTimeOption, setSortTimeOption] = useState<string>("")
	const [filters, setFilters] = useState<string[]>([])
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const PER_PAGE = {
		all: 12,
		mine: 5,
	}
	const { showToast } = useToast()

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

	// Apollo hooks
	const {
		data: allSurveysData,
		loading: isFetching,
		refetch,
	} = useQuery<AllSurveysHome>(GET_SURVEYS, {
		variables: {
			filters: {
				page: currentPage,
				limit: PER_PAGE.all,
				search: searchParams.get("search") || "",
				categoryIds: categoryId ? [parseInt(categoryId, 10)] : [],
				sortBy,
				order,
			},
		},
	})
	const allSurveys = allSurveysData?.surveys.allSurveys || []

	const {
		data: surveyData,
		loading: surveyLoading,
		error: surveyError,
	} = useQuery(GET_SURVEY, {
		variables: { surveyId: surveyId },
		skip: !surveyId,
	})
	const survey = surveyData?.survey

	const selectedStatuses = filters.filter(f =>
		Object.values(statusLabelMap).includes(f)
	)

	const selectedSort = filters.find((f): f is DateSortFilter =>
		DATE_SORT_FILTERS.includes(f as DateSortFilter)
	)

	const {
		data: mySurveysData,
		loading,
		networkStatus,
	} = useQuery<SurveysDashboardQuery>(GET_MY_SURVEYS, {
		variables: {
			filters: {
				page: currentPage,
				limit: PER_PAGE.mine,
				search: debouncedSearch,
				status: selectedStatuses.map(
					label =>
						Object.entries(statusLabelMap).find(
							([, v]) => v === label
						)?.[0]
				) as SurveyStatusType[],
				sortBy: "createdAt",
				order: selectedSort === "Plus ancienne" ? "ASC" : "DESC",
			},
			notifyOnNetworkStatusChange: true,
		},
	})
	const mySurveys = mySurveysData?.mySurveys || null

	const isRefetching = networkStatus === NetworkStatus.refetch
	const isInitialLoading = loading && !mySurveysData

	const totalCount = allSurveysData?.surveys.totalCount ?? 0

	const {
		data: categoriesData,
		loading: loadingCategories,
		error: errorCategories,
	} = useQuery(GET_CATEGORIES)

	const [createSurvey, { loading: isCreating, error: createError }] =
		useMutation(CREATE_SURVEY, {
			refetchQueries: [{ query: GET_SURVEYS }],
		})

	const [updateSurveyMutation, { loading: isUpdating, error: updateError }] =
		useMutation(UPDATE_SURVEY, {
			refetchQueries: [{ query: GET_SURVEYS }],
		})

	const [
		updateSurveyStatusMutation,
		{
			loading: isStatusUpdating,
			error: isStatusUpdateError,
			reset: resetStatusUpdateError,
		},
	] = useMutation(UPDATE_SURVEY_STATUS)

	const [doDeleteSurvey] = useMutation(DELETE_SURVEY, {
		refetchQueries: [GET_MY_SURVEYS],
	})

	const fetchSurveys = async () => {
		await refetch()
	}

	const addSurvey = async (
		survey: CreateSurveyInput
	): Promise<{ id: string } | undefined> => {
		const result = await createSurvey({
			variables: { data: survey },
		})
		return result.data?.createSurvey
	}

	const updateSurvey = async (
		id: string,
		survey: Partial<UpdateSurveyInput>
	) => {
		const result = await updateSurveyMutation({
			variables: {
				data: {
					...survey,
					id,
				},
			},
		})
		return result.data?.updateSurvey
	}

	const updateSurveyStatus = async (id: string, status: SurveyStatusType) => {
		const result = await updateSurveyStatusMutation({
			variables: { data: { id, status } },
			refetchQueries: [
				{ query: GET_SURVEY, variables: { surveyId: id } },
				{ query: GET_SURVEYS },
			],
			awaitRefetchQueries: true,
		})
		return result.data?.updateSurvey
	}

	const deleteSurvey = async (surveyId: string) => {
		try {
			await doDeleteSurvey({
				variables: {
					surveyId: surveyId,
				},
			})

			showToast({
				type: "success",
				title: "L'enquête a bien été supprimée !",
				description:
					"Vous pouvez poursuivre votre lecture du tableau de bord.",
			})
		} catch (error) {
			if (error instanceof Error) {
				if (
					error.message.includes(
						"Access denied! You don't have permission for this action!"
					)
				) {
					showToast({
						type: "error",
						title: "Échec de la suppression",
						description: "Vous n'avez pas les droits nécessaires.",
					})
				} else {
					showToast({
						type: "error",
						title: "Erreur lors de la suppression",
						description:
							"Une erreur est survenue. Veuillez réessayer plus tard.",
					})
				}
			} else {
				showToast({
					type: "error",
					title: "Erreur inattendue",
					description: "Une erreur inconnue est survenue.",
				})
			}
		}
	}

	const deleteSurveys = async (selectedSurveyIds: number[]) => {
		try {
			await Promise.all(
				selectedSurveyIds.map(id =>
					doDeleteSurvey({
						variables: { surveyId: id.toString() },
					})
				)
			)

			showToast({
				type: "success",
				title: "Les enquêtes ont bien été supprimées !",
				description:
					"Vous pouvez poursuivre votre lecture du tableau de bord.",
			})
		} catch (error) {
			console.error("Erreur lors de la suppression :", error)

			showToast({
				type: "error",
				title: "Un problème est survenu pendant la suppression des enquêtes...",
				description: "Veuillez réessayer dans quelques instants.",
			})
		}
	}

	return {
		allSurveys,
		isFetching,
		survey,
		surveyLoading,
		surveyError,
		isCreating,
		isUpdating,
		createError,
		updateError,
		currentPage,
		setCurrentPage,
		PER_PAGE,
		sortTimeOption,
		setSortTimeOption,
		totalCount,
		setDebouncedSearch,
		mySurveys,
		isRefetching,
		isInitialLoading,
		filters,
		setFilters,
		statusLabelMap,
		categoriesData,
		loadingCategories,
		errorCategories,
		fetchSurveys,
		addSurvey,
		updateSurvey,
		deleteSurvey,
		deleteSurveys,
		updateSurveyStatus,
		isStatusUpdating,
		isStatusUpdateError,
		resetStatusUpdateError,
	}
}
