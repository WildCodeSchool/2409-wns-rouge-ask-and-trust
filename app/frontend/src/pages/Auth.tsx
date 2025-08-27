import Signin from "@/components/sections/auth/Signin"
import Signup from "@/components/sections/auth/Signup"
import { Link, useLocation } from "react-router-dom"
import { withSEO } from "@/components/hoc/withSEO"

const routes = [
	{
		path: "/connexion",
		component: <Signin />,
		label: "Je veux m'inscrire",
		ariaLabel: "d'inscription",
		link: "/register",
	},
	{
		path: "/register",
		component: <Signup />,
		label: "J'ai déjà un compte",
		ariaLabel: "de connexion",
		link: "/connexion",
	},
]

// Auth renders Signup or Sign depending on path
const Auth = () => {
	const { pathname } = useLocation()

	const currentRoute = routes.find(route => route.path === pathname)

	if (!currentRoute) return null

	const { component, label, ariaLabel, link } = currentRoute

	return (
		<div className="flex h-[calc(100vh_-_var(--header-height))] flex-col items-center justify-center gap-4 px-4 max-md:pb-[calc(var(--footer-height))] md:px-0">
			{component}
			<Link
				aria-label={`Aller à la page ${ariaLabel}`}
				to={link}
				className="text-primary-700 hover:underline"
			>
				{label}
			</Link>
		</div>
	)
}

const AuthWithSEO = withSEO(Auth, "auth")
export default AuthWithSEO
