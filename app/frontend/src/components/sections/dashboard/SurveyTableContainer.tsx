import { SurveysDashboardQuery, SurveyTableType } from "@/types/types"
import { CheckedState } from "@radix-ui/react-checkbox"
import { useEffect, useState } from "react"
import SurveyTable from "./SurveyTable"
import SurveyTableNav from "./SurveyTableNav"
import SurveyTableFilter from "./SurveyTableFilter"
import { useQuery } from "@apollo/client"
import { GET_SURVEYS } from "@/graphql/survey/survey"

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
	const [currentPage, setCurrentPage] = useState<number>(1)
	const surveysPerPage = 5

	const { data } = useQuery<SurveysDashboardQuery>(GET_SURVEYS, {
		fetchPolicy: "cache-and-network",
	})
	const surveysData = data?.surveys ?? []

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

	const selectedStatuses = filters.filter(f =>
		Object.values(statusLabelMap).includes(f)
	)

	const selectedSort = filters.find(f => DATE_SORT_FILTERS.includes(f as any))

	const filteredSurveys = surveysData.filter(survey => {
		const statusLabel = statusLabelMap[survey.status]
		const matchStatus =
			selectedStatuses.length === 0 ||
			selectedStatuses.includes(statusLabel)
		return matchStatus
	})

	const sortedSurveys = [...filteredSurveys].sort((a, b) => {
		switch (selectedSort) {
			case "Plus récente":
				return (
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
				)
			case "Plus ancienne":
				return (
					new Date(a.createdAt).getTime() -
					new Date(b.createdAt).getTime()
				)
			default:
				return 0
		}
	})

	const start = (currentPage - 1) * surveysPerPage
	const end = start + surveysPerPage
	const paginatedSurveys = sortedSurveys.slice(start, end)

	useEffect(() => {
		const totalPages = Math.ceil(sortedSurveys.length / surveysPerPage)

		if (currentPage > totalPages) {
			setCurrentPage(Math.max(1, totalPages))
		}

		setIsHeaderChecked(false)
		setSelectedSurveyIds([])
	}, [sortedSurveys.length, currentPage, surveysPerPage])

	if (surveysData.length === 0) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-black-default text-xl font-medium">
					Vous n'avez pas encore créé d'enquête.
				</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-10">
			<SurveyTableFilter filters={filters} setFilters={setFilters} />
			<div>
				<SurveyTable
					isHeaderChecked={isHeaderChecked}
					handleSelectAll={handleSelectAll}
					surveys={paginatedSurveys}
					selectedSurveyIds={selectedSurveyIds}
					handleSurveyCheckboxChange={handleSurveyCheckboxChange}
					statusLabelMap={statusLabelMap}
				/>
				<SurveyTableNav
					showDeleteButton={atLeastTwoSelected}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					sortedSurveys={sortedSurveys}
					surveysPerPage={surveysPerPage}
					selectedSurveyIds={selectedSurveyIds}
				/>
			</div>
		</div>
	)
}
