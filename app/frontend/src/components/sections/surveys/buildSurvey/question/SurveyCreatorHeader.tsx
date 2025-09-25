import SurveyForm from "@/components/sections/surveys/form/SurveyForm"
import { Collapsible } from "@/components/ui/Collapsible"
import { useScreenDetector } from "@/hooks/useScreenDetector"
import { cn } from "@/lib/utils"
import { SurveyWithoutQuestions } from "@/types/types"
import { useState } from "react"
import { SurveyButtons } from "./SurveyButtons"
import { SurveyCreatorHeaderCollapse } from "./SurveyCreatorHeaderCollapse"

/**
 * @description Header component for editing a survey.
 * Handles mobile/desktop layout, expandable/collapsible behavior, and buttons for survey actions.
 *
 * @param survey Survey data without questions
 * @param hasQuestions Whether the survey has any questions (used for validation before publishing)
 */
export function SurveyCreatorHeader({
	survey,
	hasQuestions,
}: {
	survey: SurveyWithoutQuestions
	hasQuestions: boolean
}) {
	const { isMobile } = useScreenDetector()
	const [isExpanded, setIsExpanded] = useState<boolean>(false)
	const [isTransitionEnded, setIsTransitionEnded] = useState<boolean>(false)

	return (
		<section className="w-full px-4 pt-4 pb-2">
			<div className="flex flex-col gap-4">
				{isMobile && (
					<SurveyButtons
						status={survey.status}
						hasQuestions={hasQuestions}
					/>
				)}
				<div
					className={cn(
						"shadow-default border-black-50 flex h-fit max-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height)_-_10vh)] flex-col rounded-xl border bg-white p-4 pb-6 transition-all duration-200 ease-in-out md:max-h-fit",
						isExpanded && "gap-4 pb-4",
						!isExpanded && isTransitionEnded && "gap-0"
					)}
				>
					<SurveyCreatorHeaderCollapse
						isExpanded={isExpanded}
						setIsExpanded={setIsExpanded}
						surveyStatus={survey.status}
						surveyTitle={survey.title}
						hasQuestions={hasQuestions}
					/>
					<Collapsible
						isExpanded={isExpanded}
						isTransitionEnded={isTransitionEnded}
						setIsTransitionEnded={setIsTransitionEnded}
					>
						<SurveyForm survey={survey} />
					</Collapsible>
				</div>
			</div>
		</section>
	)
}
