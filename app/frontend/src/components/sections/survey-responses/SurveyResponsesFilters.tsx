import { useState, useEffect } from "react"
import {
	SurveyResponsesQueryInput,
	ResponseCompletionStatus,
	ResponseSortField,
	SortDirection,
} from "@/types/types"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { X, Filter } from "lucide-react"

interface SurveyResponsesFiltersProps {
	filters: SurveyResponsesQueryInput
	onFiltersChange: (filters: Partial<SurveyResponsesQueryInput>) => void
}

export function SurveyResponsesFilters({
	filters,
	onFiltersChange,
}: SurveyResponsesFiltersProps) {
	const [localFilters, setLocalFilters] =
		useState<SurveyResponsesQueryInput>(filters)

	useEffect(() => {
		setLocalFilters(filters)
	}, [filters])

	const handleFilterChange = (
		key: keyof SurveyResponsesQueryInput,
		value: string | number | boolean | undefined
	) => {
		const newFilters = { ...localFilters, [key]: value }
		setLocalFilters(newFilters)
	}

	const handleApplyFilters = () => {
		onFiltersChange(localFilters)
	}

	const handleClearFilters = () => {
		const clearedFilters: SurveyResponsesQueryInput = {
			page: 1,
			limit: 15,
			sortBy: ResponseSortField.SubmittedAt,
			sortDirection: SortDirection.Desc,
		}
		setLocalFilters(clearedFilters)
		onFiltersChange(clearedFilters)
	}

	const hasActiveFilters = () => {
		return !!(
			localFilters.keyword ||
			localFilters.dateFrom ||
			localFilters.dateTo ||
			localFilters.completionStatus ||
			localFilters.sortBy !== ResponseSortField.SubmittedAt ||
			localFilters.sortDirection !== SortDirection.Desc
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Filter className="h-5 w-5" />
					Filtres et tri
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{/* Keyword Search */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Recherche</label>
						<Input
							placeholder="Rechercher dans les réponses..."
							value={localFilters.keyword || ""}
							onChange={e =>
								handleFilterChange("keyword", e.target.value)
							}
							errorMessage=""
						/>
					</div>

					{/* Date From */}
					<div className="space-y-2">
						<label className="text-sm font-medium">
							Date de début
						</label>
						<Input
							type="date"
							value={localFilters.dateFrom || ""}
							onChange={e =>
								handleFilterChange("dateFrom", e.target.value)
							}
							errorMessage=""
						/>
					</div>

					{/* Date To */}
					<div className="space-y-2">
						<label className="text-sm font-medium">
							Date de fin
						</label>
						<Input
							type="date"
							value={localFilters.dateTo || ""}
							onChange={e =>
								handleFilterChange("dateTo", e.target.value)
							}
							errorMessage=""
						/>
					</div>

					{/* Completion Status */}
					<div className="space-y-2">
						<label className="text-sm font-medium">
							Statut de completion
						</label>
						<Select
							value={localFilters.completionStatus || "all"}
							onValueChange={value =>
								handleFilterChange(
									"completionStatus",
									value === "all" ? undefined : value
								)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Tous les statuts" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									Tous les statuts
								</SelectItem>
								<SelectItem
									value={ResponseCompletionStatus.Complete}
								>
									Complète
								</SelectItem>
								<SelectItem
									value={ResponseCompletionStatus.Partial}
								>
									Partielle
								</SelectItem>
								<SelectItem
									value={ResponseCompletionStatus.Incomplete}
								>
									Incomplète
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Sort By */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Trier par</label>
						<Select
							value={
								localFilters.sortBy ||
								ResponseSortField.SubmittedAt
							}
							onValueChange={value =>
								handleFilterChange("sortBy", value)
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value={ResponseSortField.SubmittedAt}
								>
									Date de soumission
								</SelectItem>
								<SelectItem value={ResponseSortField.UserEmail}>
									Email utilisateur
								</SelectItem>
								<SelectItem
									value={ResponseSortField.CompletionStatus}
								>
									Statut de completion
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Sort Direction */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Ordre</label>
						<Select
							value={
								localFilters.sortDirection || SortDirection.Desc
							}
							onValueChange={value =>
								handleFilterChange("sortDirection", value)
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={SortDirection.Desc}>
									Décroissant
								</SelectItem>
								<SelectItem value={SortDirection.Asc}>
									Croissant
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center justify-between border-t pt-4">
					<div className="flex gap-2">
						<Button
							onClick={handleApplyFilters}
							ariaLabel="Appliquer les filtres"
						>
							Appliquer les filtres
						</Button>
						{hasActiveFilters() && (
							<Button
								variant="outline"
								onClick={handleClearFilters}
								ariaLabel="Effacer tous les filtres"
							>
								<X className="mr-2 h-4 w-4" />
								Effacer
							</Button>
						)}
					</div>
					{hasActiveFilters() && (
						<p className="text-black-600 text-sm">Filtres actifs</p>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
