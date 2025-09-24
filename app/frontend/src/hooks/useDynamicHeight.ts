import { ReactNode, useEffect, useRef, useState } from "react"

/**
 * Hook that observes the scrollHeight of an HTML element and returns it dynamically.
 * Useful for collapsible components or animated height transitions.
 *
 * @template T The type of HTML element to observe (e.g., HTMLDivElement)
 * @param children Optional ReactNode that can trigger re-measuring when it changes
 * @returns An object containing:
 *  - `ref`: Ref to attach to the observed element
 *  - `height`: The current height of the element in pixels
 * @example
 * import { FC, PropsWithChildren } from "react";
 * import { Collapsible } from "./Collapsible";
 * import { useDynamicHeight } from "./useDynamicHeight";
 *
 * export const Example: FC<PropsWithChildren<{ isExpanded: boolean }>> = ({
 *   isExpanded,
 *   children,
 * }) => {
 *   const { ref, height } = useDynamicHeight<HTMLDivElement>(children);
 *
 *   return (
 *     <div
 *       style={{
 *         height: isExpanded ? height : 0,
 *         overflow: "hidden",
 *         transition: "height 0.3s ease",
 *       }}
 *     >
 *       <div ref={ref}>
 *         {children}
 *       </div>
 *     </div>
 *   );
 * };
 */

export function useDynamicHeight<T extends HTMLElement>(children?: ReactNode) {
	const ref = useRef<T>(null)
	const [height, setHeight] = useState(0)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		const resizeObserver = new ResizeObserver(() => {
			setHeight(el.scrollHeight)
		})

		resizeObserver.observe(el)

		setHeight(el.scrollHeight) // Initial measurement

		return () => resizeObserver.disconnect()
	}, [children]) // Only re-measure when children changes

	return { ref, height }
}
