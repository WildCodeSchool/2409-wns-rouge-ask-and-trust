import profilePicture from "../../../../../public/img/profile/profile-picture.png"
import { Button } from "@/components/ui/Button.tsx"
import { UserDetails } from "@/types/types.ts"

export function UserDetailsPart({
	user,
	userSurveys,
	showResetForm,
	onToggleResetForm,
}: UserDetails) {
	return (
		<div className="w-full px-1.5 py-4 sm:min-w-[331px] sm:px-2 md:px-2 lg:px-5">
			<div className="flex flex-row items-start justify-start gap-2.5 sm:gap-4">
				<div className="shadow-component max-w-[109px] rounded-md">
					<img
						className="max-w-[109px] rounded-md"
						src={profilePicture}
						alt="Image utilisateur"
					/>
				</div>

				<div className="flex w-full flex-col justify-start gap-2">
					<h5 className="text-lg font-extrabold">
						{user?.firstname} {user?.lastname}
					</h5>
					<p className="text-base font-bold">
						{userSurveys?.totalCountAll} enquêtes créées
					</p>
					<p className="text-base font-bold">
						1000 enquêtes répondues
					</p>
				</div>
			</div>

			<div className="mt-4 flex flex-row items-center justify-center gap-2">
				<Button
					variant="primary"
					role="link"
					ariaLabel="Modifier l'utilisateur"
					className="buttonVariants h-9 rounded-md px-3 text-base"
				>
					Modifier
				</Button>

				<Button
					ariaLabel="Modifier le mot de passe"
					variant="secondary"
					onClick={onToggleResetForm}
					className="buttonVariants h-9 rounded-md px-3 text-base"
				>
					{showResetForm ? "Fermer" : "Modifier le mot de passe"}
				</Button>
			</div>
		</div>
	)
}
