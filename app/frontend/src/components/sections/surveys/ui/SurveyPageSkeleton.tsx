import { Skeleton } from "@/components/ui/Skeleton"
import SurveyCardSkeleton from "./SurveyCardSkeleton"

export default function SurveyPageSkeleton() {
	return (
		<section className="flex flex-col gap-10 px-5 py-10 pb-[calc(var(--footer-height)+40px)] md:min-h-[calc(100vh_-_var(--header-height))] md:px-10 md:pb-10">
			<div className="flex w-full items-center justify-center">
				<Skeleton className="h-8 w-96 rounded-lg" />
			</div>
			<Skeleton className="h-10 w-48 rounded-lg" />
			<div className="flex flex-col gap-10 md:grid md:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] md:justify-items-center md:gap-20">
				{Array.from({ length: 12 }).map((_, index) => (
					<SurveyCardSkeleton key={index} />
				))}
			</div>
			<Skeleton className="h-10 w-48 rounded-lg" />
		</section>
	)
}
