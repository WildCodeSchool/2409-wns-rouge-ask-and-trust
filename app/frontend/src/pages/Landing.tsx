import Hero from "@/components/sections/landing/Hero"
import Information from "@/components/sections/landing/Information"
import Poll from "@/components/sections/landing/Poll"
import Package from "@/components/sections/landing/Package"
import { Button } from "@/components/ui/Button"
import { Helmet } from "react-helmet"

const Landing = () => {
	return (
		<>
			<Helmet>
				<title>Accueil | Ask&Trust</title>
				<meta
					name="description"
					content="Page d'accueil du site Ark&Trust"
				/>
				<meta name="robots" content="noindex, nofollow" />
				{/* Open Graph */}
				<meta property="og:title" content="Accueil | Ask&Trust" />
				<meta
					property="og:description"
					content="Page d'accueil du site Ark&Trust"
				/>
				<meta property="og:type" content="website" />
				{/* Twitter Card */}
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Accueil | Ask&Trust" />
				<meta
					name="twitter:description"
					content="Page d'accueil du site Ark&Trust"
				/>
			</Helmet>
			<Hero />
			<Information />
			<Poll />
			<Package />
			<div className="flex flex-row justify-center px-5 pt-4 pb-30 lg:pt-15 lg:pb-55">
				<Button
					to="register"
					variant="secondary"
					fullWidth
					role="link"
					ariaLabel="S'inscrire"
					className="mb-2.5 flex h-10 items-center justify-center rounded-md text-base lg:m-0 lg:w-48"
				>
					S'inscrire
				</Button>
			</div>
		</>
	)
}

export default Landing
