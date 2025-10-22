import { Button } from "@/components/ui/Button"
import Pagination from "@/components/ui/Pagination"
import { useSurveyMutations } from "@/hooks/survey/useSurveyMutations"
import { useSurveysMutations } from "@/hooks/survey/useSurveysMutations"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useResponsivity } from "@/hooks/useResponsivity"
import { useToast } from "@/hooks/useToast"
import { useToastOnChange } from "@/hooks/useToastOnChange"
import { cn } from "@/lib/utils"
import { SurveyTableNavProps } from "@/types/types"
import { PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function SurveyTableNav({
	showDeleteButton,
	currentPage,
	totalCount,
	surveysPerPage,
	setCurrentPage,
	selectedSurveyIds,
	onDeleteSuccess,
}: SurveyTableNavProps) {
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)

	const {
		createSurvey,
		createSurveyError,
		isCreatingSurvey,
		resetCreateSurveyError,
	} = useSurveyMutations()

	const { user } = useAuthContext()
	const mode = user?.role === "admin" ? "admin" : "profile"
	const { deleteSurveys } = useSurveysMutations(mode)

	useToastOnChange({
		trigger: createSurveyError,
		resetTrigger: resetCreateSurveyError,
		type: "error",
		title: "Erreur pour créer l'enquête",
		description: "Nous n'avons pas réussi à créer l'enquête",
	})

	const navigate = useNavigate()
	const { showToast } = useToast()

	const onCreateSurveyAndNavigate = async () => {
		try {
			const newSurvey = await createSurvey({
				title: "Nouvelle enquête",
				description: "",
				public: false,
				category: "",
			})

			if (!newSurvey?.id) {
				throw new Error(
					"Impossible de récupérer l'ID de la nouvelle enquête"
				)
			}

			navigate(`/surveys/build/${newSurvey.id}`)
		} catch (error) {
			console.error(error)
			showToast({
				type: "error",
				title: "Erreur",
				description: "La création de l'enquête a échoué",
			})
		}
	}

	return (
		<div
			className="flex items-center justify-between max-lg:flex-wrap max-lg:justify-center max-lg:gap-x-10 max-lg:gap-y-5 max-md:pb-[calc(var(--footer-height)+10px)]"
			ref={rootRef}
		>
			<Button
				icon={PlusCircle}
				loadingSpinner={isCreatingSurvey}
				onClick={onCreateSurveyAndNavigate}
				variant="secondary"
				fullWidth={isHorizontalCompact}
				role="button"
				ariaLabel="Créer une enquête"
				children="Créer une enquête"
				className="max-lg:order-2 md:w-1/2 lg:w-auto"
			/>
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
				onClick={() =>
					deleteSurveys(selectedSurveyIds, onDeleteSuccess)
				}
				className={cn(
					"transition-all duration-200 ease-in-out max-lg:order-3 md:w-1/2 lg:w-auto",
					showDeleteButton
						? "visible opacity-100"
						: "pointer-events-none invisible opacity-0"
				)}
				children="Supprimer des enquêtes"
			/>
		</div>
	)
}
