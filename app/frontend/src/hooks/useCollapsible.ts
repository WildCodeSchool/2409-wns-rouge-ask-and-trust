// import { useEffect, useRef, useState } from "react"

// export const useCollapsible = (initialOpen = false) => {
// 	const [isOpen, setIsOpen] = useState(initialOpen)
// 	const [height, setHeight] = useState<number | undefined>(0)
// 	const ref = useRef<HTMLDivElement>(null)

// 	useEffect(() => {
// 		if (!height || !isOpen || !ref.current) return undefined
// 		const resizeObserver = new ResizeObserver(el => {
// 			setHeight(el[0].contentRect.height)
// 		})
// 		resizeObserver.observe(ref.current)
// 		return () => {
// 			resizeObserver.disconnect()
// 		}
// 	}, [height, isOpen])

// 	const toggle = () => setIsOpen(prev => !prev)

// 	return { isOpen, toggle, ref, height }
// }

import { useEffect, useRef, useState } from "react"

export const useCollapsible = (initialOpen = false) => {
	const [isOpen, setIsOpen] = useState(initialOpen)
	const [height, setHeight] = useState<number>(0)
	const ref = useRef<HTMLDivElement>(null)

	// On mesure la hauteur chaque fois qu'on ouvre/ferme
	useEffect(() => {
		if (!ref.current) return

		if (isOpen) {
			// hauteur du contenu quand ouvert
			setHeight(ref.current.scrollHeight)
		} else {
			// hauteur zéro quand fermé
			setHeight(0)
		}
	}, [isOpen])

	const toggle = () => setIsOpen(prev => !prev)

	return { isOpen, toggle, ref, height }
}
