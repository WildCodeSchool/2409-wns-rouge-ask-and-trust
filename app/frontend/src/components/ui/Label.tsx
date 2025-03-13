"use client"

import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

interface LabelProps
	// Inherit all props from LabelPrimitive.Root (ex: htmlFor, id, etc.)
	extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
		// Include variant types from labelVariants
		VariantProps<typeof labelVariants> {
	// Add a custom prop
	required?: boolean
}

const Label = React.forwardRef<
	React.ComponentRef<typeof LabelPrimitive.Root>,
	LabelProps
>(({ className, required, children, ...props }, ref) => (
	<LabelPrimitive.Root
		ref={ref}
		className={cn(labelVariants(), className)}
		{...props}
	>
		{children}
		{required && <span className="text-destructive-medium ml-1">*</span>}
	</LabelPrimitive.Root>
))

Label.displayName = LabelPrimitive.Root.displayName

export { Label }
