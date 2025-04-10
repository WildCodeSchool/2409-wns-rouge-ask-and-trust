import Header from "@/components/sections/header/Header"
import Footer from "@/components/sections/footer/Footer"
import Hero from "@/components/sections/landing/Hero"
import Information from "@/components/sections/landing/Information"
import Package from "@/components/sections/landing/Package"
import Poll from "@/components/sections/landing/Poll"
import { Button } from "@/components/ui/Button.tsx"

function App() {
	return (
		<>
			<Header />
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
			<Footer />
		</>
	)
}

export default App
