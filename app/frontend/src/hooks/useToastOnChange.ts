import { useEffect } from "react"
import { ToastType, useToast } from "./useToast"

/**
 * Options for `useToastOnChange`.
 *
 * `trigger` is the value that will trigger the toast when it changes.
 * `resetTrigger` is an optional callback to reset the trigger after showing the toast.
 * `type`, `title`, and `description` define the appearance and content of the toast.
 */
type UseToastOnChangeOptions<T> = {
	trigger: T | null | undefined
	resetTrigger?: () => void
	type?: ToastType
	title: string
	description?: string
}

/**
 * useToastOnChange
 *
 * Generic hook to show a toast notification whenever a given trigger changes.
 * Automatically calls an optional reset function after showing the toast to prevent repeated notifications.
 *
 * @param options - Configuration for the toast trigger and content
 *
 * @example
 * useToastOnChange({
 *   trigger: deleteQuestionError,
 *   resetTrigger: resetDeleteQuestionError,
 *   type: "error",
 *   title: "Failed to delete question",
 *   description: deleteQuestionError?.message ?? "Unknown error",
 * })
 */
export function useToastOnChange<T>({
	trigger,
	resetTrigger,
	type = "error",
	title,
	description,
}: UseToastOnChangeOptions<T>) {
	const { showToast } = useToast()

	useEffect(() => {
		if (!trigger) return

		showToast({
			type,
			title,
			description,
		})

		if (resetTrigger) resetTrigger()
	}, [trigger, resetTrigger, type, title, description, showToast])
}
