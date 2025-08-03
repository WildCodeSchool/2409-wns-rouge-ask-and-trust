import { RefObject, startTransition, useEffect } from "react"

export function useScrollToElement(
	newElementId: number | null,
	containerRef: RefObject<HTMLDivElement | null>,
	elementsRef: RefObject<{ [key: number]: HTMLDivElement | null }>,
	setNewElementId?: (id: number | null) => void
) {
	useEffect(() => {
		if (newElementId && containerRef.current) {
			const container = containerRef.current

			const el = elementsRef.current?.[newElementId]
			container.scrollTo({
				top: el?.offsetTop,
				behavior: "smooth",
			})

			el?.focus?.()

			startTransition(() => {
				setNewElementId?.(null)
			})
		}
	}, [newElementId, containerRef, elementsRef, setNewElementId])
}
