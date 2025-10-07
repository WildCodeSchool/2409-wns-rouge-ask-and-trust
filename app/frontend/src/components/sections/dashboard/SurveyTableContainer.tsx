import {
	AllSurveysResult,
	MySurveysResult,
	SurveyTableContainerProps,
	SurveyTableType,
} from "@/types/types"
import { CheckedState } from "@radix-ui/react-checkbox"
import { useCallback, useEffect, useState } from "react"
import SurveyTable from "@/components/sections/dashboard/SurveyTable"
import SurveyTableNav from "@/components/sections/dashboard/SurveyTableNav"
import SurveyTableFilter from "@/components/sections/dashboard/SurveyTableFilter"
import SurveyTableSearch from "@/components/sections/dashboard/SurveyTableSearch"
import { useSurveysData } from "@/hooks/survey/useSurveysData"

export default function SurveyTableContainer({
	mode,
}: SurveyTableContainerProps) {
	const [selectedSurveyIds, setSelectedSurveyIds] = useState<number[]>([])
	const [isHeaderChecked, setIsHeaderChecked] = useState<CheckedState>(false)
	const [previousData, setPreviousData] = useState<
		MySurveysResult | AllSurveysResult<SurveyTableType> | null
	>(null)

	const {
		surveys,
		mySurveys,
		currentPage,
		PER_PAGE,
		setCurrentPage,
		setDebouncedSearch,
		filters,
		setFilters,
		statusLabelMap,
		isRefetchingMySurveys,
		isInitialLoadingMySurveys,
	} = useSurveysData<SurveyTableType>({ mode })

	const handleSearch = useCallback(
		(query: string) => {
			setDebouncedSearch(query)
			setCurrentPage(1)
		},
		[setDebouncedSearch, setCurrentPage]
	)

	// Use correct data based on mode
	const currentModeData = mode === "profile" ? mySurveys : surveys

	useEffect(() => {
		if (currentModeData && !isRefetchingMySurveys) {
			setPreviousData(currentModeData)
		}
	}, [currentModeData, isRefetchingMySurveys])

	const currentData = currentModeData || previousData

	const surveysData = currentData
		? "surveys" in currentData
			? currentData.surveys
			: currentData.allSurveys
		: []

	const totalCount = currentData?.totalCount ?? 0
	const totalCountAll = currentData?.totalCountAll ?? 0
	const paginatedSurveys = surveysData

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
			} else {
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

	useEffect(() => {
		setIsHeaderChecked(false)
		setSelectedSurveyIds([])
	}, [currentPage])

	if (isInitialLoadingMySurveys && !previousData) {
		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-black-default text-xl font-medium">
					Chargement des enquêtes...
				</p>
			</div>
		)
	}

	if (totalCountAll === 0 && !isRefetchingMySurveys && currentData) {
		const noDataMessage =
			mode === "profile"
				? "Vous n'avez pas encore créé d'enquête..."
				: "Aucune enquête n'a encore été créée..."

		return (
			<div className="flex h-full w-full items-center justify-center">
				<p className="text-black-default text-xl font-medium">
					{noDataMessage}
				</p>
			</div>
		)
	}

	const surveysPerPage =
		mode === "profile" ? PER_PAGE.profile : PER_PAGE.admin

	return (
		<div className="flex w-full flex-col gap-10">
			<div className="flex items-start justify-between gap-5 max-md:flex-col">
				<SurveyTableFilter filters={filters} setFilters={setFilters} />
				<SurveyTableSearch onSearch={handleSearch} />
			</div>
			{isRefetchingMySurveys && (
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
					<div className="flex h-full w-full items-center justify-center text-center">
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
