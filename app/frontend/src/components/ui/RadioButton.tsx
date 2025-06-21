import { cn } from "@/lib/utils"
import {
	Indicator as RadioGroupIndicator,
	Item as RadioGroupItemPrimitive,
	Root as RadioGroupRoot,
} from "@radix-ui/react-radio-group"
import { CircleIcon } from "lucide-react"

type RadioGroupProps = React.ComponentProps<typeof RadioGroupRoot>

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
	// const errorStyle = errorMessage
	// 	? "border-destructive-medium-dark focus-visible:border-destructive-medium"
	// 	: ""

	return (
		<div className="flex items-center gap-2">
			<RadioGroupItemPrimitive
				data-slot="radio-group-item"
				className={cn(
					"border-black-100 text-primary focus-visible:border-primary-700 aspect-square size-4 rounded-full border bg-transparent shadow-xs ring-offset-0 transition-colors outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				{...props}
			>
				<RadioGroupIndicator
					data-slot="radio-group-indicator"
					className="flex items-center justify-center"
				>
					<CircleIcon className="fill-primary size-2" />
				</RadioGroupIndicator>
			</RadioGroupItemPrimitive>
			{label && (
				<label className="text-black-default text-sm">{label}</label>
			)}
		</div>
	)
}

export { RadioGroup, RadioGroupItem }
