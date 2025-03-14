import Footer from "@/components/sections/Footer"
import Navigation from "@/components/sections/Navigation"
import { Outlet } from "react-router-dom"

function App() {
	return (
		<>
			<Navigation />
			{/* @TODO calc height : fill screen minus Header height. On mobile : minus Header height and Navbar height. */}
			<main className="h-screen bg-white">
				<div className="h-[100%]">
					<Outlet />
				</div>
			</main>
			<Footer />
		</>
	)
}

export default App
