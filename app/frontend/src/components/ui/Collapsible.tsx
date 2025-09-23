import { useDynamicHeight } from "@/hooks/useDynamicHeight"
import { cn } from "@/lib/utils"
import { FC, PropsWithChildren, useEffect } from "react"

export const Collapsible: FC<
	PropsWithChildren<{
		isExpanded: boolean
		isTransitionEnded: boolean
		setIsTransitionEnded: (value: boolean) => void
	}>
> = ({ isExpanded, children, isTransitionEnded, setIsTransitionEnded }) => {
	const { ref, height } = useDynamicHeight<HTMLDivElement>(children)

	useEffect(() => {
		if (!isExpanded) setIsTransitionEnded(false)
	}, [isExpanded, setIsTransitionEnded])

	// @TODO : fix : overflow hidden cut focus outline
	// @TODO : fix : correct scrollbar position
	// Warning : these fixes can have conflicts with each other
	return (
		<div
			onTransitionEnd={() => {
				if (isExpanded) setIsTransitionEnded(true)
			}}
			className={cn(
				"transition-all duration-200 ease-in-out",
				"overflow-hidden",
				isExpanded ? "opacity-100" : "opacity-0"
			)}
			style={{
				height: isExpanded ? height : 0,
				overflowY: isTransitionEnded ? "auto" : "hidden",
			}}
		>
			<div ref={ref}>{children}</div>
		</div>
	)
}
