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
		<div className="flex w-full flex-col gap-4 p-4">
			<div className="flex flex-row items-start justify-start gap-4">
				<div className="shadow-component w-28">
					<img
						className="w-full rounded-md"
						src={profilePicture}
						alt="Image utilisateur"
					/>
				</div>
				<div className="flex flex-col justify-start gap-2">
					<h5 className="text-lg font-extrabold">
						{user?.firstname} {user?.lastname}
					</h5>
					<p className="text-base font-bold">
						Vous avez créé {userSurveys?.totalCountAll} enquêtes !
					</p>
				</div>
			</div>
			<div className="flex flex-row items-center justify-center gap-2">
				<Button
					variant="primary"
					role="link"
					ariaLabel="Modifier l'utilisateur"
				>
					Modifier
				</Button>
				<Button
					ariaLabel="Modifier le mot de passe"
					variant="secondary"
					onClick={onToggleResetForm}
				>
					{showResetForm ? "Fermer" : "Modifier le mot de passe"}
				</Button>
			</div>
		</div>
	)
}
