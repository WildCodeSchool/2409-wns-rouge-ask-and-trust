import FooterMobile from "@/components/sections/footer/FooterMobile"
import HeaderSurveys from "@/components/sections/surveys/Header"
import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Footer from "./components/sections/footer/Footer"
import Header from "./components/sections/header/Header"
import Question from "./components/sections/surveys/buildSurvey/question/Question"

function App() {
	const location = useLocation()
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768)
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return (
		<>
			<Toaster richColors position="bottom-center" closeButton />
			{location.pathname.startsWith("/surveys") ? (
				<HeaderSurveys />
			) : (
				<Header />
			)}
			{/* @TODO calc height : fill screen minus Header height. On mobile : minus Header height and Navbar height. */}
			<main className="bg-bg mb-20">
				<div className="h-full">
					<Question questionId={"10"} />
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
