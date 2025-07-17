import AllPackages from "@/components/sections/landing/parts/AllPackages"

const Package = () => {
	return (
		<section
			className="relative flex items-center justify-center overflow-hidden pt-30 pb-15 lg:py-25"
			role="package"
			aria-label="Quatrieme section"
		>
			<div className="py-12 lg:py-30" aria-hidden="true">
				<svg
					className="absolute top-0 left-0 z-0 h-[97rem] w-full lg:h-[54rem]"
					viewBox="0 0 1920 791"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="xMidYMid slice"
				>
					<path
						fill="#F1F2FF"
						d="M745.145 57.0757C459.14 85.6661 4.05875 33.423 -187.731 3.72766L-309 791C-125.47 696.942 1372.14 725.221 2098 751.118L2080.15 57.0757C1934.21 -51.1742 1102.65 21.3377 745.145 57.0757Z"
					/>
				</svg>
			</div>
			<div
				className="relative flex flex-col items-center py-10 xl:gap-x-10"
				aria-label="Differents packages"
			>
				<h1 className="font-regular mb-12 text-center text-2xl lg:max-w-[50rem] lg:pb-18 lg:text-5xl">
					Besoin de plus d’enquêtes ? <br />
					Nos packs s’adaptent à vos défis
				</h1>
				<AllPackages />
			</div>
		</section>
	)
}

export default Package
