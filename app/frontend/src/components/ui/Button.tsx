import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"
import { ButtonHTMLAttributes, forwardRef, Ref } from "react"
import { Link } from "react-router-dom"

const buttonVariants = cva(
	"inline-flex items-center gap-2 w-fit justify-center rounded-lg transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer border-2",
	{
		variants: {
			variant: {
				primary:
					"bg-primary-700 border-primary-700 text-white hover:bg-white hover:text-primary-700 focus:ring-primary-700",
				secondary:
					"bg-primary-default border-primary-default text-white hover:bg-white hover:text-primary-default focus:ring-primary-default",
				tertiary:
					"bg-white border-white text-primary-700 hover:bg-primary-700 hover:border-primary-700 hover:text-white focus:ring-primary-700",
				navbar_btn:
					"bg-primary-default text-white hover:bg-white font-semibold hover:text-primary-700 focus:ring-primary-default border-none",
				outline:
					"border-primary-700 text-primary-700 hover:bg-primary-700 hover:text-white focus:ring-primary-700",
				destructive:
					"bg-destructive-medium border-destructive-medium text-white hover:bg-white hover:text-destructive-medium focus:ring-destructive-medium",
				disabled:
					"bg-black-400 border-black-400 text-white focus:ring-black-400 pointer-events-none cursor-not-allowed",
			},
			size: {
				sm: "px-3 py-1 text-sm",
				md: "px-5 py-2 text-base",
				lg: "px-6 py-3 text-lg",
				square: "w-12 h-12",
			},
			nav: {
				selected: "bg-white text-primary-700",
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
			onClick,
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
			className
		)

		const childrenContent = (
			<>
				{Icon && iconPosition === "left" && (
					<Icon className="h-5 w-5" aria-hidden />
				)}
				{children}
				{Icon && iconPosition === "right" && (
					<Icon className="h-5 w-5" aria-hidden />
				)}
			</>
		)

		if (to) {
			return (
				<Link
					to={to}
					ref={ref as Ref<HTMLAnchorElement>}
					aria-label={ariaLabel}
					role={role}
					className={classNameContent}
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
				>
					{childrenContent}
				</button>
			)
		}
	}
)

Button.displayName = "Button"

export { Button, buttonVariants }
