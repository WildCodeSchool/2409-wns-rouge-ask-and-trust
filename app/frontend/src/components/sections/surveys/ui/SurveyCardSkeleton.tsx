import { Skeleton } from "@/components/ui/Skeleton"

export default function SurveyCardSkeleton() {
	return (
		<div className="shadow-default flex w-full flex-col justify-between gap-5 overflow-hidden rounded-xl bg-white md:w-80">
			<Skeleton className="h-52 w-full rounded-none" />
			<div className="flex flex-col gap-3 px-5">
				<Skeleton className="h-6 w-3/4" />
				<div className="flex flex-col gap-2">
					<Skeleton className="h-3 w-full" />
					<Skeleton className="h-3 w-2/3" />
				</div>
				<div className="flex items-center justify-between gap-5">
					<Skeleton className="h-6 w-20 rounded-full" />
					<Skeleton className="h-6 w-24 rounded-full" />
				</div>
			</div>
			<div className="bg-primary-default flex items-center justify-between px-5 py-3">
				<div className="flex items-center gap-1">
					<Skeleton className="h-4 w-4 rounded-full" />
					<Skeleton className="h-3 w-16" />
				</div>
				<div className="flex items-center gap-1">
					<Skeleton className="h-4 w-4 rounded-full" />
					<Skeleton className="h-3 w-12" />
				</div>
			</div>
		</div>
	)
}
