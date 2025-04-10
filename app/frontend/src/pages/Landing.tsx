import Hero from "@/components/sections/landing/Hero.tsx"
import Information from "@/components/sections/landing/Information.tsx"
import Poll from "@/components/sections/landing/Poll.tsx"
import Package from "@/components/sections/landing/Package.tsx"
import { Button } from "@/components/ui/Button.tsx"

const Landing = () => {
	return (
		<div>
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
		</div>
	)
}

export default Landing
