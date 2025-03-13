import { AnimatePresence, motion, Variants } from "motion/react";
import { HeaderMobileMenuProps } from "@/types/types";
import NavAndAuthButtons from "./NavAndButtons";

const menuVariants: Variants = {
    closed: {
        opacity: 0,
        x: "100%",
        transition: {
            opacity: { duration: 0.15, ease: "easeInOut" },
            x: { duration: 0.25, ease: "easeInOut" },
        },
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            duration: 0.2,
            damping: 20,
        },
    },
};

export default function HeaderMobileMenu({ showMenu, handleShowMenu, headerLinks }: HeaderMobileMenuProps) {
    return (
        <AnimatePresence>
            {showMenu && (
                <>
                    <motion.div
                        className="fixed w-full h-full inset-0 bg-transparent backdrop-blur-xl z-40"
                        onClick={handleShowMenu}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={{
                            open: { opacity: 1, transition: { duration: 0.2 } },
                            closed: { opacity: 0, transition: { duration: 0.2 } },
                        }}
                    />
                    <motion.div
                        className="bg-primary-50 h-dvh top-0 right-0 absolute z-50 p-5 flex flex-col gap-20 w-60 overflow-hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                    >
                        <NavAndAuthButtons headerLinks={headerLinks} isMobile />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
