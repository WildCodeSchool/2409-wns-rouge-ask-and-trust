import { LOGIN, WHOAMI } from "@/graphql/auth"
import { UserSignIn } from "@/types/types"
import { useMutation } from "@apollo/client"
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
		// reset,
		formState: { errors },
	} = useForm<UserSignIn>({
		mode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
		},
	})
	const navigate = useNavigate()
	const [Login, { error }] = useMutation(LOGIN, {
		refetchQueries: [WHOAMI],
	})
	// @TODO implement logic sign in
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
			console.log("formData", formData)
			console.log("data", data)

			// Check Mutation errors
			if (error) {
				console.error(error)
				return
			}

			if (data) {
				const { message } = data.login
				alert(message)
				navigate("/surveys")
			}
		} catch (err) {
			console.error("Error:", err)
		}
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
