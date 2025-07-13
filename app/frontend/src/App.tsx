import FooterMobile from "@/components/sections/footer/FooterMobile"
import HeaderSurveys from "@/components/sections/surveys/Header"
import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Footer from "./components/sections/footer/Footer"
import Header from "./components/sections/header/Header"
import useResponsive from "./hooks/useResponsive"

function App() {
	const location = useLocation()
	const isMobile = useResponsive()

	return (
		<>
			<Toaster richColors position="bottom-center" closeButton />
			{location.pathname === "/" ? <Header /> : <HeaderSurveys />}
			{/* @TODO calc height : fill screen minus Header height. On mobile : minus Header height and Navbar height. */}
			<main className="bg-bg mb-20">
				<div className="h-full">
					<Outlet />
				</div>
			</main>
			{location.pathname === "/surveys" && isMobile ? (
				<FooterMobile />
			) : (
				<Footer />
			)}
		</>
	)
}

export default App
