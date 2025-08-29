import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"

export function ContactCTA() {
	return (
		<section className="mt-16 text-center">
			<Card className="bg-primary text-primary-foreground">
				<CardContent>
					<h2 className="mb-4 text-3xl font-bold">
						Prêt à découvrir Ask-and-Trust ?
					</h2>
					<p className="mb-6 text-lg opacity-90">
						Découvrez nos services et commencez dès aujourd'hui à
						bâtir la confiance avec vos clients.
					</p>
					<div className="flex justify-center gap-4">
						<Button
							size="lg"
							variant="secondary"
							ariaLabel="Voir les services"
						>
							<Link to="/">Voir les services</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
							ariaLabel="Créer un compte"
						>
							<Link to="/register">Créer un compte</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}
