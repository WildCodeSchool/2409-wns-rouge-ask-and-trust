import { Outlet, useLocation } from "react-router-dom"
import Footer from "./components/sections/footer/Footer"
import HeaderSurveys from "@/components/sections/surveys/Header"
import { useEffect, useState } from "react"
import FooterMobile from "@/components/sections/footer/FooterMobile"
import Header from "@/components/sections/header/Header.tsx"

function App() {
	const location = useLocation()
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	const renderHeader = () => {
		if (location.pathname.startsWith("/surveys")) {
			return <HeaderSurveys showCategories />
		} else if (location.pathname.startsWith("/profile")) {
			return <HeaderSurveys />
		}
		return <Header />
	}

	const renderFooter = () => {
		if (location.pathname === "/surveys" && isMobile) {
			return <FooterMobile />
		}
		return <Footer />
	}

	return (
		<>
			{renderHeader()}
			{/* @TODO calc height : fill screen minus Header height. On mobile : minus Header height and Navbar height. */}
			<main className="bg-bg mb-20">
				<div className="h-full">
					<Outlet />
				</div>
			</main>
			{renderFooter()}
		</>
	)
}

export default App
