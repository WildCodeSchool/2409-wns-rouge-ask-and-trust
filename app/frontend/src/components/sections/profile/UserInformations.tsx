import profilePicture from "../../../../public/img/profile/profile-picture.png"
import { Button } from "@/components/ui/Button.tsx"

export default function UserInformations() {
	return (
		<section className="px-5 sm:px-20">
			<div className="max-w-[428px] rounded-md shadow-lg shadow-black/10">
				<div className="bg-primary-default rounded-t-md py-2 text-center text-white">
					<h4 className="text-2xl font-semibold">
						Informations de l'utilisateur
					</h4>
				</div>
				<div className="flex flex-row items-start justify-start gap-2.5 rounded-b-xl bg-white px-1.5 py-4 sm:gap-4 sm:px-5">
					<div className="max-w-[109px] rounded-md shadow-lg shadow-black/10 sm:max-w-[145px]">
						<img
							className="max-w-[109px] rounded-md sm:max-w-[145px]"
							src={profilePicture}
							alt="Image utilisateur"
						/>
					</div>
					<div className="flex w-full flex-col justify-between">
						<div className="flex w-full flex-col">
							<h5 className="text-lg font-extrabold">
								Firstname Lastname
							</h5>
							<p className="text-base font-bold">
								500 enquêtes créées
							</p>
							<p className="text-base font-bold">
								1000 enquêtes répondues
							</p>
						</div>

						<div className="flex flex-row justify-end pt-1.5">
							<Button
								variant="primary"
								role="link"
								ariaLabel="Se connecter"
								className="buttonVariants flex h-7 items-center justify-center rounded-md text-base"
							>
								Modifier
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
