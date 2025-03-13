import { describe, it, expect, vi } from "vitest"
import { BrowserRouter } from "react-router-dom"
import { render, screen } from "@testing-library/react"
import Footer, { FooterLink } from "@/components/sections/Footer"
import userEvent from "@testing-library/user-event"

// Wrapper require in react router
const FooterWrapper = () => (
	<BrowserRouter>
		<Footer />
	</BrowserRouter>
)

describe("footer Components", () => {
	it.only("should render all essential elements", () => {
		render(<FooterWrapper />)

		expect(screen.getByRole("contentinfo")).toBeInTheDocument()
		expect(
			screen.getByRole("navigation", { name: "Plan du site" })
		).toBeInTheDocument()
		expect(
			screen.getByRole("navigation", {
				name: "Navigation du pied de page",
			})
		).toBeInTheDocument()
		expect(screen.getByRole("separator")).toBeInTheDocument()
	})

	it.only("should render all navigation links correctly", () => {
		render(<FooterWrapper />)

		const links = screen.getAllByRole("link").length

		expect(links).toEqual(6)
	})

	it.only("should have proper ARIA attributes", () => {
		render(<FooterWrapper />)

		expect(screen.getByRole("contentinfo")).toHaveAttribute(
			"aria-label",
			"Pied de page"
		)
		expect(
			screen.getByRole("navigation", {
				name: "Navigation du pied de page",
			})
		).toHaveAttribute("aria-label", "Navigation du pied de page")
	})

	it.only("should display current year in copyright", () => {
		render(<FooterWrapper />)

		const currentYear = new Date().getFullYear().toString()
		expect(screen.getByText(RegExp(currentYear))).toBeInTheDocument()
	})

	it.only("should handle internal links correctly", async () => {
		render(<FooterWrapper />)

		const user = userEvent.setup()
		const contactLink = screen.getByRole("link", {
			name: "Créer un compte",
		})
		await user.click(contactLink)
		expect(window.location.pathname).toBe("/register")
	})

	it.only("should handle external links correctly", () => {
		const externalLink = {
			href: "https://example.com",
			label: "External Link",
			category: "Test",
			ariaLabel: "Test",
		}

		render(
			<BrowserRouter>
				<FooterLink {...externalLink} />
			</BrowserRouter>
		)

		const link = screen.getByRole("link")
		expect(link).toHaveAttribute("rel", "noopener noreferrer")
		expect(link).toHaveAttribute("target", "_blank")
	})

	it.only("should warn for no-HTTPS external links", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
		const noHttpsLink = {
			href: "http://example.com",
			label: "No HTTPS Link",
			category: "Test",
			ariaLabel: "No HTTPS Test Link",
		}

		render(
			<BrowserRouter>
				<FooterLink {...noHttpsLink} />
			</BrowserRouter>
		)

		expect(warnSpy).toHaveBeenCalledWith(
			"Warning: Non-HTTPS external link detected"
		)
		warnSpy.mockRestore()
	})

	it.only("should not warn for HTTPS external links", () => {
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
		const httpsLink = {
			href: "https://example.com",
			label: "HTTPS Link",
			category: "Test",
			ariaLabel: "HTTPS Test Link",
		}

		render(
			<BrowserRouter>
				<FooterLink {...httpsLink} />
			</BrowserRouter>
		)

		expect(warnSpy).not.toHaveBeenCalled()
		warnSpy.mockRestore()
	})
})
