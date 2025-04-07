import { UserSignUp } from "@/types/types"
import { SubmitHandler, useForm } from "react-hook-form"
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

	// @TODO implement logic sign up
	const onSubmit: SubmitHandler<UserSignUp> = async data => {
		console.log("Hello from Submit SignUp", data)
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
