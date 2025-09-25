import { SurveyResponsesResult, ResponseCompletionStatus } from "@/types/types"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import {
	ChevronLeft,
	ChevronRight,
	Eye,
	User,
	Calendar,
	CheckCircle,
	Clock,
	AlertCircle,
} from "lucide-react"

interface SurveyResponsesListProps {
	responses?: SurveyResponsesResult
	isLoading: boolean
	onResponseSelect: (responseId: string) => void
	onPageChange: (page: number) => void
	onNextPage: () => void
	onPreviousPage: () => void
}

export function SurveyResponsesList({
	responses,
	isLoading,
	onResponseSelect,
	onPageChange,
	onNextPage,
	onPreviousPage,
}: SurveyResponsesListProps) {
	if (isLoading) {
		return (
			<div className="space-y-4">
				{Array.from({ length: 5 }).map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<div className="bg-primary-200 h-4 w-48 rounded"></div>
									<div className="bg-primary-200 h-3 w-32 rounded"></div>
								</div>
								<div className="bg-primary-200 h-8 w-20 rounded"></div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	if (!responses || responses.responses.length === 0) {
		return (
			<Card>
				<CardContent className="p-12 text-center">
					<AlertCircle className="text-black-400 mx-auto mb-4 h-12 w-12" />
					<h3 className="text-black-900 mb-2 text-lg font-medium">
						Aucune réponse trouvée
					</h3>
					<p className="text-black-600">
						Ce sondage n'a pas encore reçu de réponses ou aucun
						résultat ne correspond à vos filtres.
					</p>
				</CardContent>
			</Card>
		)
	}

	const getCompletionStatusBadge = (status: ResponseCompletionStatus) => {
		switch (status) {
			case ResponseCompletionStatus.Complete:
				return (
					<Badge
						variant="secondary"
						className="bg-validate-light text-validate-dark"
					>
						<CheckCircle className="mr-1 h-3 w-3" />
						Complète
					</Badge>
				)
			case ResponseCompletionStatus.Partial:
				return (
					<Badge
						variant="secondary"
						className="bg-warning-light text-warning-dark"
					>
						<Clock className="mr-1 h-3 w-3" />
						Partielle
					</Badge>
				)
			case ResponseCompletionStatus.Incomplete:
				return (
					<Badge
						variant="secondary"
						className="bg-destructive-light text-destructive-dark"
					>
						<AlertCircle className="mr-1 h-3 w-3" />
						Incomplète
					</Badge>
				)
			default:
				return null
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	return (
		<div className="space-y-4">
			{/* Responses List */}
			<div className="space-y-3">
				{responses.responses.map(response => (
					<Card
						key={response.responseId}
						className="transition-shadow hover:shadow-md"
					>
						<CardContent className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="mb-2 flex items-center gap-3">
										<User className="text-black-500 h-5 w-5" />
										<div>
											<p className="text-black-900 font-medium">
												{response.user.firstname}{" "}
												{response.user.lastname}
											</p>
											<p className="text-black-600 text-sm">
												{response.user.email}
											</p>
										</div>
									</div>

									<div className="text-black-600 flex items-center gap-4 text-sm">
										<div className="flex items-center gap-1">
											<Calendar className="h-4 w-4" />
											{formatDate(response.submittedAt)}
										</div>
										<div>
											{response.answeredQuestions}/
											{response.totalQuestions} questions
										</div>
										<div>
											{response.completionPercentage}%
											complété
										</div>
									</div>
								</div>

								<div className="flex-wrap items-center gap-3">
									{getCompletionStatusBadge(
										response.completionStatus
									)}
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											onResponseSelect(
												response.responseId
											)
										}
										ariaLabel="Voir la réponse"
									>
										<Eye className="mr-2 h-4 w-4" />
										Voir
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Pagination */}
			{responses.totalPages > 1 && (
				<div className="flex items-center justify-between pt-4">
					<div className="text-black-600 text-sm">
						Affichage de{" "}
						{(responses.page - 1) * responses.limit + 1} à{" "}
						{Math.min(
							responses.page * responses.limit,
							responses.totalCount
						)}{" "}
						sur {responses.totalCount} réponses
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onPreviousPage}
							disabled={!responses.hasPreviousPage}
							ariaLabel="Page précédente"
						>
							<ChevronLeft className="h-4 w-4" />
							Précédent
						</Button>

						<div className="flex items-center gap-1">
							{Array.from(
								{ length: Math.min(5, responses.totalPages) },
								(_, i) => {
									const page = i + 1
									return (
										<Button
											key={page}
											variant={
												page === responses.page
													? "primary"
													: "outline"
											}
											ariaLabel={`Page ${page}`}
											size="sm"
											onClick={() => onPageChange(page)}
											className="h-8 w-8 p-0"
										>
											{page}
										</Button>
									)
								}
							)}
						</div>

						<Button
							variant="outline"
							size="sm"
							onClick={onNextPage}
							disabled={!responses.hasNextPage}
							ariaLabel="Page suivante"
						>
							Suivant
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
