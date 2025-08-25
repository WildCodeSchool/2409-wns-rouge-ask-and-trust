import UserInformations from "@/components/sections/profile/UserInformations.tsx"
import SurveyTableContainer from "@/components/sections/dashboard/SurveyTableContainer.tsx"
import { withSEO } from "@/components/hoc/withSEO"

function UserProfilePage() {
	return (
		<section className="flex flex-col items-center gap-9 p-5 lg:px-19">
			<UserInformations />
			<SurveyTableContainer />
		</section>
	)
}

const UserProfileWithSEO = withSEO(UserProfilePage, "userProfile")
export default UserProfileWithSEO
