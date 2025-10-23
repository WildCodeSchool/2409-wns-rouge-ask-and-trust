import { Skeleton } from "@/components/ui/Skeleton"

export default function SurveyContentResponseSkeleton() {
	return (
		<section className="mx-auto max-w-4xl px-4 py-8 max-md:pb-[calc(var(--footer-height)+32px)] sm:px-6 lg:px-8">
			<div className="rounded-lg bg-white p-6 shadow">
				{/* Titre du formulaire */}
				<div className="mb-6">
					<Skeleton className="mb-5 h-6 w-48" />
					<Skeleton className="h-5 w-80" />
				</div>

				{/* Questions skeleton */}
				<div className="space-y-6">
					{/* Question 1 */}
					<div className="border-primary-300 space-y-3 rounded-lg border p-6">
						<Skeleton className="h-5 w-40" />
						<div className="space-y-2">
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
				</div>

				{/* Bouton de soumission */}
				<div className="border-primary-300 mt-8 flex flex-col items-center justify-center border-t pt-8">
					<Skeleton className="mb-6 h-10 w-32" />
					<Skeleton className="h-5 w-80" />
				</div>
			</div>
		</section>
	)
}
