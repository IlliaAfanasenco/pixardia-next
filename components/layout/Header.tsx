import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

export default function Header() {
    return (
        <header className="mx-auto flex w-full max-w-[var(--container)] items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:gap-6 lg:px-10">
            <Link
                href={siteConfig.links.home}
                aria-label="Pixardia home"
                className="flex flex-col items-start gap-1.5 no-underline sm:flex-row sm:items-center sm:gap-3"
            >
                <span className="font-['REM',sans-serif] text-[clamp(24px,3vw,32px)] font-bold leading-none tracking-[-0.03em] text-[#1E1E1E]">
                    PIXARDIA
                </span>

                <span className="font-['REM',sans-serif] text-[clamp(12px,1.5vw,16px)] font-bold uppercase leading-none text-[#C0BEBE]">
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
                    className="hidden lg:block lg:size-9"
                    priority
                />

                <Image
                    src="/icons/line.svg"
                    alt=""
                    width={70}
                    height={1}
                    aria-hidden="true"
                    className="hidden lg:block lg:w-[70px]"
                />

                <Link
                    href={siteConfig.links.contact}
                    className="whitespace-nowrap font-['REM',sans-serif] text-[clamp(12px,1.5vw,16px)] font-bold uppercase leading-none tracking-[0.03em] text-[#1E1E1E] no-underline transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E1E1E]"
                >
                    start project
                </Link>
            </div>
        </header>
    );
}