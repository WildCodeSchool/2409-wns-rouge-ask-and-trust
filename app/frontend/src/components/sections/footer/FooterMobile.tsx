import { useRef } from "react"
import Links from "@/components/ui/Links"
import { useAuthContext } from "@/hooks/useAuthContext"
import { useHeightVariable } from "@/hooks/useHeightVariable"
import { LinksType } from "@/types/types"
import {
	House,
	SquarePlus,
	User,
	Package,
	Scale,
	MessageCircleMore,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { useSurveyMutations } from "@/hooks/survey/useSurveyMutations"
import { useToastOnChange } from "@/hooks/useToastOnChange"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/useToast"

export default function FooterMobile({ bgBlue }: { bgBlue?: boolean }) {
	const { user } = useAuthContext()
	const footerRef = useRef<HTMLElement>(null)

	const {
		createSurvey,
		createSurveyError,
		isCreatingSurvey,
		resetCreateSurveyError,
	} = useSurveyMutations()

	useToastOnChange({
		trigger: createSurveyError,
		resetTrigger: resetCreateSurveyError,
		type: "error",
		title: "Erreur pour créer l'enquête",
		description: "Nous n'avons pas réussi à créer l'enquête",
	})
	const navigate = useNavigate()
	const { showToast } = useToast()

	const onCreateSurveyAndNavigate = async () => {
		try {
			const newSurvey = await createSurvey({
				title: "Nouvelle enquête",
				description: "",
				public: false,
				category: "",
			})

			if (!newSurvey?.id) {
				throw new Error(
					"Impossible de récupérer l'ID de la nouvelle enquête"
				)
			}

			navigate(`/surveys/build/${newSurvey.id}`)
		} catch (error) {
			console.error(error)
			showToast({
				type: "error",
				title: "Erreur",
				description: "La création de l'enquête a échoué",
			})
		}
	}

	useHeightVariable(footerRef, "--footer-height")

	const FOOTER_LINKS: LinksType[] = [
		{
			href: user ? "/surveys" : "/",
			label: "Accueil",
			category: "Accueil",
			ariaLabel: "Retourner sur la page d'accueil",
			Icon: House,
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
		<footer
			className={cn(
				"bg-bg border-primary-700 fixed bottom-0 flex w-full justify-between border-t px-5 py-2.5 sm:justify-around",
				bgBlue && "bg-primary-700 border-none"
			)}
			ref={footerRef}
		>
			<Button
				icon={SquarePlus}
				loadingSpinner={isCreatingSurvey}
				onClick={onCreateSurveyAndNavigate}
				variant="footerMobile"
				size="xs"
				role="button"
				ariaLabel="Créer une enquête"
				children="Créer"
			/>
			{FOOTER_LINKS.map(link => (
				<Links
					key={link.href}
					{...link}
					Icon={link.Icon}
					mobileFooter
					bgBlue={bgBlue}
				/>
			))}
		</footer>
	)
}
