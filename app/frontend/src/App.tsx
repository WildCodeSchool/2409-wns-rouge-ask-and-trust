import FooterMobile from "@/components/sections/footer/FooterMobile"
import HeaderSurveys from "@/components/sections/surveys/Header"
import { matchPath, Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Footer from "./components/sections/footer/Footer"
import Header from "./components/sections/header/Header"
import { useResponsivity } from "./hooks/useResponsivity"

function App() {
	const location = useLocation()
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)
	const removeHeaderFromSurveyCreator = Boolean(
		matchPath("/surveys/build/:id", location.pathname) &&
			isHorizontalCompact
	)

	const RenderHeader = () => {
		if (removeHeaderFromSurveyCreator) {
			return null
		}

		switch (location.pathname) {
			case "/":
				return <Header />
			case "/surveys":
				return <HeaderSurveys isInSurveys />
			default:
				return <HeaderSurveys />
		}
	}

	const RenderFooter = () => {
		if (location.pathname !== "/" && isHorizontalCompact) {
			return <FooterMobile bgBlue={removeHeaderFromSurveyCreator} />
		}
		return <Footer />
	}

	return (
		<>
			<Toaster richColors position="bottom-center" closeButton />
			<RenderHeader />
			{/* @TODO calc height : fill screen minus Header height. On mobile : minus Header height and Navbar height. */}
			<main className="bg-bg" ref={rootRef}>
				<div className="h-full">
					<Outlet />
				</div>
			</main>
			<RenderFooter />
		</>
	)
}

export default App
