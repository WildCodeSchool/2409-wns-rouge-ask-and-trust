import { Chipset } from "@/components/ui/Chipset"
import { useScreenDetector } from "@/hooks/useScreenDetector"
import { cn } from "@/lib/utils"
import { SurveyStatusType } from "@/types/types"
import { ChevronDown } from "lucide-react"
import { SurveyButtons } from "./SurveyButtons"

/**
 * @description Survey header collapse component displaying title, status, and toggle button.
 *
 * @param isExpanded Whether the collapsible section is expanded
 * @param setIsExpanded Setter function to toggle expanded state
 * @param surveyTitle Title of the survey
 * @param surveyStatus Current status of the survey
 * @param hasQuestions Whether the survey has any questions
 */
export function SurveyCreatorHeaderCollapse({
	isExpanded,
	setIsExpanded,
	surveyTitle,
	surveyStatus,
	hasQuestions,
}: {
	isExpanded: boolean
	setIsExpanded: (value: boolean | ((prev: boolean) => boolean)) => void
	surveyTitle: string
	surveyStatus: SurveyStatusType | undefined
	hasQuestions: boolean
}) {
	const { isMobile } = useScreenDetector()

	const translateStatus = (status: SurveyStatusType | undefined) => {
		switch (status) {
			case "draft":
				return "brouillon"
			case "published":
				return "publiée"
			case "archived":
				return "archivée"
			case "censored":
				return "censurée"
		}
	}

	const translatedStatus = translateStatus(surveyStatus)

	return (
		<div className="flex w-full items-center justify-between gap-2">
			<button
				className="flex w-full min-w-0 cursor-pointer items-center justify-between"
				onClick={() => {
					setIsExpanded((prev: boolean) => !prev)
				}}
			>
				<div
					className={cn(
						"flex min-w-0 items-center gap-4",
						isMobile && "w-full justify-between"
					)}
				>
					<div className="flex min-w-0 flex-col items-start">
						<div className="flex min-w-0 items-center gap-2">
							<h1 className="text-lg font-semibold text-gray-900">
								Gestion de l'enquête
							</h1>
							<Chipset
								ariaLabel={`L'enquête possède le statut ${translatedStatus}`}
								state={surveyStatus || "draft"}
								size="sm"
								rounded
							>
								{translatedStatus}
							</Chipset>
						</div>
						{surveyTitle && (
							<h3
								className={cn(
									"text-start text-base text-gray-600",
									isMobile ? "line-clamp-2" : "line-clamp-1"
								)}
							>
								{surveyTitle}
							</h3>
						)}
					</div>
					<ChevronDown
						size={20}
						className={cn(
							"transform transition-transform duration-300",
							isExpanded && "rotate-180"
						)}
					/>
				</div>
			</button>
			{!isMobile && (
				<div className="ml-auto">
					<SurveyButtons
						status={surveyStatus}
						hasQuestions={hasQuestions}
					/>
				</div>
			)}
		</div>
	)
}
