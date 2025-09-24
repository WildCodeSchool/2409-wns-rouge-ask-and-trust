import { REGISTER, WHOAMI } from "@/graphql/auth"
import { useToast } from "@/hooks/useToast"
import { UserSignUp } from "@/types/types"
import { ApolloError, useMutation } from "@apollo/client"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import FormButtonSubmit from "./form/FormButtonSubmit"
import FormTitle from "./form/FormTitle"
import FormWrapper from "./form/FormWrapper"
import InputEmail from "./form/InputEmail"
import InputFirstname from "./form/InputFirstname"
import InputLastname from "./form/InputLastname"
import InputPassword from "./form/InputPassword"

export default function Signup() {
	const methods = useForm<UserSignUp>({
		mode: "onBlur",
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
			password: "",
		},
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = methods

	const [Register] = useMutation(REGISTER, {
		refetchQueries: [WHOAMI],
	})
	const { showToast } = useToast()

	const onSubmit: SubmitHandler<UserSignUp> = async formData => {
		try {
			const { data } = await Register({
				variables: {
					data: {
						email: formData.email,
						password: formData.password,
						firstname: formData.firstname,
						lastname: formData.lastname,
					},
				},
			})

			if (data) {
				reset()
				showToast({
					type: "success",
					title: "Inscription réussie !",
					description: "Bienvenue chez Ask and Trust",
					actionLabel: "Me connecter",
					redirectTo: "/connexion",
				})
			}
		} catch (err) {
			console.error("Erreur complète :", err)

			// Handle GraphQL errors : invalid formats, email already used...
			if (err instanceof ApolloError) {
				const emailError = err.graphQLErrors.find(e =>
					e.message.includes("Email already exists")
				)

				if (emailError) {
					showToast({
						type: "warning",
						title: "Cette e-mail est déjà utilisée !",
						description: "Choisissez une autre adresse e-mail.",
					})
					return
				}
			}

			// Handle others errors
			console.error("Error:", err)
			showToast({
				type: "error",
				title: "Oops, nous avons rencontré un problème pour créer votre compte.",
				description: "Réessayer ultérieurement.",
			})
		}
	}

	return (
		<FormProvider {...methods}>
			<FormWrapper onSubmit={handleSubmit(onSubmit)}>
				<FormTitle isSignUp />
				<InputFirstname register={register} errors={errors} />
				<InputLastname register={register} errors={errors} />
				<InputEmail<UserSignUp> register={register} errors={errors} />
				<InputPassword<UserSignUp>
					register={register}
					errors={errors}
				/>
				<FormButtonSubmit type="sign-up" />
			</FormWrapper>
		</FormProvider>
	)
}
