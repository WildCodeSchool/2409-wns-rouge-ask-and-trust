import FooterMobile from "@/components/sections/footer/FooterMobile"
import HeaderSurveys from "@/components/sections/surveys/Header"
import { matchPath, Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import Footer from "./components/sections/footer/Footer"
import Header from "./components/sections/header/Header"
import { useResponsivity } from "./hooks/useResponsivity"

const RenderHeader = ({
	removeHeader,
	pathname,
}: {
	removeHeader: boolean
	pathname: string
}) => {
	if (removeHeader) {
		return null
	}

	switch (pathname) {
		case "/":
			return <Header />
		case "/surveys":
			return <HeaderSurveys isInSurveys />
		default:
			return <HeaderSurveys />
	}
}
const RenderFooter = ({
	isMobile,
	bgBlue,
	pathname,
}: {
	isMobile: boolean
	bgBlue: boolean
	pathname: string
}) => {
	if (pathname !== "/" && isMobile) {
		return <FooterMobile bgBlue={bgBlue} />
	}
	return <Footer />
}

function App() {
	const location = useLocation()
	const { rootRef, isHorizontalCompact } = useResponsivity(Infinity, 768)
	const isMobileInSurveyCreatorPage = Boolean(
		matchPath("/surveys/build/:id", location.pathname) &&
			isHorizontalCompact
	)

	return (
		<>
			<Toaster richColors position="bottom-center" closeButton />
			<RenderHeader
				removeHeader={isMobileInSurveyCreatorPage}
				pathname={location.pathname}
			/>
			{/* @TODO calc height : fill screen minus Header height. On mobile : minus Header height and Navbar height. */}
			<main className="bg-bg" ref={rootRef}>
				<div className="h-full">
					<Outlet />
				</div>
			</main>
			<RenderFooter
				isMobile={isHorizontalCompact}
				bgBlue={isMobileInSurveyCreatorPage}
				pathname={location.pathname}
			/>
		</>
	)
}

export default App
