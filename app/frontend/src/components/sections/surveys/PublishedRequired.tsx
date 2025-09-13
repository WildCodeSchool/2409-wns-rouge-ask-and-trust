/**
 * @fileoverview Component displayed when a survey is not available for response
 * @module PublishedRequired
 */

import { Button } from "@/components/ui/Button"
import { PublishedRequiredType } from "@/types/types"
import { Lock } from "lucide-react"

/**
 * PublishedRequired Component
 *
 * Displays an informative message when a user tries to access a survey
 * that is not published. Shows different messages based on survey status.
 *
 * @component
 * @param {Object} props - Component props
 * @param {PublishedRequiredType} props.survey - The survey object containing status information
 * @returns {JSX.Element} The rendered not available message
 */
export default function PublishedRequired({ survey }: PublishedRequiredType) {
	const getStatusMessage = () => {
		switch (survey.status) {
			case "draft":
				return {
					title: "Enquête en préparation",
					description:
						"Cette enquête est encore en cours de création et n'a pas été publiée",
				}
			case "archived":
				return {
					title: "Enquête archivée",
					description:
						"Cette enquête est archivée et ne peut plus recevoir de réponses.",
				}
			case "censored":
				return {
					title: "Enquête retirée",
					description:
						"Cette enquête a été retirée et n'est plus accessible.",
				}
			default:
				return {
					title: "Enquête non disponible",
					description:
						"Cette enquête n'est pas accessible pour le moment.",
				}
		}
	}

	const { title, description } = getStatusMessage()

	return (
		<div className="flex h-[calc(100vh_-_var(--header-height))] flex-col items-center justify-center px-4 max-md:pb-[calc(var(--footer-height))]">
			<div className="shadow-component w-full max-w-md rounded-xl bg-white p-8 text-center">
				<div className="mb-6 flex justify-center">
					<div className="bg-primary-50 rounded-full p-4">
						<Lock className="text-primary-600 h-12 w-12" />
					</div>
				</div>
				<h1 className="text-black-default mb-2 text-2xl font-bold">
					{title}
				</h1>
				<p className="text-black-default mb-6">{description}</p>
				<nav className="flex flex-col gap-3">
					<Button
						to="/surveys"
						ariaLabel="Retourner à la page des enquêtes"
						size="lg"
						className="w-full sm:w-auto"
					>
						Retourner aux enquêtes
					</Button>
				</nav>
			</div>
		</div>
	)
}
