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
	const [isVerticalCompact, setVerticalCompact] = useState<boolean>(false)
	// State for horizontal compact mode (based on window width)
	const [isHorizontalCompact, setHorizontalCompact] = useState<boolean>(false)
	// Ref to attach to the element to observe
	const rootRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!rootRef.current) return

		// Create a ResizeObserver to watch the element's height
		const observer = new ResizeObserver(entries => {
			for (const entry of entries) {
				const height = entry.contentRect.height // Get the element's height
				const width = window.innerWidth // Get the current window width

				// Set vertical compact if height is below the threshold
				setVerticalCompact(height < verticalThreshold)
				// Set horizontal compact if window width is below the threshold
				setHorizontalCompact(width < horizontalThreshold)
			}
		})

		// Start observing the referenced element
		observer.observe(rootRef.current)

		// Handler for window resize to update horizontal compact state
		const handleResize = () => {
			if (rootRef.current) {
				setHorizontalCompact(window.innerWidth < horizontalThreshold)
			}
		}

		// Listen to window resize events
		window.addEventListener("resize", handleResize)
		// Initial check to set the state on mount
		handleResize()

		// Cleanup: disconnect observer and remove event listener
		return () => {
			observer.disconnect()
			window.removeEventListener("resize", handleResize)
		}
	}, [verticalThreshold, horizontalThreshold])

	// Return the ref to attach to the element and both compact states
	return { rootRef, isVerticalCompact, isHorizontalCompact }
}
