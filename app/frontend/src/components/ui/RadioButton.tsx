import { cn } from "@/lib/utils"
import {
	Indicator as RadioGroupIndicator,
	Item as RadioGroupItemPrimitive,
	Root as RadioGroupRoot,
} from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

type RadioGroupProps = React.ComponentProps<typeof RadioGroupRoot>

/**
 * `RadioGroup` is a container with a list of Radio buttons. Enable user to select an option.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="option-one">
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option-one" id="option-one" />
 *     <Label htmlFor="option-one">Option One</Label>
 *   </div>
 *   <div className="flex items-center space-x-2">
 *     <RadioGroupItem value="option-two" id="option-two" />
 *     <Label htmlFor="option-two">Option Two</Label>
 *   </div>
 * </RadioGroup>
 * ```
 */

function RadioGroup({ className, ...props }: RadioGroupProps) {
	return (
		<RadioGroupRoot
			data-slot="radio-group"
			className={cn("flex flex-col gap-3", className)}
			{...props}
		/>
	)
}

type RadioGroupItemProps = React.ComponentProps<
	typeof RadioGroupItemPrimitive
> & {
	errorMessage?: string
	label?: string
}

function RadioGroupItem({ className, label, ...props }: RadioGroupItemProps) {
	return (
		<div className="flex cursor-pointer items-center gap-2">
			<RadioGroupItemPrimitive
				data-slot="radio-group-item"
				className={cn(
					"border-black-100 focus-visible:border-primary-700 shadow-small aspect-square size-4 cursor-pointer rounded-full border bg-transparent text-black ring-offset-0 transition-colors outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",

					className
				)}
				{...props}
			>
				<RadioGroupIndicator
					data-slot="radio-group-indicator"
					className="flex items-center justify-center"
				>
					<CircleIcon className="fill-active bg-pr size-2" />
				</RadioGroupIndicator>
			</RadioGroupItemPrimitive>
			{label && (
				<label className="text-black-default text-sm">{label}</label>
			)}
		</div>
	)
}

export { RadioGroup, RadioGroupItem }
