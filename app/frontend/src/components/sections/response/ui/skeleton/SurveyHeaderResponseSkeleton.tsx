import { Skeleton } from "@/components/ui/Skeleton"

export default function SurveyHeaderResponseSkeleton({
	isPreview,
}: {
	isPreview?: boolean
}) {
	return (
		<section className="bg-white shadow-sm">
			<div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
				{/* Header avec bouton retour et actions */}
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
					{/* Bouton retour */}
					<Skeleton className="h-8 w-20" />

					{/* Boutons d'actions */}
					<div className="flex flex-wrap items-center gap-2 sm:gap-4">
						{isPreview ? (
							<Skeleton className="h-8 w-36" />
						) : (
							<>
								<Skeleton className="h-8 w-20" />
								<Skeleton className="h-8 w-32" />
								<Skeleton className="h-8 w-36" />
							</>
						)}
					</div>
				</div>

				{/* Titre et badge */}
				<div className="mb-4 flex items-center gap-3">
					<Skeleton className="h-7 w-64" />
					<Skeleton className="h-5 w-20 rounded-full" />
				</div>

				{/* Description (callout) */}
				<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
					<div className="flex items-start gap-3">
						<Skeleton className="h-5 w-5 rounded-full" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-4 w-4/5" />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
