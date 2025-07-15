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

	return (
		<>
			<Toaster richColors position="bottom-center" closeButton />
			{location.pathname === "/" ? <Header /> : <HeaderSurveys />}
			{/* @TODO calc height : fill screen minus Header height. On mobile : minus Header height and Navbar height. */}
			<main className="bg-bg mb-20" ref={rootRef}>
				<div className="h-full">
					<Outlet />
				</div>
			</main>
			{location.pathname === "/surveys" && isHorizontalCompact ? (
				<FooterMobile />
			) : (
				<Footer />
			)}
		</>
	)
}

export default App
