type FormWrapperProps = {
	onSubmit: React.FormEventHandler<HTMLFormElement>
	children: React.ReactNode
	className?: string
}

export default function FormWrapper({
	onSubmit,
	children,
	className,
}: FormWrapperProps) {
	return (
		<form
			onSubmit={onSubmit}
			role="form"
			className={`border-black-50 flex w-full flex-col gap-4 rounded-xl border-1 bg-white p-4 shadow-xl md:max-w-[60vh] ${className}`}
		>
			{children}
		</form>
	)
}
