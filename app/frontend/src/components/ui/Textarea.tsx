import { cn } from "@/lib/utils"
import { forwardRef, ComponentProps, useState } from "react"
import ErrorInput from "./ErrorInput"

type TextareaProps = ComponentProps<"textarea"> & {
	errorMessage: string | undefined
	counter?: boolean
	maxLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			className,
			errorMessage,
			counter = false,
			maxLength,
			onChange,
			...props
		},
		ref
	) => {
		const [charCount, setCharCount] = useState(0)

		const classError = errorMessage
			? "border-destructive-medium-dark focus-visible:border-destructive-medium "
			: ""

		const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setCharCount(e.target.value.length)

			if (onChange) {
				onChange(e)
			}
		}

		return (
			<div>
				<textarea
					className={cn(
						"border-black-100 file:text-black-default placeholder:border-black-400 focus-visible:border-primary-700 flex h-20 w-full resize-none rounded-lg border bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
						classError,
						className
					)}
					onChange={handleChange}
					ref={ref}
					{...props}
				/>
				<div className="flex items-center justify-between gap-5">
					{errorMessage && <ErrorInput message={errorMessage} />}
					{counter && maxLength && (
						<p className="text-black-default ml-auto text-xs">
							{charCount}/{maxLength}
						</p>
					)}
				</div>
			</div>
		)
	}
)
Textarea.displayName = "Textarea"

export { Textarea }
