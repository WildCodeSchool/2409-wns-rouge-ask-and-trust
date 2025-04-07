import { Button } from "@/components/ui/Button"

type FormButttonSubmitProps = {
	type: "sign-in" | "sign-up"
}

export default function FormButtonSubmit({ type }: FormButttonSubmitProps) {
	const buttonText = type === "sign-in" ? "Se connecter" : "S'inscrire"
	const ariaLabel =
		type === "sign-in" ? "Se connecter au compte" : "Créer un compte"

	return (
		<Button type="submit" fullWidth ariaLabel={ariaLabel}>
			{buttonText}
		</Button>
	)
}
