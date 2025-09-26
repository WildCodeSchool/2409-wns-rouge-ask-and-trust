import UserInformations from "@/components/sections/profile/UserInformations"
// import AccountManagement from "@/components/sections/profile/AccountManagement"
// import RecoveryCodesManager from "@/components/sections/profile/RecoveryCodesManager"
import SurveyTableContainer from "@/components/sections/dashboard/SurveyTableContainer"
import { withSEO } from "@/components/hoc/withSEO"

function UserProfilePage() {
	return (
		<section className="flex min-h-[calc(100vh_-_var(--header-height))] flex-col items-start gap-10 px-5 py-20 max-md:pb-[calc(var(--footer-height)+80px)] lg:px-20">
			<UserInformations />
			{/* <RecoveryCodesManager />
			<AccountManagement /> */}
			<SurveyTableContainer mode="profile" />
		</section>
	)
}

const UserProfileWithSEO = withSEO(UserProfilePage, "userProfile")
export default UserProfileWithSEO
