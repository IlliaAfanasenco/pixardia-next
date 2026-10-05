"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/motion/gsap";

gsap.registerPlugin(ScrollTrigger);

// Keep this exclusion identical to cinematicDesktopQuery in CinematicRuntime.
const cinematicDesktopQuery =
    "(min-width: 1280px) and (min-height: 800px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const tabletConditions = {
    standardTablet: "(min-width: 768px) and (max-width: 1279px)",
    largeTouchTablet: "(min-width: 1280px) and (max-width: 1440px) and (any-pointer: coarse)",
    motionAllowed: "(prefers-reduced-motion: no-preference)",
    desktopCinematic: cinematicDesktopQuery,
};

const debugTabletMotion = process.env.NODE_ENV === "development";

function debug(message: string, details?: unknown) {
    if (debugTabletMotion) console.info(`[TabletMotion] ${message}`, details ?? "");
}

function mediaSnapshot() {
    return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        visualViewport: { width: window.visualViewport?.width, height: window.visualViewport?.height },
        scrollY: window.scrollY,
        matches: Object.fromEntries(Object.entries(tabletConditions).map(([key, query]) => [key, window.matchMedia(query).matches])),
        prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        anyPointerCoarse: window.matchMedia("(any-pointer: coarse)").matches,
        maxTouchPoints: navigator.maxTouchPoints,
    };
}

export default function TabletMotionRuntime() {
    useGSAP(() => {
        const stage = document.querySelector<HTMLElement>("[data-cinematic-stage]");
        if (debugTabletMotion) debug("mounted", {
            ...mediaSnapshot(),
            stageFound: Boolean(stage),
            stageMode: stage?.dataset.cinematicMode,
            gsapVersion: gsap.version,
            scrollTriggerVersion: ScrollTrigger.version,
            pluginRegistered: (gsap.core as typeof gsap.core & { globals: () => Record<string, unknown> }).globals().ScrollTrigger === ScrollTrigger,
        });
        if (!stage) {
            debug("inactive: stage missing at mount");
            return () => debug("unmounted (stage was missing)");
        }

        // Independent listeners report changes even when every GSAP condition is false.
        const debugQueries = debugTabletMotion
            ? Object.values(tabletConditions).map((query) => window.matchMedia(query))
            : [];
        const reportMediaChange = () => debug("media changed", mediaSnapshot());
        debugQueries.forEach((query) => query.addEventListener("change", reportMediaChange));

        const media = gsap.matchMedia();
        media.add(tabletConditions, (context) => {
            const { standardTablet, largeTouchTablet, motionAllowed, desktopCinematic } = context.conditions ?? {};
            // Desktop wins even on hybrid devices. MatchMedia reverts and reevaluates
            // when viewport, input capabilities or motion preferences change.
            if (debugTabletMotion) debug("activation evaluated", {
                ...mediaSnapshot(),
                gsapConditions: { ...context.conditions },
                active: Boolean(motionAllowed && !desktopCinematic && (standardTablet || largeTouchTablet)),
                blockedBy: !motionAllowed ? "motion preference" : desktopCinematic ? "desktop cinematic exclusion" : !(standardTablet || largeTouchTablet) ? "tablet capability/width conditions" : null,
            });
            if (!motionAllowed || desktopCinematic || !(standardTablet || largeTouchTablet)) return;

            const triggersBefore = debugTabletMotion ? new Set(ScrollTrigger.getAll()) : null;
            const matchedTargets = new Set<HTMLElement>();
            const missingSelectors: string[] = [];
            const skippedReveals: Array<{ target: string; reason: string }> = [];
            const entrances: Array<{ element: HTMLElement; animation: gsap.core.Animation }> = [];
            const select = (selector: string) => {
                const target = stage.querySelector<HTMLElement>(selector);
                if (debugTabletMotion && !target) missingSelectors.push(selector);
                return target;
            };
            const element = (name: string) => select(`[data-cinematic-element="${name}"]`);

            // Completed entrances stay visible when scrolling back. Focus always wins.
            const reveal = (target: HTMLElement | null, delay = 0, lift = true) => {
                if (debugTabletMotion && target) matchedTargets.add(target);
                if (!target || target.getBoundingClientRect().bottom <= 0 || target.contains(document.activeElement)) {
                    if (debugTabletMotion && target) skippedReveals.push({
                        target: target.dataset.cinematicElement ?? target.tagName,
                        reason: target.contains(document.activeElement) ? "contains focus" : "above viewport",
                    });
                    return;
                }
                const animation = gsap.fromTo(target,
                    { opacity: 0, ...(lift ? { y: 14 } : {}) },
                    {
                        opacity: 1,
                        ...(lift ? { y: 0 } : {}),
                        duration: 0.65,
                        delay,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: target,
                            start: "top 90%",
                            once: true,
                        },
                    },
                );
                entrances.push({ element: target, animation });
            };

            // Animate wrappers, leaving the Hero image's existing idle motion alone.
            const depth = (target: HTMLElement | null, distance: number) => {
                if (!target) return;
                if (debugTabletMotion) matchedTargets.add(target);
                gsap.fromTo(target, { y: 0 }, {
                    y: -distance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: target,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.6,
                    },
                });
            };

            reveal(element("hero-eyebrow"));
            const title = element("hero-title");
            title?.querySelectorAll<HTMLElement>(":scope > span").forEach((line, index) => {
                reveal(line, index * 0.08);
            });
            reveal(element("hero-character"), 0.12, false);
            depth(element("hero-character"), 12);
            reveal(element("hero-copy"), 0.08);
            reveal(element("hero-cta"), 0.12);

            const crafting = element("crafting-copy");
            crafting?.querySelectorAll<HTMLElement>(":scope > p, :scope > h2").forEach((copy, index) => {
                reveal(copy, index * 0.06);
            });
            reveal(element("crafting-card"));
            reveal(element("crafting-terminal"), 0, false);
            depth(element("crafting-terminal"), 8);

            reveal(select("[data-neural-header]"));
            reveal(select("[data-neural-core]"));
            const nodes = select("[data-neural-nodes]");
            if (nodes && nodes.getBoundingClientRect().bottom > 0 && !nodes.contains(document.activeElement)) {
                const cards = Array.from(nodes.querySelectorAll<HTMLElement>("[data-neural-node]"));
                if (debugTabletMotion) {
                    matchedTargets.add(nodes);
                    cards.forEach((card) => matchedTargets.add(card));
                }
                const sequence = gsap.timeline({
                    defaults: { ease: "power2.out" },
                    scrollTrigger: { trigger: nodes, start: "top 88%", once: true },
                });
                sequence.fromTo(nodes,
                    { "--tablet-connection-progress": 0 },
                    { "--tablet-connection-progress": 1, duration: 0.4 },
                );
                sequence.fromTo(cards,
                    { opacity: 0, y: 12 },
                    { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 },
                    0.2,
                );
                entrances.push({ element: nodes, animation: sequence });
            }
            reveal(select("[data-neural-insight]"));
            reveal(select("[data-neural-stats]"), 0.08);

            stage.querySelectorAll<HTMLElement>("[data-cinematic-product-card]").forEach((card, index) => {
                reveal(card, (index % 2) * 0.08);
            });

            const ownedTriggers = triggersBefore
                ? ScrollTrigger.getAll().filter((trigger) => !triggersBefore.has(trigger))
                : [];
            const reportExecution = (phase: string) => {
                if (!debugTabletMotion) return;
                const liveTriggers = new Set(ScrollTrigger.getAll());
                debug(phase, {
                    scrollY: window.scrollY,
                    stageMode: stage.dataset.cinematicMode,
                    matchedTargets: matchedTargets.size,
                    missingSelectors,
                    skippedReveals,
                    createdTriggers: ownedTriggers.length,
                    liveOwnedTriggers: ownedTriggers.filter((trigger) => liveTriggers.has(trigger)).length,
                    triggers: ownedTriggers.map((trigger) => ({
                        start: trigger.start, end: trigger.end, progress: trigger.progress,
                        animationProgress: trigger.animation?.totalProgress(),
                        live: liveTriggers.has(trigger),
                    })),
                    // Inline/computed differences expose CSS overrides; ancestor state
                    // helps distinguish a hidden section from a failed child reveal.
                    targets: Array.from(matchedTargets).map((target) => {
                        const style = getComputedStyle(target);
                        const scene = target.closest<HTMLElement>("[data-cinematic-scene]");
                        const sceneStyle = scene ? getComputedStyle(scene) : null;
                        return {
                            target: target.dataset.cinematicElement ?? target.dataset.neuralNode ?? target.tagName,
                            scene: scene?.dataset.cinematicScene,
                            top: Math.round(target.getBoundingClientRect().top),
                            inlineOpacity: target.style.opacity, opacity: style.opacity,
                            inlineTransform: target.style.transform, transform: style.transform,
                            visibility: style.visibility, display: style.display,
                            sceneOpacity: sceneStyle?.opacity, sceneTransform: sceneStyle?.transform,
                        };
                    }),
                });
            };
            const debugTimers: number[] = [];
            const reportFirstScroll = () => {
                debugTimers.push(window.setTimeout(() => reportExecution("after first scroll"), 150));
            };
            if (debugTabletMotion) {
                reportExecution("active: triggers created");
                debugTimers.push(window.setTimeout(() => reportExecution("execution after 250ms"), 250));
                debugTimers.push(window.setTimeout(() => reportExecution("execution after 1500ms"), 1500));
                window.addEventListener("scroll", reportFirstScroll, { once: true, passive: true });
            }

            const showFocused = (event: FocusEvent) => {
                if (!(event.target instanceof Node)) return;
                for (const entry of entrances) {
                    if (entry.element.contains(event.target)) entry.animation.progress(1);
                }
            };
            stage.addEventListener("focusin", showFocused);
            // MatchMedia reverts inline styles and its own ScrollTriggers on resize,
            // reduced-motion changes and unmount; never kill another runtime's triggers.
            return () => {
                if (debugTabletMotion) debug("active context cleanup", mediaSnapshot());
                debugTimers.forEach((timer) => window.clearTimeout(timer));
                window.removeEventListener("scroll", reportFirstScroll);
                stage.removeEventListener("focusin", showFocused);
            };
        });

        return () => {
            debug("unmounted: reverting matchMedia");
            debugQueries.forEach((query) => query.removeEventListener("change", reportMediaChange));
            media.revert();
        };
    });

    return null;
}
