"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/LocaleProvider";
import { publicPath } from "@/i18n/navigation";

export default function MobileHeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const introPlayed = useRef(false);
    const statsPlayed = useRef(false);
    const { locale } = useI18n();
    const router = useRouter();

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;
        const media = gsap.matchMedia();
        media.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", (context) => {
            const glow = section.querySelector("[data-hero-glow]");
            if (!introPlayed.current) {
                gsap.timeline({ onComplete: () => { introPlayed.current = true; } })
                    .from(section.querySelector("[data-hero-digital]"), { y: 16, opacity: 0, duration: 0.7, ease: "power2.out" })
                    .from(section.querySelector("[data-hero-agency]"), { y: 12, duration: 0.65, ease: "power2.out" }, 0.35)
                    .from(section.querySelectorAll("[data-hero-letter]"), { opacity: 0, duration: 0.45, stagger: 0.065, ease: "power2.out" }, 0.35)
                    .from(section.querySelector("[data-hero-characters]"), { opacity: 0, duration: 0.9, ease: "power2.out" }, 0.35)
                    .to(glow, { opacity: 1, duration: 1, ease: "sine.inOut" }, 0.25);
            } else {
                gsap.set(glow, { opacity: 1 });
            }

            const stats = section.querySelector<HTMLElement>("[data-hero-stats]")!;
            const projects = section.querySelector<HTMLElement>('[data-hero-stat="projects"]')!;
            const uptime = section.querySelector<HTMLElement>('[data-hero-stat="uptime"]')!;
            const observer = new IntersectionObserver((entries) => {
                for (const entry of entries) {
                    if (entry.target === section) {
                        section.dataset.heroVisible = String(entry.isIntersecting);
                    } else if (entry.isIntersecting && entry.intersectionRatio >= 0.25 && !statsPlayed.current) {
                        statsPlayed.current = true;
                        observer.unobserve(stats);
                        context.add(() => {
                            const values = { projects: 0, uptime: 0 };
                            projects.textContent = "0+";
                            uptime.textContent = "0.0%";
                            gsap.to(values, {
                                projects: 50, uptime: 99.9, duration: 1.25, ease: "power2.out",
                                onUpdate: () => {
                                    projects.textContent = `${Math.round(values.projects)}+`;
                                    uptime.textContent = `${values.uptime.toFixed(1)}%`;
                                },
                            });
                        });
                    }
                }
            }, { threshold: [0, 0.25] });
            observer.observe(section);
            if (!statsPlayed.current) observer.observe(stats);

            return () => {
                observer.disconnect();
                delete section.dataset.heroVisible;
                projects.textContent = "50+";
                uptime.textContent = "99.9%";
            };
        });
        return () => media.revert();
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            data-mobile-section="hero"
            className="relative w-full overflow-hidden px-5"
        >

            {/* content */}
            <div className="relative z-20">
                <p className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.27em] text-[#c8c8ca]">
                    Creative digital studio / AI augmented
                </p>

                <h1 aria-label="DIGITAL AGENCY" className="mt-[20px] font-black uppercase leading-[0.82] tracking-[-0.065em]">
                    <span data-hero-digital className="block text-[64px] text-[#b9b9bb]">
                        DIGITAL
                    </span>

                    <span data-hero-agency aria-hidden="true" className="ml-[38px] mt-[14px] block text-[64px] text-[#5848ff]">
                        {"AGENCY".split("").map((letter, index) => <span key={index} data-hero-letter>{letter}</span>)}
                    </span>
                </h1>

                <p className="mt-[38px] w-[190px] text-[18px] font-medium leading-[1.18] text-[#c8c8ca]">
                    Your journey into the
                    <br />
                    world of development
                    <br />
                    starts here
                </p>

                <div className="mt-[30px] flex items-center gap-[16px]">
                    <button
                        type="button"
                        aria-label="Explore space"
                        onClick={() => router.push(publicPath(locale, siteConfig.links.services))}
                        className="group/hero-explore flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full border-[2px] border-[#414141] transition-transform duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5848ff] motion-reduce:transition-none [@media(max-width:767px)]:motion-safe:active:scale-95"
                    >
                        <span className="translate-y-[-2px] text-[40px] font-light text-[#414141] transition-transform duration-150 ease-out motion-reduce:transition-none [@media(max-width:767px)]:motion-safe:group-active/hero-explore:translate-x-1.5">
                            →
                        </span>
                    </button>

                    <span className="text-[17px] font-black uppercase tracking-[-0.04em] text-[#414141]">
                        Explore space
                    </span>
                </div>

                <div data-hero-stats className="mt-[38px] flex gap-[45px]">
                    <div>
                        <div className="relative text-[29px] font-black leading-none text-[#5848ff]">
                            <span className="opacity-0">50+</span>
                            <span data-hero-stat="projects" aria-hidden="true" className="absolute inset-0">50+</span>
                        </div>
                        <div className="mt-[8px] text-[14px] font-bold uppercase text-[#414141]">
                            Projects
                        </div>
                    </div>

                    <div>
                        <div className="relative text-[29px] font-black leading-none text-[#5848ff]">
                            <span className="opacity-0">99.9%</span>
                            <span data-hero-stat="uptime" aria-hidden="true" className="absolute inset-0">99.9%</span>
                        </div>
                        <div className="mt-[8px] text-[14px] font-bold uppercase text-[#414141]">
                            Uptime
                        </div>
                    </div>
                </div>
            </div>

            {/* characters */}
            <div data-hero-characters className="pointer-events-none absolute left-0 top-[-40px] z-10 w-full opacity-85">
                <span data-hero-glow aria-hidden="true" className="absolute inset-x-[10%] top-[18%] -z-10 h-[55%] rounded-full opacity-0" style={{ background: "radial-gradient(ellipse, rgba(88,72,255,0.09), rgba(88,72,255,0.035) 40%, transparent 72%)" }} />
                <Image
                    src="/images/astronautAlienMobileHero.png"
                    alt=""
                    width={430}
                    height={470}
                    priority
                    className="h-auto w-full"
                />
            </div>

            {/* CTA */}
            <Link href={publicPath(locale, siteConfig.links.contact)} className="group/hero-cta relative z-30 mt-[95px] flex min-h-[82px] w-full items-center rounded-[11px] bg-[#181818] px-[11px] no-underline transition-transform duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5848ff] motion-reduce:transition-none [@media(max-width:767px)]:motion-safe:active:scale-[0.98]">
                <div className="relative h-[44px] w-[39px] shrink-0 overflow-hidden rounded-[6px] bg-[#5848ff]">
                    <Image
                        src="/images/alienMobileHero.png"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>

                <p className="ml-[28px] text-[16px] font-medium uppercase leading-[1.15] tracking-[0.04em] text-white">
                    Let&apos;s build
                    <br />
                    something gret
                </p>

                <div className="ml-auto flex h-[51px] w-[51px] items-center justify-center rounded-full border-2 border-white">
                    <span aria-hidden="true" className="inline-flex size-[31px] origin-center items-center justify-center text-[31px] font-light text-white transition-transform duration-700 ease-in-out motion-reduce:transition-none [@media(max-width:767px)]:motion-safe:group-active/hero-cta:rotate-[360deg]">→</span>
                </div>
            </Link>

            <p className="hero-scroll-indicator relative z-30 pb-[18px] pt-[36px] text-[16px] font-medium uppercase tracking-[0.02em] text-[#c9c9cb]">
                Scroll to explore
            </p>
            <style jsx>{`
                @keyframes hero-scroll {
                    0%, 100% { translate: 0 0; }
                    50% { translate: 0 5px; }
                }
                @media (max-width: 767px) and (prefers-reduced-motion: no-preference) {
                    .hero-scroll-indicator {
                        animation: hero-scroll 2.8s ease-in-out infinite;
                        animation-play-state: paused;
                    }
                    [data-hero-visible="true"] .hero-scroll-indicator {
                        animation-play-state: running;
                    }
                }
            `}</style>
        </section>
    );
}
