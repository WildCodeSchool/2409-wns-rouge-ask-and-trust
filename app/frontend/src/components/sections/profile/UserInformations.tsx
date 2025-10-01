import { User } from "@/types/types"
import { useQuery } from "@apollo/client"
import { WHOAMI } from "@/graphql/auth"
import { useSurvey } from "@/hooks/useSurvey"
import { useState } from "react"
import { UserDetailsPart } from "@/components/sections/profile/parts/UserDetailsPart"
import { ResetPasswordPart } from "@/components/sections/profile/parts/ResetPasswordPart"
import { DeleteAccountPart } from "@/components/sections/profile/parts/DeleteAccountPart"

export default function UserInformations() {
	const [showResetForm, setShowResetForm] = useState<boolean>(false)
	const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false)

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
						showDeleteForm={showDeleteForm}
						onToggleResetForm={() => {
							setShowResetForm((prev: boolean) => !prev)
							setShowDeleteForm(false)
						}}
						onToggleDeleteForm={() => {
							setShowDeleteForm((prev: boolean) => !prev)
							setShowResetForm(false)
						}}
					/>
					{showResetForm && <ResetPasswordPart />}
					{showDeleteForm && <DeleteAccountPart />}
				</div>
			</div>
		</section>
	)
}
