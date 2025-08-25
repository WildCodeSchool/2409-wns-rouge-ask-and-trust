import { RefObject, useEffect } from "react"

/**
 * Observe the height of a DOM element and set it to a CSS variable
 *
 * @param ref - A ref pointing to the element to observe
 * @param variableName - The CSS variable name to update (e.g. '--header-height')
 */
export function useHeightVariable(
	ref: RefObject<HTMLElement | null>,
	variableName: string
) {
	useEffect(() => {
		const el = ref.current
		if (!el || !variableName) return

		const updateHeight = () => {
			const height = el.offsetHeight
			document.documentElement.style.setProperty(
				variableName,
				`${height}px`
			)
		}
		// Observe height changes
		const observer = new ResizeObserver(() => {
			// Run function after DOM is ready
			requestAnimationFrame(updateHeight)
		})

		observer.observe(el)

		return () => observer.disconnect()
	}, [ref, variableName])
}
