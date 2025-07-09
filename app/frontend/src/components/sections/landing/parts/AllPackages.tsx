import { Link } from "react-router-dom"
import imgCheck from "/public/img/landing/check.svg"

const AllPackages = () => {
	return (
		<div className="flex flex-col gap-22 lg:flex-row lg:gap-20">
			{/* Package 1 */}
			<Link
				to="/"
				className="rounded-xl shadow-lg shadow-black/10 duration-200 hover:scale-[1.05]"
			>
				<div className="secondary bg-primary-default max-w-[271px] rounded-t-xl py-3 text-center text-white">
					<span className="text-xl font-semibold">Gratuit</span>
				</div>
				<div className="flex flex-col justify-start rounded-b-xl bg-white px-4.5 py-4">
					<div className="flex flex-row items-center justify-start gap-3 px-3 pb-3">
						<img
							className="max-w-[36px]"
							src={imgCheck}
							alt="img-check"
						/>
						<p className="text-lg">1 enquête offerte</p>
					</div>
					<div className="flex flex-row items-center justify-start gap-3 px-3 py-3">
						<img
							className="max-w-[36px]"
							src={imgCheck}
							alt="img-check"
						/>
						<p className="text-lg">30 questions</p>
					</div>
					<div className="flex flex-row items-center justify-start gap-3 px-3 pt-3 pb-5">
						<img
							className="max-w-[36px]"
							src={imgCheck}
							alt="img-check"
						/>
						<p className="text-lg">
							Participer aux <br />
							enquêtes en illimité
						</p>
					</div>
					<div className="bg-primary-default flex flex-col rounded-md py-1.5 text-center text-white">
						<span className="font-medium">Offert</span>
					</div>
				</div>
			</Link>
			{/* Package 2 */}
			<Link
				to="/"
				className="scale-[1.3] rounded-xl shadow-lg shadow-black/10 duration-200 hover:scale-[1.35]"
			>
				<div className="secondary bg-primary-default max-w-[271px] rounded-t-xl py-3 text-center text-white">
					<span className="text-xl font-semibold">
						Pack 50 enquêtes
					</span>
				</div>
				<div className="flex flex-col justify-start rounded-b-xl bg-white px-4.5 py-4">
					<div className="flex flex-row items-center justify-start gap-3 px-3 pb-3">
						<img
							className="max-w-[36px]"
							src={imgCheck}
							alt="img-check"
						/>
						<p className="text-lg">1 enquête offerte</p>
					</div>
					<div className="flex flex-row items-center justify-start gap-3 px-3 py-3">
						<img
							className="max-w-[36px]"
							src={imgCheck}
							alt="img-check"
						/>
						<p className="text-lg">Questions illimitées</p>
					</div>
					<div className="flex flex-row items-center justify-start gap-3 px-3 pt-3 pb-5">
						<img
							className="max-w-[36px]"
							src={imgCheck}
							alt="img-check"
						/>
						<p className="text-lg">
							Participer aux <br />
							enquêtes en illimité
						</p>
					</div>
					<div className="bg-primary-default flex flex-col rounded-md py-1.5 text-center text-white">
						<span className="font-medium">29,99 €</span>
					</div>
				</div>
			</Link>
			{/* Package 3 */}
			<Link
				className="rounded-xl shadow-lg shadow-black/10 duration-200 hover:scale-[1.05]"
				to="/"
			>
				<div className="secondary bg-primary-default max-w-[271px] rounded-t-xl py-3 text-center text-white">
					<span className="text-xl font-semibold">
						Pack 100 enquêtes
					</span>
				</div>
				<div className="flex flex-col justify-start rounded-b-xl bg-white px-4.5 py-4">
					<div className="flex flex-row items-center justify-start gap-3 px-3 pb-3">
						<img
							className="max-w-[36px]"
							src={imgCheck}
							alt="img-check"
						/>
						<p className="text-lg">1 enquête offerte</p>
					</div>
					<div className="flex flex-row items-center justify-start gap-3 px-3 py-3">
						<img
							className="max-w-[36px]"
							src={imgCheck}
							alt="img-check"
						/>
						<p className="text-lg">Questions illimitées</p>
					</div>
					<div className="flex flex-row items-center justify-start gap-3 px-3 pt-3 pb-5">
						<img
							className="max-w-[36px]"
							src={imgCheck}
							alt="img-check"
						/>
						<p className="text-lg">
							Participer aux <br />
							enquêtes en illimité
						</p>
					</div>
					<div className="bg-primary-default flex flex-col rounded-md py-1.5 text-center text-white">
						<span className="font-medium">59,99 €</span>
					</div>
				</div>
			</Link>
		</div>
	)
}

export default AllPackages
