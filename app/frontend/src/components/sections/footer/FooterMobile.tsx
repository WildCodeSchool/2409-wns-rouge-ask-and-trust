import { FooterLinkType } from "@/types/types";
import { House, SquarePlus, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

const FOOTER_LINKS: readonly FooterLinkType[] = [
    {
        href: '/',
        label: "Accueil",
        category: "Accueil",
        ariaLabel: "Retourner sur la page d'accueil",
        Icon: House
    },
    {
        href: '/createSurvey',
        label: "Créer",
        category: "Création",
        ariaLabel: "Créer une enquête",
        Icon: SquarePlus
    },
    {
        href: '/profil/notification',
        label: "Notifications",
        category: "Notifications",
        ariaLabel: "Voir les notifications",
        Icon: Bell,
    },
    {
        href: '/profil',
        label: "Profil",
        category: "Profil",
        ariaLabel: "Aller sur son profil",
        Icon: User,
    },
] as const;

export default function FooterMobile() {
    return (
        <footer className="flex justify-between px-5 py-2.5 bg-primary-600 fixed bottom-0 w-full sm:justify-around">
            {FOOTER_LINKS.map((link) => (
                <FooterLinkLink
                    key={link.href}
                    {...link}
                />
            ))}
        </footer>
    );
}

/**
 * Footer link component with external link management and accessibility
 * 
 * @param {object} props - Component properties
 * @param {string} props.href - Link destination URL
 * @param {string} props.label - The link text
 * @param {string} props.category - Link category for grouping
 * @param {string} props.ariaLabel - The personalized ARIA label for accessibility
 * @returns {JSX.Element} A Link component with appropriate safety and accessibility attributes
 */
function FooterLinkLink({ href, label, category, ariaLabel, Icon }: FooterLinkType) {
    const isExternal = href.startsWith('http');

    // Security: check allowed protocols
    if (isExternal && !href.startsWith('https://')) {
        console.warn('Warning: Non-HTTPS external link detected');
    }

    // ariaLabel generation for accessibility
    const finalAriaLabel = ariaLabel || `${label} ${category ? `- ${category}` : ''} ${isExternal ? '(s\'ouvre dans un nouvel onglet)' : ''}`;

    return (
        <Link
            to={href}
            className="flex flex-col items-center gap-1 group text-button-primary-fg text-xs"
            // Indicates to assistive technologies the current page
            aria-current={href === window.location.pathname ? 'page' : undefined}

            // Security: protects against tabnabbing by preventing access to window.opener
            // and prevents the external site from controlling our window
            rel={isExternal ? "noopener noreferrer" : undefined}

            // Opens external links in a new tab to preserve navigation context on our site
            target={isExternal ? "_blank" : undefined}

            // Provides a descriptive label for assistive technologies
            aria-label={finalAriaLabel}

            // data attribute for analytics tracking
            data-category={category}
        >
            {Icon && <Icon className="transition-transform duration-200 ease-in-out group-hover:scale-110 text-button-primary-fg h-5 w-5" aria-hidden />}
            {label}
        </Link>
    )
}
