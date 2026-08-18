import Image from "next/image";
import Link from "next/link";
import { Archivo } from "next/font/google";

import { siteConfig } from "@/config/site";

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
    variable: "--font-archivo",
});

export default function HeroSection() {
    return (
        <section
            id="hero"
            className={`${archivo.variable} relative overflow-hidden py-4 sm:py-6 lg:py-8`}
            aria-labelledby="hero-title"
            data-story-section="hero"
            data-story-step="1"
            data-cinematic-scene="hero"
            data-motion="fade-up"
            data-motion-state="pending"
        >
            <div
                className="relative z-10 mx-auto w-full max-w-[var(--container)] px-5 sm:px-8 lg:px-10"
                data-cinematic-layer=""
            >
                <p
                    className="max-w-[280px] font-[var(--font-archivo)] text-[11px] font-black uppercase leading-[1.2] tracking-[0.2em] text-[#C5C6C8] sm:max-w-[500px] sm:text-[clamp(12px,1.2vw,16px)] sm:leading-none"
                    data-cinematic-element="hero-eyebrow"
                >
                    creative digital studio / ai augmented
                </p>

                <h1
                    id="hero-title"
                    className="relative z-20 mt-6 font-[var(--font-archivo)] font-black uppercase leading-[0.85] text-[#C5C6C8] sm:mt-0"
                    data-cinematic-element="hero-title"
                >
                    <span className="block whitespace-normal text-[clamp(58px,18vw,90px)] tracking-[-0.03em] sm:whitespace-nowrap sm:text-[clamp(70px,15vw,150px)] lg:text-[clamp(80px,16vw,212px)]">
                        <span className="-ml-[0.05em] inline-block">
                            Digital
                        </span>
                    </span>

                    <span className="block whitespace-normal text-[clamp(58px,18vw,90px)] tracking-[-0.04em] sm:ml-[0.35em] sm:whitespace-nowrap sm:text-[clamp(70px,14vw,140px)] lg:ml-[0.55em] lg:text-[clamp(80px,15vw,205px)]">
                        Agency
                    </span>
                </h1>

                <p
                    className="mt-7 max-w-[300px] font-[var(--font-archivo)] text-lg font-bold uppercase leading-none tracking-[0.03em] text-[#1E1E1E] sm:mt-[clamp(30px,6vw,90px)] sm:text-[clamp(18px,2vw,24px)] lg:max-w-[360px]"
                    data-cinematic-element="hero-copy"
                >
                    We design and build digital products that solve real business problems
                </p>

                <Link
                    href={siteConfig.links.services}
                    className="flex w-fit items-center gap-5 py-6 text-[#1E1E1E] no-underline transition-opacity hover:opacity-70 sm:py-[30px]"
                    data-cinematic-element="hero-cta"
                >
                    <Image
                        src="/icons/arrow.svg"
                        alt=""
                        width={96}
                        height={96}
                        aria-hidden="true"
                        className="size-16 shrink-0 sm:size-20 lg:size-24"
                    />

                    <span className="font-[var(--font-archivo)] text-lg font-black uppercase leading-none tracking-[0.03em] sm:text-[clamp(18px,2vw,24px)]">
                        explore services
                    </span>
                </Link>

                <div
                    className="mt-5 flex flex-col items-start gap-6 sm:mt-[2%] sm:flex-row sm:justify-between sm:gap-[30px]"
                    data-cinematic-element="hero-meta"
                >
                    <div>
                        <p className="font-[var(--font-archivo)] text-xs uppercase leading-none tracking-[0.03em] text-[#C5C6C8] sm:text-base">
                            scroll to begin
                        </p>

                        <div
                            className="mt-3 h-2 w-[121px] overflow-hidden rounded-[10px] bg-[#C5C6C8]"
                            aria-hidden="true"
                        >
                            <div className="h-2 w-[45px] bg-[#2A2A2A]" />
                        </div>
                    </div>

                    <div className="text-left sm:text-right">
                        <p className="font-[var(--font-archivo)] text-xs uppercase leading-none tracking-[0.03em] text-[#C5C6C8] sm:text-base">
                            project intake: open
                        </p>

                        <p className="font-[var(--font-archivo)] text-xs uppercase leading-none tracking-[0.03em] text-[#C5C6C8] sm:text-base">
                            service area: Germany / Europe / Remote
                        </p>
                    </div>
                </div>

                <div
                    className="relative mt-4 flex w-full justify-center pt-1 sm:mt-5 min-[1200px]:absolute min-[1200px]:bottom-0 min-[1200px]:left-1/2 min-[1200px]:z-20 min-[1200px]:mt-0 min-[1200px]:w-auto min-[1200px]:-translate-x-1/2 min-[1200px]:pt-0"
                    data-cinematic-element="hero-character"
                >
                    <Image
                        src="/images/AlienExtraterrestrial.png"
                        alt=""
                        aria-hidden="true"
                        width={697}
                        height={694}
                        priority
                        sizes="(max-width: 639px) 86vw, (max-width: 1199px) 44vw, 42vw"
                        className="h-auto w-[min(86vw,340px)] max-w-full object-contain sm:w-[clamp(340px,44vw,470px)] min-[1200px]:w-[clamp(320px,42vw,697px)]"
                    />
                </div>
            </div>
        </section>
    );
}
