import Signin from "@/components/sections/auth/Signin"
import Signup from "@/components/sections/auth/Signup"
import { Link, useLocation } from "react-router-dom"

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
		<div className="flex h-[100%] flex-col items-center gap-4 px-4 py-16 md:px-0">
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

export default Auth
