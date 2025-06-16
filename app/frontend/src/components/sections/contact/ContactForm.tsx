import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/hooks/useToast"

export function ContactForm() {
	const { showToast } = useToast()
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitSuccessful },
		reset,
	} = useForm({
		defaultValues: { name: "", email: "", message: "" },
	})

	const onSubmit = () => {
		showToast({
			title: "Message envoyé",
			description:
				"Merci pour votre message ! Nous vous répondrons rapidement.",
			type: "success",
		})
		reset()
		// Ici, on pourrait envoyer le formulaire à une API
	}

	if (isSubmitSuccessful) {
		return (
			<div
				className="text-validate-medium font-medium"
				aria-live="polite"
			>
				Merci pour votre message ! Nous vous répondrons rapidement.
			</div>
		)
	}

	return (
		<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label
					htmlFor="name"
					className="mb-1 block text-sm font-medium"
				>
					Nom
				</label>
				<Input
					id="name"
					{...register("name", {
						required: "Le nom est obligatoire.",
					})}
					errorMessage={errors.name?.message as string}
				/>
			</div>
			<div>
				<label
					htmlFor="email"
					className="mb-1 block text-sm font-medium"
				>
					Email
				</label>
				<Input
					id="email"
					type="email"
					{...register("email", {
						required: "L'email est obligatoire.",
						pattern: {
							value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							message: "Email invalide.",
						},
					})}
					errorMessage={errors.email?.message as string}
				/>
			</div>
			<div>
				<label
					htmlFor="message"
					className="mb-1 block text-sm font-medium"
				>
					Message
				</label>
				<Textarea
					id="message"
					rows={5}
					{...register("message", {
						required: "Le message est obligatoire.",
					})}
				/>
				{errors.message && (
					<div className="text-destructive-medium text-sm">
						{errors.message.message as string}
					</div>
				)}
			</div>
			<Button
				type="submit"
				className="w-full"
				ariaLabel="Envoyer le formulaire de contact"
			>
				Envoyer
			</Button>
		</form>
	)
}
