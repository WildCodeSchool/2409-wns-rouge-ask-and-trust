import { Question } from "@/types/types"

export type SurveyPreview = {
	title: string
	description: string
	public: boolean
	category: number | string | { name: string }
	questions: Question[]
}

export const mockSurvey: SurveyPreview = {
	title: "🎯 Template : Enquête de satisfaction client",
	description:
		"Un exemple complet montrant tous les types de questions disponibles. Utilisez ce template comme inspiration pour créer vos propres enquêtes professionnelles.",
	public: true,
	category: { name: "Templates & Exemples" },
	questions: [
		// 📋 INFORMATIONS GÉNÉRALES
		{
			id: 1,
			title: "Comment avez-vous découvert nos services ?",
			type: "select",
			answers: [
				{ value: "Réseaux sociaux" },
				{ value: "Bouche-à-oreille" },
				{ value: "Moteur de recherche" },
				{ value: "Publicité en ligne" },
				{ value: "Recommandation d'un ami" },
				{ value: "Autre" },
			],
		},
		// 🔢 ÉVALUATION (Boolean)
		{
			id: 2,
			title: "Recommanderiez-vous nos services à un proche ?",
			type: "boolean",
			answers: [],
		},

		// ✅ CHOIX MULTIPLES
		{
			id: 3,
			title: "Quels aspects de notre service appréciez-vous le plus ? (Plusieurs choix possibles)",
			type: "multiple_choice",
			answers: [
				{ value: "Rapidité de réponse" },
				{ value: "Qualité du service client" },
				{ value: "Prix compétitifs" },
				{ value: "Interface intuitive" },
				{ value: "Fiabilité" },
				{ value: "Innovation" },
			],
		},
		// 🎯 ÉVALUATION DÉTAILLÉE
		{
			id: 4,
			title: "Quel est votre niveau de satisfaction global ?",
			type: "select",
			answers: [
				{ value: "⭐ Très insatisfait" },
				{ value: "⭐⭐ Insatisfait" },
				{ value: "⭐⭐⭐ Neutre" },
				{ value: "⭐⭐⭐⭐ Satisfait" },
				{ value: "⭐⭐⭐⭐⭐ Très satisfait" },
			],
		},
		// 💼 PROFIL CLIENT
		{
			id: 5,
			title: "Dans quel secteur d'activité travaillez-vous ?",
			type: "select",
			answers: [
				{ value: "Technologies / IT" },
				{ value: "Finance / Banque" },
				{ value: "Santé / Médical" },
				{ value: "Éducation" },
				{ value: "Commerce / Retail" },
				{ value: "Industrie" },
				{ value: "Services" },
				{ value: "Autre" },
			],
		},
		// 📝 INFORMATIONS PERSONNELLES
		{
			id: 6,
			title: "Votre nom d'entreprise (optionnel) :",
			type: "text",
			answers: [],
		},
		// 💬 FEEDBACK DÉTAILLÉ
		{
			id: 7,
			title: "Quelles améliorations suggéreriez-vous ? (Décrivez en détail)",
			type: "text",
			answers: [],
		},
		// 🔧 BESOINS SPÉCIFIQUES
		{
			id: 8,
			title: "Quels services supplémentaires souhaiteriez-vous ? (Plusieurs choix possibles)",
			type: "multiple_choice",
			answers: [
				{ value: "Formation / Tutoriels" },
				{ value: "Support technique 24/7" },
				{ value: "Intégrations API" },
				{ value: "Rapports avancés" },
				{ value: "Application mobile" },
				{ value: "Consultation personnalisée" },
			],
		},
		// 📊 USAGE
		{
			id: 9,
			title: "À quelle fréquence utilisez-vous nos services ?",
			type: "select",
			answers: [
				{ value: "Quotidiennement" },
				{ value: "Plusieurs fois par semaine" },
				{ value: "Une fois par semaine" },
				{ value: "Plusieurs fois par mois" },
				{ value: "Occasionnellement" },
				{ value: "Première utilisation" },
			],
		},
		// 🎯 PRIORITÉS
		{
			id: 10,
			title: "Êtes-vous intéressé par nos futures mises à jour ?",
			type: "boolean",
			answers: [],
		},
		// 📱 CONTACT
		{
			id: 11,
			title: "Email de contact (pour le suivi) :",
			type: "text",
			answers: [],
		},
		// 🌟 ÉVALUATION FINALE
		{
			id: 12,
			title: "Note globale de 1 à 10 :",
			type: "select",
			answers: [
				{ value: "1 - Très mauvais" },
				{ value: "2 - Mauvais" },
				{ value: "3 - Médiocre" },
				{ value: "4 - Faible" },
				{ value: "5 - Moyen" },
				{ value: "6 - Correct" },
				{ value: "7 - Bien" },
				{ value: "8 - Très bien" },
				{ value: "9 - Excellent" },
				{ value: "10 - Parfait" },
			],
		},
	],
}
