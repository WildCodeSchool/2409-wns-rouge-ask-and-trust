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
		<div className="w-full max-w-[428px] px-1.5 py-4 sm:px-5">
			<div className="flex flex-row items-start justify-start gap-2.5 sm:gap-4">
				<div className="max-w-[109px] rounded-md shadow-lg shadow-black/10 sm:max-w-[145px]">
					<img
						className="max-w-[109px] rounded-md sm:max-w-[145px]"
						src={profilePicture}
						alt="Image utilisateur"
					/>
				</div>

				<div className="flex w-full flex-col justify-start">
					<h5 className="text-lg font-extrabold">
						{user.firstname} {user.lastname}
					</h5>
					<p className="text-base font-bold">
						{userSurveys?.length} enquêtes créées
					</p>
					<p className="text-base font-bold">
						1000 enquêtes répondues
					</p>
				</div>
			</div>

			<div className="mt-4 flex flex-row items-center justify-end gap-2">
				<Button
					variant="primary"
					role="link"
					ariaLabel="Modifier l'utilisateur"
					className="buttonVariants h-9 rounded-md px-4 text-base"
				>
					Modifier
				</Button>

				<Button
					ariaLabel="Modifier le mot de passe"
					variant="secondary"
					onClick={onToggleResetForm}
					className="h-9 rounded-md px-4 text-base"
				>
					{showResetForm ? "Fermer" : "Modifier le mot de passe"}
				</Button>
			</div>
		</div>
	)
}
