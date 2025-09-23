import { Button } from "@/components/ui/Button"
import { useCopyClipboard } from "@/hooks/useCopyClipboard"
import { useSurveyMutations } from "@/hooks/useSurveyMutations"
import { useToast } from "@/hooks/useToast"
import { useToastOnChange } from "@/hooks/useToastOnChange"
import { SurveyStatus, SurveyStatusType } from "@/types/types"
import { useCallback } from "react"
import { useParams } from "react-router-dom"

/**
 * @description Renders action buttons for the survey depending on its status.
 * Handle "publish" or "share" actions and displays appropriate toast notifications.
 *
 * @param status Survey status
 * @param hasQuestions Whether the survey has any questions
 */
export function SurveyButtons({
	status,
	hasQuestions,
}: {
	status: SurveyStatusType | undefined
	hasQuestions: boolean
}) {
	const { id: surveyId } = useParams()

	const {
		updateSurveyStatus,
		updateSurveyStatusError,
		resetUpdateSurveyStatusError,
	} = useSurveyMutations()
	const { showToast } = useToast()
	const { copyToClipboard } = useCopyClipboard()

	useToastOnChange({
		trigger: updateSurveyStatusError,
		resetTrigger: resetUpdateSurveyStatusError,
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
