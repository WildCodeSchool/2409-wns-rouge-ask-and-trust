import Links from "@/components/ui/Links"
import { useAuthContext } from "@/hooks/useAuthContext"
import { LinksType } from "@/types/types"
import {
	House,
	SquarePlus,
	User,
	Package,
	Scale,
	MessageCircleMore,
} from "lucide-react"

export default function FooterMobile() {
	const { user } = useAuthContext()

	const FOOTER_LINKS: LinksType[] = [
		{
			href: user ? "/surveys" : "/",
			label: "Accueil",
			category: "Accueil",
			ariaLabel: "Retourner sur la page d'accueil",
			Icon: House,
		},
		{
			href: "/surveys/create",
			label: "Créer",
			category: "Création",
			ariaLabel: "Créer une enquête",
			Icon: SquarePlus,
		},
		{
			href: "/payment",
			label: "Achat",
			category: "Achat",
			ariaLabel: "Acheter des enquêtes",
			Icon: Package,
		},
		{
			href: "/contact",
			label: "Contact",
			category: "Contact",
			ariaLabel: "Nous contacter",
			Icon: MessageCircleMore,
		},
		{
			href: "/terms-of-use",
			label: "Légal",
			category: "Légal",
			ariaLabel: "Mentions légales",
			Icon: Scale,
		},
		{
			href: user
				? user.role === "admin"
					? "/admin"
					: "/profil"
				: "/connexion",
			label: user
				? user.role === "admin"
					? "Admin"
					: "Profil"
				: "Se connecter",
			category: "Compte",
			ariaLabel: "Se connecter ou accéder à son compte",
			Icon: User,
		},
	].filter(Boolean)

	return (
		<footer className="bg-bg border-primary-700 fixed bottom-0 flex w-full justify-between border-t px-5 py-2.5 sm:justify-around">
			{FOOTER_LINKS.map(link => (
				<Links
					key={link.href}
					{...link}
					Icon={link.Icon}
					mobileFooter
				/>
			))}
		</footer>
	)
}
