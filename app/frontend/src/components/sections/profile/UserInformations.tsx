import { useState } from "react"
import { UserDetailsPart } from "@/components/sections/profile/parts/UserDetailsPart"
import { ResetPasswordPart } from "@/components/sections/profile/parts/ResetPasswordPart"
import { useSurveysData } from "@/hooks/survey/useSurveysData"
import { useAuthContext } from "@/hooks/useAuthContext"

export default function UserInformations() {
	const [showResetForm, setShowResetForm] = useState<boolean>(false)
	const { user } = useAuthContext()

	const { mySurveys, isRefetchingMySurveys, mySurveysError } = useSurveysData(
		{
			mode: "profile",
		}
	)

	if (isRefetchingMySurveys) {
		return <p>Chargement des enquêtes...</p>
	}

	if (!mySurveys && mySurveysError) {
		throw new Response("Surveys not found", { status: 404 })
	}

	if (!user) {
		throw new Response("User not found", { status: 404 })
	}

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
