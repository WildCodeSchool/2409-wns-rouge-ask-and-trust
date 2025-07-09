import { cn } from "@/lib/utils"

type FormWrapperProps = {
	onSubmit: React.FormEventHandler<HTMLFormElement>
	children: React.ReactNode
	className?: string
	unstyled?: boolean
}

export default function FormWrapper({
	onSubmit,
	children,
	className,
	unstyled = false,
}: FormWrapperProps) {
	return (
		<form
			onSubmit={onSubmit}
			role="form"
			className={cn(
				unstyled
					? className
					: cn(
							className,
							"border-black-50 flex w-full flex-col gap-4 rounded-xl border-1 bg-white p-4 shadow-xl md:max-w-[60vh]"
						)
			)}
		>
			{children}
		</form>
	)
}
