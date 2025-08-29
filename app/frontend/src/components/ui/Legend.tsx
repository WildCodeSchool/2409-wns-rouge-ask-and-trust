import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { ComponentPropsWithoutRef, forwardRef } from "react"

const legendVariants = cva(
	"mb-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

interface LegendProps
	extends ComponentPropsWithoutRef<"legend">,
		VariantProps<typeof legendVariants> {
	required?: boolean
}

const Legend = forwardRef<HTMLLegendElement, LegendProps>(
	({ className, required, children, ...props }, ref) => (
		<legend
			ref={ref}
			className={cn(legendVariants(), className)}
			{...props}
		>
			{children}
			{required && (
				<span className="text-destructive-medium-dark ml-1">*</span>
			)}
		</legend>
	)
)

Legend.displayName = "Legend"

export { Legend }
