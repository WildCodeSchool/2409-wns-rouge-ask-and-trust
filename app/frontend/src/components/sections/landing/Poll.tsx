import CompanyBox from "@/components/ui/CompanyBox"

const Poll = () => {
	const companies = ["Entreprise 1", "Entreprise 2"]

	return (
		<section
			className="section-landing items-center"
			role="poll"
			aria-label="Troisieme section"
		>
			<div
				className="flex flex-col items-center justify-center pt-10 text-center lg:py-15"
				aria-label="Resulats des enquetes"
			>
				<div className="flex flex-col px-10">
					<h1 className="text-primary-default pb-20 text-2xl font-bold lg:pb-35 lg:text-5xl">
						+ de 200 000 enquêtes publiées !
					</h1>
				</div>
				<div className="flex flex-col items-center justify-center">
					<h1 className="font-regular pb-10 text-2xl lg:max-w-[50rem] lg:pb-18 lg:text-5xl">
						60% des grandes entreprises publient leurs enquêtes avec
						nous
					</h1>
					<div className="flex flex-row gap-x-4">
						{companies.map((company, index) => (
							<CompanyBox key={index} name={company} />
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

export default Poll
