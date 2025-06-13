import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import { GET_CATEGORIES } from "@/graphql/category"
import { useToast } from "@/hooks/useToast"
import { CreateSurveyInput } from "@/types/types"
import { useQuery } from "@apollo/client"
import { useForm } from "react-hook-form"

interface SurveyFormProps {
	onSubmit: (form: CreateSurveyInput) => Promise<void>
}

export default function SurveyForm({ onSubmit }: SurveyFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setError,
		clearErrors,
	} = useForm<CreateSurveyInput>({
		defaultValues: {
			title: "",
			description: "",
			public: true,
			category: "",
		},
	})

	const { data: categoriesData, loading: loadingCategories } =
		useQuery(GET_CATEGORIES)

	const { showToast } = useToast()

	const onFormSubmit = async (data: CreateSurveyInput) => {
		clearErrors()
		try {
			await onSubmit({
				...data,
				category:
					typeof data.category === "string"
						? Number(data.category)
						: data.category,
			})
			showToast({
				type: "success",
				title: "Enquête créée avec succès",
				description: "Votre enquête a bien été enregistrée.",
			})
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

	return (
		<div className="flex h-[100%] flex-col items-center gap-4 px-4 py-16 md:px-0">
			<form
				onSubmit={handleSubmit(onFormSubmit)}
				role="form"
				className="border-black-50 flex w-full flex-col gap-4 rounded-xl border-1 bg-white p-4 shadow-xl md:max-w-[60vh]"
			>
				<div className="mb-4">
					<Label htmlFor="title">Titre</Label>
					<Input
						id="title"
						{...register("title", {
							required: "Le titre est requis",
						})}
						errorMessage=""
					/>
					{errors.title && (
						<p className="text-destructive-medium text-sm">
							{errors.title.message}
						</p>
					)}
				</div>
				<div className="mb-4">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						{...register("description", {
							required: "La description est requise",
						})}
					/>
					{errors.description && (
						<p className="text-destructive-medium text-sm">
							{errors.description.message}
						</p>
					)}
				</div>
				<div className="mb-4">
					<Label htmlFor="category">Catégorie</Label>
					<select
						id="category"
						{...register("category", {
							required: "La catégorie est requise",
						})}
						className="w-full rounded border px-3 py-2"
						disabled={loadingCategories}
					>
						<option value="">Sélectionner une catégorie</option>
						{categoriesData?.categories?.map(
							(cat: { id: string; name: string }) => (
								<option key={cat.id} value={cat.id}>
									{cat.name}
								</option>
							)
						)}
					</select>
					{errors.category && (
						<p className="text-destructive-medium text-sm">
							{errors.category.message}
						</p>
					)}
				</div>
				<div className="mb-4 flex items-center space-x-2">
					<Input
						id="public"
						type="checkbox"
						{...register("public")}
						errorMessage=""
					/>
					<Label htmlFor="public">Enquête publique</Label>
				</div>
				{errors.root && (
					<div className="text-destructive-medium mb-4">
						{errors.root.message}
					</div>
				)}
				<Button
					type="submit"
					disabled={isSubmitting}
					ariaLabel="Créer l'enquête"
				>
					{isSubmitting ? "Création..." : "Créer l'enquête"}
				</Button>
			</form>
		</div>
	)
}
