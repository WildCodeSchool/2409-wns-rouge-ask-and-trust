import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

type ToastType = "success" | "error" | "warning" | "info"

type ShowToastOptions = {
	type?: ToastType
	title: string
	description?: string
	actionLabel?: string
	redirectTo?: string
}

export function useToast() {
	const navigate = useNavigate()

	const buttonColorMap: Record<ToastType, { bg: string; fg: string }> = {
		success: {
			bg: "!bg-button-validate-bg",
			fg: "!text-button-validate-fg",
		},
		error: {
			bg: "!bg-button-destructive-bg",
			fg: "!text-button-destructive-fg",
		},
		warning: {
			bg: "!bg-button-warning-bg",
			fg: "!text-button-warning-fg",
		},
		info: {
			bg: "!bg-button-secondary-bg",
			fg: "!text-button-secondary-fg",
		},
	}

	const showToast = ({
		type = "success",
		title,
		description,
		actionLabel,
		redirectTo,
	}: ShowToastOptions) => {
		const action =
			actionLabel && redirectTo
				? {
						label: actionLabel,
						onClick: () => navigate(redirectTo),
					}
				: undefined

		const { bg, fg } = buttonColorMap[type]

		const classNames = {
			toast: `!text-sm`,
			actionButton: `${bg} !px-3 !py-4 !text-sm ${fg}`,
		}

		const toastOptions = {
			description,
			action,
			classNames,
			duration: 5000,
		}

		switch (type) {
			case "success":
				toast.success(title, toastOptions)
				break
			case "error":
				toast.error(title, toastOptions)
				break
			case "warning":
				toast.warning(title, toastOptions)
				break
			case "info":
			default:
				toast(title, toastOptions)
				break
		}
	}

	return { showToast }
}
