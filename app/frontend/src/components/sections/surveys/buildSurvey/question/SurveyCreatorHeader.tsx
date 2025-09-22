import { Button } from "@/components/ui/Button"
import { Chipset } from "@/components/ui/Chipset"
import { useCopyClipboard } from "@/hooks/useCopyClipboard"
import { useScreenDetector } from "@/hooks/useScreenDetector"
import { useSurvey } from "@/hooks/useSurvey"
import { useToast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import {
	SurveyStatus,
	SurveyStatusType,
	SurveyWithoutQuestions,
} from "@/types/types"
import { ChevronDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import SurveyForm from "../../form/SurveyForm"

export function SurveyCreatorHeader({
	survey,
	isQuestions,
}: {
	survey: SurveyWithoutQuestions
	isQuestions: boolean
}) {
	const { isMobile } = useScreenDetector()
	const [open, setOpen] = useState(false)

	// @TODO refacto in components
	// @TODO add form in collapse to edit survey's data

	const translateStatus = useCallback(
		(status: SurveyStatusType | undefined) => {
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
		},
		[]
	)
	const ref = useRef<HTMLDivElement>(null)

	const translatedStatus = translateStatus(survey.status)
	return (
		<div className="flex flex-col gap-4">
			{isMobile && (
				<SurveyButtons
					status={survey.status}
					isQuestions={isQuestions}
				/>
			)}
			<div className="shadow-default border-black-50 flex h-fit max-h-[calc(100vh_-_var(--header-height)_-_var(--footer-height)_-_10vh)] flex-col gap-4 overflow-y-auto rounded-xl border bg-white p-4">
				<div className="flex w-full flex-col gap-8">
					<div className="flex w-full items-center gap-2">
						<button
							className="flex w-full min-w-0 cursor-pointer items-center justify-between"
							onClick={() => {
								setOpen(!open)
							}}
						>
							<div className="flex min-w-0 items-center gap-4">
								<div className="flex min-w-0 flex-col items-start">
									<div className="flex min-w-0 items-center gap-2">
										<h1 className="text-lg font-semibold text-gray-900">
											Création de l'enquête
										</h1>
										<Chipset
											ariaLabel={`L'enquête possède le statut ${translatedStatus}`}
											state={survey.status || "draft"}
											size="sm"
											rounded
										>
											{translatedStatus}
										</Chipset>
									</div>
									<h3
										className={cn(
											"text-start text-base text-gray-600",
											isMobile && "line-clamp-2",
											!isMobile && "line-clamp-1"
										)}
									>
										{survey.title}
									</h3>
								</div>
								{!isMobile && (
									<ChevronDown
										size={20}
										className={cn(
											"transform transition-transform duration-300",
											open && "rotate-180"
										)}
									/>
								)}
							</div>
						</button>
						<div className="flex items-center gap-12">
							{!isMobile && (
								<SurveyButtons
									status={survey.status}
									isQuestions={isQuestions}
								/>
							)}
							{isMobile && (
								<ChevronDown
									size={20}
									className={cn(
										"rotate-0 transform transition-transform duration-300",
										open && "rotate-180"
									)}
								/>
							)}
						</div>
					</div>
				</div>
				<AnimatePresence initial={false}>
					{open && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: "easeInOut" }}
							// style={{ overflow: "hidden" }}
						>
							<div ref={ref}>
								<SurveyForm survey={survey} />
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

function SurveyButtons({
	status,
	isQuestions,
}: {
	status: SurveyStatusType | undefined
	isQuestions: boolean
}) {
	const { id: surveyId } = useParams()
	const { updateSurveyStatus, isStatusUpdateError, resetStatusUpdateError } =
		useSurvey()
	const { showToast } = useToast()
	const { copyToClipboard } = useCopyClipboard()

	const onPublishSurvey = useCallback(async () => {
		if (!surveyId || !status) return

		if (!isQuestions) {
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
			console.error("Erreur lors de la mise à jour du statut :", err)
		}
	}, [isQuestions, showToast, status, surveyId, updateSurveyStatus])

	const onClickCopy = () => {
		if (!surveyId) return

		const surveyUrl = `${window.location.origin}/surveys/respond/${surveyId}`
		copyToClipboard(surveyUrl)
	}

	useEffect(() => {
		if (isStatusUpdateError) {
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré une erreur",
				description: "L'enquête n'a pas pu être publiée",
			})
			resetStatusUpdateError() // Reset the error to avoid permanent toast error
		}
	}, [
		updateSurveyStatus,
		resetStatusUpdateError,
		showToast,
		isStatusUpdateError,
	])

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
