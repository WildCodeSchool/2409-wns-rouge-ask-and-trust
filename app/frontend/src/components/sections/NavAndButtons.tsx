import { Button } from "../ui/Button";
import { NavAndAuthButtonsProps } from "@/types/types";
import { HeaderLink } from "./Header";

export default function NavAndAuthButtons({ headerLinks, isMobile }: NavAndAuthButtonsProps) {
    return (
        <>
            <nav>
                <ul className={isMobile ? "flex flex-col gap-5" : "flex items-center justify-center gap-20"}>
                    {headerLinks.map((link) => (
                        <HeaderLink key={link.href} {...link} />
                    ))}
                </ul>
            </nav>
            <div className={isMobile ? "flex flex-col gap-5" : "flex items-center justify-center gap-6"}>
                <Button to="/register" variant={isMobile ? "outline" : "secondary"} role="link" fullWidth={isMobile} ariaLabel="S'inscrire">
                    S'inscrire
                </Button>
                <Button to="/login" variant="primary" role="link" fullWidth={isMobile} ariaLabel="Se connecter">
                    Se connecter
                </Button>
            </div>
        </>
    );
}
