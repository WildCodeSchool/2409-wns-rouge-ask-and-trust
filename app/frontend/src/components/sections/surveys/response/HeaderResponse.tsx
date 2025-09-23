import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Callout } from "@/components/ui/Callout"
import { SurveyResponseType } from "@/types/types"
import { ArrowLeft, BarChart3 } from "lucide-react"

export default function HeaderResponse({
	onClickCopy,
	survey,
	isOwner,
	id,
}: SurveyResponseType) {
	return (
		<section className="bg-white shadow-sm">
			<div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
					<Button
						variant="ghost"
						size="sm"
						to="/surveys"
						icon={ArrowLeft}
						ariaLabel="Retour sur la page d'accueil"
					>
						Retour
					</Button>
					<div className="flex flex-wrap items-center gap-2 sm:gap-4">
						<Button
							ariaLabel="Partager l'enquête"
							size="sm"
							onClick={onClickCopy}
						>
							Partager
						</Button>
						{isOwner && (
							<>
								<Button
									to={`/surveys/responses/${id}`}
									ariaLabel="Voir les réponses du sondage"
									size="sm"
									icon={BarChart3}
									className="flex-1 sm:flex-none"
								>
									<span className="hidden sm:inline">
										Voir les réponses
									</span>
									<span className="sm:hidden">Réponses</span>
								</Button>
								<Button
									to={`/surveys/build/${id}`}
									ariaLabel="Aller sur la page de modification de l'enquête"
									size="sm"
									className="flex-1 sm:flex-none"
								>
									<span className="hidden sm:inline">
										Modifier l'enquête
									</span>
									<span className="sm:hidden">Modifier</span>
								</Button>
							</>
						)}
					</div>
				</div>

				<div className="mb-4 flex items-center gap-3">
					<h1 className="text-fg text-3xl font-bold">
						{survey.title}
					</h1>
					<Badge variant="secondary">{survey.category.name}</Badge>
				</div>

				{survey.description && (
					<Callout type="info" title="Description">
						{survey.description}
					</Callout>
				)}
			</div>
		</section>
	)
}
