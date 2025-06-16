import { Clock, Mail, MapPin, Phone, MessageCircle, Users } from "lucide-react"

export const contactMethods = [
	{
		icon: Mail,
		title: "Email",
		description: "Écrivez-nous pour toute question",
		value: "contact@askandtrust.com",
		action: "mailto:contact@askandtrust.com",
	},
	{
		icon: Phone,
		title: "Téléphone",
		description: "Appelez-nous du lundi au vendredi",
		value: "+33 1 23 45 xx xx",
		action: "tel:+3312345xxxx",
	},
	{
		icon: MapPin,
		title: "Adresse",
		description: "Venez nous rendre visite",
		value: "1 Place de l'Hopital \n69002 Lyon, France",
		action: "https://maps.google.com/maps?q=1+Place+de+l'Hopital+69002+Lyon,+France",
	},
	{
		icon: Clock,
		title: "Horaires",
		description: "Nos heures d'ouverture",
		value: "Lun-Ven: 9h-18h\nSam: 10h-16h",
		action: null,
	},
] as const

export const faq = [
	{
		question: "Comment puis-je contacter Ask-and-Trust ?",
		answer: "Vous pouvez utiliser le formulaire de contact, nous écrire par email ou nous appeler directement. Nous sommes à votre écoute !",
	},
	{
		question: "Quels sont vos horaires d'ouverture ?",
		answer: "Nous sommes disponibles du lundi au vendredi de 9h à 18h, et le samedi de 10h à 16h.",
	},
	{
		question: "Où sont situés vos bureaux ?",
		answer: "Nous sommes situés au 1 Place de l'Hopital, 69002 Lyon, France.",
	},
	{
		question: "Proposez-vous un support technique ?",
		answer: "Oui, notre équipe technique est disponible pour répondre à toutes vos questions et résoudre vos problèmes.",
	},
	{
		question: "Puis-je réserver une consultation gratuite ?",
		answer: "Bien sûr ! Réservez un créneau via notre page de contact ou contactez-nous directement.",
	},
] as const

export const supportOptions = [
	{
		icon: MessageCircle,
		title: "Chat en direct",
		description: "Obtenez une réponse immédiate",
		action: "Démarrer le chat",
		available: true,
	},
	{
		icon: Users,
		title: "Consultation gratuite",
		description: "30 minutes avec un expert",
		action: "Réserver un créneau",
		available: true,
	},
	{
		icon: Mail,
		title: "Support technique",
		description: "Aide pour les problèmes techniques",
		action: "support@askandtrust.com",
		available: true,
	},
] as const
