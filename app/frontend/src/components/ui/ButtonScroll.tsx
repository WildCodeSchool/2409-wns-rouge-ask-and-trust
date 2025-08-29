import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { ArrowUp } from "lucide-react"
import { motion } from "motion/react"
import React, { useCallback, useEffect, useState } from "react"

interface ButtonScrollProps {
	containerRef: React.RefObject<HTMLElement | null>
	className?: string
	ariaLabel?: string
	scrollToTop?: boolean
}

// This component provides a button that scrolls to the top or the bottom of a specified container
export const ButtonScroll: React.FC<ButtonScrollProps> = ({
	containerRef,
	className,
	ariaLabel,
	scrollToTop = false,
}) => {
	const [isVisible, setIsVisible] = useState(false)
	const [isBouncing, setIsBouncing] = useState(false)

	const onScroll = useCallback(() => {
		const container = containerRef.current
		if (!container) return

		if (scrollToTop) {
			setIsVisible(container.scrollTop > 50)
		} else {
			const distanceFromBottom =
				container.scrollHeight -
				container.scrollTop -
				container.clientHeight
			setIsVisible(distanceFromBottom > 50)
		}
	}, [containerRef, scrollToTop])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		container.addEventListener("scroll", onScroll)
		onScroll()

		return () => container.removeEventListener("scroll", onScroll)
	}, [containerRef, onScroll, scrollToTop])

	const handleClick = () => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: scrollToTop ? 0 : containerRef.current.scrollHeight,
				behavior: "smooth",
			})
		}
		setIsBouncing(true)
	}

	return (
		<Button
			ariaLabel={
				ariaLabel ??
				`${scrollToTop ? "Remonter en haut" : "Descendre en bas"} de la page`
			}
			onClick={handleClick}
			type="button"
			variant="outline"
			size="square_sm"
			className={cn(
				"bg-white transition-opacity duration-200 ease-in-out",
				isVisible
					? "pointer-events-auto opacity-100"
					: "pointer-events-none opacity-0",
				className
			)}
		>
			<AnimatedArrowUp
				isBouncing={isBouncing}
				scrollToTop={scrollToTop}
				onBounceEnd={() => setIsBouncing(false)}
			/>
		</Button>
	)
}

const AnimatedArrowUp: React.FC<{
	isBouncing: boolean
	scrollToTop: boolean
	onBounceEnd: () => void
}> = ({ isBouncing, scrollToTop, onBounceEnd }) => (
	<motion.div
		animate={isBouncing ? { y: [-2, -6, 0] } : { y: 0 }}
		transition={{ duration: 0.3, bounce: 1 }}
		onAnimationComplete={onBounceEnd}
	>
		<ArrowUp className={!scrollToTop ? "rotate-180" : ""} />
	</motion.div>
)
