import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"
import React, { useEffect, useState } from "react"

interface ButtonScrollTopProps {
	containerRef: React.RefObject<HTMLElement | null>
	className?: string
}

export const ButtonScrollTop: React.FC<ButtonScrollTopProps> = ({
	containerRef,
	className,
}) => {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		// Listen for scroll events on the container
		// If scroll position is greater than 50px, show the button
		const container = containerRef.current
		if (!container) return

		const onScroll = () => {
			setIsVisible(container.scrollTop > 50)
		}

		container.addEventListener("scroll", onScroll)
		onScroll()

		return () => container.removeEventListener("scroll", onScroll)
	}, [containerRef])

	const handleClick = () => {
		if (containerRef.current) {
			containerRef.current.scrollTo({ top: 0, behavior: "smooth" })
		}
	}

	return (
		<Button
			ariaLabel="Scroll to top"
			onClick={handleClick}
			variant="primary"
			size="square"
			icon={ArrowUp}
			className={cn(
				className,
				"fixed right-6 bottom-6 z-50",
				// Animate button's apparition
				"transition-opacity duration-200 ease-in-out",
				isVisible
					? "pointer-events-auto opacity-100"
					: "pointer-events-none opacity-0"
			)}
		/>
	)
}
