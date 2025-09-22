import { Label } from "@/components/ui/Label.tsx"
import { Input } from "@/components/ui/Input.tsx"

type InputResetPasswordProps = {
	id: string
	label: string
	placeholder: string
	errorsMessage?: string
}

export default function InputResetPassword({
	id,
	label,
	placeholder,
	errorsMessage,
}: InputResetPasswordProps) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				type="password"
				placeholder={placeholder}
				errorMessage={errorsMessage}
			/>
		</div>
	)
}
