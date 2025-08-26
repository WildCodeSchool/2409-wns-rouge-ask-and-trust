import { withSEO } from "@/components/hoc/withSEO"
import { Canvas } from "@/components/sections/canvas/Canvas"
import { Toolbox } from "@/components/sections/Toolbox/Toolbox"
import { Button } from "@/components/ui/Button"
import { Chipset } from "@/components/ui/Chipset"
import { Skeleton } from "@/components/ui/Skeleton"
import { GET_SURVEY } from "@/graphql/survey/survey"
import { useCopyClipboard } from "@/hooks/useCopyClipboard"
import { useQuestions } from "@/hooks/useQuestions"
import { useScreenDetector } from "@/hooks/useScreenDetector"
import { useSurvey } from "@/hooks/useSurvey"
import { useToast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"
import {
	QuestionType,
	Survey,
	SurveyStatus,
	SurveyStatusType,
} from "@/types/types"
import { useQuery } from "@apollo/client"
import { ChevronDown } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

function SurveyCreator() {
	//  Get survey's id from params
	const { id: surveyId } = useParams()
	// Focused question ID for the current question in the canvas
	const [focusedQuestionId, setFocusedQuestionId] = useState<number | null>(
		null
	)
	// Load addQuestion function from the API
	const { addQuestion, createQuestionError, resetCreateQuestionError } =
		useQuestions()
	// @TODO mayse getQuestions here and getSurvey infos in Survey details
	const { data, loading: loadingSurvey } = useQuery<{
		survey: Survey
	}>(GET_SURVEY, {
		variables: {
			surveyId,
		},
		fetchPolicy: "cache-first",
	})
	const { showToast } = useToast()
	const { isMobile } = useScreenDetector()
	// Show a toast notification if there is an error after creating a question
	// @TODO add this in useQuestions
	useEffect(() => {
		if (createQuestionError) {
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré une erreur.",
				description: "La question n'a pas pu être ajoutée.",
			})
			resetCreateQuestionError() // Reset the error to avoid permanent toast error
		}
	}, [createQuestionError, resetCreateQuestionError, showToast])

	// Memoize questions to avoid unnecessary re-renders
	const questions = useMemo(() => {
		return data?.survey?.questions ?? []
	}, [data?.survey?.questions])

	const handleAddQuestion = useCallback(
		async (type: QuestionType | undefined) => {
			if (!surveyId) return

			setFocusedQuestionId(null)

			const result = await addQuestion({
				surveyId: Number(surveyId),
				type,
			})

			if (result?.id) {
				showToast({
					type: "success",
					title: "Question ajoutée !",
				})
				setFocusedQuestionId(result.id)
			}
		},
		[addQuestion, showToast, surveyId]
	)

	if (loadingSurvey) {
		return <SurveyCreatorSkeleton />
	}

	return (
		<div className="flex h-[calc(100vh_-_var(--header-height))] flex-col bg-gray-50 max-md:h-[calc(100vh_-_var(--header-height)_-_var(--footer-height))]">
			{/* @TODO create a SurveyDetails component to edit survey's title, description, settings... */}
			<section className="w-full p-4 pb-0 lg:p-4 lg:pb-0">
				<SurveyHeader
					surveyStatus={data?.survey.status}
					surveyTitle={data?.survey.title}
				/>
			</section>
			<section className="box-border flex h-full w-full flex-row gap-4 overflow-hidden p-4 lg:gap-4 lg:p-4">
				{!isMobile && <Toolbox onAddQuestion={handleAddQuestion} />}
				<Canvas
					onAddQuestion={handleAddQuestion}
					questions={questions}
					focusedQuestionId={focusedQuestionId}
					setFocusedQuestionId={setFocusedQuestionId}
				/>
			</section>
		</div>
	)
}

function SurveyHeader({
	surveyStatus,
	surveyTitle,
}: {
	surveyStatus: SurveyStatusType | undefined
	surveyTitle: string | undefined
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

	const translatedStatus = translateStatus(surveyStatus)
	return (
		<div className="flex flex-col gap-4">
			{isMobile && <SurveyButtons status={surveyStatus} />}
			<div className="shadow-default border-black-50 rounded-xl border bg-white">
				<div className="flex w-full flex-col justify-between gap-2 p-4">
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
											state={surveyStatus || "draft"}
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
										{surveyTitle}
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
								<SurveyButtons status={surveyStatus} />
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
				{/* Collapse */}
				{open && (
					<div className="flex p-4">
						@TODO : add form to update survey data and shadcn
						collapse
					</div>
				)}
			</div>
		</div>
	)
}

function SurveyButtons({ status }: { status: SurveyStatusType | undefined }) {
	const { id: surveyId } = useParams()
	const { updateSurveyStatus, isStatusUpdateError, resetStatusUpdateError } =
		useSurvey()
	const { showToast } = useToast()
	const { copyToClipboard } = useCopyClipboard()

	const onPublishSurvey = useCallback(
		async (surveyId: string, status: SurveyStatusType) => {
			if (!surveyId) return
			try {
				const result = await updateSurveyStatus(surveyId, status)
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
		},
		[updateSurveyStatus, showToast]
	)

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

	return (
		<div className="flex justify-end gap-2">
			<Button
				variant="outline"
				ariaLabel="Voir l'enquête"
				size="sm"
				to={`/surveys/respond/${surveyId}`}
			>
				Voir l'enquête
			</Button>
			{status === SurveyStatus.Draft ? (
				<Button
					variant="primary"
					ariaLabel="Publier l'enquête"
					size="sm"
					onClick={() => {
						if (surveyId) {
							onPublishSurvey(surveyId, "published")
						}
					}}
				>
					Publier
				</Button>
			) : (
				<Button
					variant="primary"
					ariaLabel="Partager l'enquête"
					size="sm"
					onClick={onClickCopy}
				>
					Partager
				</Button>
			)}
		</div>
	)
}

export function SurveyCreatorSkeleton() {
	const { isMobile } = useScreenDetector()
	return (
		<div className="flex h-[calc(100vh_-_var(--header-height))] flex-col bg-white">
			<section className="p-4 pb-0 lg:p-4 lg:pb-0">
				<div className="border-black-50 shadow-default rounded-xl border bg-white p-4">
					<Skeleton className="h-8 w-64" />
				</div>
			</section>
			<section className="box-border flex h-full w-full flex-row gap-4 overflow-hidden p-4">
				{/* Toolbox Skeleton */}
				{!isMobile && (
					<div className="border-black-50 shadow-default flex h-full w-[250px] flex-col gap-4 rounded-xl border bg-white p-4">
						<Skeleton className="h-6 w-full" />
						<div className="flex flex-col gap-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-4 w-full" />
							))}
						</div>
					</div>
				)}

				{/* Canvas Skeleton */}
				<div className="flex w-full flex-col gap-6 overflow-y-auto">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
						>
							<Skeleton className="mb-2 h-6 w-1/3" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="mt-2 h-4 w-1/2" />
						</div>
					))}
					<Skeleton className="h-10 w-48 self-center" />
				</div>

				{/* Table of Content Skeleton
				 */}
				{!isMobile && (
					<div className="border-black-50 shadow-default flex h-full w-[250px] flex-col gap-4 overflow-hidden rounded-xl border bg-white p-4">
						{Array.from({ length: 14 }).map((_, i) => (
							<div className="flex items-center gap-1" key={i}>
								<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
								<Skeleton className="h-4 w-full" />
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	)
}

const SurveyCreatorWithSEO = withSEO(SurveyCreator, "surveyCreator")
export default SurveyCreatorWithSEO
