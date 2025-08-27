import UserInformations from "@/components/sections/profile/UserInformations.tsx"
import SurveyTableContainer from "@/components/sections/dashboard/SurveyTableContainer.tsx"
import { withSEO } from "@/components/hoc/withSEO"

function UserProfilePage() {
	return (
		<section className="flex flex-col items-center gap-10 px-5 py-20 pb-[calc(var(--footer-height)+80px)] lg:px-20">
			<UserInformations />
			<SurveyTableContainer />
		</section>
	)
}

const UserProfileWithSEO = withSEO(UserProfilePage, "userProfile")
export default UserProfileWithSEO
