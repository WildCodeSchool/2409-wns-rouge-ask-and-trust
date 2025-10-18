import { LOGIN, WHOAMI } from "@/graphql/auth"
import { useToast } from "@/hooks/useToast"
import { UserSignIn } from "@/types/types"
import { ApolloError, useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import FormButtonSubmit from "./form/FormButtonSubmit"
import FormTitle from "./form/FormTitle"
import FormWrapper from "./form/FormWrapper"
import InputEmail from "./form/InputEmail"
import InputPassword from "./form/InputPassword"

export default function Signin() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UserSignIn>({
		mode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
		},
	})
	const navigate = useNavigate()
	const [Login, { loading }] = useMutation(LOGIN, {
		refetchQueries: [WHOAMI],
		onCompleted: data => {
			// If login successful, show success toast and navigate
			if (data?.login) {
				reset()
				showToast({
					type: "success",
					title: "Connexion réussie !",
					description: "Bienvenue sur Ask and Trust !",
				})
				// Navigate after a short delay to let the user see the success message
				setTimeout(() => {
					navigate("/surveys")
				}, 1000)
			}
		},
		onError: err => {
			console.error("Login error:", err)

			// Handle ApolloError with specific GraphQL errors
			if (err instanceof ApolloError) {
				const graphQLErrors = err.graphQLErrors

				// Check for specific error types
				const unauthorizedError = graphQLErrors.find(
					e =>
						e.message.includes("Login failed") ||
						e.message.includes("Invalid identifiers") ||
						e.message.includes("UnauthorizedError")
				)

				if (unauthorizedError) {
					showToast({
						type: "error",
						title: "Identifiants incorrects",
						description:
							"L'email et/ou le mot de passe est incorrect. Veuillez réessayer.",
					})
					return
				}

				// Handle rate limiting errors
				const rateLimitError = graphQLErrors.find(
					e =>
						e.message.includes("Rate limit") ||
						e.message.includes("Too many requests")
				)

				if (rateLimitError) {
					showToast({
						type: "warning",
						title: "Trop de tentatives",
						description:
							"Veuillez patienter quelques minutes avant de réessayer.",
					})
					return
				}

				// Handle other GraphQL errors
				showToast({
					type: "error",
					title: "Erreur de connexion",
					description:
						"Une erreur est survenue lors de la connexion. Veuillez réessayer.",
				})
				return
			}

			// Handle network errors or other issues
			showToast({
				type: "error",
				title: "Erreur de connexion",
				description:
					"Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
			})
		},
	})
	const { showToast } = useToast()

	const onSubmit: SubmitHandler<UserSignIn> = async formData => {
		if (loading) return
		await Login({
			variables: {
				data: {
					email: formData.email,
					password: formData.password,
				},
			},
		})
	}

	return (
		<FormWrapper onSubmit={handleSubmit(onSubmit)}>
			<FormTitle isSignUp={false} />
			<InputEmail<UserSignIn> register={register} errors={errors} />
			<InputPassword<UserSignIn> register={register} errors={errors} />
			<FormButtonSubmit type="sign-in" />
		</FormWrapper>
	)
}
