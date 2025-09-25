import {
	ItemIndicator,
	ItemText,
	Portal,
	Root as Select,
	Content as SelectContentBase,
	Group as SelectGroup,
	Icon as SelectIcon,
	Item as SelectItemBase,
	Label as SelectLabelBase,
	ScrollDownButton as SelectScrollDownButtonBase,
	ScrollUpButton as SelectScrollUpButtonBase,
	Separator as SelectSeparatorBase,
	Trigger as SelectTriggerBase,
	Value as SelectValue,
	Viewport,
} from "@radix-ui/react-select"

import { cn } from "@/lib/utils"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { forwardRef } from "react"

// Trigger
const SelectTrigger = forwardRef<
	React.ComponentRef<typeof SelectTriggerBase>,
	React.ComponentPropsWithoutRef<typeof SelectTriggerBase> & {
		icon?: React.ReactNode
	}
>(({ className, children, icon, ...props }, ref) => (
	<SelectTriggerBase
		ref={ref}
		className={cn(
			"border-black-100 ring-offset-background data-[placeholder]:text-muted-foreground group flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border bg-transparent px-3 py-1 text-sm whitespace-nowrap focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
			"focus-visible:border-primary-700 focus-visible:ring-primary-700 focus-visible:ring-1",
			className
		)}
		{...props}
	>
		{children}
		<SelectIcon asChild>
			{icon ?? (
				<ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
			)}
		</SelectIcon>
	</SelectTriggerBase>
))
SelectTrigger.displayName = "SelectTrigger"

// Scroll Up Button
const SelectScrollUpButton = forwardRef<
	React.ComponentRef<typeof SelectScrollUpButtonBase>,
	React.ComponentPropsWithoutRef<typeof SelectScrollUpButtonBase>
>(({ className, ...props }, ref) => (
	<SelectScrollUpButtonBase
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className
		)}
		{...props}
	>
		<ChevronUp className="h-4 w-4" />
	</SelectScrollUpButtonBase>
))
SelectScrollUpButton.displayName = "SelectScrollUpButton"

// Scroll Down Button
const SelectScrollDownButton = forwardRef<
	React.ComponentRef<typeof SelectScrollDownButtonBase>,
	React.ComponentPropsWithoutRef<typeof SelectScrollDownButtonBase>
>(({ className, ...props }, ref) => (
	<SelectScrollDownButtonBase
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className
		)}
		{...props}
	>
		<ChevronDown className="h-4 w-4" />
	</SelectScrollDownButtonBase>
))
SelectScrollDownButton.displayName = "SelectScrollDownButton"

// Content
const SelectContent = forwardRef<
	React.ComponentRef<typeof SelectContentBase>,
	React.ComponentPropsWithoutRef<typeof SelectContentBase>
>(({ className, children, position = "popper", ...props }, ref) => (
	<Portal>
		<SelectContentBase
			ref={ref}
			className={cn(
				"text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border-black-100 shadow-default relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] origin-[--radix-select-content-transform-origin] overflow-x-hidden overflow-y-auto rounded-lg border bg-white",
				position === "popper" &&
					"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
				className
			)}
			position={position}
			{...props}
		>
			<SelectScrollUpButton />
			<Viewport
				className={cn(
					"p-1",
					position === "popper" &&
						"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
				)}
			>
				{children}
			</Viewport>
			<SelectScrollDownButton />
		</SelectContentBase>
	</Portal>
))
SelectContent.displayName = "SelectContent"

// Label
const SelectLabel = forwardRef<
	React.ComponentRef<typeof SelectLabelBase>,
	React.ComponentPropsWithoutRef<typeof SelectLabelBase>
>(({ className, ...props }, ref) => (
	<SelectLabelBase
		ref={ref}
		className={cn("px-2 py-1.5 text-sm font-semibold", className)}
		{...props}
	/>
))
SelectLabel.displayName = "SelectLabel"

// Item
const SelectItem = forwardRef<
	React.ComponentRef<typeof SelectItemBase>,
	React.ComponentPropsWithoutRef<typeof SelectItemBase>
>(({ className, children, ...props }, ref) => (
	<SelectItemBase
		ref={ref}
		className={cn(
			"focus:bg-focus relative flex w-full cursor-pointer items-center rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
			className
		)}
		{...props}
	>
		<span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
			<ItemIndicator>
				<Check className="h-4 w-4" />
			</ItemIndicator>
		</span>
		<ItemText>{children}</ItemText>
	</SelectItemBase>
))
SelectItem.displayName = "SelectItem"

// Separator
const SelectSeparator = forwardRef<
	React.ComponentRef<typeof SelectSeparatorBase>,
	React.ComponentPropsWithoutRef<typeof SelectSeparatorBase>
>(({ className, ...props }, ref) => (
	<SelectSeparatorBase
		ref={ref}
		className={cn("bg-muted -mx-1 my-1 h-px", className)}
		{...props}
	/>
))
SelectSeparator.displayName = "SelectSeparator"

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
}
