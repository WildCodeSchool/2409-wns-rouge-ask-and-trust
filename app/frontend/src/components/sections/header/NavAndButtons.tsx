import { Button } from "../../ui/Button";
import { NavAndAuthButtonsProps } from "@/types/types";
import { HeaderLink } from "./Header";

export default function NavAndAuthButtons({ headerLinks, isMobile }: NavAndAuthButtonsProps) {
    return (
        <>
            <nav className={isMobile ? "flex flex-col gap-20" : "flex items-center justify-between flex-1"}>
                <ul className={isMobile ? "flex flex-col gap-5" : "flex items-center justify-center gap-20 flex-1"}>
                    {headerLinks.map((link) => (
                        <li key={link.href}>
                            <HeaderLink {...link} />
                        </li>
                    ))}
                </ul>
                <div className={isMobile ? "flex flex-col gap-5" : "flex items-center justify-center gap-6"}>
                    <Button to="/register" variant={isMobile ? "outline" : "secondary"} role="link" fullWidth={isMobile} ariaLabel="S'inscrire">
                        S'inscrire
                    </Button>
                    <Button to="/login" variant="primary" role="link" fullWidth={isMobile} ariaLabel="Se connecter">
                        Se connecter
                    </Button>
                </div>
            </nav>
        </>
    );
}
