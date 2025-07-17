import { Button } from "@/components/ui/Button"
import Pagination from "@/components/ui/Pagination"
import { useResponsivity } from "@/hooks/useResponsivity"
import { useSurvey } from "@/hooks/useSurvey"
import { cn } from "@/lib/utils"
import { SurveyTableNavProps } from "@/types/types"

export default function SurveyTableNav({
	showDeleteButton,
	currentPage,
	totalCount,
	surveysPerPage,
	setCurrentPage,
	selectedSurveyIds,
}: SurveyTableNavProps) {
	const { deleteSurveys } = useSurvey()
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)

	return (
		<div
			className="flex items-center justify-between max-lg:flex-wrap max-lg:justify-center max-lg:gap-x-10 max-lg:gap-y-5"
			ref={rootRef}
		>
			<Button
				ariaLabel="Créer une enquête"
				variant="secondary"
				fullWidth={isHorizontalCompact}
				to="/surveys/create"
				role="link"
				className="max-lg:order-2 md:w-1/2 lg:w-auto"
			>
				Créer une enquête
			</Button>
			<Pagination
				className="m-0 w-max max-lg:order-1 max-lg:w-full"
				currentPage={currentPage}
				totalCount={totalCount}
				perPage={surveysPerPage}
				onPageChange={setCurrentPage}
			/>
			<Button
				ariaLabel="Supprimer des enquêtes"
				variant="destructive"
				fullWidth={isHorizontalCompact}
				onClick={() => deleteSurveys(selectedSurveyIds)}
				className={cn(
					"transition-all duration-200 ease-in-out max-lg:order-3 md:w-1/2 lg:w-auto",
					showDeleteButton
						? "visible opacity-100"
						: "pointer-events-none invisible opacity-0"
				)}
			>
				Supprimer des enquêtes
			</Button>
		</div>
	)
}
