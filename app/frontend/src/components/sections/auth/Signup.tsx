import { REGISTER, WHOAMI } from "@/graphql/auth"
import { UserSignUp } from "@/types/types"
import { useMutation } from "@apollo/client"
import { SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import FormButtonSubmit from "./form/FormButtonSubmit"
import FormTitle from "./form/FormTitle"
import FormWrapper from "./form/FormWrapper"
import InputEmail from "./form/InputEmail"
import InputFirstname from "./form/InputFirstname"
import InputLastname from "./form/InputLastname"
import InputPassword from "./form/InputPassword"

export default function Signup() {
	const {
		register,
		handleSubmit,
		// reset,
		formState: { errors },
	} = useForm<UserSignUp>({
		mode: "onBlur",
		defaultValues: {
			firstname: "",
			lastname: "",
			email: "",
			password: "",
		},
	})
	const navigate = useNavigate()
	const [Register, { error }] = useMutation(REGISTER, {
		refetchQueries: [WHOAMI],
	})

	const onSubmit: SubmitHandler<UserSignUp> = async formData => {
		try {
			const { data } = await Register({
				variables: {
					data: {
						email: formData.email,
						password: formData.password,
						firstname: formData.firstname,
						lastname: formData.lastname,
						role: formData.role || "user",
					},
				},
			})
			// Check Mutation errors
			if (error) {
				console.error(error)
				return
			}

			if (data) {
				navigate("/connexion")
			}
		} catch (err) {
			// Handle others errors
			console.error("Error:", err)
		}
	}
	return (
		<FormWrapper onSubmit={handleSubmit(onSubmit)}>
			<FormTitle isSignUp />
			<InputFirstname register={register} errors={errors} />
			<InputLastname register={register} errors={errors} />
			<InputEmail<UserSignUp> register={register} errors={errors} />
			<InputPassword<UserSignUp> register={register} errors={errors} />
			<FormButtonSubmit type="sign-up" />
		</FormWrapper>
	)
}
