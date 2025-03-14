type ErrorInputProps = {
	message: string
}

export default function ErrorInput({ message }: ErrorInputProps) {
	return (
		<p
			className="text-destructive-medium-dark text-sm font-medium"
			role="alert"
		>
			{message}
		</p>
	)
}
