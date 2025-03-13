type ErrorInputProps = {
	message: string
}

export default function ErrorInput({ message }: ErrorInputProps) {
	return (
		<p className="text-destructive-medium text-sm" role="alert">
			{message}
		</p>
	)
}
