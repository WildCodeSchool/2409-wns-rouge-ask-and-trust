const Information = () => {
	return (
		<section
			className="relative flex items-center justify-center overflow-hidden px-5 py-25 lg:py-35"
			role="information"
			aria-label="Deuxieme section"
		>
			<div className="py-12 lg:py-70" aria-hidden="true">
				<svg
					className="absolute top-0 left-0 z-0 h-[32rem] w-auto lg:h-[54rem]"
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
				<div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-28">
					<div className="relative flex max-w-[394px] flex-col rounded-xl shadow-lg shadow-black/10 lg:max-w-[466px]">
						<div className="bg-primary-default flex gap-2.5 rounded-t-xl px-4 py-3">
							<div className="flex h-[15px] w-[15px] flex-row rounded-xl bg-white"></div>
							<div className="flex h-[15px] w-[15px] flex-row rounded-xl bg-white"></div>
							<div className="flex h-[15px] w-[15px] flex-row rounded-xl bg-white"></div>
						</div>
						<div className="items-center rounded-b-xl bg-white px-7 pt-6 pb-8">
							<h4 className="pb-2 pb-6 text-2xl font-bold">
								Une enquête personnalisée et adaptée à vos
								besoins
							</h4>
							<p className="font-regular pb-4 text-sm sm:text-lg lg:text-lg">
								Une fois votre enquête terminée, recevez les
								résultats et analyser les réponses.
							</p>
							<p className="font-regular text-sm sm:text-lg lg:text-lg">
								Choisissez vos questions et comment peuvent
								répondre les participants.
							</p>
						</div>
					</div>
					<div className="rounded-xl shadow-lg shadow-black/10">
						<img
							src="public/assets/window-group-icons.svg"
							alt="img-window-content"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Information
