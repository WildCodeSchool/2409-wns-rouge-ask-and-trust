import { Skeleton } from "@/components/ui/Skeleton"
import SurveyCardSkeleton from "./SurveyCardSkeleton"

export default function SurveyPageSkeleton() {
	return (
		<section className="larger-screen:w-4/5 larger-screen:mx-auto flex flex-col gap-10 px-5 py-10 pb-[calc(var(--footer-height)+40px)] md:min-h-[calc(100vh_-_var(--header-height))] md:px-10 md:pb-10">
			<div className="flex w-full items-center justify-center">
				<Skeleton className="h-8 w-96 rounded-lg" />
			</div>
			<Skeleton className="h-10 w-48 rounded-lg" />
			<div className="grid w-full justify-between gap-20 max-md:grid-cols-2 max-md:gap-10 max-sm:grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
				{Array.from({ length: 12 }).map((_, index) => (
					<SurveyCardSkeleton key={index} />
				))}
			</div>
			<Skeleton className="h-10 w-48 rounded-lg" />
		</section>
	)
}
