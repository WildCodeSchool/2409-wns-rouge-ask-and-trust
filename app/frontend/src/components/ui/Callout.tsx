import { ReactNode } from "react"
import { cn } from "@/lib/utils"

const typeStyles: Record<string, string> = {
	info:
		"border-l-4" +
		" bg-[var(--color-primary-100)] text-[var(--color-primary-700)] border-[var(--color-primary-default)]",
	warning:
		"border-l-4" +
		" bg-[var(--color-warning-light)] text-[var(--color-warning-dark)] border-[var(--color-warning-medium)]",
	success:
		"border-l-4" +
		" bg-[var(--color-validate-light)] text-[var(--color-validate-dark)] border-[var(--color-validate-medium)]",
	danger:
		"border-l-4" +
		" bg-[var(--color-destructive-light)] text-[var(--color-destructive-dark)] border-[var(--color-destructive-medium)]",
	question:
		"border-l-4" +
		" bg-[var(--color-validate-light)] text-[var(--color-primary-800)] border-[var(--color-validate-dark)]",
	default:
		"border-l-4" +
		" bg-[var(--color-card-bg)] text-[var(--color-card-fg)] border-[var(--color-primary-default)]",
}

const typeIcons: Record<string, ReactNode> = {
	info: <span className="mr-2">ℹ️</span>,
	warning: <span className="mr-2">⚠️</span>,
	success: <span className="mr-2">✅</span>,
	danger: <span className="mr-2">⛔</span>,
	question: <span className="mr-2">📝</span>,
	default: <span className="mr-2">💡</span>,
}

export function Callout({
	children,
	type = "info",
	title,
	className = "",
}: {
	children: ReactNode
	type?: "info" | "warning" | "success" | "danger" | "question" | "default"
	title?: string
	className?: string
}) {
	return (
		<div
			className={cn(
				"flex items-start gap-2 rounded-md px-4 py-2",
				typeStyles[type] || typeStyles.default,
				className
			)}
		>
			<div className="pt-0.5">{typeIcons[type] || typeIcons.default}</div>
			<div>
				{title && <h2 className="mb-1 font-semibold">{title}</h2>}
				<div>{children}</div>
			</div>
		</div>
	)
}
