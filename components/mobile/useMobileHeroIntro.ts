"use client";

import type { RefObject } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useI18n } from "@/i18n/LocaleProvider";
import styles from "./MobileHeroIntro.module.css";

const SESSION_KEY = "pixardia:mobile-intro:complete";

export function useMobileHeroIntro(sectionRef: RefObject<HTMLElement | null>) {
    const { t } = useI18n();

    useGSAP(() => {
        const section = sectionRef.current;
        const characters = section?.querySelector<HTMLElement>("[data-hero-characters]");
        const image = characters?.querySelector("img");
        if (!section || !characters || !image) return;

        const root = document.documentElement;
        const bootstrapExpired = root.dataset.mobileIntroBoot === "expired";
        window.clearTimeout(Number(root.dataset.mobileIntroTimer));
        delete root.dataset.mobileIntroTimer;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const header = document.querySelector<HTMLElement>("[data-mobile-header]");
        const main = section.closest("main");
        const roots = [...document.querySelectorAll<HTMLElement>("[data-mobile-section], [data-mobile-footer]")];
        const rootState = roots.map((node) => ({ node, inert: node.inert }));
        const bodyOverflow = document.body.style.overflow;
        const htmlOverflow = document.documentElement.style.overflow;
        const busy = main?.getAttribute("aria-busy");
        let context: gsap.Context | undefined;
        let overlay: HTMLDivElement | undefined;
        let timeout: number | undefined;
        let frame = 0;
        let finished = false;
        let locked = false;

        function finish(completed = false) {
            if (finished) return;
            finished = true;
            window.clearTimeout(timeout);
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", onViewportChange);
            window.visualViewport?.removeEventListener("resize", onViewportChange);
            reducedMotion.removeEventListener("change", onViewportChange);
            header?.removeEventListener("pointerdown", onHeaderInteraction);
            header?.removeEventListener("focusin", onHeaderInteraction);
            try {
                // Reverting at the measured endpoint returns this same node to flow.
                context?.revert();
            } finally {
                delete root.dataset.mobileIntroBoot;
                overlay?.remove();
                if (locked) {
                    document.body.style.overflow = bodyOverflow;
                    document.documentElement.style.overflow = htmlOverflow;
                    rootState.forEach(({ node, inert }) => { node.inert = inert; });
                    if (busy == null) main?.removeAttribute("aria-busy");
                    else main?.setAttribute("aria-busy", busy);
                }
                section!.dataset.mobileIntroState = "ready";
                if (completed) {
                    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* Storage may be disabled. */ }
                }
            }
        }

        function onViewportChange() {
            // Rotation, address-bar changes or zoom invalidate the endpoint.
            finish();
        }

        function onHeaderInteraction() {
            // Navigation remains available throughout the intro.
            finish();
        }

        const cleanup = () => {
            finish();
            delete section.dataset.mobileIntroState;
        };

        let alreadyPlayed = false;
        try { alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1"; } catch { /* Continue without persistence. */ }
        if (alreadyPlayed || reducedMotion.matches || bootstrapExpired || window.scrollY > 0) {
            finish();
            return cleanup;
        }

        try {
            const headerBottom = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
            overlay = document.createElement("div");
            overlay.className = styles.overlay;
            overlay.style.top = `${headerBottom}px`;
            overlay.dataset.mobileIntro = "";
            overlay.dataset.phase = "loading";
            overlay.setAttribute("role", "status");
            overlay.setAttribute("aria-label", t("Preparing Pixardia"));
            const label = document.createElement("p");
            label.className = styles.label;
            label.setAttribute("aria-hidden", "true");
            label.textContent = "PIXARDIA";
            overlay.append(label);
            document.body.append(overlay);
            section.dataset.mobileIntroState = "loading";

            locked = true;
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden";
            rootState.forEach(({ node }) => { node.inert = true; });
            main?.setAttribute("aria-busy", "true");
            window.addEventListener("resize", onViewportChange);
            window.visualViewport?.addEventListener("resize", onViewportChange);
            reducedMotion.addEventListener("change", onViewportChange);
            header?.addEventListener("pointerdown", onHeaderInteraction);
            header?.addEventListener("focusin", onHeaderInteraction);

            const reveal = section.querySelectorAll<HTMLElement>("[data-hero-content] > *, [data-hero-reveal]");
            const glow = section.querySelector<HTMLElement>("[data-hero-glow]");
            context = gsap.context(() => {
                gsap.set(reveal, { opacity: 0, y: 8 });
                gsap.set(glow, { opacity: 0 });
            }, section);

            // A failed or stalled resource must never leave the page locked.
            timeout = window.setTimeout(() => finish(), 5000);
            const start = () => {
                if (finished) return;
                try {
                    const target = characters.getBoundingClientRect();
                    if (!target.width || !target.height || !image.naturalWidth) {
                        finish();
                        return;
                    }

                    const viewport = window.visualViewport;
                    const width = viewport?.width ?? window.innerWidth;
                    const height = viewport?.height ?? window.innerHeight;
                    const availableHeight = Math.max(1, height - headerBottom);
                    const size = Math.min(width * 0.82, availableHeight * 0.58, 340);
                    const scale = size / target.width;
                    const left = (viewport?.offsetLeft ?? 0) + (width - size) / 2;
                    const top = (viewport?.offsetTop ?? 0) + headerBottom + (availableHeight - size) / 2;
                    const x = left - target.left;
                    const y = top - target.top;
                    label.style.top = `${Math.max(16, top - headerBottom - 36)}px`;

                    window.clearTimeout(timeout);
                    timeout = window.setTimeout(() => finish(), 3500);
                    overlay!.dataset.phase = "initializing";
                    section.dataset.mobileIntroState = "initializing";
                    context!.add(() => {
                        // Inverse of the live Hero geometry. The stage preserves its
                        // dimensions while this single image floats above the loader.
                        gsap.set(characters, {
                            autoRound: false,
                            position: "fixed", left: target.left, top: target.top,
                            width: target.width, height: target.height, zIndex: 1001,
                            transformOrigin: "0 0", x, y: y + 8,
                            scale: scale * 0.97, opacity: 0,
                            willChange: "transform, opacity",
                        });
                        delete root.dataset.mobileIntroBoot;
                        gsap.timeline({ onComplete: () => finish(true) })
                            .to(characters, { y, scale, opacity: 1, duration: 0.35, ease: "power2.out" })
                            // A quiet first-contact beat using the original handshake pose.
                            .to(characters, { y: y - 3, duration: 0.18, ease: "sine.inOut" })
                            .to(label, { opacity: 0, duration: 0.18 }, 0.45)
                            .call(() => {
                                overlay!.dataset.phase = "arrival";
                                section.dataset.mobileIntroState = "arrival";
                            }, [], 0.53)
                            .to(characters, { x: 0, y: 0, scale: 1, duration: 0.9, ease: "power3.inOut" }, 0.53)
                            .to(overlay!, { opacity: 0, duration: 0.65, ease: "power2.inOut" }, 0.72)
                            .call(() => {
                                overlay!.dataset.phase = "reveal";
                                section.dataset.mobileIntroState = "reveal";
                            }, [], 1.43)
                            .to(glow, { opacity: 1, duration: 0.3 }, 1.43)
                            .to(reveal, { opacity: 1, y: 0, duration: 0.27, stagger: 0.025, ease: "power2.out" }, 1.43);
                    });
                } catch {
                    finish();
                }
            };

            void Promise.all([image.decode(), document.fonts.ready]).then(() => {
                if (finished) return;
                frame = requestAnimationFrame(() => { frame = requestAnimationFrame(start); });
            }).catch(() => finish());
        } catch {
            finish();
        }

        return cleanup;
    }, { scope: sectionRef });
}
