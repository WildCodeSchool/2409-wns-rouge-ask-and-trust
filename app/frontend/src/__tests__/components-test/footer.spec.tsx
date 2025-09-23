import Footer from "@/components/sections/footer/Footer"
import Links from "@/components/ui/Links"
import { useAuthContext } from "@/hooks/useAuthContext"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, Mock, vi } from "vitest"

// Mock ResizeObserver
class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}

vi.mock("@/hooks/useSurveyMutations", () => ({
	useSurveyMutations: () => ({
		createSurvey: vi.fn(),
		reset: vi.fn(),
	}),
}))

// Wrapper require in react router
const FooterWrapper = () => (
	<BrowserRouter>
		<Footer />
	</BrowserRouter>
)

vi.mock("@/hooks/useAuthContext", () => ({
	useAuthContext: vi.fn(),
}))

// Mock du hook useHeightVariable
vi.mock("@/hooks/useHeightVariable", () => ({
	useHeightVariable: vi.fn(),
}))

beforeEach(() => {
	global.ResizeObserver = ResizeObserverMock
	;(useAuthContext as Mock).mockReturnValue({ user: null })
})

describe("footer Components", () => {
	it("should render all essential elements", () => {
		render(<FooterWrapper />)

		expect(screen.getByRole("contentinfo")).toBeInTheDocument()
		expect(
			screen.getByRole("navigation", {
				name: "Navigation du site",
			})
		).toBeInTheDocument()
	})

	it("should render all navigation links correctly", () => {
		render(<FooterWrapper />)

		const links = screen.getAllByRole("link").length

		expect(links).toEqual(6)
	})

	it("should have proper ARIA attributes", () => {
		render(<FooterWrapper />)

		expect(screen.getByRole("contentinfo")).toHaveAttribute(
			"aria-label",
			"Pied de page"
		)
		expect(
			screen.getByRole("navigation", {
				name: "Navigation du site",
			})
		).toHaveAttribute("aria-label", "Navigation du site")
	})

	it("should display current year in copyright", () => {
		render(<FooterWrapper />)

		const currentYear = new Date().getFullYear().toString()
		expect(screen.getByText(RegExp(currentYear))).toBeInTheDocument()
	})

	it("should handle internal links correctly", async () => {
		render(<FooterWrapper />)

		const user = userEvent.setup()
		const contactLink = screen.getByRole("link", {
			name: "Se connecter",
		})
		await user.click(contactLink)
		expect(window.location.pathname).toBe("/connexion")
	})

	it("should not display 'S'inscrire' link when user is connected", () => {
		;(useAuthContext as Mock).mockReturnValue({ user: { role: "admin" } })

		render(<FooterWrapper />)

		expect(
			screen.queryByRole("link", { name: "S'inscrire" })
		).not.toBeInTheDocument()
	})

	it("should handle external links correctly", () => {
		const externalLink = {
			href: "https://example.com",
			label: "External Link",
			category: "Test",
			ariaLabel: "Test",
		}

		render(
			<BrowserRouter>
				<Links {...externalLink} />
			</BrowserRouter>
		)

		const link = screen.getByRole("link")
		expect(link).toHaveAttribute("rel", "noopener noreferrer")
		expect(link).toHaveAttribute("target", "_blank")
	})

	it("should warn for no-HTTPS external links", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
		const noHttpsLink = {
			href: "http://example.com",
			label: "No HTTPS Link",
			category: "Test",
			ariaLabel: "No HTTPS Test Link",
		}

		render(
			<BrowserRouter>
				<Links {...noHttpsLink} />
			</BrowserRouter>
		)

		expect(warnSpy).toHaveBeenCalledWith(
			"Warning: Non-HTTPS external link detected"
		)
		warnSpy.mockRestore()
	})

	it("should not warn for HTTPS external links", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
		const httpsLink = {
			href: "https://example.com",
			label: "HTTPS Link",
			category: "Test",
			ariaLabel: "HTTPS Test Link",
		}

		render(
			<BrowserRouter>
				<Links {...httpsLink} />
			</BrowserRouter>
		)

		expect(warnSpy).not.toHaveBeenCalled()
		warnSpy.mockRestore()
	})
})
