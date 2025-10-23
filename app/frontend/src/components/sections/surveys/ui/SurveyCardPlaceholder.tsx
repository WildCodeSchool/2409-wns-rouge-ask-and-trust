import { Hourglass, Timer } from "lucide-react"

/**
 * SurveyCardPlaceholder component - a gray skeleton card to maintain grid spacing
 * when there are fewer than 4 survey cards
 */
export default function SurveyCardPlaceholder() {
	return (
		<div className="shadow-default flex w-full flex-col justify-between gap-5 overflow-hidden rounded-xl bg-gray-100 opacity-50">
			{/* Image placeholder */}
			<div className="bg-black-200 h-52 w-full">
				<div className="flex h-full w-full items-center justify-center">
					<div className="bg-black-300 h-16 w-16 rounded-full"></div>
				</div>
			</div>

			{/* Content placeholder */}
			<div className="flex flex-col gap-3 px-5">
				{/* Title placeholder */}
				<div className="bg-black-300 h-5 w-3/4 rounded"></div>

				{/* Description placeholder */}
				<div className="space-y-2">
					<div className="bg-black-300 h-3 w-full rounded"></div>
					<div className="bg-black-300 h-3 w-2/3 rounded"></div>
				</div>

				{/* Chipset placeholder */}
				<div className="flex items-center justify-between gap-5">
					<div className="bg-black-300 h-6 w-20 rounded-full"></div>
				</div>
			</div>

			{/* Footer placeholder */}
			<div className="bg-black-200 flex items-center justify-between px-5 py-3">
				<div className="flex items-center gap-1">
					<Timer className="text-black-400 h-4 w-4" aria-hidden />
					<div className="bg-black-400 h-3 w-16 rounded"></div>
				</div>
				<div className="flex items-center gap-1">
					<Hourglass className="text-black-400 h-4 w-4" aria-hidden />
					<div className="bg-black-400 h-3 w-16 rounded"></div>
				</div>
			</div>
		</div>
	)
}
