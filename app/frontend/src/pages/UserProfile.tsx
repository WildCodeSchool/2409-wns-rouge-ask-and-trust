import UserInformations from "@/components/sections/profile/UserInformations.tsx"
import SurveyTableContainer from "@/components/sections/dashboard/SurveyTableContainer.tsx"

export default function UserProfilePage() {
	return (
		<>
			<section className="flex flex-col gap-9 p-5 lg:px-19">
				<article className="flex flex-row justify-center gap-10">
					<UserInformations />
					<UserInformations />
				</article>
				<article>
					<SurveyTableContainer />
				</article>
			</section>
		</>
	)
}
