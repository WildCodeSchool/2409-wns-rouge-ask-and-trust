import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const chipsetVariants = cva(
	"inline-flex items-center gap-1 border-1 h-fit w-fit rounded-sm px-4 py-1 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				primary: "bg-primary-700 border-primary-700 text-white",
				secondary:
					"bg-primary-default border-primary-default text-white",
				tertiary: "bg-white border-white text-primary-700 ",
				destructive:
					"bg-destructive-medium border-destructive-medium text-white",
				disabled: "bg-black-400 border-black-400 text-white",
				outline: "bg-white border-primary-700 text-primary-700",
				filtered:
					"bg-primary-100 text-primary-default font-semibold text-sm px-3 h-10 py-2 gap-2 rounded-lg",
			},
			state: {
				published:
					"bg-validate-light text-validate-dark px-2 py-1 font-bold text-base border-none",
				draft: "bg-warning-light text-warning-dark px-2 py-1 font-bold text-base border-none",
				archived:
					"bg-black-200 text-black-default px-2 py-1 font-bold text-base border-none",
				censored:
					"bg-destructive-light text-destructive-dark px-2 py-1 font-bold text-base border-none",
			},
			size: {
				sm: "text-sm",
				md: "text-base px-4 py-1 ",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	}
)

export interface ChipsetProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof chipsetVariants> {
	rounded?: boolean
	ariaLabel: string
}

function Chipset({
	className,
	variant,
	state,
	ariaLabel,
	rounded = false,
	size,
	...props
}: ChipsetProps) {
	return (
		<div
			className={cn(
				chipsetVariants({ variant, state, size }),
				rounded && "rounded-full",
				ariaLabel,
				className
			)}
			{...props}
		/>
	)
}

export { Chipset }
