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
