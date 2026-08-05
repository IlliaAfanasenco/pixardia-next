"use client";

import {
    useEffect,
    useRef,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SceneNavigator from "@/components/presentation/SceneNavigator";
import SignalRoute from "@/components/presentation/SignalRoute";
import TransitionVeil from "@/components/presentation/TransitionVeil";

gsap.registerPlugin(ScrollTrigger);

const sceneOrder = [
    "hero",
    "crafting",
    "product",
] as const;
const cinematicDesktopQuery =
    "(min-width: 1200px) and (min-height: 800px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type CinematicScene = (typeof sceneOrder)[number];
type FlowSection = "archive" | "contact";
type NavigatorTarget = CinematicScene | FlowSection;

const navigatorProgressByChapter: Record<
    NavigatorTarget,
    number
> = {
    hero: 0,
    crafting: 0.25,
    product: 0.5,
    archive: 0.75,
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
                    const heroLayer = select<HTMLElement>(
                        stage,
                        '[data-cinematic-scene="hero"] [data-cinematic-layer]',
                    );
                    const craftingLayer = select<HTMLElement>(
                        stage,
                        '[data-cinematic-scene="crafting"] [data-cinematic-layer]',
                    );
                    const productLayer = select<HTMLElement>(
                        stage,
                        '[data-cinematic-scene="product"] [data-cinematic-layer]',
                    );

                    if (
                        !veil ||
                        !navigator ||
                        !navigatorFill ||
                        !signalRoute ||
                        !archiveSection ||
                        !contactSection ||
                        !heroLayer ||
                        !craftingLayer ||
                        !productLayer
                    ) {
                        clearSceneState(scenes);

                        return;
                    }

                    let activeIndex = -1;
                    let craftingSceneProgress = 0.34;
                    let productSceneProgress = 0.68;
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
                        const nextIndex =
                            progress < craftingSceneProgress
                                ? 0
                                : progress < productSceneProgress
                                  ? 1
                                  : 2;

                        setNavigatorProgress(progress * 0.5);

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
                        lerp: 0.12,
                        smoothWheel: true,
                        touchMultiplier: 1,
                        wheelMultiplier: 0.9,
                        autoToggle: true,
                    });
                    const tickLenis = (time: number) => {
                        lenis.raf(time * 1000);
                    };

                    lenis.on("scroll", ScrollTrigger.update);
                    gsap.ticker.add(tickLenis);
                    gsap.ticker.lagSmoothing(0);

                    gsap.set(scenes, {
                        autoAlpha: 0,
                    });
                    gsap.set(scenes[0], {
                        autoAlpha: 1,
                    });
                    gsap.set([craftingLayer, productLayer], {
                        y: 72,
                        clipPath: "inset(10% 0% 0% 0%)",
                    });
                    gsap.set(veil, {
                        autoAlpha: 0,
                    });
                    gsap.set(navigator, {
                        autoAlpha: 1,
                    });
                    gsap.set(signalRoute, {
                        autoAlpha: 0,
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
                    const timeline = gsap.timeline({
                        defaults: {
                            duration: 0.68,
                            ease: "none",
                        },
                    });
                    const createHold = () => ({ progress: 0 });

                    timeline
                        .addLabel("hero")
                        .to(createHold(), {
                            progress: 1,
                            duration: 1.28,
                        })
                        .addLabel("hero-to-crafting")
                        .set(signalRoute, {
                            autoAlpha: 0.42,
                        })
                        .fromTo(
                            '[data-cinematic-signal-path="primary"]',
                            {
                                strokeDashoffset: 1,
                            },
                            {
                                strokeDashoffset: 0,
                                duration: 0.46,
                            },
                            "<",
                        )
                        .to(
                            veil,
                            {
                                autoAlpha: 0.09,
                                duration: 0.1,
                            },
                            "<",
                        )
                        .to(
                            heroLayer,
                            {
                                autoAlpha: 0,
                                yPercent: -5,
                                scale: 0.982,
                            },
                            "<",
                        )
                        .to(
                            '[data-cinematic-element="hero-character"]',
                            {
                                y: -58,
                                scale: 0.94,
                                duration: 0.46,
                            },
                            "<",
                        )
                        .set(scenes[1], { autoAlpha: 1 }, "<")
                        .fromTo(
                            craftingLayer,
                            {
                                autoAlpha: 0,
                                y: 58,
                                clipPath: "inset(7% 0% 0% 0%)",
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                clipPath: "inset(0% 0% 0% 0%)",
                            },
                            "<+=0.08",
                        )
                        .to(
                            [veil, signalRoute],
                            {
                                autoAlpha: 0,
                                duration: 0.16,
                            },
                            "-=0.16",
                        )
                        .addLabel("crafting")
                        .fromTo(
                            [
                                '[data-cinematic-element="crafting-copy"]',
                                '[data-cinematic-element="crafting-card"]',
                                '[data-cinematic-element="crafting-terminal"]',
                            ],
                            {
                                autoAlpha: 0,
                                y: 34,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.16,
                            },
                            "<",
                        )
                        .to(createHold(), {
                            progress: 1,
                            duration: 0.72,
                        })
                        .addLabel("crafting-to-product")
                        .set(signalRoute, {
                            autoAlpha: 0.4,
                        })
                        .fromTo(
                            '[data-cinematic-signal-path="secondary"]',
                            {
                                strokeDashoffset: 1,
                            },
                            {
                                strokeDashoffset: 0,
                                duration: 0.44,
                            },
                            "<",
                        )
                        .to(
                            veil,
                            {
                                autoAlpha: 0.09,
                                duration: 0.1,
                            },
                            "<",
                        )
                        .to(
                            craftingLayer,
                            {
                                autoAlpha: 0,
                                yPercent: -4,
                                scale: 0.986,
                            },
                            "<",
                        )
                        .set(scenes[2], { autoAlpha: 1 }, "<")
                        .fromTo(
                            productLayer,
                            {
                                autoAlpha: 0,
                                y: 56,
                                clipPath: "inset(7% 0% 0% 0%)",
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                clipPath: "inset(0% 0% 0% 0%)",
                            },
                            "<+=0.08",
                        )
                        .to(
                            [veil, signalRoute],
                            {
                                autoAlpha: 0,
                                duration: 0.16,
                            },
                            "-=0.16",
                        )
                        .addLabel("product")
                        .fromTo(
                            [
                                '[data-cinematic-element="product-kicker"]',
                                '[data-cinematic-element="product-heading"]',
                            ],
                            {
                                autoAlpha: 0,
                                y: 28,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.12,
                            },
                            "<",
                        )
                        .fromTo(
                            "[data-cinematic-product-card]",
                            {
                                autoAlpha: 0,
                                y: 38,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.08,
                            },
                            "-=0.18",
                        )
                        .fromTo(
                            [
                                '[data-cinematic-element="product-system"]',
                                '[data-cinematic-element="product-status"]',
                            ],
                            {
                                autoAlpha: 0,
                                y: 28,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.12,
                            },
                            "-=0.06",
                        )
                        .to(
                            '[data-cinematic-signal-path="secondary"]',
                            {
                                strokeDashoffset: 0,
                                duration: 0.84,
                            },
                            "<",
                        )
                        .to(createHold(), {
                            progress: 1,
                            duration: 0.8,
                        })
                        .addLabel("product-deconstruct")
                        .to(createHold(), {
                            progress: 1,
                            duration: 0.24,
                        })
                        .addLabel("product-to-archive-signal")
                        .to(
                            '[data-cinematic-signal-path="secondary"]',
                            {
                                strokeDashoffset: 0.12,
                                duration: 0.24,
                            },
                        )
                        .addLabel("product-to-archive")
                        .to(createHold(), {
                            progress: 1,
                            duration: 0.22,
                        })
                        .addLabel("product-clean-release")
                        .to(createHold(), {
                            progress: 1,
                            duration: 0.18,
                        });

                    const timelineDuration = timeline.duration();

                    if (timelineDuration > 0) {
                        craftingSceneProgress =
                            (timeline.labels.crafting ?? 0) /
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
                                window.innerHeight * 3.8,
                            )}`,
                        scrub: 0.18,
                        pin: true,
                        pinSpacing: true,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                        onUpdate: (self) => {
                            updateScene(self.progress);
                        },
                    });
                    const archiveHeadingElements =
                        selectAll<HTMLElement>(
                            archiveSection,
                            "p, h2",
                        );
                    const archiveCards =
                        selectAll<HTMLElement>(
                            archiveSection,
                            "article",
                        );
                    const contactHeadingElements =
                        selectAll<HTMLElement>(
                            contactSection,
                            "p, h2",
                        );
                    const contactInner =
                        contactSection.firstElementChild instanceof
                        HTMLElement
                            ? contactSection.firstElementChild
                            : contactSection;

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
                            productLayer,
                            {
                                autoAlpha: 0.08,
                                yPercent: -3,
                                scale: 0.99,
                                duration: 0.46,
                            },
                            "<",
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
                            ease: "none",
                        },
                        paused: true,
                    });

                    archiveEntryTimeline
                        .addLabel("archive-entry")
                        .fromTo(
                            archiveSection,
                            {
                                autoAlpha: 0.78,
                                y: 46,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.62,
                                immediateRender: false,
                            },
                        )
                        .fromTo(
                            archiveHeadingElements,
                            {
                                autoAlpha: 0.72,
                                y: 26,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.06,
                                duration: 0.42,
                                immediateRender: false,
                            },
                            "<",
                        )
                        .fromTo(
                            archiveCards,
                            {
                                autoAlpha: 0.88,
                                y: 24,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.08,
                                duration: 0.46,
                                immediateRender: false,
                            },
                            0.16,
                        )
                        .addLabel("archive-active");

                    const archiveContactHandoffTimeline =
                        gsap.timeline({
                            defaults: {
                                ease: "none",
                            },
                            paused: true,
                        });

                    archiveContactHandoffTimeline
                        .addLabel("archive-outro")
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
                                duration: 0.46,
                            },
                            "<",
                        )
                        .to(
                            veil,
                            {
                                autoAlpha: 0.07,
                                duration: 0.16,
                            },
                            "<",
                        )
                        .to(
                            archiveSection,
                            {
                                autoAlpha: 0.8,
                                y: -22,
                                duration: 0.46,
                            },
                            "<",
                        )
                        .addLabel("contact-entry")
                        .fromTo(
                            contactInner,
                            {
                                autoAlpha: 0.72,
                                y: 54,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.54,
                                immediateRender: false,
                            },
                            0.26,
                        )
                        .fromTo(
                            contactHeadingElements,
                            {
                                autoAlpha: 0.76,
                                y: 24,
                            },
                            {
                                autoAlpha: 1,
                                y: 0,
                                stagger: 0.06,
                                duration: 0.42,
                                immediateRender: false,
                            },
                            0.3,
                        )
                        .to(
                            [veil, signalRoute],
                            {
                                autoAlpha: 0,
                                duration: 0.22,
                            },
                            "-=0.1",
                        )
                        .addLabel("contact-settled");

                    const productArchiveHandoffTrigger =
                        ScrollTrigger.create({
                            trigger: archiveSection,
                            animation:
                                productArchiveHandoffTimeline,
                            start: "top 102%",
                            end: "top 76%",
                            scrub: 0.22,
                            invalidateOnRefresh: true,
                            onUpdate: (self) => {
                                setNavigatorProgress(
                                    0.5 +
                                        self.progress * 0.12,
                                );
                            },
                            onEnter: () => {
                                setSignalState("archive");
                            },
                            onEnterBack: () => {
                                setSignalState("archive");
                            },
                            onLeaveBack: () => {
                                setActiveScene(
                                    scenes,
                                    2,
                                    navControls,
                                );
                                setSignalState("product");
                                setNavigatorProgress(0.5);
                            },
                        });
                    const archiveEntryTrigger =
                        ScrollTrigger.create({
                            trigger: archiveSection,
                            animation: archiveEntryTimeline,
                            start: "top 92%",
                            end: "top 42%",
                            scrub: 0.24,
                            invalidateOnRefresh: true,
                            onUpdate: (self) => {
                                setNavigatorProgress(
                                    0.62 +
                                        self.progress * 0.13,
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
                                    2,
                                    navControls,
                                );
                                setSignalState("product");
                                setNavigatorProgress(0.5);
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
                            start: "top 96%",
                            end: "top 46%",
                            scrub: 0.22,
                            invalidateOnRefresh: true,
                            onUpdate: (self) => {
                                setNavigatorProgress(
                                    0.75 +
                                        self.progress * 0.25,
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

                    const scrollToTarget = (
                        target: NavigatorTarget,
                    ) => {
                        if (sceneOrder.includes(target as CinematicScene)) {
                            lenis.scrollTo(
                                getLabelScroll(
                                    target as CinematicScene,
                                ),
                                {
                                    immediate: false,
                                    lock: false,
                                },
                            );

                            return;
                        }

                        const elementId =
                            target === "archive"
                                ? "projects"
                                : "contact";
                        const element =
                            document.getElementById(elementId);

                        if (!element) {
                            return;
                        }

                        lenis.scrollTo(element, {
                            immediate: false,
                            lock: false,
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
                        trigger.kill();
                        timeline.kill();
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
            <TransitionVeil />
            <SceneNavigator />
        </div>
    );
}
