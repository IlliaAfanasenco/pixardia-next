"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/LocaleProvider";
import { publicPath } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export function MobileMenu({ mobileOnly = true }: { mobileOnly?: boolean }) {
    const { locale, t } = useI18n();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeHash, setActiveHash] = useState("");
    const dialogRef = useRef<HTMLDialogElement>(null);
    const animationRef = useRef<gsap.core.Timeline | null>(null);
    const afterCloseRef = useRef<(() => void) | null>(null);
    const menuId = "pixardia-mobile-menu";
    const items = [
        { label: "Home", path: `${siteConfig.links.home}#hero` },
        { label: "About / Studio", path: "/#crafting-structure" },
        { label: "Services", path: siteConfig.links.services },
        { label: "Projects", path: siteConfig.links.projects },
        { label: "Contact", path: siteConfig.links.contact },
    ];
    const activeItem = items.findIndex((item) => item.path.startsWith("/#")
        ? activeHash === item.path.slice(1)
        : pathname.startsWith(publicPath(locale, item.path)));

    function closeMenu(afterClose?: () => void) {
        afterCloseRef.current = afterClose ?? null;
        const animation = animationRef.current;
        if (animation && animation.progress() > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            animation.reverse();
        } else {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        if (!isOpen || !dialogRef.current) return;
        const dialog = dialogRef.current;
        const body = document.body;
        const root = document.documentElement;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const bodyOverflow = body.style.overflow;
        const rootOverflow = root.style.overflow;
        dialog.showModal();
        body.style.overflow = "hidden";
        root.style.overflow = "hidden";

        const context = gsap.context(() => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            animationRef.current = gsap.timeline({ onReverseComplete: () => setIsOpen(false) })
                .from(dialog, { opacity: 0, y: 12, duration: 0.24, ease: "power2.out" })
                .from("[data-menu-link]", { opacity: 0, x: -12, duration: 0.26, stagger: 0.045, ease: "power2.out" }, 0.06)
                .from("[data-menu-alien]", { opacity: 0, x: 16, y: 24, duration: 0.4, ease: "power2.out" }, 0.12);
        }, dialog);
        const mobile = window.matchMedia("(max-width: 767px)");
        const onResize = () => { if (mobileOnly && !mobile.matches) setIsOpen(false); };
        mobile.addEventListener("change", onResize);

        return () => {
            mobile.removeEventListener("change", onResize);
            context.revert();
            animationRef.current = null;
            dialog.close();
            body.style.overflow = bodyOverflow;
            root.style.overflow = rootOverflow;
            window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
            const afterClose = afterCloseRef.current;
            afterCloseRef.current = null;
            afterClose?.();
        };
    }, [isOpen, mobileOnly]);

    function navigate(path: string) {
        closeMenu(() => {
            const href = publicPath(locale, path);
            router.push(href);
            // Also handle selecting an anchor already present in the URL.
            if (pathname === href.split("#")[0] && href.includes("#")) {
                document.getElementById(href.split("#")[1])?.scrollIntoView();
            }
        });
    }

    return (
        <>
            <button
                type="button"
                aria-label={t("Open menu")}
                aria-expanded={isOpen}
                aria-controls={menuId}
                aria-haspopup="dialog"
                onClick={() => { setActiveHash(window.location.hash); setIsOpen(true); }}
                className={`flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-full bg-[#5848ff]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5848ff] ${mobileOnly ? "md:hidden" : ""}`}
            >
                {[0, 1, 2].map((line) => <span key={line} className="h-[2px] w-6 rounded-full bg-[#3f3f3f]" />)}
            </button>

            <dialog
                ref={dialogRef}
                id={menuId}
                aria-label={t("Main navigation")}
                aria-modal="true"
                onCancel={(event) => { event.preventDefault(); closeMenu(); }}
                className={`fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto overscroll-contain border-0 bg-white p-0 text-[#181818] backdrop:bg-black/20 ${mobileOnly ? "md:hidden" : ""}`}
            >
                <div
                    className="mx-auto flex min-h-full w-full max-w-[430px] flex-col px-5"
                    style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: "max(16px, env(safe-area-inset-bottom))", paddingLeft: "max(20px, env(safe-area-inset-left))", paddingRight: "max(20px, env(safe-area-inset-right))" }}
                >
                    <div className="flex min-h-[52px] shrink-0 items-center justify-between">
                        <Link href={publicPath(locale, "/#hero")} onNavigate={(event) => { event.preventDefault(); navigate("/#hero"); }} aria-label={t("Pixardia home")} className="text-[28px] font-black leading-none tracking-[-0.04em] no-underline focus-visible:outline-2 focus-visible:outline-[#5848ff]">
                            PIXARDIA
                        </Link>
                        <button type="button" autoFocus aria-label={t("Close menu")} onClick={() => closeMenu()} className="flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#5848ff]">
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m4 4 22 22M26 4 4 26" /></svg>
                        </button>
                    </div>

                    <p className="mb-5 mt-3 max-w-[30ch] text-[10px] font-bold uppercase leading-[1.8] tracking-[0.23em] text-[#b9b9bb]">
                        {t("creative digital studio / ai augmented")}
                    </p>

                    <nav aria-label={t("Main navigation")}>
                        {items.map((item, index) => {
                            const active = index === (activeItem < 0 ? 0 : activeItem);
                            return (
                                <Link
                                    key={item.path}
                                    href={publicPath(locale, item.path)}
                                    onNavigate={(event) => { event.preventDefault(); navigate(item.path); }}
                                    aria-current={active ? (item.path.includes("#") ? "location" : "page") : undefined}
                                    data-menu-link=""
                                    className="group/menu-item flex min-h-[clamp(52px,7dvh,78px)] items-center gap-5 border-b border-black/10 no-underline focus-visible:outline-2 focus-visible:outline-[#5848ff]"
                                >
                                    <span aria-hidden="true" className="text-[12px] font-medium text-[#b9b9bb]">{String(index + 1).padStart(2, "0")}</span>
                                    <span className={`min-w-0 text-[clamp(26px,8.6vw,38px)] font-bold leading-tight tracking-[-0.045em] transition-[color,translate] duration-250 ease-out group-focus-visible/menu-item:translate-x-2.5 group-focus-visible/menu-item:text-[#5848ff] [@media(hover:hover)_and_(pointer:fine)]:group-hover/menu-item:translate-x-2.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover/menu-item:text-[#5848ff] motion-reduce:transition-none ${active ? "text-[#5848ff]" : ""}`}>{t(item.label)}</span>
                                    <span aria-hidden="true" className="ml-auto text-[28px] font-light leading-none">→</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex min-h-14 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2">
                        <div className="[&_nav]:text-[17px] [&_a]:no-underline [&_a[aria-current]]:text-[#5848ff] [&_a+a]:before:mr-2 [&_a+a]:before:text-[#b9b9bb] [&_a+a]:before:content-['/']">
                            <LanguageSwitcher />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {siteConfig.socialLinks.map((social) => (
                                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="py-3 text-[11px] font-bold no-underline focus-visible:outline-2 focus-visible:outline-[#5848ff]">{social.label}</a>
                            ))}
                        </div>
                    </div>

                    <div aria-hidden="true" className="relative min-h-36 flex-1 overflow-hidden">
                        <Image data-menu-alien="" src="/images/alienAr.png" alt="" width={390} height={417} sizes="260px" className="absolute -bottom-5 right-0 h-full max-h-[310px] w-auto origin-bottom rotate-[-9deg] object-contain" />
                    </div>

                    <Link href={publicPath(locale, siteConfig.links.contact)} onNavigate={(event) => { event.preventDefault(); navigate(siteConfig.links.contact); }} className="group/menu-cta relative flex min-h-[88px] shrink-0 items-center justify-between gap-3 rounded-[16px] bg-[#181818] px-5 py-4 text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5848ff]">
                        <span className="max-w-[17ch] text-[16px] font-bold uppercase leading-[1.3]">{t("LET'S BUILD SOMETHING GREAT")}</span>
                        <span aria-hidden="true" className="flex size-[50px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-white text-[32px] font-light">
                            <span className="inline-flex size-8 origin-center items-center justify-center transition-transform duration-700 ease-in-out motion-reduce:transition-none motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover/menu-cta:rotate-[360deg]">→</span>
                        </span>
                    </Link>
                </div>
            </dialog>
        </>
    );
}

export default function MobileHeader() {
    const { t } = useI18n();

    return (
        <header data-mobile-header className="grid h-[92px] w-full grid-cols-[minmax(0,1fr)_auto] content-center items-start gap-4 px-5">
            <div className="grid min-w-0 gap-0.1">
                <div className="text-[28px] font-black text-[#3f3f3f]">PIXARDIA</div>
                <p className="max-w-full text-[clamp(8px,2.2vw,10px)] font-bold uppercase leading-[1.6] tracking-[0.16em] text-[#929296]">
                    {t("creative digital studio / ai augmented")}
                </p>
            </div>
            <MobileMenu mobileOnly={false} />
        </header>
    );
}
