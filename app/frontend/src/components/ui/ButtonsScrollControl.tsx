import { ButtonScroll } from "./ButtonScroll"
type ButtonScrollControlProps = {
	scrollContainerRef: React.RefObject<HTMLElement | null>
}

export const ButtonsScrollControl = ({
	scrollContainerRef,
}: ButtonScrollControlProps) => {
	return (
		<div className="fixed right-6 bottom-6 z-50 flex flex-col gap-2">
			<ButtonScroll
				containerRef={scrollContainerRef}
				scrollToTop
				ariaLabel="Monter aux premières questions"
			/>
			<ButtonScroll
				containerRef={scrollContainerRef}
				ariaLabel="Descencre aux dernières questions"
			/>
		</div>
	)
}
