import { RefObject, startTransition, useEffect } from "react"

export function useScrollToElement(
	newElementId: number | null,
	containerRef: RefObject<HTMLDivElement | null>,
	elementsRef: RefObject<{ [key: number]: HTMLDivElement | null }>,
	setNewElementId?: (id: number | null) => void,
	isHover = false
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

				if (!isHover) {
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
	}, [newElementId, containerRef, elementsRef, setNewElementId, isHover])
}
