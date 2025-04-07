import { UserSignIn } from "@/types/types"
import { SubmitHandler, useForm } from "react-hook-form"
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

	// @TODO implement logic sign in
	const onSubmit: SubmitHandler<UserSignIn> = async data => {
		console.log("Hello from Submit SignIn", data)
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
