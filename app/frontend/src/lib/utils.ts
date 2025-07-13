import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const slugify = (str: string): string =>
	str
		.normalize("NFD") // supprime les accents
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // espaces → tirets
		.replace(/[^\w\-]+/g, "") // supprime les caractères spéciaux
