import FormWrapper from "@/components/sections/auth/form/FormWrapper"
import InputTitle from "@/components/sections/surveys/form/InputTitle"
import InputDescription from "@/components/sections/surveys/form/InputDescription"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/useToast"
import { useQuery } from "@apollo/client"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { CategoryOption, CreateSurveyInput, Question } from "@/types/types"
import { GET_CATEGORIES } from "@/graphql/survey/category"
import { useSurvey } from "@/hooks/useSurvey"
import TypeSelect from "@/components/ui/TypeSelect"
import SwitchPublic from "@/components/sections/surveys/form/SwitchPublic"
import { GET_SURVEY } from "@/graphql/survey/survey"
import { useEffect } from "react"

export default function SurveyForm() {
	const { addSurvey, updateSurvey } = useSurvey()
	const navigate = useNavigate()
	const { id: surveyId } = useParams()
	const { showToast } = useToast()

	const form = useForm<CreateSurveyInput>({
		defaultValues: {
			title: "",
			description: "",
			public: true,
			category: "",
			questions: [] as Question[],
		},
	})

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		clearErrors,
		control,
		reset,
	} = form

	const { data: categoriesData, loading: loadingCategories } =
		useQuery(GET_CATEGORIES)

	const {
		data: surveyData,
		loading: surveyLoading,
		error: surveyError,
	} = useQuery(GET_SURVEY, {
		variables: { surveyId: surveyId },
		skip: !surveyId,
	})
	const survey = surveyData?.survey

	useEffect(() => {
		if (survey) {
			reset({
				title: survey.title,
				description: survey.description,
				public: survey.public,
				category: survey.category.id.toString(),
				questions: [] as Question[],
			})
		}
	}, [survey, categoriesData, reset])

	if (surveyId && surveyLoading) {
		return (
			<div className="flex items-center justify-center">
				<div>Chargement de l'enquête...</div>
			</div>
		)
	}

	if (surveyId && surveyError) {
		const isNotFoundError = surveyError.graphQLErrors.some(error =>
			error.message.includes("Survey not found")
		)

		if (isNotFoundError) {
			navigate("/surveyNotFound", { replace: true })
			return null
		}
	}

	if (surveyId && !surveyLoading && !survey) {
		navigate("/surveyNotFound", { replace: true })
		return null
	}

	const onFormSubmit = async (form: CreateSurveyInput) => {
		clearErrors()
		try {
			let result

			if (survey) {
				result = await updateSurvey(survey.id, {
					...form,
					category: Number(form.category),
					questions: [] as Question[],
				})

				showToast({
					type: "success",
					title: "Enquête modifiée",
					description: "Votre enquête a bien été mise à jour.",
				})
			} else {
				result = await addSurvey({
					...form,
					category: Number(form.category),
					questions: form.questions ?? [],
				})

				showToast({
					type: "success",
					title: "Enquête créée",
					description: "Votre enquête a bien été enregistrée.",
				})
			}

			if (result && result.id) {
				navigate(`/surveys/build/${result.id}`)
			}
		} catch (err) {
			const msg =
				err instanceof Error
					? err.message
					: "Erreur lors de la soumission de l'enquête."

			setError("root", { message: msg })

			showToast({
				type: "error",
				title: "Erreur",
				description: msg,
			})
		}
	}

	const isEdit = Boolean(surveyId)
	const label = isSubmitting
		? isEdit
			? "Modification..."
			: "Création..."
		: isEdit
			? "Modifier l'enquête"
			: "Créer l'enquête"

	const categoryOptions: CategoryOption[] =
		categoriesData?.categories?.map(
			(cat: { id: string; name: string }) => ({
				value: cat.id,
				label: cat.name,
			})
		) ?? []

	return (
		<FormWrapper onSubmit={handleSubmit(onFormSubmit)}>
			<h1 className="text-center text-2xl font-bold">
				{surveyId ? "Modifier l'enquête" : "Créer une enquête"}
			</h1>
			<InputTitle register={register} errors={errors} />
			<InputDescription register={register} errors={errors} />
			<div>
				<Label htmlFor="category" required>
					Catégorie
				</Label>
				<TypeSelect
					control={control}
					name="category"
					message="La catégorie est requise"
					selectSomething="Sélectionner une catégorie"
					options={categoryOptions}
					disabled={loadingCategories}
				/>
				{errors.category && (
					<p className="text-destructive-medium-dark text-sm font-medium">
						{errors.category.message}
					</p>
				)}
			</div>
			<SwitchPublic control={control} errors={errors} />
			<Button
				type="submit"
				disabled={isSubmitting}
				fullWidth
				ariaLabel={label}
			>
				{label}
			</Button>
		</FormWrapper>
	)
}
