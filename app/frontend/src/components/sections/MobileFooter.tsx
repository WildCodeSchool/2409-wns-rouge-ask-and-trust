import { House, SquarePlus, Bell, User, LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface FooterItem {
    Icon: LucideIcon;
    content: string;
    url: string;
}

export default function MobileFooter() {
    const footerItems: FooterItem[] = [
        {
            Icon: House,
            content: "Accueil",
            url: "/"
        },
        {
            Icon: SquarePlus,
            content: "Créer",
            url: "/"
        },
        {
            Icon: Bell,
            content: "Notifications",
            url: "/"
        },
        {
            Icon: User,
            content: "Profil",
            url: "/"
        },
    ];

    return (
        <footer className="flex justify-between px-5 py-2.5 bg-primary-600 fixed bottom-0 min-w-[375px] w-full sm:justify-around">
            {footerItems.map(({ Icon, content, url }) => (
                <Link key={content} to={url} className="flex flex-col items-center gap-1 group">
                    <Icon className="transition-transform duration-200 ease-in-out group-hover:scale-110 text-button-primary-fg h-5 w-5" />
                    <span className="text-button-primary-fg text-xs">{content}</span>
                </Link>
            ))}
        </footer>
    );
}
