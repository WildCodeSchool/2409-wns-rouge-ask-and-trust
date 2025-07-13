import { useState, useEffect } from "react"

export default function useResponsive(breakpoint: number = 768) {
	const [isMobile, setIsMobile] = useState<boolean>(
		window.innerWidth < breakpoint
	)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < breakpoint)
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [breakpoint])

	return isMobile
}
