import { cn } from "@/lib/utils"
import { Info } from "lucide-react"

interface InfoBoxProps {
	title?: string
	children: React.ReactNode
	variant?: "info" | "success" | "warning"
	className?: string
	showIcon?: boolean
}

/**
 * InfoBox component for displaying informational messages with WCAG/RGAA compliant contrast
 * @description
 * Displays an information box with optional icon and customizable variants.
 * Ensures minimum contrast ratio of 4.5:1 for WCAG AA compliance.
 */
export function InfoBox({
	title,
	children,
	variant = "info",
	className,
	showIcon = true,
}: InfoBoxProps) {
	const variantStyles = {
		info: "border-primary-700 bg-primary-100 text-primary-800",
		success: "border-validate-medium bg-validate-light text-validate-dark",
		warning: "border-warning-medium bg-warning-light text-warning-dark",
	}

	return (
		<div
			className={cn(
				"rounded-lg border p-3",
				variantStyles[variant],
				className
			)}
			role="status"
			aria-live="polite"
		>
			{(title || showIcon) && (
				<div className="mb-2 flex items-center gap-2">
					{showIcon && (
						<Info className="size-5 shrink-0" aria-hidden="true" />
					)}
					{title && (
						<strong className="font-semibold">{title}</strong>
					)}
				</div>
			)}
			<div className="text-sm">{children}</div>
		</div>
	)
}
