import { RefObject, startTransition, useEffect } from "react"

export function useScrollToElement<T extends HTMLElement = HTMLElement>(
	newElementId: number | null,
	containerRef: RefObject<HTMLElement | null>,
	elementsRef: RefObject<{ [key: number]: T | null }>,
	setNewElementId?: (id: number | null) => void,
	shouldFocus = false
) {
	useEffect(() => {
		if (newElementId && containerRef.current) {
			const container = containerRef.current

			const el = elementsRef.current?.[newElementId]

			if (!el || !container) return

			// Use requestAnimationFrame to ensure the scroll happens after the DOM update
			requestAnimationFrame(() => {
				container.scrollTo({
					top: el.offsetTop,
					behavior: "smooth",
				})

				if (shouldFocus) {
					el.focus?.()
				}

				// Reset the newElementId after scrolling
				if (setNewElementId) {
					startTransition(() => {
						setNewElementId(null)
					})
				}
			})
		}
	}, [newElementId, containerRef, elementsRef, setNewElementId, shouldFocus])
}
