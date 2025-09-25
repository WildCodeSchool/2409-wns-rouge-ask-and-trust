import { Skeleton } from "@/components/ui/Skeleton"
import { useScreenDetector } from "@/hooks/useScreenDetector"

export function SurveyCreatorSkeleton() {
	const { isMobile } = useScreenDetector()
	return (
		<div className="flex h-[calc(100vh_-_var(--header-height))] flex-col bg-white">
			<section className="p-4 pb-0 lg:p-4 lg:pb-0">
				<div className="border-black-50 shadow-default rounded-xl border bg-white p-4">
					<Skeleton className="h-8 w-64" />
				</div>
			</section>
			<section className="box-border flex h-full w-full flex-row gap-4 overflow-hidden p-4">
				{/* Toolbox Skeleton */}
				{!isMobile && (
					<div className="border-black-50 shadow-default flex h-full w-[250px] flex-col gap-4 rounded-xl border bg-white p-4">
						<Skeleton className="h-6 w-full" />
						<div className="flex flex-col gap-2">
							{Array.from({ length: 4 }).map((_, i) => (
								<Skeleton key={i} className="h-4 w-full" />
							))}
						</div>
					</div>
				)}

				{/* Canvas Skeleton */}
				<div className="flex w-full flex-col gap-6 overflow-y-auto">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
						>
							<Skeleton className="mb-2 h-6 w-1/3" />
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="mt-2 h-4 w-1/2" />
						</div>
					))}
					<Skeleton className="h-10 w-48 self-center" />
				</div>

				{/* Table of Content Skeleton
				 */}
				{!isMobile && (
					<div className="border-black-50 shadow-default flex h-full w-[250px] flex-col gap-4 overflow-hidden rounded-xl border bg-white p-4">
						{Array.from({ length: 14 }).map((_, i) => (
							<div className="flex items-center gap-1" key={i}>
								<Skeleton className="h-4 w-4 shrink-0 rounded-full" />
								<Skeleton className="h-4 w-full" />
							</div>
						))}
					</div>
				)}
			</section>
		</div>
	)
}
