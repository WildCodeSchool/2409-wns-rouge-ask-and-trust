import { Button } from "@/components/ui/Button.tsx"

const Hero = () => {
	return (
		<section className="mt-3 mb-16 flex flex-col justify-center px-5 lg:mx-10 lg:my-20 lg:flex-row-reverse lg:items-center lg:px-20">
			<div className="pb-6 lg:m-4 lg:max-w-[45rem]">
				<img
					src="../../../../public/assets/illustration-presentation.svg"
					alt="img-presentation"
				/>
			</div>
			<div className="flex flex-col lg:w-4/12">
				<span className="pb-4.5 text-5xl font-black lg:pb-3.5 lg:text-6xl">
					Créez, partagez, analysez
				</span>
				<h5 className="pb-4.5 font-medium lg:pb-4">
					Avec notre outil en ligne, menez vos enquêtes en tout
					simplicité. Créez un formulaire, détaillez les réponses
					possibles, partagez-le... et c’est parti !
				</h5>
				<Button
					variant="secondary"
					fullWidth
					role="link"
					ariaLabel="S'inscrire"
					className="mb-2.5 flex h-10 items-center justify-center rounded-md text-base lg:m-0 lg:w-48"
				>
					S'inscrire
				</Button>

				<Button
					variant="primary"
					fullWidth
					role="link"
					ariaLabel="Se connecter"
					className="buttonVariants flex h-10 items-center justify-center rounded-md text-base lg:hidden"
				>
					Se connecter
				</Button>
			</div>
		</section>
	)
}

export default Hero
