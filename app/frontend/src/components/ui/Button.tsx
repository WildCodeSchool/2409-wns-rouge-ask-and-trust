import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2, LucideIcon } from "lucide-react"
import { ButtonHTMLAttributes, forwardRef, Ref } from "react"
import { Link } from "react-router-dom"

const buttonVariants = cva(
	"inline-flex items-center gap-2 w-fit justify-center rounded-lg transition-colors duration-200 ease-in-out font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer border-2",
	{
		variants: {
			variant: {
				primary:
					"bg-primary-700 border-primary-700 text-white hover:bg-white hover:text-primary-700 focus:ring-primary-700",
				secondary:
					"bg-primary-default border-primary-default text-white hover:bg-white hover:text-primary-default focus:ring-primary-default",
				tertiary:
					"bg-white border-white text-primary-700 hover:bg-primary-700 hover:text-white focus-visible:ring-primary-700 focus-visible:border-primary-700",
				navbar_btn:
					"bg-primary-default text-white border-none rounded-md font-semibold hover:bg-white hover:text-primary-700 hover:border-primary-700 focus-visible:ring-primary-default focus-visible:border-transparent",
				pagination_btn:
					"bg-transparent text-fg border-none hover:bg-fg hover:text-white focus:ring-primary-700 rounded-md",
				outline:
					"border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white focus:ring-primary-700",
				transparent:
					"bg-transparent border-white text-white hover:bg-primary-700 hover:text-white focus-visible:ring-offset-primary-600 focus-visible:ring-white focus-visible:border-white",
				destructive:
					"bg-destructive-medium border-destructive-medium text-white hover:bg-white hover:text-destructive-medium focus:ring-destructive-medium",
				disabled:
					"bg-black-50 border-black-50 text-black-500 focus:ring-black-400 pointer-events-none cursor-not-allowed",
				ghost: "bg-transparent border-none text-primary-700 hover:underline focus:ring-primary-700",
				ghost_destructive:
					"bg-transparent border-none text-destructive-medium hover:underline focus:ring-primary-700 active:outline-none hover:bg-destructive-medium hover:text-white active:bg-transparent",
				footerMobile:
					"bg-transparent border-none text-primary-50 focus:ring-primary-700 group flex-col gap-1 font-medium [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-in-out [&_svg]:group-hover:scale-105",
			},
			size: {
				xs: "p-0 text-xs",
				sm: "px-3 py-1 text-sm",
				md: "px-5 py-2 text-base h-10",
				lg: "px-6 py-3 text-lg",
				square: "w-12 aspect-square",
				square_sm: "w-10 aspect-square",
			},
			nav: {
				selected: "bg-white text-primary-700",
			},
			pagination: {
				selected: "bg-fg text-white",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	}
)

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	icon?: LucideIcon
	iconPosition?: "left" | "right"
	ariaLabel: string
	fullWidth?: boolean
	isNavBtnSelected?: boolean
	onClick?: React.MouseEventHandler
	role?: "button" | "submit" | "link"
	to?: string
	loadingSpinner?: boolean
}

const Button = forwardRef<HTMLElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			icon: Icon,
			iconPosition = "left",
			ariaLabel,
			fullWidth = false,
			isNavBtnSelected = false,
			role = "button",
			children,
			to,
			loadingSpinner = false,
			onClick,
			...props
		},
		ref
	) => {
		const classNameContent = cn(
			buttonVariants({
				variant,
				size,
			}),
			isNavBtnSelected &&
				"text-primary-700 hover:bg-primary-default bg-white hover:text-white",
			fullWidth && "w-full",
			"whitespace-nowrap",
			className
		)

		const childrenContent = (
			<ButtonContent
				Icon={Icon}
				iconPosition={iconPosition}
				children={children}
				loadingSpinner={loadingSpinner}
			/>
		)

		if (to) {
			return (
				<Link
					to={to}
					ref={ref as Ref<HTMLAnchorElement>}
					aria-label={ariaLabel}
					role={role}
					className={classNameContent}
					onClick={onClick}
				>
					{childrenContent}
				</Link>
			)
		} else {
			return (
				<button
					ref={ref as Ref<HTMLButtonElement>}
					aria-label={ariaLabel}
					role={role}
					onClick={onClick}
					className={classNameContent}
					{...props}
				>
					{childrenContent}
				</button>
			)
		}
	}
)

Button.displayName = "Button"

export { Button, buttonVariants }

const ButtonContent = ({
	Icon,
	iconPosition,
	children,
	loadingSpinner,
}: {
	Icon?: LucideIcon
	iconPosition: "left" | "right"
	children: React.ReactNode
	loadingSpinner?: boolean
}) => {
	const Spinner = <Loader2 className="h-5 w-5 animate-spin" aria-hidden />

	return (
		<>
			{/* Icon left */}
			{Icon &&
				iconPosition === "left" &&
				(loadingSpinner ? (
					Spinner
				) : (
					<Icon className="h-5 w-5 shrink-0" aria-hidden />
				))}

			{/* Label or spinner if no icon */}
			{!Icon && (loadingSpinner ? Spinner : children)}

			{/* Icon right */}
			{Icon &&
				iconPosition === "right" &&
				(loadingSpinner ? (
					Spinner
				) : (
					<Icon className="h-5 w-5 shrink-0" aria-hidden />
				))}

			{/* Always show label if icon exists */}
			{Icon && children}
		</>
	)
}
