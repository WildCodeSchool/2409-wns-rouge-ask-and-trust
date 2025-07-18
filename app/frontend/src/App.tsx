import FooterMobile from "@/components/sections/footer/FooterMobile"
import HeaderSurveys from "@/components/sections/surveys/Header"
import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Footer from "./components/sections/footer/Footer"
import Header from "./components/sections/header/Header"
import { useResponsivity } from "./hooks/useResponsivity"

function App() {
	const location = useLocation()
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)

	const renderHeader = () => {
		switch (location.pathname) {
			case "/":
				return <Header />
			case "/surveys":
				return <HeaderSurveys showCategories />
			default:
				return <HeaderSurveys />
		}
	}

	const renderFooter = () => {
		if (location.pathname === "/surveys" && isHorizontalCompact) {
			return <FooterMobile />
		}
		return <Footer />
	}

	return (
		<>
			<Toaster richColors position="bottom-center" closeButton />
			{renderHeader()}
			{/* @TODO calc height : fill screen minus Header height. On mobile : minus Header height and Navbar height. */}
			<main className="bg-bg mb-20" ref={rootRef}>
				<div className="h-full">
					<Outlet />
				</div>
			</main>
			{renderFooter()}
		</>
	)
}

export default App
