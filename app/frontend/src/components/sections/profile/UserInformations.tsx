import profilePicture from "../../../../public/img/profile/profile-picture.png"
import { Button } from "@/components/ui/Button.tsx"
import { Survey, User } from "@/types/types.ts"
import { useQuery } from "@apollo/client"
import { WHOAMI } from "@/graphql/auth.ts"
import { useSurvey } from "@/hooks/useSurvey.ts"

export default function UserInformations() {
	const { data } = useQuery(WHOAMI)
	const { surveys, isFetching } = useSurvey()

	if (isFetching) {
		return <p>Chargement...</p>
	}

	const user: User = data?.whoami

	const userSurveys: Survey[] = surveys.filter(
		(survey: Survey) => survey.users?.id === user.id
	)

	return (
		<section className="md:min-w-[428px]">
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
								{user.firstname} {user.lastname}
							</h5>
							<div>
								<p className="text-base font-bold">
									{userSurveys?.length} enquêtes créées
								</p>
								<p className="text-base font-bold">
									1000 enquêtes répondues
								</p>
							</div>
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
