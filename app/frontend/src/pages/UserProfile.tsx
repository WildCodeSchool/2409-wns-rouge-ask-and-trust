import UserInformations from "@/components/sections/profile/UserInformations.tsx"
import SurveyTableContainer from "@/components/sections/dashboard/SurveyTableContainer.tsx"

export default function UserProfilePage() {
	return (
		<>
			<section className="px-5">
				<UserInformations />
				<SurveyTableContainer />
			</section>
		</>
	)
}
