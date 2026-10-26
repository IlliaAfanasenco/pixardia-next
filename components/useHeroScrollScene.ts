"use client";

import type { RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import styles from "./HeroSection.module.css";

gsap.registerPlugin(ScrollTrigger);

// Keep the desktop gate identical to CinematicRuntime. It owns the shared pin.
const desktopQuery = "(min-width: 1280px) and (min-height: 800px) and (hover: hover) and (pointer: fine)";

function layoutTop(element: HTMLElement) {
    let top = 0;
    for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
        top += node.offsetTop;
    }
    return top;
}

export function useHeroScrollScene(ref: RefObject<HTMLElement | null>) {
    useGSAP(() => {
        const hero = ref.current;
        const shell = hero?.closest<HTMLElement>("[data-cinematic-pin-shell]");
        const stage = hero?.closest<HTMLElement>("[data-cinematic-stage]");
        const header = document.querySelector<HTMLElement>("[data-site-header]");
        const canvas = hero?.querySelector<HTMLCanvasElement>("[data-hero-handshake]");
        const visual = hero?.querySelector<HTMLElement>("[data-hero-visual]");
        const title = hero?.querySelector<HTMLElement>("#hero-title");
        const glow = hero?.querySelector<HTMLElement>("[data-hero-contact-glow]");
        if (!hero || !shell || !stage || !header || !canvas || !visual || !title || !glow) return;

        const media = gsap.matchMedia();
        media.add({
            motion: "(prefers-reduced-motion: no-preference)",
            desktop: desktopQuery,
            tablet: "(min-width: 768px) and (max-width: 1279px)",
            landscape: "(min-width: 1024px)",
            wide: "(min-width: 1600px) and (min-height: 900px)",
        }, (match) => {
            if (!match.conditions?.motion) return;
            const desktop = Boolean(match.conditions.desktop);
            // main itself can be the browser's anchor when the sticky Header
            // compacts, even though the corrected pin shell stays at document 0.
            const main = hero.closest("main");
            const previousAnchor = main?.style.overflowAnchor ?? "";
            if (main) main.style.overflowAnchor = "none";
            // Preserve the initial clearance while the unchanged Header compacts.
            const headerOffset = Number.parseFloat(getComputedStyle(document.documentElement)
                .getPropertyValue("--cinematic-header-offset")) || 0;
            let clearance = Math.max(header.offsetHeight, desktop ? headerOffset + header.clientTop : 0);
            const syncHeader = () => {
                const height = header.getBoundingClientRect().height;
                clearance = Math.max(clearance, height);
                shell.style.setProperty("--hero-header-flow", `${height}px`);
                shell.style.setProperty("--hero-header-clearance", `${clearance}px`);
                shell.style.setProperty("--hero-header-delta", `${clearance - height}px`);
            };
            syncHeader();
            shell.classList.add(styles.pinShell);
            if (!desktop) hero.classList.add(styles.flowScene);

            // Match the existing frame engine's range, including its flow fallback.
            // No additional scroll distance is introduced into the frame mapping.
            const range = () => {
                const existing = ScrollTrigger.getAll().find((trigger) =>
                    trigger.trigger === stage && trigger.animation instanceof gsap.core.Timeline &&
                    "hero-to-crafting" in trigger.animation.labels,
                );
                if (existing && existing.animation instanceof gsap.core.Timeline) {
                    return [existing.start, existing.start + (existing.end - existing.start) *
                        existing.animation.labels["hero-to-crafting"] / existing.animation.duration()];
                }
                return [0, Math.max(1, Math.min(
                    layoutTop(hero) + hero.offsetHeight - window.innerHeight * 0.5,
                    layoutTop(canvas) - header.offsetHeight - 12,
                ))];
            };

            const effects = gsap.timeline({ paused: true })
                .fromTo(visual, { scale: 1 }, { scale: 1.12, duration: 1, ease: "none" }, 0)
                .fromTo(title, { opacity: 1 }, { opacity: 0.08, duration: 0.7, ease: "sine.inOut" }, 0.12)
                .fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "sine.inOut" }, 0.64)
                .to(glow, { opacity: 0.45, duration: 0.16, ease: "sine.inOut" }, 0.84);

            // Short landscape/compact viewports retain their scrolling composition:
            // pinning a taller-than-viewport Hero would conceal the illustration.
            const fits = () => hero.offsetHeight + clearance - header.offsetHeight <= window.innerHeight;
            let pin = !desktop && fits();
            const syncOrigin = () => gsap.set(visual, { transformOrigin: desktop || pin ? "center bottom" : "center top" });
            syncOrigin();
            const createTrigger = () => ScrollTrigger.create({
                id: "hero-scroll-scene",
                trigger: hero,
                animation: effects,
                start: () => range()[0],
                end: () => range()[1],
                scrub: true,
                pin: pin ? hero : false,
                // Preserve layoutTop() measurements used by the frame engine.
                pinType: "transform",
                pinSpacing: true,
                refreshPriority: -2,
                invalidateOnRefresh: true,
            });
            let trigger = createTrigger();
            const previousScrollMargin = hero.style.scrollMarginBlockStart;

            const syncFlowSpacing = () => {
                syncHeader();
                if (pin && hero.parentElement) {
                    hero.parentElement.style.height = `${hero.offsetHeight + trigger.end - trigger.start}px`;
                    hero.parentElement.style.marginBlockEnd = `${clearance - header.getBoundingClientRect().height}px`;
                    // Native #hero links must target the scene origin rather than
                    // the transform that ScrollTrigger retains after unpinning.
                    hero.style.scrollMarginBlockStart = `${trigger.end - trigger.start}px`;
                } else {
                    hero.style.scrollMarginBlockStart = previousScrollMargin;
                }
            };
            const observer = new ResizeObserver(syncFlowSpacing);
            observer.observe(header);
            syncFlowSpacing();

            let resizeFrame = 0;
            const reconcilePin = match.add("reconcileHeroPin", () => {
                resizeFrame = 0;
                const nextPin = !desktop && fits();
                if (nextPin !== pin) {
                    trigger.kill(true, true);
                    pin = nextPin;
                    syncOrigin();
                    trigger = createTrigger();
                    syncFlowSpacing();
                    ScrollTrigger.refresh();
                } else {
                    syncFlowSpacing();
                }
            });
            const scheduleReconcile = () => {
                window.cancelAnimationFrame(resizeFrame);
                resizeFrame = window.requestAnimationFrame(() => reconcilePin());
            };
            window.addEventListener("resize", scheduleReconcile);
            ScrollTrigger.addEventListener("refresh", scheduleReconcile);

            // The shared desktop timeline is created in a later effect. Refresh once
            // after mount/media changes so both observers use its final labels.
            const refresh = window.requestAnimationFrame(() => ScrollTrigger.refresh());

            return () => {
                window.cancelAnimationFrame(refresh);
                window.cancelAnimationFrame(resizeFrame);
                window.removeEventListener("resize", scheduleReconcile);
                ScrollTrigger.removeEventListener("refresh", scheduleReconcile);
                observer.disconnect();
                trigger.kill();
                effects.revert();
                hero.style.scrollMarginBlockStart = previousScrollMargin;
                shell.classList.remove(styles.pinShell);
                hero.classList.remove(styles.flowScene);
                if (main) main.style.overflowAnchor = previousAnchor;
                for (const property of ["--hero-header-flow", "--hero-header-clearance", "--hero-header-delta"]) {
                    shell.style.removeProperty(property);
                }
            };
        });
        return () => media.revert();
    }, { scope: ref });
}
