import FormWrapper from "../../auth/form/FormWrapper"
import InputTitle from "./InputTitle"
import InputDescription from "./InputDescription"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/useToast"
import { useQuery } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { CategoryOption, CreateSurveyInput } from "@/types/types"
import { GET_CATEGORIES } from "@/graphql/category"
import { useSurvey } from "@/hooks/useSurvey"
import TypeSelect from "@/components/ui/TypeSelect"

export default function SurveyForm() {
	const { addSurvey } = useSurvey()
	const navigate = useNavigate()
	const { showToast } = useToast()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		clearErrors,
		control,
	} = useForm<CreateSurveyInput>({
		defaultValues: {
			title: "",
			description: "",
			public: true,
			category: "",
			questions: [],
		},
	})

	const { data: categoriesData, loading: loadingCategories } =
		useQuery(GET_CATEGORIES)

	const onFormSubmit = async (form: CreateSurveyInput) => {
		clearErrors()
		try {
			const survey = await addSurvey({
				...form,
				category:
					typeof form.category === "string"
						? Number(form.category)
						: form.category,
				questions: form.questions ?? [],
			})

			showToast({
				type: "success",
				title: "Enquête créée avec succès",
				description: "Votre enquête a bien été enregistrée.",
			})

			if (survey && survey.id) {
				navigate(`/surveys/build/${survey.id}`)
			}
		} catch (err) {
			setError("root", {
				message:
					err instanceof Error
						? err.message
						: "Erreur lors de la création de l'enquête.",
			})
			showToast({
				type: "error",
				title: "Erreur lors de la création",
				description:
					err instanceof Error
						? err.message
						: "Erreur lors de la création de l'enquête.",
			})
		}
	}

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
				Créer une enquête
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
					selectSomething="Sélectionner une catégorie"
					options={categoryOptions}
					disabled={loadingCategories}
				/>
				{errors.category && (
					<p className="text-destructive-medium text-sm">
						{errors.category.message}
					</p>
				)}
			</div>
			<div className="flex flex-row-reverse items-center space-x-2">
				<Label htmlFor="public" required>
					Enquête publique
				</Label>
				<Input
					id="public"
					type="checkbox"
					{...register("public")}
					errorMessage=""
				/>
			</div>
			{errors.root && (
				<div className="text-destructive-medium mb-4">
					{errors.root.message}
				</div>
			)}
			<Button
				type="submit"
				disabled={isSubmitting}
				fullWidth
				ariaLabel="Créer l'enquête"
			>
				{isSubmitting ? "Création..." : "Créer l'enquête"}
			</Button>
		</FormWrapper>
	)
}
