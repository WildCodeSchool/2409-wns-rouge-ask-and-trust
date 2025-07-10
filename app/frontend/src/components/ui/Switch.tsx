import { cn } from "@/lib/utils"
import { Root as SwitchRoot, Thumb } from "@radix-ui/react-switch"
import React, { forwardRef } from "react"

interface SwitchProps
	extends React.ComponentPropsWithoutRef<typeof SwitchRoot> {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
	id: string
}

const Switch = forwardRef<React.ComponentRef<typeof SwitchRoot>, SwitchProps>(
	({ className, checked, onCheckedChange, id, ...props }, ref) => (
		<SwitchRoot
			className={cn(
				// Background switch
				"peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
				"focus-visible:ring-focus focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
				"disabled:cursor-not-allowed disabled:opacity-50",
				// Change background color if activated
				"data-[state=checked]:bg-active",
				"data-[state=unchecked]:bg-disabled",
				className
			)}
			id={id}
			checked={checked}
			onCheckedChange={onCheckedChange}
			{...props}
			ref={ref}
		>
			<Thumb
				className={cn(
					// Circle switch
					"pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform",
					"bg-white",
					"data-[state=checked]:translate-x-5",
					"data-[state=unchecked]:translate-x-0"
				)}
			/>
		</SwitchRoot>
	)
)
Switch.displayName = "Switch"

export { Switch }
