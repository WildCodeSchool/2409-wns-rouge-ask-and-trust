import { LucideIcon } from "lucide-react"

export type AuthContextProps = {
	user: User | null
	isLoading: boolean
	refetchUser: () => void
	logout: () => void
}

export interface User {
	id: string
	email: string
	// ... other user properties
}

export interface LinksType {
	href: string
	label: string
	category: string
	ariaLabel: string
    Icon?: LucideIcon;
}

export interface HeaderMobileMenuProps {
    showMenu: boolean;
    handleShowMenu: () => void;
    headerLinks: readonly LinksType[];
}

export interface NavAndAuthButtonsProps {
	headerLinks: readonly LinksType[];
	isMobile: boolean;
  }