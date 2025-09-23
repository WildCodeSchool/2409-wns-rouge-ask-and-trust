import SurveyForm from "@/components/sections/surveys/form/SurveyForm"
import { Button } from "@/components/ui/Button"
import { Chipset } from "@/components/ui/Chipset"
import { Collapsible } from "@/components/ui/Collapsible"
import { useCopyClipboard } from "@/hooks/useCopyClipboard"
import { useScreenDetector } from "@/hooks/useScreenDetector"
import { useSurvey } from "@/hooks/useSurvey"
import { useToast } from "@/hooks/useToast"
import { useToastOnChange } from "@/hooks/useToastOnChange"
import { cn } from "@/lib/utils"
import {
	SurveyStatus,
	SurveyStatusType,
	SurveyWithoutQuestions,
} from "@/types/types"
import { ChevronDown } from "lucide-react"
import { useCallback, useState } from "react"
import { useParams } from "react-router-dom"

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
		<section className="w-full p-4 pb-0 lg:p-4 lg:pb-0">
			<div className="flex flex-col gap-4">
				{isMobile && (
					<SurveyButtons
						status={survey.status}
						hasQuestions={hasQuestions}
					/>
				)}
				<div
					className={cn(
						"shadow-default border-black-50 flex h-fit max-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height)_-_10vh)] flex-col rounded-xl border bg-white p-4 transition-all duration-200 ease-in-out md:max-h-fit",
						isExpanded && "gap-4",
						!isExpanded && isTransitionEnded && "gap-0"
					)}
				>
					<Header
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

function Header({
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

function SurveyButtons({
	status,
	hasQuestions,
}: {
	status: SurveyStatusType | undefined
	hasQuestions: boolean
}) {
	const { id: surveyId } = useParams()
	const { updateSurveyStatus, isStatusUpdateError, resetStatusUpdateError } =
		useSurvey()
	const { showToast } = useToast()
	const { copyToClipboard } = useCopyClipboard()

	useToastOnChange({
		trigger: isStatusUpdateError,
		resetTrigger: resetStatusUpdateError,
		type: "error",
		title: "Oops, nous avons rencontré une erreur",
		description: "L'enquête n'a pas pu être publiée",
	})

	const onPublishSurvey = useCallback(async () => {
		if (!surveyId || !status) return

		if (!hasQuestions) {
			showToast({
				type: "warning",
				title: "Votre enquête est vide",
				description: "Ajouter une question pour publier l'enquête",
			})
			return
		}

		try {
			const result = await updateSurveyStatus(surveyId, "published")
			if (result) {
				showToast({
					type: "success",
					title: "Enquête publiée !",
					description: "Vous pouvez partager votre enquête",
				})
			}
		} catch (err) {
			console.error(err)
		}
	}, [hasQuestions, showToast, status, surveyId, updateSurveyStatus])

	const onClickCopy = () => {
		if (!surveyId) return
		const surveyUrl = `${window.location.origin}/surveys/respond/${surveyId}`
		copyToClipboard(surveyUrl)
	}

	const viewConfig: Partial<
		Record<
			SurveyStatusType,
			{ label: string; ariaLabel: string; path: string }
		>
	> = {
		[SurveyStatus.Draft]: {
			label: "Aperçu de l'enquête",
			ariaLabel: "Aperçu de l'enquête",
			path: `/surveys/preview/${surveyId}`,
		},
		[SurveyStatus.Published]: {
			label: "Voir l'enquête",
			ariaLabel: "Voir l'enquête",
			path: `/surveys/respond/${surveyId}`,
		},
	}

	const actionConfig: Partial<
		Record<
			SurveyStatusType,
			{ label: string; ariaLabel: string; onClick: () => void }
		>
	> = {
		[SurveyStatus.Draft]: {
			label: "Publier",
			ariaLabel: "Publier l'enquête",
			onClick: onPublishSurvey,
		},
		[SurveyStatus.Published]: {
			label: "Partager",
			ariaLabel: "Partager l'enquête",
			onClick: onClickCopy,
		},
	}

	const currentView = viewConfig[status ?? SurveyStatus.Draft]
	const currentAction = actionConfig[status ?? SurveyStatus.Draft]

	if (!currentView || !currentAction) return null

	return (
		<div className="flex justify-end gap-2">
			<Button
				variant="outline"
				ariaLabel={currentView.ariaLabel}
				size="sm"
				to={currentView.path}
			>
				{currentView.label}
			</Button>
			<Button
				variant="primary"
				ariaLabel={currentAction.ariaLabel}
				size="sm"
				onClick={currentAction.onClick}
			>
				{currentAction.label}
			</Button>
		</div>
	)
}
