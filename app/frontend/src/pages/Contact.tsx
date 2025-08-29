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
import { withSEO } from "@/components/hoc/withSEO"

function ContactPage() {
	return (
		<div className="container mx-auto px-4 py-20 max-md:pb-[calc(var(--footer-height)+80px)]">
			<ContactHero />
			<div className="grid gap-12 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle>Envoyez-nous un message</CardTitle>
							<CardDescription>
								Remplissez le formulaire ci-dessous et nous vous
								répondrons dans les plus brefs délais.
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
	)
}

// Export with SEO automatically handled via the "contact" key
const ContactWithSEO = withSEO(ContactPage, "contact")
export default ContactWithSEO
