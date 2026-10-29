"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/LocaleProvider";
import { publicPath } from "@/i18n/navigation";
import { useMobileHeroIntro } from "../useMobileHeroIntro";
import styles from "./MobileHeroSection.module.css";

export default function MobileHeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const statsPlayed = useRef(false);
    const { locale, t } = useI18n();

    useMobileHeroIntro(sectionRef);

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", (context) => {
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
        <section ref={sectionRef} id="hero" data-mobile-section="hero" className={styles.hero}>
            <div data-hero-content className={styles.content}>
                <h1 aria-label="DIGITAL AGENCY" className={styles.title}>
                    <span data-hero-digital>DIGITAL</span>
                    <span data-hero-agency>AGENCY</span>
                </h1>
                <p data-hero-description className={styles.description}>
                    {t("We design, build and scale digital products that move businesses forward.")}
                </p>
            </div>

            {/* Reserve the endpoint while the same character node is fixed for arrival. */}
            <div data-hero-stage className={styles.stage} aria-hidden="true">
                <span data-hero-glow className={styles.glow} />
                <div data-hero-characters className={styles.characters}>
                    <Image
                        src="/images/hero-handshake/frame-065.webp?v=transparent-d823ea33"
                        alt=""
                        width={960}
                        height={960}
                        preload
                        unoptimized
                        className={styles.characterImage}
                    />
                </div>
            </div>

            <div data-hero-stats data-hero-reveal className={styles.stats}>
                <div>
                    <div className={styles.statValue}>
                        <span className={styles.statMeasure}>50+</span>
                        <span data-hero-stat="projects" aria-hidden="true">50+</span>
                    </div>
                    <p>{t("Projects")}</p>
                </div>
                <div>
                    <div className={styles.statValue}>
                        <span className={styles.statMeasure}>99.9%</span>
                        <span data-hero-stat="uptime" aria-hidden="true">99.9%</span>
                    </div>
                    <p>{t("Uptime")}</p>
                </div>
            </div>

            <Link data-hero-reveal href={publicPath(locale, siteConfig.links.contact)} className={styles.contact}>
                <span className={styles.contactAvatar}>
                    <Image src="/images/alienMobileHero.png" alt="" fill sizes="38px" className="object-cover" />
                </span>
                <span className={styles.contactCopy}>{t("LET'S BUILD SOMETHING GREAT")}</span>
                <span aria-hidden="true" className={styles.contactArrow}>→</span>
            </Link>

            <p data-hero-reveal className={styles.scroll}>{t("scroll to explore")} <span aria-hidden="true">↓</span></p>
        </section>
    );
}
