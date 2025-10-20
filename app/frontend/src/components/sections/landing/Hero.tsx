import { Button } from "@/components/ui/Button"
import imgPresentation from "/public/img/landing/illustration-presentation.svg"

const Hero = () => {
	return (
		<section
			className="section-landing"
			role="hero"
			data-first-section
			aria-label="Premiere section"
		>
			<div className="pb-6 lg:m-4 lg:max-w-[45rem]" aria-hidden="true">
				<img src={imgPresentation} alt="img-presentation" />
			</div>
			<div
				className="flex flex-col lg:w-120"
				aria-label="Texte premiere section"
			>
				<span className="pb-4.5 text-5xl font-black lg:pb-3.5 lg:text-6xl">
					Créez, partagez, analysez
				</span>
				<h5 className="font-regular pb-4.5 text-lg lg:pb-4">
					Avec notre outil en ligne, menez vos enquêtes en tout
					simplicité. Créez un formulaire, détaillez les réponses
					possibles, partagez-le... et c’est parti !
				</h5>
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
