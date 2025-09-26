import { LOGIN, WHOAMI } from "@/graphql/auth"
import { useToast } from "@/hooks/useToast"
import { UserSignIn } from "@/types/types"
import { ApolloError, useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"
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
	const [Login] = useMutation(LOGIN, {
		refetchQueries: [WHOAMI],
	})
	const { showToast } = useToast()

	const onSubmit: SubmitHandler<UserSignIn> = async formData => {
		try {
			const { data } = await Login({
				variables: {
					data: {
						email: formData.email,
						password: formData.password,
					},
				},
			})

			// If registration ok, navigate to surveys page and toastify
			if (data) {
				reset()
				navigate("/surveys")
				showToast({
					type: "success",
					title: "Connexion réussie !",
					description: "A vous de jouer !",
				})
			}
		} catch (err) {
			// Handle ApolloError
			if (err instanceof ApolloError) {
				const invalidCredentialsError = err.graphQLErrors.find(e =>
					e.message.includes("Login failed")
				)

				showToast({
					type: "error",
					title: invalidCredentialsError
						? "Identifiants incorrects"
						: "La connexion a échoué",
					description: invalidCredentialsError
						? "L'email et/ou le mot de passe est incorrect."
						: "Veuillez réessayer",
				})
				return
			}
			// Handle other errors
			showToast({
				type: "error",
				title: "La connexion a échoué.",
				description: "Veuillez réessayer",
			})
			console.error("Error:", err)
		}
	}

	return (
		<FormWrapper onSubmit={handleSubmit(onSubmit)}>
			<FormTitle isSignUp={false} />
			<InputEmail<UserSignIn> register={register} errors={errors} />
			<InputPassword<UserSignIn> register={register} errors={errors} />
			<FormButtonSubmit type="sign-in" />
			<div className="mt-4 text-center">
				<Link
					to="/mot-de-passe-oublie"
					className="text-primary-600 hover:text-primary-500 text-sm hover:underline"
				>
					Mot de passe oublié ?
				</Link>
			</div>
		</FormWrapper>
	)
}
