import { SurveyResponseStats } from "@/types/types"
import { Card, CardContent } from "@/components/ui/Card"
import { Users, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface SurveyResponsesStatsProps {
	stats: SurveyResponseStats
	isLoading: boolean
	error?: Error
}

export function SurveyResponsesStats({
	stats,
	isLoading,
	error,
}: SurveyResponsesStatsProps) {
	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i} className="animate-pulse">
						<CardContent className="p-6">
							<div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
							<div className="h-8 w-1/2 rounded bg-gray-200"></div>
						</CardContent>
					</Card>
				))}
			</div>
		)
	}

	if (error) {
		return (
			<Card className="border-red-200 bg-red-50">
				<CardContent className="p-6">
					<p className="text-red-600">
						Erreur lors du chargement des statistiques
					</p>
				</CardContent>
			</Card>
		)
	}

	const statCards = [
		{
			title: "Total des réponses",
			value: stats.totalResponses,
			icon: Users,
			color: "text-blue-600",
			bgColor: "bg-blue-50",
		},
		{
			title: "Réponses complètes",
			value: stats.completeResponses,
			icon: CheckCircle,
			color: "text-green-600",
			bgColor: "bg-green-50",
		},
		{
			title: "Réponses partielles",
			value: stats.partialResponses,
			icon: Clock,
			color: "text-yellow-600",
			bgColor: "bg-yellow-50",
		},
		{
			title: "Taux de completion",
			value: `${stats.completionRate}%`,
			icon: TrendingUp,
			color: "text-purple-600",
			bgColor: "bg-purple-50",
		},
	]

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{statCards.map((stat, index) => {
				const Icon = stat.icon
				return (
					<Card
						key={index}
						className="transition-shadow hover:shadow-md"
					>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-black-600 mb-1 text-sm font-medium">
										{stat.title}
									</p>
									<p className="text-black-900 text-2xl font-bold">
										{stat.value}
									</p>
								</div>
								<div
									className={`rounded-full p-3 ${stat.bgColor}`}
								>
									<Icon className={`h-6 w-6 ${stat.color}`} />
								</div>
							</div>
						</CardContent>
					</Card>
				)
			})}
		</div>
	)
}
