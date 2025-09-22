import { User } from "@/types/types.ts"
import { useQuery } from "@apollo/client"
import { WHOAMI } from "@/graphql/auth.ts"
import { useSurvey } from "@/hooks/useSurvey.ts"
import { useState } from "react"
import { UserDetailsPart } from "@/components/sections/profile/parts/UserDetailsPart.tsx"
import { ResetPasswordPart } from "@/components/sections/profile/parts/ResetPasswordPart.tsx"

export default function UserInformations() {
	const [showResetForm, setShowResetForm] = useState<boolean>(false)

	const { data } = useQuery(WHOAMI)
	const { mySurveys, isRefetching } = useSurvey()

	if (isRefetching) {
		return <p>Chargement...</p>
	}

	const user: User = data?.whoami

	return (
		<section className="max-md:w-full">
			<div className="shadow-component rounded-md bg-white">
				<div className="bg-primary-default rounded-t-md p-2.5 text-center">
					<h1 className="text-2xl font-semibold text-white">
						Informations de l'utilisateur
					</h1>
				</div>

				<div className="flex flex-col md:flex-row">
					<UserDetailsPart
						user={user}
						userSurveys={mySurveys}
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
