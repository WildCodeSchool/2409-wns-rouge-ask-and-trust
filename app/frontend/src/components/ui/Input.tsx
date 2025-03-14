import * as React from "react"

import { cn } from "@/lib/utils"
import ErrorInput from "./ErrorInput"

type InputProps = React.ComponentProps<"input"> & {
	errorMessage: string | undefined
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, errorMessage, ...props }, ref) => {
		const classError = errorMessage
			? "border-destructive-medium-dark focus-visible:border-destructive-medium "
			: ""

		return (
			<div>
				<input
					type={type}
					className={cn(
						"border-black-100 file:text-black-default placeholder:border-black-400 focus-visible:border-primary-700 flex h-10 w-full rounded-lg border bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
						classError,
						className
					)}
					ref={ref}
					{...props}
				/>
				{errorMessage && <ErrorInput message={errorMessage} />}
			</div>
		)
	}
)
Input.displayName = "Input"

export { Input }
