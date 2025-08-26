import { Button } from "@/components/ui/Button"
import { useFormContext } from "react-hook-form"

type FormButttonSubmitProps = {
	type: "sign-in" | "sign-up"
}

export default function FormButtonSubmit({ type }: FormButttonSubmitProps) {
	const { formState } = useFormContext?.() ?? { formState: undefined }
	const isDisabled = Boolean(
		formState && (!formState.isValid || formState.isSubmitting)
	)
	const buttonText = type === "sign-in" ? "Se connecter" : "S'inscrire"
	const ariaLabel =
		type === "sign-in" ? "Se connecter au compte" : "Créer un compte"

	return (
		<Button
			type="submit"
			fullWidth
			ariaLabel={ariaLabel}
			disabled={isDisabled}
		>
			{buttonText}
		</Button>
	)
}
