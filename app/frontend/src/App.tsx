import { Outlet } from "react-router-dom"
import Footer from "./components/sections/footer/Footer"
import Header from "./components/sections/header/Header"

function App() {
	return (
		<>
			<Header />
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
