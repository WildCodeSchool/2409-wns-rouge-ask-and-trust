import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const chipsetVariants = cva(
	"inline-flex items-center gap-1 border-1 h-fit w-fit rounded-md px-4 py-1 text-xs font-medium transition-colors",
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
			},
		},
		defaultVariants: {
			variant: "primary",
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
	ariaLabel,
	rounded = false,
	...props
}: ChipsetProps) {
	return (
		<div
			className={cn(
				chipsetVariants({ variant }),
				rounded && "rounded-full",
				ariaLabel,
				className
			)}
			{...props}
		/>
	)
}

export { Chipset }
