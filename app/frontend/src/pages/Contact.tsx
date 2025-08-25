import { ContactHero } from "@/components/sections/contact/ContactHero"
import { ContactInfo } from "@/components/sections/contact/ContactInfo"
import { ContactFAQ } from "@/components/sections/contact/ContactFAQ"
import { ContactMap } from "@/components/sections/contact/ContactMap"
import { ContactCTA } from "@/components/sections/contact/ContactCTA"
import { ContactForm } from "@/components/sections/contact/ContactForm"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card"
import { Helmet } from "react-helmet"

export default function Contact() {
	return (
		<>
			<Helmet>
				<title>Contactez-nous</title>
				<meta name="description" content="Page de contact." />
				<meta name="robots" content="index, follow" />
				<meta property="og:title" content="Contactez-nous" />
				<meta property="og:description" content="Page de contact." />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary" />
				<meta name="twitter:title" content="Contactez-nous" />
				<meta name="twitter:description" content="Page de contact." />
			</Helmet>
			<div className="container mx-auto px-4 pt-20">
				<ContactHero />
				<div className="grid gap-12 lg:grid-cols-3">
					<div className="lg:col-span-2">
						<Card>
							<CardHeader>
								<CardTitle>Envoyez-nous un message</CardTitle>
								<CardDescription>
									Remplissez le formulaire ci-dessous et nous
									vous répondrons dans les plus brefs délais.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ContactForm />
							</CardContent>
						</Card>
					</div>
					<ContactInfo />
				</div>
				<ContactFAQ />
				<ContactMap />
				<ContactCTA />
			</div>
		</>
	)
}
