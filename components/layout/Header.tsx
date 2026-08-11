"use client";

import Image from "next/image";
import Link from "next/link";
import { Archivo } from "next/font/google";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["700", "900"],
    variable: "--font-header-archivo",
});

export default function Header() {
    const [isCompact, setIsCompact] = useState(false);

    useEffect(() => {
        let animationFrame = 0;

        const updateHeader = () => {
            window.cancelAnimationFrame(animationFrame);

            animationFrame = window.requestAnimationFrame(() => {
                setIsCompact(window.scrollY > 40);
            });
        };

        updateHeader();
        window.addEventListener("scroll", updateHeader, {
            passive: true,
        });

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.removeEventListener("scroll", updateHeader);
        };
    }, []);

    return (
        <header
            className={`${archivo.variable} sticky top-0 z-[60] w-full border-b border-black/[0.04] bg-white/95`}
            data-site-header=""
            data-compact={isCompact ? "true" : "false"}
        >
            <div
                className={`mx-auto flex w-full max-w-[var(--container)] items-center justify-between px-5 transition-[padding,gap] duration-300 ease-out sm:px-8 lg:px-10 ${
                    isCompact
                        ? "gap-3 py-2 sm:py-2.5 lg:gap-4"
                        : "gap-4 py-5 lg:gap-6"
                }`}
            >
                <Link
                    href={siteConfig.links.home}
                    aria-label="Pixardia home"
                    className={`flex flex-col items-start no-underline transition-[gap] duration-300 ease-out sm:flex-row sm:items-center ${
                        isCompact
                            ? "gap-0.5 sm:gap-2"
                            : "gap-1.5 sm:gap-3"
                    }`}
                >
                    <span
                        className={`[font-family:var(--font-header-archivo)] font-black leading-none tracking-[-0.04em] text-[#1E1E1E] transition-[font-size] duration-300 ease-out ${
                            isCompact
                                ? "text-[22px] sm:text-2xl"
                                : "text-[clamp(24px,3vw,32px)]"
                        }`}
                    >
                        PIXARDIA
                    </span>

                    <span
                        className={`[font-family:var(--font-header-archivo)] font-bold uppercase leading-none text-[#C0BEBE] transition-[font-size] duration-300 ease-out ${
                            isCompact
                                ? "text-[10px] sm:text-xs"
                                : "text-[clamp(12px,1.5vw,16px)]"
                        }`}
                    >
                        digital studio
                    </span>
                </Link>

                <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4 lg:gap-6">
                    <Image
                        src="/icons/star.svg"
                        alt=""
                        width={36}
                        height={36}
                        aria-hidden="true"
                        className={`hidden transition-[width,height] duration-300 ease-out lg:block ${
                            isCompact
                                ? "lg:size-7"
                                : "lg:size-9"
                        }`}
                        priority
                    />

                    <Image
                        src="/icons/line.svg"
                        alt=""
                        width={70}
                        height={1}
                        aria-hidden="true"
                        className={`hidden h-auto transition-[width] duration-300 ease-out lg:block ${
                            isCompact
                                ? "lg:w-[52px]"
                                : "lg:w-[70px]"
                        }`}
                    />

                    <Link
                        href={siteConfig.links.contact}
                        className={`whitespace-nowrap [font-family:var(--font-header-archivo)] font-bold uppercase leading-none tracking-[0.03em] text-[#1E1E1E] no-underline transition-[font-size,opacity] duration-300 ease-out hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E1E1E] ${
                            isCompact
                                ? "text-[11px] sm:text-[13px]"
                                : "text-[clamp(12px,1.5vw,16px)]"
                        }`}
                    >
                        start project
                    </Link>
                </div>
            </div>
        </header>
    );
}
