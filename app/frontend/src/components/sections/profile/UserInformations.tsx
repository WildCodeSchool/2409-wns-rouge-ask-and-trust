import { Survey, User } from "@/types/types.ts"
import { useQuery } from "@apollo/client"
import { WHOAMI } from "@/graphql/auth.ts"
import { useSurvey } from "@/hooks/useSurvey.ts"
import { useState } from "react"
import { UserDetailsPart } from "@/components/sections/profile/parts/UserDetailsPart.tsx"
import { ResetPasswordPart } from "@/components/sections/profile/parts/ResetPasswordPart.tsx"

export default function UserInformations() {
	const [showResetForm, setShowResetForm] = useState<boolean>(false)

	const { data } = useQuery(WHOAMI)
	const { surveys, isFetching } = useSurvey()

	if (isFetching) {
		return <p>Chargement...</p>
	}

	const user: User = data?.whoami

	const userSurveys: Survey[] = surveys.filter(
		(survey: Survey) => survey.user?.id === user.id
	)

	return (
		<section
			className={`duration-100 ${
				showResetForm
					? "lg:min-w-[850px]"
					: "sm:max-w-[331px] lg:min-w-[428px]"
			}`}
		>
			<div className="rounded-md bg-white shadow-lg shadow-black/10">
				<div className="bg-primary-default rounded-t-md p-2 text-center text-white">
					<h4 className="text-2xl font-semibold">
						Informations de l'utilisateur
					</h4>
				</div>

				<div className="flex flex-col md:flex-row">
					<UserDetailsPart
						user={user}
						userSurveys={userSurveys}
						showResetForm={showResetForm}
						onToggleResetForm={() =>
							setShowResetForm((prev: boolean) => !prev)
						}
					/>
					{showResetForm && <ResetPasswordPart />}
				</div>
			</div>
		</section>
	)
}
