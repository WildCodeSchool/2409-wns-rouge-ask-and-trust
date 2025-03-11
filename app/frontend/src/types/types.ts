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

export type FooterLinkType = {
	href: string;
	label: string;
	category?: string;
	ariaLabel?: string;
  };
  