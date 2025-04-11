import { Package } from "@/types/types"

interface PackageSelectionProps {
	packages: Package[]
	selectedPackage: Package
	onPackageSelect: (pkg: Package) => void
}

export function PackageSelection({
	packages,
	selectedPackage,
	onPackageSelect,
}: PackageSelectionProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			{packages.map((pkg: Package) => (
				<div
					key={pkg.id}
					className={`cursor-pointer rounded-xl transition-all duration-200 hover:shadow-lg ${
						selectedPackage.id === pkg.id
							? "ring-primary-default ring-2 ring-offset-2"
							: "shadow-md"
					}`}
					onClick={() => onPackageSelect(pkg)}
				>
					<div className="bg-primary-default rounded-t-xl py-3 text-center text-white">
						<span className="text-xl font-semibold">
							{pkg.name}
						</span>
					</div>
					<div className="flex flex-col justify-start rounded-b-xl bg-white px-4 py-4">
						{pkg.features.map((feature: string, index: number) => (
							<div
								key={index}
								className="flex flex-row items-center justify-start gap-3 px-3 py-3"
							>
								<img
									className="max-w-[36px]"
									src="../../../public/assets/check.svg"
									alt="img-check"
								/>
								<p className="text-lg">{feature}</p>
							</div>
						))}
						<div className="bg-primary-default mt-4 flex flex-col rounded-md py-1.5 text-center text-white">
							<span className="font-medium">
								{pkg.price.toFixed(2)} €
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
