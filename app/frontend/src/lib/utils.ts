import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const slugify = (str: string): string =>
	str
		.normalize("NFD") // removes accents
		.replace(/[\u0300-\u036f]/g, "") // strips diacritics
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // spaces → hyphens
		.replace(/[^\w-]+/g, "") // removes special characters

// Util function to get image based on category name
export const getCategoryImage = (categoryName: string): string => {
	const categoryImages: { [key: string]: string } = {
		International: "/img/categories/undraw_around-the-world_vgcy.svg",
		Politique: "/img/categories/undraw_candidate_q4my.svg",
		"Faits divers": "/img/categories/undraw_data-thief_d66l.svg",
		Consommation: "/img/categories/undraw_eating-together_4cna.svg",
		Éducation: "/img/categories/undraw_education_3vwh.svg",
		Culture: "/img/categories/undraw_eiffel-tower_ju2s.svg",
		Santé: "/img/categories/undraw_medical-care_7m9g.svg",
		Environnement: "/img/categories/undraw_nature_yf30.svg",
		Société: "/img/categories/undraw_people_ka7y.svg",
		Technologie: "/img/categories/undraw_server-status_7viz.svg",
		Médias: "/img/categories/undraw_social-media_vxq0.svg",
		Économie: "/img/categories/undraw_wallet_diag.svg",
	}

	// Return the corresponding image or a default one
	return (
		categoryImages[categoryName] ||
		"/img/landing/illustration-presentation.svg"
	)
}
