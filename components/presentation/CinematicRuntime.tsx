"use client";

import {
    useEffect,
    useRef,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import EvidenceInterlude from "@/components/presentation/EvidenceInterlude";
import SceneNavigator from "@/components/presentation/SceneNavigator";
import SignalRoute from "@/components/presentation/SignalRoute";
import TransitionVeil from "@/components/presentation/TransitionVeil";

gsap.registerPlugin(ScrollTrigger);

const sceneOrder = [
    "hero",
    "crafting",
    "neural",
    "product",
] as const;
const cinematicDesktopQuery =
    "(min-width: 1280px) and (min-height: 800px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type CinematicScene = (typeof sceneOrder)[number];
type FlowSection = "archive" | "contact";
type NavigatorTarget = CinematicScene | FlowSection;

const navigatorProgressByChapter: Record<
    NavigatorTarget,
    number
> = {
    hero: 0,
    crafting: 0.2,
    neural: 0.4,
    product: 0.6,
    archive: 0.8,
    contact: 1,
};

function select<T extends Element>(
    root: ParentNode,
    selector: string,
): T | null {
    return root.querySelector<T>(selector);
}

function selectAll<T extends Element>(
    root: ParentNode,
    selector: string,
): T[] {
    return Array.from(root.querySelectorAll<T>(selector));
}

function setActiveScene(
    scenes: HTMLElement[],
    activeIndex: number,
    controls: HTMLElement[] = [],
): void {
    const activeScene = sceneOrder[activeIndex] ?? "hero";

    scenes.forEach((scene, index) => {
        const inactive = index !== activeIndex;

        scene.dataset.cinematicState =
            index < activeIndex
                ? "past"
                : index === activeIndex
                    ? "active"
                    : "future";
        scene.toggleAttribute("aria-hidden", inactive);
        scene.inert = inactive;
    });

    document.documentElement.dataset.cinematicActive =
        activeScene;
    updateCurrentControl(controls, activeScene);
}

function setFlowSectionActive(
    scenes: HTMLElement[],
    section: FlowSection,
    controls: HTMLElement[] = [],
): void {
    scenes.forEach((scene) => {
        scene.dataset.cinematicState = "past";
        scene.setAttribute("aria-hidden", "");
        scene.inert = true;
    });

    document.documentElement.dataset.cinematicActive =
        section;
    updateCurrentControl(controls, section);
}

function updateCurrentControl(
    controls: HTMLElement[],
    activeTarget: NavigatorTarget,
): void {
    controls.forEach((control) => {
        if (
            control.dataset.cinematicNavTarget ===
            activeTarget
        ) {
            control.setAttribute("aria-current", "step");
        } else {
            control.removeAttribute("aria-current");
        }
    });
}

function clearSceneState(scenes: HTMLElement[]): void {
    scenes.forEach((scene) => {
        delete scene.dataset.cinematicState;
        scene.removeAttribute("aria-hidden");
        scene.inert = false;
        scene.dataset.motionState = "visible";
    });

    delete document.documentElement.dataset.cinematicActive;
    delete document.documentElement.dataset.cinematicSignal;
}

function clampProgress(progress: number): number {
    return Math.min(1, Math.max(0, progress));
}

export default function CinematicRuntime() {
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(
        () => {
            const stage = select<HTMLElement>(
                document,
                "[data-cinematic-stage]",
            );
            const root = document.documentElement;

            if (!stage) {
                return;
            }

            const scenes = sceneOrder
                .map((scene) =>
                    select<HTMLElement>(
                        stage,
                        `[data-cinematic-scene="${scene}"]`,
                    ),
                )
                .filter(
                    (scene): scene is HTMLElement =>
                        scene !== null,
                );

            if (scenes.length !== sceneOrder.length) {
                return;
            }

            const mm = gsap.matchMedia();

            root.dataset.motionRuntime = "ready";

            mm.add(
                cinematicDesktopQuery,
                () => {
                    const veil = select<HTMLElement>(
                        document,
                        "[data-cinematic-veil]",
                    );
                    const navigator = select<HTMLElement>(
                        document,
                        "[data-cinematic-navigator]",
                    );
                    const navigatorFill = select<HTMLElement>(
                        document,
                        "[data-cinematic-nav-fill]",
                    );
                    const signalRoute = select<SVGSVGElement>(
                        document,
                        "[data-cinematic-signal]",
                    );
                    const signalPaths = selectAll<SVGPathElement>(
                        document,
                        "[data-cinematic-signal-path]",
                    );
                    const navControls = selectAll<HTMLElement>(
                        document,
                        "[data-cinematic-nav-target]",
                    );
                    const archiveSection = select<HTMLElement>(
                        document,
                        "#projects",
                    );
                    const contactSection = select<HTMLElement>(
                        document,
                        "#contact",
                    );
                    const archiveKicker = select<HTMLElement>(
                        document,
                        "[data-archive-kicker]",
                    );
                    const archiveTitle = select<HTMLElement>(
                        document,
                        "[data-archive-title]",
                    );
                    const archiveIntro = select<HTMLElement>(
                        document,
                        "[data-archive-intro]",
                    );
                    const archiveAlien = select<HTMLElement>(
                        document,
                        "[data-archive-alien]",
                    );
                    const archiveCta = select<HTMLElement>(
                        document,
                        "[data-archive-cta]",
                    );
                    const archiveCards = selectAll<HTMLElement>(
                        document,
                        "[data-archive-card]",
                    );
                    const archiveCardVisuals = selectAll<HTMLElement>(
                        document,
                        "[data-archive-card-visual]",
                    );
                    const archiveCardCopies = selectAll<HTMLElement>(
                        document,
                        "[data-archive-card-copy]",
                    );
                    const contactKicker = select<HTMLElement>(
                        document,
                        "[data-contact-kicker]",
                    );
                    const contactTitle = select<HTMLElement>(
                        document,
                        "[data-contact-title]",
                    );
                    const contactStamp = select<HTMLElement>(
                        document,
                        "[data-contact-stamp]",
                    );
                    const contactRule = select<HTMLElement>(
                        document,
                        "[data-contact-rule]",
                    );
                    const contactCopy = select<HTMLElement>(
                        document,
                        "[data-contact-copy]",
                    );
                    const contactVisual = select<HTMLElement>(
                        document,
                        "[data-contact-visual]",
                    );
                    const contactFormWrap = select<HTMLElement>(
                        document,
                        "[data-contact-form-wrap]",
                    );
                    const contactFormVisual = select<HTMLElement>(
                        document,
                        "[data-contact-form-visual]",
                    );
                    const heroLayer = select<HTMLElement>(
                        stage,
                        '[data-cinematic-scene="hero"] [data-cinematic-layer]',
                    );
                    const craftingLayer = select<HTMLElement>(
                        stage,
                        '[data-cinematic-scene="crafting"] [data-cinematic-layer]',
                    );
                    const neuralLayer = select<HTMLElement>(
                        stage,
                        '[data-cinematic-scene="neural"] [data-cinematic-layer]',
                    );
                    const productLayer = select<HTMLElement>(
                        stage,
                        '[data-cinematic-scene="product"] [data-cinematic-layer]',
                    );
                    const productProgress = select<SVGPathElement>(
                        stage,
                        "[data-product-progress]",
                    );
                    const productProgressValue = select<SVGTextElement>(
                        stage,
                        "[data-product-progress-value]",
                    );
                    const neuralCore = select<HTMLElement>(
                        stage,
                        "[data-neural-core]",
                    );
                    const neuralNetwork = select<SVGSVGElement>(
                        stage,
                        "[data-neural-network]",
                    );
                    const neuralNetworkPaths = selectAll<SVGPathElement>(
                        stage,
                        "[data-neural-network-path]",
                    );
                    const neuralNodes = selectAll<HTMLElement>(
                        stage,
                        "[data-neural-node]",
                    );
                    const neuralInsight = select<HTMLElement>(
                        stage,
                        "[data-neural-insight]",
                    );
                    const neuralStats = select<HTMLElement>(
                        stage,
                        "[data-neural-stats]",
                    );
                    const evidenceInterlude = select<HTMLElement>(
                        document,
                        "[data-cinematic-evidence-interlude]",
                    );
                    const evidenceFrame = select<HTMLElement>(
                        document,
                        "[data-cinematic-evidence-frame]",
                    );
                    const evidenceLine = select<HTMLElement>(
                        document,
                        "[data-cinematic-evidence-line]",
                    );

                    if (
                        !veil ||
                        !navigator ||
                        !navigatorFill ||
                        !signalRoute ||
                        !archiveSection ||
                        !contactSection ||
                        !archiveKicker ||
                        !archiveTitle ||
                        !archiveIntro ||
                        !archiveAlien ||
                        !archiveCta ||
                        archiveCards.length === 0 ||
                        archiveCardVisuals.length === 0 ||
                        archiveCardCopies.length === 0 ||
                        !contactKicker ||
                        !contactTitle ||
                        !contactStamp ||
                        !contactRule ||
                        !contactCopy ||
                        !contactVisual ||
                        !contactFormWrap ||
                        !contactFormVisual ||
                        !heroLayer ||
                        !craftingLayer ||
                        !neuralLayer ||
                        !neuralCore ||
                        !neuralNetwork ||
                        neuralNetworkPaths.length === 0 ||
                        neuralNodes.length === 0 ||
                        !neuralInsight ||
                        !neuralStats ||
                        !productLayer ||
                        !productProgress ||
                        !productProgressValue ||
                        !evidenceInterlude ||
                        !evidenceFrame ||
                        !evidenceLine
                    ) {
                        clearSceneState(scenes);

                        return;
                    }

                    let activeIndex = -1;
                    let craftingSceneProgress = 0.24;
                    let neuralSceneProgress = 0.48;
                    let productSceneProgress = 0.72;
                    const setProgress = gsap.quickSetter(
                        root,
                        "--cinematic-progress",
                    );
                    const setSignalState = (
                        chapter: NavigatorTarget,
                    ) => {
                        root.dataset.cinematicSignal = chapter;
                    };
                    const setNavigatorProgress = (
                        progress: number,
                    ) => {
                        setProgress(
                            clampProgress(progress).toFixed(4),
                        );
                    };
                    const updateScene = (progress: number) => {
                        if (
                            root.dataset.projectModalOpen ===
                            "true"
                        ) {
                            return;
                        }

                        const nextIndex =
                            progress < craftingSceneProgress
                                ? 0
                                : progress < neuralSceneProgress
                                    ? 1
                                    : progress < productSceneProgress
                                        ? 2
                                        : 3;

                        setNavigatorProgress(
                            progress *
                            navigatorProgressByChapter.product,
                        );

                        if (nextIndex !== activeIndex) {
                            activeIndex = nextIndex;
                            setActiveScene(
                                scenes,
                                nextIndex,
                                navControls,
                            );
                            setSignalState(
                                sceneOrder[nextIndex] ??
                                "hero",
                            );
                        }
                    };
                    const setFlowChapter = (
                        section: FlowSection,
                    ) => {
                        if (
                            root.dataset.projectModalOpen ===
                            "true"
                        ) {
                            return;
                        }

                        setFlowSectionActive(
                            scenes,
                            section,
                            navControls,
                        );
                        setSignalState(section);
                        setNavigatorProgress(
                            navigatorProgressByChapter[section],
                        );
                    };

                    root.dataset.motionRuntime = "ready";
                    root.dataset.cinematicRuntime = "ready";
                    stage.dataset.cinematicMode = "desktop";
                    setActiveScene(scenes, 0, navControls);
                    setSignalState("hero");
                    setNavigatorProgress(0);

                    const lenis = new Lenis({
                        anchors: true,
                        allowNestedScroll: true,
                        lerp: 0.10,
                        smoothWheel: true,
                        touchMultiplier: 1,
                        wheelMultiplier: 0.88,
                        autoToggle: true,
                    });
                    const tickLenis = (time: number) => {
                        lenis.raf(time * 1000);
                    };

                    const handleProjectModalLock = () => {
                        lenis.stop();
                    };
                    const handleProjectModalUnlock = () => {
                        lenis.start();
                        ScrollTrigger.update();
                    };

                    document.addEventListener(
                        "pixardia:project-modal-lock",
                        handleProjectModalLock,
                    );
                    document.addEventListener(
                        "pixardia:project-modal-unlock",
                        handleProjectModalUnlock,
                    );

                    if (
                        root.dataset.projectModalOpen ===
                        "true"
                    ) {
                        lenis.stop();
                    }

                    lenis.on("scroll", ScrollTrigger.update);
                    gsap.ticker.add(tickLenis);
                    gsap.ticker.lagSmoothing(0);

                    gsap.set(scenes, {
                        autoAlpha: 0,
                    });
                    gsap.set(scenes[0], {
                        autoAlpha: 1,
                    });
                    gsap.set(
                        [
                            craftingLayer,
                            neuralLayer,
                            productLayer,
                        ],
                        {
                            y: 72,
                            clipPath:
                                "inset(10% 0% 0% 0%)",
                        },
                    );

                    gsap.set(
                        neuralNetworkPaths,
                        {
                            strokeDasharray: 1,
                            strokeDashoffset: 1,
                        },
                    );

                    gsap.set(
                        [
                            "[data-neural-header]",
                            neuralCore,
                            ...neuralNodes,
                            neuralInsight,
                            neuralStats,
                        ],
                        {
                            autoAlpha: 0,
                        },
                    );
                    gsap.set(
                        "[data-neural-header]",
                        {
                            y: 18,
                        },
                    );
                    gsap.set(
                        "[data-neural-title-line]",
                        {
                            y: 24,
                            clipPath: "inset(0 0 100% 0)",
                        },
                    );
                    gsap.set(
                        neuralCore,
                        {
                            scale: 0.84,
                            rotation: -3,
                        },
                    );
                    gsap.set(
                        '[data-neural-node="frontend"]',
                        {
                            x: 24,
                            y: -10,
                            scale: 0.96,
                        },
                    );
                    gsap.set(
                        '[data-neural-node="integration"]',
                        {
                            x: -24,
                            y: 0,
                            scale: 0.96,
                        },
                    );
                    gsap.set(
                        '[data-neural-node="backend"]',
                        {
                            x: -18,
                            y: 18,
                            scale: 0.96,
                        },
                    );
                    gsap.set(
                        '[data-neural-node="security"]',
                        {
                            x: 18,
                            y: 18,
                            scale: 0.96,
                        },
                    );
                    gsap.set(
                        neuralInsight,
                        {
                            x: 26,
                            scale: 0.98,
                        },
                    );
                    gsap.set(
                        neuralStats,
                        {
                            y: 16,
                        },
                    );
                    gsap.set(veil, {
                        autoAlpha: 0,
                    });
                    gsap.set(navigator, {
                        autoAlpha: 1,
                    });
                    gsap.set(signalRoute, {
                        autoAlpha: 0,
                    });
                    gsap.set(evidenceInterlude, {
                        autoAlpha: 0,
                    });
                    gsap.set(evidenceLine, {
                        scaleX: 0,
                    });
                    gsap.set(signalPaths, {
                        strokeDasharray: 1,
                        strokeDashoffset: 1,
                    });
                    gsap.set(
                        [
                            '[data-cinematic-element="hero-eyebrow"]',
                            '[data-cinematic-element="hero-title"] span',
                            '[data-cinematic-element="hero-copy"]',
                            '[data-cinematic-element="hero-cta"]',
                            '[data-cinematic-element="hero-meta"]',
                            '[data-cinematic-element="hero-character"]',
                        ],
                        {
                            autoAlpha: 1,
                            y: 0,
                            yPercent: 0,
                            scale: 1,
                            clipPath: "inset(0 0 0 0)",
                        },
                    );
                    gsap.set(
                        [
                            '[data-cinematic-element="crafting-copy"]',
                            '[data-cinematic-element="crafting-card"]',
                            '[data-cinematic-element="crafting-terminal"]',
                        ],
                        {
                            autoAlpha: 0,
                            y: 26,
                        },
                    );
                    gsap.set(
                        [
                            '[data-cinematic-element="product-kicker"]',
                            '[data-cinematic-element="product-heading"]',
                            '[data-cinematic-product-card]',
                            '[data-cinematic-element="product-system"]',
                            '[data-cinematic-element="product-status"]',
                            '[data-cinematic-element="product-footer"]',
                        ],
                        {
                            autoAlpha: 0,
                            y: 24,
                        },
                    );
                    gsap.set(
                        '[data-cinematic-element="product-heading"]',
                        {
                            x: 22,
                        },
                    );
                    gsap.set(
                        "[data-cinematic-product-card]",
                        {
                            scale: 0.985,
                        },
                    );
                    const timeline = gsap.timeline({
                        defaults: {
                            duration: 0.44,
                            ease: "power2.inOut",
                        },
                    });
                    const createHold = () => ({ progress: 0 });
                    const productProgressLength =
                        productProgress.getTotalLength();
                    const productProgressState = {
                        value: 0,
                    };
                    let productProgressTween: gsap.core.Tween | null =
                        null;
                    const renderProductProgress = () => {
                        productProgressValue.textContent = `${Math.round(
                            productProgressState.value,
                        )}%`;
                        gsap.set(productProgress, {
                            strokeDasharray: productProgressLength,
                            strokeDashoffset:
                                productProgressLength *
                                (1 - productProgressState.value / 80),
                        });
                    };
                    const resetProductProgress = () => {
                        productProgressTween?.kill();
                        productProgressTween = null;
                        productProgressState.value = 0;
                        renderProductProgress();
                    };
                    const playProductProgress = () => {
                        resetProductProgress();
                        productProgressTween = gsap.to(
                            productProgressState,
                            {
                                value: 80,
                                duration: 2,
                                ease: "power2.inOut",
                                onUpdate: renderProductProgress,
                                onComplete: () => {
                                    productProgressTween = null;
                                },
                            },
                        );
                    };

                    resetProductProgress();

                    timeline
                        .addLabel("hero")
                        .to(createHold(), {
                            progress: 1,
                            duration: 1.02,
                            ease: "none",
                        })

                        .addLabel("hero-to-crafting")
                        .set(signalRoute, {
                            autoAlpha: 0.22,
                        })
                        .fromTo(
                            '[data-cinematic-signal-path="primary"]',
                            {
                                strokeDashoffset: 1,
                            },
                            {
                                strokeDashoffset: 0.18,
                                duration: 0.34,
                                ease: "power2.out",
                            },
                        )
                        .to(
                            [
                                '[data-cinematic-element="hero-eyebrow"]',
                                '[data-cinematic-element="hero-title"] span',
                                '[data-cinematic-element="hero-copy"]',
                                '[data-cinematic-element="hero-cta"]',
                                '[data-cinematic-element="hero-meta"]',
                            ],
                            {
                                autoAlpha: 0,
                                y: -20,
                                stagger: 0.035,
                                duration: 0.34,
                                ease: "power2.in",
                            },
                            "<",
                        )
                        .to(
                            '[data-cinematic-element="hero-character"]',
                            {
                                autoAlpha: 0,
                                xPercent: 3,
                                y: -18,
                                scale: 0.975,
                                duration: 0.38,
                                ease: "power2.in",
                            },
                            "<+=0.04",
                        )
                        .to(
                            heroLayer,
                            {
                                scale: 0.995,
                                duration: 0.30,
                            },
                            "<",
                        )
                        .to(
                            scenes[0],
                            {
                                autoAlpha: 0,
                                duration: 0.16,
                                ease: "none",
                            },
                            ">-0.04",
                        )
                        .set(
                            craftingLayer,
                            {
                                autoAlpha: 1,
                                x: 26,
                                y: 0,
                                scale: 1,
                                clipPath: "inset(0 100% 0 0)",
                            },
                        )
                        .set(
                            scenes[1],
                            {
                                autoAlpha: 1,
                            },
                            "<",
                        )
                        .to(
                            craftingLayer,
                            {
                                x: 0,
                                clipPath: "inset(0 0% 0 0)",
                                duration: 0.48,
                                ease: "power3.out",
                            },
                        )
                        .to(
                            [
                                '[data-cinematic-element="crafting-copy"]',
                                '[data-cinematic-element="crafting-card"]',
                                '[data-cinematic-element="crafting-terminal"]',
                            ],
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.075,
                                duration: 0.34,
                                ease: "power3.out",
                            },
                            "<+=0.12",
                        )
                        .to(
                            signalRoute,
                            {
                                autoAlpha: 0,
                                duration: 0.16,
                                ease: "none",
                            },
                            ">-0.12",
                        )

                        .addLabel("crafting")
                        .to(createHold(), {
                            progress: 1,
                            duration: 0.82,
                            ease: "none",
                        })

                        .addLabel("crafting-to-neural")
                        .set(signalRoute, {
                            autoAlpha: 0.22,
                        })
                        .fromTo(
                            '[data-cinematic-signal-path="secondary"]',
                            {
                                strokeDashoffset: 1,
                            },
                            {
                                strokeDashoffset: 0.16,
                                duration: 0.36,
                                ease: "power2.out",
                            },
                        )
                        .to(
                            '[data-cinematic-element="crafting-copy"]',
                            {
                                autoAlpha: 0,
                                x: -28,
                                duration: 0.30,
                                ease: "power2.in",
                            },
                            "<",
                        )
                        .to(
                            '[data-cinematic-element="crafting-card"]',
                            {
                                autoAlpha: 0,
                                y: -22,
                                duration: 0.30,
                                ease: "power2.in",
                            },
                            "<+=0.04",
                        )
                        .to(
                            '[data-cinematic-element="crafting-terminal"]',
                            {
                                autoAlpha: 0,
                                x: 30,
                                duration: 0.32,
                                ease: "power2.in",
                            },
                            "<",
                        )
                        .to(
                            scenes[1],
                            {
                                autoAlpha: 0,
                                duration: 0.16,
                                ease: "none",
                            },
                            ">-0.04",
                        )
                        .set(
                            neuralLayer,
                            {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                                clipPath: "inset(0% 0% 0% 0%)",
                            },
                        )
                        .set(
                            scenes[2],
                            {
                                autoAlpha: 1,
                            },
                            "<",
                        )

                        .addLabel("neural")
                        .to(
                            "[data-neural-header]",
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.30,
                                ease: "power3.out",
                            },
                        )
                        .to(
                            "[data-neural-title-line]",
                            {
                                autoAlpha: 1,
                                y: 0,
                                clipPath: "inset(0 0 0% 0)",
                                stagger: 0.055,
                                duration: 0.36,
                                ease: "power3.out",
                            },
                            "<+=0.03",
                        )
                        .to(
                            neuralCore,
                            {
                                autoAlpha: 1,
                                scale: 1,
                                rotation: 0,
                                duration: 0.42,
                                ease: "power3.out",
                            },
                            "<+=0.02",
                        )
                        .to(
                            neuralNetwork,
                            {
                                autoAlpha: 1,
                                duration: 0.12,
                                ease: "none",
                            },
                            "<+=0.08",
                        )
                        .to(
                            neuralNetworkPaths,
                            {
                                strokeDashoffset: 0,
                                stagger: 0.045,
                                duration: 0.40,
                                ease: "power2.out",
                            },
                            "<",
                        )
                        .to(
                            neuralNodes,
                            {
                                autoAlpha: 1,
                                x: 0,
                                y: 0,
                                scale: 1,
                                stagger: 0.06,
                                duration: 0.34,
                                ease: "power3.out",
                            },
                            "<+=0.08",
                        )
                        .to(
                            neuralInsight,
                            {
                                autoAlpha: 1,
                                x: 0,
                                y: 0,
                                scale: 1,
                                duration: 0.36,
                                ease: "power3.out",
                            },
                            "<+=0.10",
                        )
                        .to(
                            neuralStats,
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.30,
                                ease: "power3.out",
                            },
                            "<+=0.08",
                        )
                        .to(
                            signalRoute,
                            {
                                autoAlpha: 0,
                                duration: 0.16,
                                ease: "none",
                            },
                            ">-0.10",
                        )
                        .to(createHold(), {
                            progress: 1,
                            duration: 0.96,
                            ease: "none",
                        })

                        .addLabel("neural-to-product")
                        .set(signalRoute, {
                            autoAlpha: 0.24,
                        })
                        .to(
                            [neuralInsight, neuralStats],
                            {
                                autoAlpha: 0,
                                y: -14,
                                stagger: 0.035,
                                duration: 0.26,
                                ease: "power2.in",
                            },
                        )
                        .to(
                            neuralNodes,
                            {
                                autoAlpha: 0,
                                scale: 0.96,
                                y: 8,
                                stagger: {
                                    each: 0.035,
                                    from: "end",
                                },
                                duration: 0.28,
                                ease: "power2.in",
                            },
                            "<+=0.02",
                        )
                        .to(
                            neuralNetworkPaths,
                            {
                                strokeDashoffset: 1,
                                stagger: {
                                    each: 0.035,
                                    from: "end",
                                },
                                duration: 0.30,
                                ease: "power2.in",
                            },
                            "<",
                        )
                        .to(
                            neuralNetwork,
                            {
                                autoAlpha: 0,
                                duration: 0.12,
                                ease: "none",
                            },
                            ">-0.08",
                        )
                        .to(
                            neuralCore,
                            {
                                autoAlpha: 0,
                                scale: 0.82,
                                rotation: 2,
                                duration: 0.30,
                                ease: "power2.in",
                            },
                            "<",
                        )
                        .to(
                            "[data-neural-header]",
                            {
                                autoAlpha: 0,
                                y: -16,
                                duration: 0.26,
                                ease: "power2.in",
                            },
                            "<",
                        )
                        .to(
                            scenes[2],
                            {
                                autoAlpha: 0,
                                duration: 0.14,
                                ease: "none",
                            },
                            ">-0.02",
                        )
                        .set(
                            productLayer,
                            {
                                autoAlpha: 1,
                                x: -24,
                                y: 0,
                                scale: 1,
                                clipPath: "inset(0 0 0 100%)",
                            },
                            "<",
                        )
                        .set(
                            scenes[3],
                            {
                                autoAlpha: 1,
                            },
                            "<",
                        )
                        .fromTo(
                            '[data-cinematic-signal-path="convergence"]',
                            {
                                strokeDashoffset: 1,
                            },
                            {
                                strokeDashoffset: 0.18,
                                duration: 0.30,
                                ease: "power2.out",
                            },
                            "<",
                        )
                        .to(
                            productLayer,
                            {
                                x: 0,
                                clipPath: "inset(0 0 0 0%)",
                                duration: 0.42,
                                ease: "power3.out",
                            },
                            "<+=0.04",
                        )

                        .addLabel("product")
                        .to(
                            [
                                '[data-cinematic-element="product-kicker"]',
                                '[data-cinematic-element="product-heading"]',
                            ],
                            {
                                autoAlpha: 1,
                                x: 0,
                                y: 0,
                                stagger: 0.06,
                                duration: 0.34,
                                ease: "power3.out",
                            },
                            "<+=0.08",
                        )
                        .to(
                            "[data-cinematic-product-card]",
                            {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                                stagger: 0.055,
                                duration: 0.34,
                                ease: "power3.out",
                            },
                            "<+=0.06",
                        )
                        .to(
                            [
                                '[data-cinematic-element="product-system"]',
                                '[data-cinematic-element="product-status"]',
                            ],
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.065,
                                duration: 0.30,
                                ease: "power3.out",
                                onStart: playProductProgress,
                                onReverseComplete: resetProductProgress,
                            },
                            "<+=0.04",
                        )
                        .to(
                            '[data-cinematic-element="product-footer"]',
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.24,
                                ease: "power3.out",
                            },
                            "<+=0.03",
                        )
                        .to(
                            signalRoute,
                            {
                                autoAlpha: 0,
                                duration: 0.16,
                                ease: "none",
                            },
                            ">-0.10",
                        )
                        .to(createHold(), {
                            progress: 1,
                            duration: 0.90,
                            ease: "none",
                        })

                        .addLabel("product-deconstruct")
                        .to(
                            '[data-cinematic-element="product-footer"]',
                            {
                                autoAlpha: 0,
                                y: -10,
                                duration: 0.20,
                                ease: "power2.in",
                            },
                        )
                        .to(
                            [
                                '[data-cinematic-element="product-system"]',
                                '[data-cinematic-element="product-status"]',
                            ],
                            {
                                autoAlpha: 0,
                                y: -12,
                                stagger: 0.035,
                                duration: 0.24,
                                ease: "power2.in",
                                onComplete: resetProductProgress,
                                onReverseComplete: playProductProgress,
                            },
                            "<",
                        )
                        .to(
                            "[data-cinematic-product-card]",
                            {
                                autoAlpha: 0,
                                y: -18,
                                scale: 0.985,
                                stagger: {
                                    each: 0.03,
                                    from: "end",
                                },
                                duration: 0.28,
                                ease: "power2.in",
                            },
                            "<+=0.02",
                        )
                        .to(
                            [
                                '[data-cinematic-element="product-kicker"]',
                                '[data-cinematic-element="product-heading"]',
                            ],
                            {
                                autoAlpha: 0,
                                x: -22,
                                duration: 0.26,
                                ease: "power2.in",
                            },
                            "<+=0.04",
                        )

                        .addLabel("product-to-archive-signal")
                        .set(signalRoute, {
                            autoAlpha: 0.34,
                        })
                        .fromTo(
                            '[data-cinematic-signal-path="convergence"]',
                            {
                                strokeDashoffset: 1,
                            },
                            {
                                strokeDashoffset: 0,
                                duration: 0.34,
                                ease: "power2.out",
                            },
                        )
                        .fromTo(
                            veil,
                            {
                                autoAlpha: 0,
                                xPercent: -32,
                            },
                            {
                                autoAlpha: 0.075,
                                xPercent: 32,
                                duration: 0.30,
                                ease: "power2.inOut",
                            },
                            "<",
                        )
                        .set(
                            evidenceInterlude,
                            {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                            },
                            "<+=0.14",
                        )
                        .fromTo(
                            evidenceFrame,
                            {
                                autoAlpha: 0,
                                y: 14,
                                scale: 0.992,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                                duration: 0.32,
                                ease: "power3.out",
                            },
                            "<+=0.03",
                        )
                        .to(
                            scenes[3],
                            {
                                autoAlpha: 0,
                                duration: 0.14,
                                ease: "none",
                            },
                            "<",
                        )
                        .fromTo(
                            evidenceLine,
                            {
                                scaleX: 0,
                            },
                            {
                                scaleX: 1,
                                duration: 0.26,
                                ease: "power2.out",
                            },
                            "<+=0.04",
                        )

                        .addLabel("product-to-archive")
                        .to(createHold(), {
                            progress: 1,
                            duration: 0.34,
                            ease: "none",
                        })
                        .addLabel("product-clean-release")
                        .to(
                            [veil, signalRoute],
                            {
                                autoAlpha: 0,
                                duration: 0.16,
                                ease: "none",
                            },
                        );

                    const timelineDuration = timeline.duration();

                    if (timelineDuration > 0) {
                        craftingSceneProgress =
                            (timeline.labels.crafting ?? 0) /
                            timelineDuration;

                        neuralSceneProgress =
                            (timeline.labels.neural ?? 0) /
                            timelineDuration;

                        productSceneProgress =
                            (timeline.labels.product ?? 0) /
                            timelineDuration;
                    }

                    const trigger = ScrollTrigger.create({
                        trigger: stage,
                        animation: timeline,
                        start: "top top",
                        end: () =>
                            `+=${Math.round(
                                window.innerHeight * 6.2,
                            )}`,
                        scrub: true,
                        pin: true,
                        pinSpacing: true,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                        onUpdate: (self) => {
                            updateScene(self.progress);
                        },
                    });
                    const archiveHeadingElements = [
                        archiveKicker,
                        archiveTitle,
                        archiveIntro,
                    ];

                    const productArchiveHandoffTimeline =
                        gsap.timeline({
                            defaults: {
                                ease: "none",
                            },
                            paused: true,
                        });

                    productArchiveHandoffTimeline
                        .addLabel("archive-handoff")
                        .set(signalRoute, {
                            autoAlpha: 0.36,
                        })
                        .fromTo(
                            '[data-cinematic-signal-path="primary"]',
                            {
                                strokeDashoffset: 1,
                            },
                            {
                                strokeDashoffset: 0.18,
                                duration: 0.42,
                            },
                            "<",
                        )
                        .to(
                            veil,
                            {
                                autoAlpha: 0.075,
                                duration: 0.16,
                            },
                            "<",
                        )
                        .to(
                            evidenceInterlude,
                            {
                                autoAlpha: 0,
                                y: -18,
                                scale: 0.992,
                                duration: 0.46,
                            },
                            "<+=0.04",
                        )
                        .to(
                            '[data-cinematic-signal-path="primary"]',
                            {
                                strokeDashoffset: 0.28,
                                duration: 0.48,
                            },
                            "<",
                        )
                        .to(
                            '[data-cinematic-signal-path="secondary"]',
                            {
                                strokeDashoffset: 0,
                                duration: 0.5,
                            },
                            "<",
                        )
                        .to(
                            [veil, signalRoute],
                            {
                                autoAlpha: 0,
                                duration: 0.2,
                            },
                            "-=0.14",
                        );

                    const archiveEntryTimeline = gsap.timeline({
                        defaults: {
                            ease: "power3.out",
                        },
                        paused: true,
                    });

                    archiveEntryTimeline
                        .addLabel("archive-editorial")
                        .fromTo(
                            archiveKicker,
                            {
                                autoAlpha: 0,
                                x: -18,
                            },
                            {
                                autoAlpha: 1,
                                x: 0,
                                duration: 0.28,
                                immediateRender: false,
                            },
                        )
                        .fromTo(
                            archiveTitle,
                            {
                                autoAlpha: 0,
                                y: 26,
                                clipPath: "inset(0 0 100% 0)",
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                clipPath: "inset(0 0 0% 0)",
                                duration: 0.5,
                                immediateRender: false,
                            },
                            0.04,
                        )
                        .fromTo(
                            archiveIntro,
                            {
                                autoAlpha: 0,
                                x: 24,
                            },
                            {
                                autoAlpha: 1,
                                x: 0,
                                duration: 0.36,
                                immediateRender: false,
                            },
                            0.14,
                        )
                        .fromTo(
                            archiveAlien,
                            {
                                autoAlpha: 0,
                                y: 22,
                                scale: 0.94,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                                duration: 0.48,
                                immediateRender: false,
                            },
                            0.18,
                        )
                        .fromTo(
                            archiveCards,
                            {
                                autoAlpha: 0,
                                x: (index: number) =>
                                    index % 2 === 0 ? -30 : 30,
                                y: 20,
                            },
                            {
                                autoAlpha: 1,
                                x: 0,
                                y: 0,
                                stagger: 0.09,
                                duration: 0.46,
                                immediateRender: false,
                            },
                            0.22,
                        )
                        .fromTo(
                            archiveCardVisuals,
                            {
                                clipPath: "inset(0 0 14% 0)",
                            },
                            {
                                clipPath: "inset(0 0 0% 0)",
                                stagger: 0.07,
                                duration: 0.38,
                                immediateRender: false,
                            },
                            0.28,
                        )
                        .fromTo(
                            archiveCardCopies,
                            {
                                autoAlpha: 0,
                                y: 12,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.055,
                                duration: 0.3,
                                immediateRender: false,
                            },
                            0.34,
                        )
                        .fromTo(
                            archiveCta,
                            {
                                autoAlpha: 0,
                                y: 12,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.28,
                                immediateRender: false,
                            },
                            0.58,
                        )
                        .addLabel("archive-active");

                    const archiveContactHandoffTimeline =
                        gsap.timeline({
                            defaults: {
                                ease: "power2.inOut",
                            },
                            paused: true,
                        });

                    archiveContactHandoffTimeline
                        .addLabel("archive-outro")
                        .set(signalRoute, {
                            autoAlpha: 0.3,
                        })
                        .fromTo(
                            '[data-cinematic-signal-path="convergence"]',
                            {
                                strokeDashoffset: 1,
                            },
                            {
                                strokeDashoffset: 0,
                                duration: 0.42,
                            },
                        )
                        .to(
                            archiveHeadingElements,
                            {
                                autoAlpha: 0.32,
                                x: -14,
                                stagger: 0.025,
                                duration: 0.32,
                            },
                            "<",
                        )
                        .to(
                            archiveCards,
                            {
                                autoAlpha: 0.38,
                                y: -18,
                                stagger: {
                                    each: 0.025,
                                    from: "end",
                                },
                                duration: 0.34,
                            },
                            "<+=0.04",
                        )
                        .addLabel("contact-convergence", 0.2)
                        .fromTo(
                            contactKicker,
                            {
                                autoAlpha: 0,
                                x: -18,
                            },
                            {
                                autoAlpha: 1,
                                x: 0,
                                duration: 0.28,
                                immediateRender: false,
                            },
                            0.2,
                        )
                        .fromTo(
                            contactTitle,
                            {
                                autoAlpha: 0,
                                y: 28,
                                clipPath: "inset(0 0 100% 0)",
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                clipPath: "inset(0 0 0% 0)",
                                duration: 0.5,
                                immediateRender: false,
                            },
                            0.24,
                        )
                        .fromTo(
                            contactStamp,
                            {
                                autoAlpha: 0,
                                scale: 0.84,
                                rotation: -6,
                            },
                            {
                                autoAlpha: 1,
                                scale: 1,
                                rotation: 0,
                                duration: 0.42,
                                immediateRender: false,
                            },
                            0.3,
                        )
                        .fromTo(
                            contactRule,
                            {
                                scaleX: 0,
                            },
                            {
                                scaleX: 1,
                                duration: 0.34,
                                immediateRender: false,
                            },
                            0.34,
                        )
                        .fromTo(
                            contactCopy,
                            {
                                autoAlpha: 0,
                                x: -24,
                            },
                            {
                                autoAlpha: 1,
                                x: 0,
                                duration: 0.46,
                                immediateRender: false,
                            },
                            0.4,
                        )
                        .fromTo(
                            contactVisual,
                            {
                                autoAlpha: 0,
                                y: 18,
                                scale: 0.96,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                scale: 1,
                                duration: 0.4,
                                immediateRender: false,
                            },
                            0.46,
                        )
                        .fromTo(
                            contactFormWrap,
                            {
                                autoAlpha: 0,
                                x: 28,
                                y: 12,
                            },
                            {
                                autoAlpha: 1,
                                x: 0,
                                y: 0,
                                duration: 0.5,
                                immediateRender: false,
                            },
                            0.42,
                        )
                        .fromTo(
                            contactFormVisual,
                            {
                                autoAlpha: 0,
                                x: -18,
                                scale: 0.94,
                            },
                            {
                                autoAlpha: 1,
                                x: 0,
                                scale: 1,
                                duration: 0.38,
                                immediateRender: false,
                            },
                            0.52,
                        )
                        .to(
                            archiveSection,
                            {
                                autoAlpha: 0.14,
                                duration: 0.24,
                            },
                            0.54,
                        )
                        .to(
                            signalRoute,
                            {
                                autoAlpha: 0,
                                duration: 0.18,
                            },
                            0.64,
                        )
                        .addLabel("contact-settled", 0.78);

                    const productArchiveHandoffTrigger =
                        ScrollTrigger.create({
                            trigger: archiveSection,
                            animation:
                            productArchiveHandoffTimeline,
                            start: "top 108%",
                            end: "top 72%",
                            scrub: 0.22,
                            invalidateOnRefresh: true,
                            onUpdate: (self) => {
                                setNavigatorProgress(
                                    0.6 +
                                    self.progress * 0.08,
                                );
                            },
                            onEnter: () => {
                                root.dataset.cinematicActive =
                                    "archive";
                                updateCurrentControl(
                                    navControls,
                                    "archive",
                                );
                                setSignalState("archive");
                            },
                            onEnterBack: () => {
                                root.dataset.cinematicActive =
                                    "archive";
                                updateCurrentControl(
                                    navControls,
                                    "archive",
                                );
                                setSignalState("archive");
                            },
                            onLeaveBack: () => {
                                setActiveScene(
                                    scenes,
                                    3,
                                    navControls,
                                );
                                setSignalState("product");
                                setNavigatorProgress(0.6);
                            },
                        });
                    const archiveEntryTrigger =
                        ScrollTrigger.create({
                            trigger: archiveSection,
                            animation: archiveEntryTimeline,
                            start: "top 96%",
                            end: "top 38%",
                            scrub: true,
                            invalidateOnRefresh: true,
                            onUpdate: (self) => {
                                setNavigatorProgress(
                                    0.68 +
                                    self.progress * 0.12,
                                );
                            },
                            onEnter: () => {
                                setFlowChapter("archive");
                            },
                            onEnterBack: () => {
                                setFlowChapter("archive");
                            },
                            onLeaveBack: () => {
                                setActiveScene(
                                    scenes,
                                    3,
                                    navControls,
                                );
                                setSignalState("product");
                                setNavigatorProgress(0.6);
                            },
                        });
                    const archiveActiveTrigger =
                        ScrollTrigger.create({
                            trigger: archiveSection,
                            start: "top 50%",
                            end: "bottom 54%",
                            invalidateOnRefresh: true,
                            onEnter: () => {
                                setFlowChapter("archive");
                            },
                            onEnterBack: () => {
                                setFlowChapter("archive");
                            },
                        });
                    const archiveContactHandoffTrigger =
                        ScrollTrigger.create({
                            trigger: contactSection,
                            animation:
                            archiveContactHandoffTimeline,
                            start: "top 94%",
                            end: "top 42%",
                            scrub: true,
                            invalidateOnRefresh: true,
                            onUpdate: (self) => {
                                setNavigatorProgress(
                                    0.8 +
                                    self.progress * 0.2,
                                );
                            },
                            onEnter: () => {
                                setSignalState("contact");
                            },
                            onEnterBack: () => {
                                setSignalState("contact");
                            },
                            onLeaveBack: () => {
                                setFlowChapter("archive");
                            },
                        });
                    const contactChapterTrigger =
                        ScrollTrigger.create({
                            trigger: contactSection,
                            start: "top 52%",
                            end: "bottom 42%",
                            invalidateOnRefresh: true,
                            onEnter: () => {
                                setFlowChapter("contact");
                            },
                            onEnterBack: () => {
                                setFlowChapter("contact");
                            },
                            onLeaveBack: () => {
                                setFlowChapter("archive");
                            },
                        });
                    const flowTimelines = [
                        productArchiveHandoffTimeline,
                        archiveEntryTimeline,
                        archiveContactHandoffTimeline,
                    ];
                    const flowTriggers = [
                        productArchiveHandoffTrigger,
                        archiveEntryTrigger,
                        archiveActiveTrigger,
                        archiveContactHandoffTrigger,
                        contactChapterTrigger,
                    ];

                    updateScene(0);

                    const getLabelScroll = (
                        label: CinematicScene,
                    ): number => {
                        const labelTime =
                            timeline.labels[label] ?? 0;
                        const progress =
                            timeline.duration() > 0
                                ? labelTime /
                                timeline.duration()
                                : 0;

                        return (
                            trigger.start +
                            progress *
                            (trigger.end - trigger.start)
                        );
                    };

                    let directedScrollTween:
                        | gsap.core.Tween
                        | null = null;

                    const runDirectedScroll = (
                        targetY: number,
                        onComplete?: () => void,
                    ) => {
                        directedScrollTween?.kill();

                        const scrollState = {
                            y: lenis.scroll,
                        };

                        lenis.stop();

                        directedScrollTween = gsap.to(
                            scrollState,
                            {
                                y: targetY,
                                duration: 0.95,
                                ease: "power3.inOut",
                                overwrite: true,
                                onUpdate: () => {
                                    lenis.scrollTo(
                                        scrollState.y,
                                        {
                                            immediate: true,
                                            force: true,
                                        },
                                    );
                                    ScrollTrigger.update();
                                },
                                onComplete: () => {
                                    lenis.scrollTo(
                                        targetY,
                                        {
                                            immediate: true,
                                            force: true,
                                        },
                                    );
                                    lenis.start();
                                    directedScrollTween =
                                        null;
                                    ScrollTrigger.update();
                                    onComplete?.();
                                },
                                onInterrupt: () => {
                                    lenis.start();
                                    directedScrollTween =
                                        null;
                                },
                            },
                        );
                    };

                    const scrollToTarget = (
                        target: NavigatorTarget,
                    ) => {
                        if (
                            sceneOrder.includes(
                                target as CinematicScene,
                            )
                        ) {
                            const sceneTarget =
                                target as CinematicScene;
                            const sceneIndex =
                                sceneOrder.indexOf(
                                    sceneTarget,
                                );
                            const targetY =
                                sceneTarget === "hero"
                                    ? 0
                                    : getLabelScroll(
                                        sceneTarget,
                                    );

                            runDirectedScroll(
                                targetY,
                                () => {
                                    activeIndex =
                                        Math.max(
                                            0,
                                            sceneIndex,
                                        );
                                    setActiveScene(
                                        scenes,
                                        activeIndex,
                                        navControls,
                                    );
                                    setSignalState(
                                        sceneTarget,
                                    );
                                    setNavigatorProgress(
                                        navigatorProgressByChapter[
                                            sceneTarget
                                            ],
                                    );
                                },
                            );

                            return;
                        }

                        const element =
                            target === "archive"
                                ? archiveSection
                                : contactSection;
                        const headerOffset =
                            Math.round(
                                Number.parseFloat(
                                    getComputedStyle(
                                        root,
                                    ).getPropertyValue(
                                        "--cinematic-header-offset",
                                    ),
                                ) || 76,
                            );
                        const flowTarget =
                            window.scrollY +
                            element.getBoundingClientRect().top -
                            headerOffset;

                        runDirectedScroll(
                            flowTarget,
                            () => {
                                setFlowChapter(
                                    target as FlowSection,
                                );
                            },
                        );
                    };

                    const handleNavigatorClick = (
                        event: Event,
                    ) => {
                        const control = event.currentTarget;

                        if (!(control instanceof HTMLElement)) {
                            return;
                        }

                        const target =
                            control.dataset
                                .cinematicNavTarget as
                                | NavigatorTarget
                                | undefined;

                        if (!target) {
                            return;
                        }

                        scrollToTarget(target);
                    };

                    navControls.forEach((control) => {
                        control.addEventListener(
                            "click",
                            handleNavigatorClick,
                        );
                    });

                    const handleExternalNavigation = (
                        event: Event,
                    ) => {
                        const target = (
                            event as CustomEvent<{
                                target?: string;
                            }>
                        ).detail?.target;

                        if (
                            typeof target !== "string" ||
                            !(target in navigatorProgressByChapter)
                        ) {
                            return;
                        }

                        scrollToTarget(
                            target as NavigatorTarget,
                        );
                    };

                    window.addEventListener(
                        "pixardia:navigate-target",
                        handleExternalNavigation,
                    );

                    const syncHashTarget = () => {
                        if (!window.location.hash) {
                            return;
                        }

                        const target = document.getElementById(
                            decodeURIComponent(
                                window.location.hash.slice(1),
                            ),
                        );

                        if (!target) {
                            return;
                        }

                        if (
                            target.id === "projects" ||
                            target.id === "contact"
                        ) {
                            lenis.scrollTo(target, {
                                immediate: true,
                                offset:
                                    -1 *
                                    Math.round(
                                        Number.parseFloat(
                                            getComputedStyle(
                                                root,
                                            ).getPropertyValue(
                                                "--cinematic-header-offset",
                                            ),
                                        ) || 76,
                                    ),
                            });

                            return;
                        }

                        target.scrollIntoView({
                            block: "start",
                        });
                    };
                    const refresh = () => {
                        ScrollTrigger.refresh();
                        window.requestAnimationFrame(
                            syncHashTarget,
                        );
                    };
                    const timeout = window.setTimeout(
                        refresh,
                        250,
                    );

                    if (document.fonts) {
                        void document.fonts.ready.then(refresh);
                    }

                    window.addEventListener("load", refresh, {
                        once: true,
                    });
                    window.addEventListener(
                        "hashchange",
                        syncHashTarget,
                    );

                    return () => {
                        window.clearTimeout(timeout);
                        window.removeEventListener(
                            "load",
                            refresh,
                        );
                        window.removeEventListener(
                            "hashchange",
                            syncHashTarget,
                        );
                        window.removeEventListener(
                            "pixardia:navigate-target",
                            handleExternalNavigation,
                        );
                        navControls.forEach((control) => {
                            control.removeEventListener(
                                "click",
                                handleNavigatorClick,
                            );
                            control.removeAttribute(
                                "aria-current",
                            );
                        });
                        flowTriggers.forEach((flowTrigger) => {
                            flowTrigger.kill();
                        });
                        flowTimelines.forEach((flowTimeline) => {
                            flowTimeline.kill();
                        });
                        directedScrollTween?.kill();
                        trigger.kill();
                        timeline.kill();
                        productProgressTween?.kill();

                        const runtimeStyledElements = [
                            ...scenes,
                            heroLayer,
                            craftingLayer,
                            neuralLayer,
                            neuralCore,
                            neuralNetwork,
                            ...neuralNetworkPaths,
                            ...neuralNodes,
                            neuralInsight,
                            neuralStats,
                            productLayer,
                            veil,
                            navigator,
                            signalRoute,
                            evidenceInterlude,
                            evidenceFrame,
                            evidenceLine,
                            archiveSection,
                            archiveKicker,
                            archiveTitle,
                            archiveIntro,
                            archiveAlien,
                            archiveCta,
                            ...archiveCards,
                            ...archiveCardVisuals,
                            ...archiveCardCopies,
                            contactSection,
                            contactKicker,
                            contactTitle,
                            contactStamp,
                            contactRule,
                            contactCopy,
                            contactVisual,
                            contactFormWrap,
                            contactFormVisual,
                            ...signalPaths,
                            ...selectAll<Element>(
                                stage,
                                "[data-cinematic-element]",
                            ),
                        ];

                        gsap.set(
                            runtimeStyledElements,
                            {
                                clearProps:
                                    "transform,opacity,visibility,clipPath",
                            },
                        );

                        document.removeEventListener(
                            "pixardia:project-modal-lock",
                            handleProjectModalLock,
                        );
                        document.removeEventListener(
                            "pixardia:project-modal-unlock",
                            handleProjectModalUnlock,
                        );
                        gsap.ticker.remove(tickLenis);
                        lenis.off("scroll", ScrollTrigger.update);
                        lenis.destroy();
                        root.removeAttribute(
                            "data-cinematic-runtime",
                        );
                        root.style.removeProperty(
                            "--cinematic-progress",
                        );
                        delete stage.dataset.cinematicMode;
                        clearSceneState(scenes);
                    };
                },
            );

            return () => {
                mm.revert();
            };
        },
        [],
    );

    return (
        <div
            ref={rootRef}
            className="cinematic-runtime"
            aria-hidden="false"
        >
            <SignalRoute />
            <EvidenceInterlude />
            <TransitionVeil />
            <SceneNavigator />
        </div>
    );
}
