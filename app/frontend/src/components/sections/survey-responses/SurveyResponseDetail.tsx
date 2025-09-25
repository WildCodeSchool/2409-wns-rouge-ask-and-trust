import { SurveyResponse, ResponseAnswer } from "@/types/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import {
	ArrowLeft,
	User,
	Calendar,
	CheckCircle,
	Clock,
	AlertCircle,
	FileText,
} from "lucide-react"

interface SurveyResponseDetailProps {
	response: SurveyResponse
	onBack: () => void
}

export function SurveyResponseDetail({
	response,
	onBack,
}: SurveyResponseDetailProps) {
	const getCompletionStatusBadge = (status: string) => {
		switch (status) {
			case "complete":
				return (
					<Badge
						variant="secondary"
						className="bg-green-100 text-green-800"
					>
						<CheckCircle className="mr-1 h-3 w-3" />
						Complète
					</Badge>
				)
			case "partial":
				return (
					<Badge
						variant="secondary"
						className="bg-yellow-100 text-yellow-800"
					>
						<Clock className="mr-1 h-3 w-3" />
						Partielle
					</Badge>
				)
			case "incomplete":
				return (
					<Badge
						variant="secondary"
						className="bg-red-100 text-red-800"
					>
						<AlertCircle className="mr-1 h-3 w-3" />
						Incomplète
					</Badge>
				)
			default:
				return null
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const formatAnswerContent = (answer: ResponseAnswer) => {
		// Handle different question types for better display
		switch (answer.questionType) {
			case "boolean":
				return answer.content === "Oui" ? "✅ Oui" : "❌ Non"
			case "multiple_choice":
			case "checkbox":
				// If content contains commas, it's multiple selections
				if (answer.content.includes(", ")) {
					return answer.content.split(", ").map((item, index) => (
						<div key={index} className="inline-block">
							<Badge variant="secondary" className="mr-1 mb-1">
								{item}
							</Badge>
						</div>
					))
				}
				return <Badge variant="secondary">{answer.content}</Badge>
			case "select":
			case "radio":
				return <Badge variant="secondary">{answer.content}</Badge>
			default:
				return answer.content
		}
	}

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button
					variant="outline"
					onClick={onBack}
					ariaLabel="Retour à la liste"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Retour à la liste
				</Button>
				<div>
					<h1 className="text-2xl font-bold">Détail de la réponse</h1>
					<p className="text-black-600">
						Réponse de {response.user.firstname}{" "}
						{response.user.lastname}
					</p>
				</div>
			</div>

			{/* Response Summary */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<User className="h-5 w-5" />
						Informations générales
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<p className="text-black-600 text-sm font-medium">
								Utilisateur
							</p>
							<p className="text-lg">
								{response.user.firstname}{" "}
								{response.user.lastname}
							</p>
							<p className="text-black-600 text-sm">
								{response.user.email}
							</p>
						</div>
						<div>
							<p className="text-black-600 text-sm font-medium">
								Date de soumission
							</p>
							<div className="flex items-center gap-2">
								<Calendar className="text-black-500 h-4 w-4" />
								{formatDate(response.submittedAt)}
							</div>
						</div>
						<div>
							<p className="text-black-600 text-sm font-medium">
								Statut de completion
							</p>
							{getCompletionStatusBadge(
								response.completionStatus
							)}
						</div>
						<div>
							<p className="text-black-600 text-sm font-medium">
								Progression
							</p>
							<p className="text-lg">
								{response.answeredQuestions}/
								{response.totalQuestions} questions
							</p>
							<div className="bg-primary-200 mt-1 h-2 w-full rounded-full">
								<div
									className="bg-primary-600 h-2 rounded-full"
									style={{
										width: `${response.completionPercentage}%`,
									}}
								></div>
							</div>
							<p className="text-black-600 mt-1 text-sm">
								{response.completionPercentage}% complété
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Answers */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="h-5 w-5" />
						Réponses aux questions
					</CardTitle>
				</CardHeader>
				<CardContent>
					{response.answers.length === 0 ? (
						<div className="py-8 text-center">
							<AlertCircle className="text-black-400 mx-auto mb-4 h-12 w-12" />
							<p className="text-black-600">
								Aucune réponse fournie
							</p>
						</div>
					) : (
						<div className="space-y-6">
							{response.answers.map((answer, index) => (
								<div
									key={answer.questionId}
									className="border-primary-default border-l-4 pl-4"
								>
									<div className="mb-2 flex items-start justify-between">
										<h3 className="text-black-900 font-medium">
											Question {index + 1}:{" "}
											{answer.questionTitle}
										</h3>
										<Badge
											variant="outline"
											className="text-xs"
										>
											{answer.questionType}
										</Badge>
									</div>
									<div className="bg-primary-50 rounded-md p-3">
										<p className="text-black-600 mb-1 text-sm font-medium">
											Réponse :
										</p>
										<div className="text-black-900">
											{formatAnswerContent(answer)}
										</div>
									</div>
									<p className="text-black-500 mt-2 text-xs">
										Répondu le{" "}
										{formatDate(answer.submittedAt)}
									</p>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
