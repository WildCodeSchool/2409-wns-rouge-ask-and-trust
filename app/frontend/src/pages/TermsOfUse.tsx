import { Helmet } from "react-helmet"

export default function TermsOfUse() {
	return (
		<>
			<Helmet>
				<title>Mentions Légales | Ask&Trust</title>
				<meta
					name="description"
					content="Mentions légales et informations juridiques concernant notre service de formulaires en ligne."
				/>
				<meta name="robots" content="index, follow" />
				<link rel="canonical" href="/terms-of-use" />
			</Helmet>

			<section className="bg-bg container mx-auto max-w-4xl px-4 pt-20">
				<h1
					className="text-primary mb-6 text-3xl font-bold"
					id="main-heading"
				>
					Mentions Légales
				</h1>

				<div className="prose prose-lg max-w-none">
					<article
						className="mb-8"
						title="Propriétaire du site : Wild Code School"
					>
						<p className="mb-4">
							Avant toute utilisation du site Internet et des
							services proposés par la Wild Code School (marque
							enregistrée par la société INNOV'EDUC), vous devez
							lire attentivement les présentes Conditions
							Générales d'Utilisation et de Services, car elles
							contiennent d'importantes informations et
							stipulations, relatives à vos obligations, droits et
							recours.
						</p>
						<p className="mb-4">
							Les présentes Conditions Générales d'Utilisation et
							de Services (ci-après les "Conditions Générales")
							des sites wildcodeschool.com et
							odyssey.wildcodeschool.com (ci-après le "Site ")
							sont éditées par la société INNOV'EDUC (ci-après la
							"Société"), société par actions simplifiées au
							capital social de 14 250 €, dont le siège social est
							situé au 44 rue Alphonse Penaud, 75020 Paris (RCS
							Chartres 794 926 063), société éditrice du site
							wildcodeschool.com, dont le numéro de TVA
							intracommunautaire est FR 27 794 926 063. Organisme
							de formation enregistré auprès du Préfet de la
							région Centre le 23 juin 2014 sous le n° 24 28
							0154228.
						</p>
					</article>

					<article
						className="mb-8"
						title="Informations légales et coordonnées de l'entreprise"
					>
						<h2 className="text-primary mb-4 text-2xl font-semibold">
							1. Informations légales
						</h2>
						<p className="mb-4">
							Conformément aux dispositions des articles 6-III et
							19 de la Loi n° 2004-575 du 21 juin 2004 pour la
							Confiance dans l'économie numérique, dite L.C.E.N.,
							nous portons à la connaissance des utilisateurs et
							visiteurs du site les informations suivantes :
						</p>

						<div className="border-primary/20 bg-bg mb-4 border-l-4 py-2 pl-4">
							<p className="mb-2">
								<strong>Raison sociale :</strong> [Nom de votre
								entreprise]
							</p>
							<p className="mb-2">
								<strong>Forme juridique :</strong> [Forme
								juridique]
							</p>
							<p className="mb-2">
								<strong>Adresse :</strong> [Adresse complète]
							</p>
							<p className="mb-2">
								<strong>Téléphone :</strong> [Numéro de
								téléphone]
							</p>
							<p className="mb-2">
								<strong>Email :</strong> [Adresse email]
							</p>
							<p className="mb-2">
								<strong>SIRET :</strong> [Numéro SIRET]
							</p>
							<p>
								<strong>
									Numéro de TVA intracommunautaire :
								</strong>{" "}
								[Numéro TVA]
							</p>
						</div>
					</article>

					<article
						className="mb-8"
						title="Informations sur l'hébergement du site"
					>
						<h2 className="text-primary mb-4 text-2xl font-semibold">
							2. Hébergement
						</h2>
						<p className="mb-4">Le site est hébergé par :</p>
						<div className="border-primary/20 bg-bg mb-4 border-l-4 py-2 pl-4">
							<p className="mb-2">
								<strong>Société :</strong> [Nom de l'hébergeur]
							</p>
							<p className="mb-2">
								<strong>Adresse :</strong> [Adresse de
								l'hébergeur]
							</p>
							<p>
								<strong>Site web :</strong> [Site web de
								l'hébergeur]
							</p>
						</div>
					</article>

					<article
						className="mb-8"
						title="Droits de propriété intellectuelle et conditions d'utilisation"
					>
						<h2 className="text-primary mb-4 text-2xl font-semibold">
							3. Propriété intellectuelle
						</h2>
						<p className="mb-4">
							L'ensemble de ce site relève de la législation
							française et internationale sur le droit d'auteur et
							la propriété intellectuelle. Tous les droits de
							reproduction sont réservés, y compris pour les
							documents téléchargeables et les représentations
							iconographiques et photographiques.
						</p>
						<p>
							La reproduction de tout ou partie de ce site sur un
							support électronique quel qu'il soit est
							formellement interdite sauf autorisation expresse du
							directeur de la publication.
						</p>
					</article>

					<article
						className="mb-8"
						title="Politique de collecte et protection des données personnelles"
					>
						<h2 className="text-primary mb-4 text-2xl font-semibold">
							4. Collecte des données personnelles
						</h2>
						<p className="mb-4">
							Les informations recueillies via nos formulaires
							sont enregistrées dans un fichier informatisé par
							[Nom de votre entreprise] pour [finalité du
							traitement].
						</p>
						<p className="mb-4">
							Conformément au Règlement Général sur la Protection
							des Données (RGPD), vous pouvez exercer votre droit
							d'accès aux données vous concernant et les faire
							rectifier en contactant : [contact pour les données
							personnelles].
						</p>
						<p>
							Nous conservons vos données pendant [durée de
							conservation] à compter de [point de départ de la
							conservation].
						</p>
					</article>

					<article
						className="mb-8"
						title="Politique d'utilisation des cookies"
					>
						<h2 className="text-primary mb-4 text-2xl font-semibold">
							5. Cookies
						</h2>
						<p className="mb-4">
							Notre site internet utilise des cookies pour
							améliorer l'expérience utilisateur et analyser le
							trafic du site. Vous pouvez accepter ou refuser ces
							cookies à tout moment en modifiant les paramètres de
							votre navigateur.
						</p>
						<p>
							Pour plus d'informations sur notre utilisation des
							cookies, veuillez consulter notre politique de
							confidentialité.
						</p>
					</article>

					<article
						className="mb-8"
						title="Clauses de limitation de responsabilité"
					>
						<h2 className="text-primary mb-4 text-2xl font-semibold">
							6. Limitation de responsabilité
						</h2>
						<p className="mb-4">
							[Nom de votre entreprise] ne pourra être tenue
							responsable des dommages directs et indirects causés
							au matériel de l'utilisateur, lors de l'accès au
							site, et résultant soit de l'utilisation d'un
							matériel ne répondant pas aux spécifications
							techniques requises, soit de l'apparition d'un bug
							ou d'une incompatibilité.
						</p>
						<p>
							[Nom de votre entreprise] ne pourra également être
							tenue responsable des dommages indirects consécutifs
							à l'utilisation du site.
						</p>
					</article>

					<article title="Droit applicable et coordonnées de contact">
						<h2 className="text-primary mb-4 text-2xl font-semibold">
							7. Droit applicable et juridiction compétente
						</h2>
						<p className="mb-4">
							Les présentes mentions légales sont soumises au
							droit français. En cas de litige, les tribunaux
							français seront compétents.
						</p>
						<p className="mb-4">
							Pour toute question relative aux mentions légales de
							notre site, vous pouvez nous contacter par email à
							contact@wildcodeschool.fr ou par courrier au
							Innov'Educ, à l'attention de service Protection des
							Données, 18 rue de la Gare, 28240, La Loupe.
						</p>
						<p className="mb-4">
							Nous vous remercions de votre confiance et de votre
							visite sur notre site.
						</p>
						<p>
							Dernière mise à jour :{" "}
							{new Date().toLocaleDateString("fr-FR", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							})}
						</p>
					</article>
				</div>
			</section>
		</>
	)
}
