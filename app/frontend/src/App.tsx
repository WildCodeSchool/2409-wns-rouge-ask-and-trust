import { Outlet } from "react-router-dom"
import Footer from "./components/sections/footer/Footer"
import Header from "./components/sections/header/Header"

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
            <Hero />
            <Information />
            <Poll />
            <Package />
            <div className="flex flex-row justify-center px-5 pt-4 pb-30 lg:pt-15 lg:pb-55">
                <Button
                    variant="secondary"
                    fullWidth
                    role="link"
                    ariaLabel="S'inscrire"
                    className="mb-2.5 flex h-10 items-center justify-center rounded-md text-base lg:m-0 lg:w-48"
                >
                    S'inscrire
                </Button>
            </div>
			{location.pathname === "/surveys" && isMobile ? (
				<FooterMobile />
			) : (
				<Footer />
			)}
		</>
	)
}

export default App
