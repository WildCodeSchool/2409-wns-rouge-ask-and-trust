import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import InputDescription from "@/components/sections/surveys/form/InputDescription"
import InputTitle from "@/components/sections/surveys/form/InputTitle"
import SwitchPublic from "@/components/sections/surveys/form/SwitchPublic"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Skeleton } from "@/components/ui/Skeleton"
import TypeSelect from "@/components/ui/TypeSelect"
import { useSurveyMutations } from "@/hooks/survey/useSurveyMutations"
import { useCategoriesData } from "@/hooks/category/useCategoriesData"
import { useScreenDetector } from "@/hooks/useScreenDetector"
import { useToast } from "@/hooks/useToast"
import { useToastOnChange } from "@/hooks/useToastOnChange"
import {
	CategoryOption,
	SurveyWithoutQuestions,
	UpdateSurveyInput,
} from "@/types/types"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

export default function SurveyForm({
	survey,
}: {
	survey: SurveyWithoutQuestions
}) {
	const {
		updateSurvey,
		isUpdatingSurvey,
		updateSurveyError,
		resetUpdateSurveyError,
	} = useSurveyMutations()
	const { categoriesData, isLoadingCategories, errorCategories } =
		useCategoriesData()

	const { showToast } = useToast()
	const { isMobile } = useScreenDetector()
	const {
		register,
		handleSubmit,
		control,
		getValues,
		formState: { errors, isDirty, dirtyFields },
		setError,
		clearErrors,
		reset,
	} = useForm<UpdateSurveyInput>({
		defaultValues: {
			title: survey?.title || "",
			description: survey?.description || "",
			public: survey?.public ?? true,
			category: survey?.category.id.toString() || "",
		},
	})

	useEffect(() => {
		if (survey) {
			reset({
				title: survey.title,
				description: survey.description,
				public: survey.public,
				category: survey.category.id.toString(),
			})
		}
	}, [survey, categoriesData, reset])

	useToastOnChange({
		trigger: updateSurveyError,
		resetTrigger: resetUpdateSurveyError,
		type: "error",
		title: "Erreur lors de la modification de l’enquête",
		description: updateSurveyError?.message ?? "Une erreur est survenue",
	})

	const onFormSubmit = async () => {
		clearErrors()
		try {
			const test = Object.fromEntries(
				Object.keys(dirtyFields).map(key => [
					key,
					getValues(key as keyof UpdateSurveyInput),
				])
			)

			const payload = { ...test }

			const results = await updateSurvey(String(survey.id), payload)

			if (results) {
				showToast({
					type: "success",
					title: "Enquête modifiée",
					description: "Votre enquête a bien été mise à jour",
				})
			}
		} catch (err) {
			setError("root", {
				message:
					err instanceof Error
						? err.message
						: "Erreur inattendue lors de la soumission",
			})
		}
	}

	if (isLoadingCategories || !survey || !categoriesData) {
		return (
			<div className="p-4">
				<Skeleton className="mb-4 h-8 w-1/3" />
				<Skeleton className="mb-2 h-4 w-full" />
				<Skeleton className="mb-2 h-4 w-3/4" />
				<Skeleton className="mt-4 h-10 w-32" />
			</div>
		)
	}

	const categoryOptions: CategoryOption[] =
		categoriesData?.categories?.map(
			(cat: { id: string; name: string }) => ({
				value: cat.id,
				label: cat.name,
			})
		) ?? []

	const hasAnswers = survey.hasAnswers

	return (
		<FormWrapper
			onSubmit={handleSubmit(onFormSubmit)}
			className="w-full flex-col border-none !p-0 pt-4 shadow-none md:max-w-full"
		>
			<div className="flex flex-col gap-4 lg:flex-row">
				<div className="flex flex-col gap-4 lg:w-[50%]">
					<InputTitle
						register={register}
						errors={errors}
						disabled={hasAnswers}
					/>
					<div className="flex flex-col gap-1">
						<Label htmlFor="category">Catégorie</Label>
						<TypeSelect
							control={control}
							name="category"
							message="La catégorie est requise"
							selectSomething="Sélectionner une catégorie"
							options={categoryOptions}
							disabled={
								isLoadingCategories ||
								!!errorCategories ||
								!categoryOptions.length
							}
						/>
						<FieldErrorMessage
							errorMessage={
								errorCategories
									? "Impossible de charger les catégories. Veuillez réessayer plus tard."
									: errors.category?.message
							}
							isLoading={isLoadingCategories}
							hasData={!!categoryOptions.length}
							emptyMessage={
								!errorCategories && !categoryOptions.length
									? "Aucune catégorie disponible."
									: undefined
							}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-8 lg:w-[50%]">
					<InputDescription
						register={register}
						errors={errors}
						disabled={hasAnswers}
					/>
				</div>
			</div>
			<div className="flex w-full flex-col gap-5 md:flex-row md:items-end md:justify-between">
				<SwitchPublic control={control} errors={errors} />
				<Button
					type="submit"
					disabled={isUpdatingSurvey || !isDirty}
					ariaLabel="Modifier l'enquête"
					fullWidth={isMobile}
					loadingSpinner={isUpdatingSurvey}
					variant={isDirty ? "primary" : "disabled"}
				>
					Modifier l'enquête
				</Button>
			</div>
		</FormWrapper>
	)
}

type FieldErrorMessageProps = {
	errorMessage?: string
	isLoading?: boolean
	hasData?: boolean
	emptyMessage?: string
}

export function FieldErrorMessage({
	errorMessage,
	isLoading,
	hasData,
	emptyMessage,
}: FieldErrorMessageProps) {
	if (errorMessage) {
		return (
			<p className="mt-1 text-sm font-medium text-red-600">
				{errorMessage}
			</p>
		)
	}

	if (!isLoading && !hasData && emptyMessage) {
		return (
			<p className="mt-1 text-sm font-medium text-gray-600">
				{emptyMessage}
			</p>
		)
	}

	return null
}
