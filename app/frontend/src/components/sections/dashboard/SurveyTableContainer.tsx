import { MySurveysResult } from "@/types/types"
import { CheckedState } from "@radix-ui/react-checkbox"
import { useCallback, useEffect, useState } from "react"
import SurveyTable from "@/components/sections/dashboard/SurveyTable"
import SurveyTableNav from "@/components/sections/dashboard/SurveyTableNav"
import SurveyTableFilter from "@/components/sections/dashboard/SurveyTableFilter"
import SurveyTableSearch from "@/components/sections/dashboard/SurveyTableSearch"
import { useSurvey } from "@/hooks/useSurvey"

export default function SurveyTableContainer() {
	const [selectedSurveyIds, setSelectedSurveyIds] = useState<number[]>([])
	const [isHeaderChecked, setIsHeaderChecked] = useState<CheckedState>(false)

	const {
		currentPage,
		setCurrentPage,
		setDebouncedSearch,
		mySurveys,
		isRefetching,
		isInitialLoading,
		filters,
		setFilters,
		statusLabelMap,
		PER_PAGE,
	} = useSurvey()

	const handleSearch = useCallback(
		(query: string) => {
			setDebouncedSearch(query)
			setCurrentPage(1)
		},
		[setDebouncedSearch, setCurrentPage]
	)

	const [previousData, setPreviousData] = useState<MySurveysResult | null>(
		null
	)

	useEffect(() => {
		if (mySurveys && !isRefetching) {
			setPreviousData(mySurveys)
		}
	}, [mySurveys, isRefetching])

	const currentData = mySurveys || previousData
	const surveysData = currentData?.surveys ?? []
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
		<div className="flex w-full flex-col gap-10">
			<div className="flex items-start justify-between gap-5 max-md:flex-col">
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
				surveysPerPage={PER_PAGE.mine}
				selectedSurveyIds={selectedSurveyIds}
			/>
		</div>
	)
}
