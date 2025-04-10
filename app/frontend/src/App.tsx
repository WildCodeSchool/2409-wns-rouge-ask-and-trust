import { Outlet, useLocation } from "react-router-dom"
import Footer from "./components/sections/footer/Footer"
import Header from "./components/sections/header/Header"
import HeaderSurveys from "./components/sections/header/Header"
import { useEffect, useState } from "react"
import FooterMobile from "@/components/sections/footer/FooterMobile.tsx"

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

	return (
		<>
			{location.pathname.startsWith("/surveys") ? (
				<HeaderSurveys />
			) : (
				<Header />
			)}
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
