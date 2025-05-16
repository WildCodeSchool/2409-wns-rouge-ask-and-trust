import FormWrapper from "../../auth/form/FormWrapper"
import InputTitle from "./InputTitle"
import InputDescription from "./InputDescription"
import { SubmitHandler, useForm } from "react-hook-form"
import { SurveyFormType } from "@/types/types"
import { useToast } from "@/hooks/useToast"
import { useMutation, useQuery } from "@apollo/client"
import { CREATE_SURVEY } from "@/graphql/survey/createSurvey"
import { querySurvey } from "@/graphql/survey/getSurvey"
import { useNavigate, useParams } from "react-router-dom"
import { UPDATE_SURVEY } from "@/graphql/survey/updateSurvey"
import { useEffect } from "react"
import { Button } from "@/components/ui/Button"

export default function SurveyForm() {
	const { showToast } = useToast()
	const params = useParams<{ id: string }>()
	const id = params.id && Number(params.id)
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<SurveyFormType>({
		mode: "onBlur",
		defaultValues: {
			title: "",
			description: "",
			isPublic: true,
			category: "",
		},
	})

	const [doCreateSurvey] = useMutation<{ CREATE_SURVEY: SurveyFormType }>(
		CREATE_SURVEY
	)

	const [doUpdateSurvey] = useMutation<{
		UPDATE_SURVEY: SurveyFormType
	}>(UPDATE_SURVEY)

	const { data: surveyData } = useQuery<{ survey: SurveyFormType }>(
		querySurvey,
		{
			variables: { surveyId: id },
			skip: !id,
		}
	)
	const survey = surveyData?.survey
	console.log(survey)

	useEffect(() => {
		if (survey) {
			reset(survey)
		}
	}, [survey])

	const onSubmit: SubmitHandler<SurveyFormType> = async formData => {
		try {
			if (survey) {
				const { data } = await doUpdateSurvey({
					variables: {
						id: survey.id,
						data: formData,
					},
				})

				if (data) {
					reset()
					showToast({
						type: "success",
						title: "Modification de votre enquête réussie !",
						description:
							"Vous pouvez maintenant modifier si nécessaires, les questions de votre enquêtes.",
					})
				}

				navigate("/survey-creator")
			} else {
				const { data } = await doCreateSurvey({
					variables: {
						data: {
							title: formData.title,
							description: formData.description,
							isPublic: formData.isPublic,
							category: formData.category,
						},
					},
				})

				console.log(data)

				if (data) {
					reset()
					showToast({
						type: "success",
						title: "Création de votre enquête réussie !",
						description:
							"Vous pouvez maintenant ajouter des questions à votre enquêtes.",
					})
				}

				navigate("/survey-creator")
			}
		} catch (err) {
			console.error("Erreur complète :", err)

			// Handle others errors
			console.error("Error:", err)
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré un problème pour créer votre enquête.",
				description: "Réessayer ultérieurement.",
			})
		}
	}

	return (
		<FormWrapper onSubmit={handleSubmit(onSubmit)}>
			<InputTitle register={register} errors={errors} />
			<InputDescription register={register} errors={errors} />
			<Button
				type="submit"
				fullWidth
				ariaLabel="Soumettre le formulaire"
				children="Sauvegarder"
			/>
		</FormWrapper>
	)
}
