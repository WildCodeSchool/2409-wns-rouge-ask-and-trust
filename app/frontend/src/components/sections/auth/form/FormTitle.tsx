type FormTitleProps = {
	isSignUp: boolean
}

export default function FormTitle({ isSignUp = false }: FormTitleProps) {
	return (
		<h1 className="text-center text-2xl font-bold">
			{isSignUp ? "Je m'inscris" : "Je me connecte"}
		</h1>
	)
}
