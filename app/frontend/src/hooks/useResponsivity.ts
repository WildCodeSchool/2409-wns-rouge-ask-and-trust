/**
 * useResponsivity
 *
 * Custom React hook to determine if a referenced element is in a compact state
 * based on its height (verticalThreshold) and the window's width (horizontalThreshold).
 * Returns booleans for each compact state and a ref to attach to the observed element.
 *
 * @param {number} verticalThreshold - Height (in px) below which vertical compact mode is enabled.
 * @param {number} horizontalThreshold - Window width (in px) below which horizontal compact mode is enabled.
 * @returns {{ rootRef: React.RefObject<HTMLDivElement>, isVerticalCompact: boolean, isHorizontalCompact: boolean }}
 */
import { useState, useEffect, useRef } from "react"

/**
 * useVerticalResponsivity
 *
 */
export function useResponsivity(
	verticalThreshold: number,
	horizontalThreshold: number
) {
	// State for vertical compact mode (based on element height)
	const [isVerticalCompact, setVerticalCompact] = useState(false)
	// State for horizontal compact mode (based on window width)
	const [isHorizontalCompact, setHorizontalCompact] = useState(false)
	// Ref to attach to the element to observe
	const rootRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!rootRef.current) return

		// Observe the element's height for vertical responsivity
		const observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				const height = entry.contentRect.height
				const width = window.innerWidth

				setVerticalCompact(height < verticalThreshold)
				setHorizontalCompact(width < horizontalThreshold)
			}
		})

		observer.observe(rootRef.current)

		// Also check on window resize for horizontal responsivity
		const handleResize = () => {
			if (rootRef.current) {
				setHorizontalCompact(window.innerWidth < horizontalThreshold)
			}
		}

		window.addEventListener("resize", handleResize)
		// Initial check
		handleResize()

		return () => {
			observer.disconnect()
			window.removeEventListener("resize", handleResize)
		}
	}, [verticalThreshold, horizontalThreshold])

	// Return the ref and both compact states
	return { rootRef, isVerticalCompact, isHorizontalCompact }
}
