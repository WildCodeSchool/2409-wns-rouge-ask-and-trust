import UserInformations from "@/components/sections/profile/UserInformations.tsx"
import SurveyTableContainer from "@/components/sections/dashboard/SurveyTableContainer.tsx"

export default function UserProfilePage() {
	return (
		<>
			<section className="flex flex-col justify-between gap-9 p-5 xl:flex-row xl:px-19">
				<UserInformations />
				<SurveyTableContainer />
			</section>
		</>
	)
}
