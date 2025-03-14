const Information = () => {
	return (
		<section
			className="relative flex items-center justify-center overflow-hidden py-12 lg:py-35"
			role="information"
			aria-label="Deuxieme section"
		>
			<div className="py-12 lg:py-30" aria-hidden="true">
				<svg
					className="absolute top-0 left-0 z-0 h-[30rem] w-auto lg:h-[45rem] 2xl:h-auto"
					viewBox="100 0 1920 791"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill="#F1F2FF"
						d="M745.145 57.0757C459.14 85.6661 4.05875 33.423 -187.731 3.72766L-309 791C-125.47 696.942 1372.14 725.221 2098 751.118L2080.15 57.0757C1934.21 -51.1742 1102.65 21.3377 745.145 57.0757Z"
					/>
				</svg>
			</div>
			<div className="relative" aria-label="Fenetres expliquatives">
				<div className="flex flex-col items-center lg:flex-row xl:gap-x-10">
					<div className="relative">
						<img
							src="../../../public/assets/window-text.svg"
							alt="img-window"
						/>
						<div className="text-on-img absolute items-center px-2">
							<h4 className="pb-2 text-2xl font-bold">
								Une enquête personnalisée et adaptée à vos
								besoins
							</h4>
							<h5 className="font-regular pb-2 text-sm sm:text-lg lg:text-lg">
								Une fois votre enquête terminée, recevez les
								résultats et analyser les réponses.
							</h5>
							<h5 className="font-regular text-sm sm:text-lg lg:text-lg">
								Choisissez vos questions et comment peuvent
								répondre les participants.
							</h5>
						</div>
					</div>
					<img
						src="../../../public/assets/window-group-icons.svg"
						alt="img-window-content"
					/>
				</div>
			</div>
		</section>
	)
}

export default Information
