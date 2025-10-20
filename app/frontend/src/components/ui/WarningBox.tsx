import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface WarningBoxProps {
	title: string
	items: string[]
	className?: string
}

/**
 * WarningBox component for displaying critical warnings with WCAG/RGAA compliant contrast
 * @description
 * Displays a warning box with an alert icon, title, and list of warning items.
 * Ensures minimum contrast ratio of 4.5:1 for WCAG AA compliance.
 */
export function WarningBox({ title, items, className }: WarningBoxProps) {
	return (
		<div
			className={cn(
				"border-destructive-medium bg-destructive-light rounded-lg border-2 p-4",
				className
			)}
			role="alert"
			aria-live="polite"
		>
			<div className="mb-2 flex items-center gap-2">
				<AlertTriangle
					className="text-destructive-dark"
					aria-hidden="true"
				/>
				<h3 className="text-destructive-dark font-bold">{title}</h3>
			</div>
			<ul className="text-destructive-dark ml-6 list-disc space-y-1 text-sm">
				{items.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ul>
		</div>
	)
}
