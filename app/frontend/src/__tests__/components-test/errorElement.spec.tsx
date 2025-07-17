import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { RouterProvider, createMemoryRouter } from "react-router-dom"
import ErrorElement from "@/components/ui/ErrorElement"

describe("ErrorElement Component", () => {
	// Helper to create a router with an error
	const createRouterWithError = (error: unknown) => {
		return createMemoryRouter(
			[
				{
					path: "/",
					element: <div>Home</div>,
					errorElement: <ErrorElement />,
					loader: () => {
						throw error
					},
				},
			],
			{
				initialEntries: ["/"],
				initialIndex: 0,
			}
		)
	}

	// Testing specific HTTP errors
	describe("HTTP Errors", () => {
		const httpErrors = [
			{
				status: 400,
				title: "Requête incorrecte",
				message: "La requête envoyée au serveur n'est pas valide.",
			},
			{
				status: 401,
				title: "Non autorisé",
				message:
					"Vous devez être connecté pour accéder à cette ressource.",
			},
			{
				status: 403,
				title: "Accès refusé",
				message:
					"Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
			},
			{
				status: 500,
				title: "Erreur serveur",
				message:
					"Une erreur est survenue sur nos serveurs. Nos équipes ont été notifiées.",
			},
		]

		// Test each HTTP error
		for (const { status, title, message } of httpErrors) {
			it(`should display correct content for ${status} error`, async () => {
				const router = createRouterWithError(
					new Response("Error", {
						status,
						statusText: title,
					})
				)

				render(<RouterProvider router={router} />)

				// Wait for error to be displayed
				await screen.findByText(new RegExp(status.toString()))

				// Content verification
				expect(
					screen.getByRole("heading", { level: 1 })
				).toHaveTextContent(new RegExp(status.toString()))
				expect(
					screen.getByRole("heading", { level: 1 })
				).toHaveTextContent(new RegExp(title))
				expect(
					screen.getByRole("heading", { level: 2 })
				).toHaveTextContent(new RegExp(title))
				expect(
					screen.getByAltText(`Illustration erreur ${status}`)
				).toBeInTheDocument()
				expect(
					screen.getByText(new RegExp(message))
				).toBeInTheDocument()
			})
		}
	})

	// Generic error test
	describe("Generic Error", () => {
		it("should display generic error content", async () => {
			const router = createRouterWithError(new Error("Test Error"))

			render(<RouterProvider router={router} />)

			// Wait for error to be displayed
			await screen.findByText("Erreur inattendue")

			expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
				"Erreur inattendue"
			)
			expect(
				screen.getByAltText("Illustration erreur générique")
			).toBeInTheDocument()
			expect(
				screen.getByText(
					"Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
				)
			).toBeInTheDocument()
		})
	})

	// Test navigation buttons
	describe("Navigation", () => {
		it("should render navigation buttons", async () => {
			const router = createRouterWithError(new Error("Test Error"))

			render(<RouterProvider router={router} />)

			// Wait until the buttons are displayed
			await screen.findByText("Retourner aux enquêtes")

			expect(
				screen.getByText("Retourner aux enquêtes")
			).toBeInTheDocument()
			expect(screen.getByText("Page précédente")).toBeInTheDocument()
		})
	})

	// [TODO] Test Click
})
