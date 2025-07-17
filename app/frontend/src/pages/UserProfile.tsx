import UserInformations from "@/components/sections/profile/UserInformations.tsx"
import SurveyTableContainer from "@/components/sections/dashboard/SurveyTableContainer.tsx"
import { Helmet } from "react-helmet"

export default function UserProfilePage() {
	return (
		<section className="flex flex-col items-center gap-9 p-5 lg:px-19">
			<Helmet>
				<title>Profil utilisateur</title>
				<meta name="description" content="Profil utilisateur" />
				<meta name="robots" content="noindex, nofollow" />
				<meta property="og:title" content="Profil" />
				<meta property="og:description" content="Profil utilisateur" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Profil" />
				<meta name="twitter:description" content="Profil utilisateur" />
			</Helmet>
			<UserInformations />
			<SurveyTableContainer />
		</section>
	)
}
