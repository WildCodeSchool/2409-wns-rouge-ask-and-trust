import Hero from "@/components/sections/landing/Hero"
import Information from "@/components/sections/landing/Information"
import Poll from "@/components/sections/landing/Poll"
import Package from "@/components/sections/landing/Package"
import { Button } from "@/components/ui/Button"
import { withSEO } from "@/components/hoc/withSEO"

const Landing = () => {
	return (
		<>
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

const LandingWithSEO = withSEO(Landing, "landing")
export default LandingWithSEO
