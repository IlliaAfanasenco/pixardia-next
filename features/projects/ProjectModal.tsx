"use client";

import {
    type MouseEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { useRouter } from "next/navigation";

import {
    gsap,
    useGSAP,
} from "@/lib/motion/gsap";
import {
    motionTokens,
} from "@/lib/motion/tokens";

type ProjectModalProps = {
    children: ReactNode;
    titleId: string;
    summaryId: string;
    triggerId: string;
};

type BackgroundElementState = {
    element: HTMLElement;
    hadInert: boolean;
    ariaHidden: string | null;
};

type ModalPhase =
    | "opening"
    | "open"
    | "closing";

const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
].join(",");

function getFocusableElements(
    container: HTMLElement,
): HTMLElement[] {
    return Array.from(
        container.querySelectorAll<HTMLElement>(
            focusableSelector,
        ),
    ).filter(
        (element) =>
            element.getClientRects().length > 0 &&
            element.getAttribute("aria-hidden") !== "true",
    );
}

function getPanelChildren(
    panel: HTMLElement | null,
): HTMLElement[] {
    if (!panel) {
        return [];
    }

    return Array.from(panel.children).filter(
        (child): child is HTMLElement =>
            child instanceof HTMLElement,
    );
}

export default function ProjectModal({
                                         children,
                                         titleId,
                                         summaryId,
                                         triggerId,
                                     }: ProjectModalProps) {
    const router = useRouter();

    const modalRootRef =
        useRef<HTMLDivElement | null>(null);

    const dialogRef =
        useRef<HTMLDivElement | null>(null);

    const backdropRef =
        useRef<HTMLDivElement | null>(null);

    const railRef =
        useRef<HTMLDivElement | null>(null);

    const closeButtonRef =
        useRef<HTMLButtonElement | null>(null);

    const triggerRef =
        useRef<HTMLElement | null>(null);

    const openingTimelineRef =
        useRef<gsap.core.Timeline | null>(null);

    const closingTimelineRef =
        useRef<gsap.core.Timeline | null>(null);

    const closingRef = useRef(false);
    const navigationCommittedRef = useRef(false);
    const reduceMotionRef = useRef(false);
    const returnHrefRef = useRef("/");
    const releaseEnvironmentRef =
        useRef<(() => void) | null>(null);

    const [phase, setPhase] =
        useState<ModalPhase>("opening");

    const commitClose = useCallback(() => {
        if (navigationCommittedRef.current) {
            return;
        }

        navigationCommittedRef.current = true;

        releaseEnvironmentRef.current?.();

        const modalRoot = modalRootRef.current;

        if (modalRoot) {
            modalRoot.style.pointerEvents = "none";
            modalRoot.setAttribute(
                "aria-hidden",
                "true",
            );
        }

        router.replace(returnHrefRef.current, {
            scroll: false,
        });
    }, [router]);

    const closeModal = useCallback(() => {
        if (closingRef.current) {
            return;
        }

        closingRef.current = true;
        setPhase("closing");

        if (reduceMotionRef.current) {
            commitClose();

            return;
        }

        openingTimelineRef.current?.kill();
        closingTimelineRef.current?.kill();

        const dialog = dialogRef.current;
        const backdrop = backdropRef.current;
        const rail = railRef.current;

        const leftPanel =
            dialog?.querySelector<HTMLElement>(
                '[data-project-modal-panel="left"]',
            ) ?? null;

        const rightPanel =
            dialog?.querySelector<HTMLElement>(
                '[data-project-modal-panel="right"]',
            ) ?? null;

        const content =
            dialog?.querySelector<HTMLElement>(
                "[data-project-modal-content]",
            ) ?? null;

        if (
            !dialog ||
            !backdrop ||
            !leftPanel ||
            !rightPanel
        ) {
            commitClose();

            return;
        }

        const leftChildren =
            getPanelChildren(leftPanel);

        const rightChildren =
            getPanelChildren(rightPanel);

        closingTimelineRef.current = gsap
            .timeline({
                onComplete: () => {
                    commitClose();
                },
            })
            .to(
                [
                    ...leftChildren,
                    ...rightChildren,
                ],
                {
                    autoAlpha: 0,
                    y: 10,
                    duration:
                    motionTokens.duration.contentOut,
                    stagger:
                    motionTokens.stagger.exit,
                    ease: "power2.in",
                },
                0,
            )
            .to(
                rail,
                {
                    autoAlpha: 0,
                    scale: 0.96,
                    duration:
                    motionTokens.duration.railOut,
                    ease: "power2.in",
                },
                0,
            )
            .to(
                leftPanel,
                {
                    xPercent: -104,
                    duration:
                    motionTokens.duration.curtainOut,
                    ease: motionTokens.ease.exit,
                },
                0.08,
            )
            .to(
                rightPanel,
                {
                    xPercent: 104,
                    duration:
                    motionTokens.duration.curtainOut,
                    ease: motionTokens.ease.exit,
                },
                0.08,
            )
            .to(
                backdrop,
                {
                    autoAlpha: 0,
                    duration: 0.34,
                    ease: "power2.inOut",
                },
                0.24,
            );

        if (content) {
            closingTimelineRef.current.to(
                content,
                {
                    scale: 0.995,
                    duration: 0.28,
                    ease: "power2.in",
                },
                0,
            );
        }
    }, [commitClose]);

    useGSAP(
        () => {
            const dialog = dialogRef.current;
            const backdrop = backdropRef.current;
            const rail = railRef.current;

            if (!dialog || !backdrop || !rail) {
                return;
            }

            const reduceMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;

            reduceMotionRef.current = reduceMotion;

            const leftPanel =
                dialog.querySelector<HTMLElement>(
                    '[data-project-modal-panel="left"]',
                );

            const rightPanel =
                dialog.querySelector<HTMLElement>(
                    '[data-project-modal-panel="right"]',
                );

            const content =
                dialog.querySelector<HTMLElement>(
                    "[data-project-modal-content]",
                );

            if (!leftPanel || !rightPanel || !content) {
                gsap.set(
                    [backdrop, rail, content],
                    {
                        autoAlpha: 1,
                    },
                );

                setPhase("open");

                return;
            }

            const leftChildren =
                getPanelChildren(leftPanel);

            const rightChildren =
                getPanelChildren(rightPanel);

            if (reduceMotion) {
                gsap.set(
                    [
                        backdrop,
                        leftPanel,
                        rightPanel,
                        rail,
                        ...leftChildren,
                        ...rightChildren,
                    ],
                    {
                        autoAlpha: 1,
                        xPercent: 0,
                        y: 0,
                        scale: 1,
                    },
                );

                setPhase("open");

                return;
            }

            gsap.set(backdrop, {
                autoAlpha: 0,
            });

            gsap.set(leftPanel, {
                xPercent: -104,
                force3D: true,
            });

            gsap.set(rightPanel, {
                xPercent: 104,
                force3D: true,
            });

            gsap.set(
                [
                    ...leftChildren,
                    ...rightChildren,
                ],
                {
                    autoAlpha: 0,
                    y: 22,
                },
            );

            gsap.set(rail, {
                autoAlpha: 0,
                scale: 0.94,
                transformOrigin: "50% 50%",
            });

            openingTimelineRef.current = gsap
                .timeline({
                    onComplete: () => {
                        setPhase("open");
                    },
                })
                .to(
                    backdrop,
                    {
                        autoAlpha: 1,
                        duration:
                        motionTokens.duration.backdropIn,
                        ease: "power2.out",
                    },
                    0,
                )
                .to(
                    leftPanel,
                    {
                        xPercent: 0,
                        duration:
                        motionTokens.duration.curtainIn,
                        ease: motionTokens.ease.curtain,
                    },
                    0.04,
                )
                .to(
                    rightPanel,
                    {
                        xPercent: 0,
                        duration:
                        motionTokens.duration.curtainIn,
                        ease: motionTokens.ease.curtain,
                    },
                    0.04,
                )
                .to(
                    rail,
                    {
                        autoAlpha: 1,
                        scale: 1,
                        duration:
                        motionTokens.duration.railIn,
                        ease: motionTokens.ease.enter,
                    },
                    0.48,
                )
                .to(
                    leftChildren,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration:
                        motionTokens.duration.contentIn,
                        stagger:
                        motionTokens.stagger.content,
                        ease: motionTokens.ease.reveal,
                    },
                    0.54,
                )
                .to(
                    rightChildren,
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration:
                        motionTokens.duration.contentIn,
                        stagger:
                        motionTokens.stagger.content,
                        ease: motionTokens.ease.reveal,
                    },
                    0.6,
                );
        },
        {
            scope: modalRootRef,
        },
    );

    useEffect(() => {
        const currentDialog =
            dialogRef.current;

        const body = document.body;
        const root = document.documentElement;

        if (!currentDialog) {
            return;
        }

        const dialog: HTMLDivElement =
            currentDialog;

        const trigger =
            document.getElementById(triggerId);

        triggerRef.current =
            trigger instanceof HTMLElement
                ? trigger
                : document.activeElement instanceof HTMLElement
                    ? document.activeElement
                    : null;

        returnHrefRef.current =
            trigger instanceof HTMLElement
                ? "/"
                : "/projects";

        const scrollY = window.scrollY;
        const scrollbarWidth =
            window.innerWidth -
            document.documentElement.clientWidth;
        const preserveCinematicScroll =
            root.dataset.cinematicRuntime === "ready";
        const previousModalOpen =
            root.dataset.projectModalOpen;

        const previousRootStyles = {
            overflow: root.style.overflow,
            overscrollBehavior:
            root.style.overscrollBehavior,
        };

        const previousBodyStyles = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
            overflow: body.style.overflow,
            paddingRight: body.style.paddingRight,
            overscrollBehavior:
            body.style.overscrollBehavior,
            touchAction:
            body.style.touchAction,
        };

        const siteShell =
            document.querySelector<HTMLElement>(
                "[data-site-shell]",
            );

        const backgroundElements: HTMLElement[] =
            siteShell ? [siteShell] : [];

        const backgroundStates:
            BackgroundElementState[] =
            backgroundElements.map((element) => ({
                element,
                hadInert:
                    element.hasAttribute("inert"),
                ariaHidden:
                    element.getAttribute("aria-hidden"),
            }));

        let released = false;
        let focusFrame = 0;

        const preventDesktopScroll = (
            event: Event,
        ): void => {
            if (event.cancelable) {
                event.preventDefault();
            }
        };

        const restoreFocus = (): void => {
            const focusTarget =
                triggerRef.current;

            window.requestAnimationFrame(() => {
                if (focusTarget?.isConnected) {
                    focusTarget.focus({
                        preventScroll: true,
                    });
                }
            });
        };

        const releaseEnvironment = (): void => {
            if (released) {
                return;
            }

            released = true;

            window.cancelAnimationFrame(focusFrame);

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            if (preserveCinematicScroll) {
                document.removeEventListener(
                    "wheel",
                    preventDesktopScroll,
                    true,
                );
                document.removeEventListener(
                    "touchmove",
                    preventDesktopScroll,
                    true,
                );
            }

            for (const state of backgroundStates) {
                if (!state.hadInert) {
                    state.element.removeAttribute(
                        "inert",
                    );
                }

                if (state.ariaHidden === null) {
                    state.element.removeAttribute(
                        "aria-hidden",
                    );
                } else {
                    state.element.setAttribute(
                        "aria-hidden",
                        state.ariaHidden,
                    );
                }
            }

            if (previousModalOpen === undefined) {
                delete root.dataset.projectModalOpen;
            } else {
                root.dataset.projectModalOpen =
                    previousModalOpen;
            }

            root.style.overflow =
                previousRootStyles.overflow;
            root.style.overscrollBehavior =
                previousRootStyles.overscrollBehavior;

            body.style.position =
                previousBodyStyles.position;
            body.style.top =
                previousBodyStyles.top;
            body.style.left =
                previousBodyStyles.left;
            body.style.right =
                previousBodyStyles.right;
            body.style.width =
                previousBodyStyles.width;
            body.style.overflow =
                previousBodyStyles.overflow;
            body.style.paddingRight =
                previousBodyStyles.paddingRight;
            body.style.overscrollBehavior =
                previousBodyStyles.overscrollBehavior;
            body.style.touchAction =
                previousBodyStyles.touchAction;

            window.scrollTo({
                top: scrollY,
                left: 0,
                behavior: "auto",
            });

            document.dispatchEvent(
                new Event("pixardia:project-modal-unlock"),
            );

            restoreFocus();

            if (
                releaseEnvironmentRef.current ===
                releaseEnvironment
            ) {
                releaseEnvironmentRef.current = null;
            }
        };

        function handleKeyDown(
            event: KeyboardEvent,
        ): void {
            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();

                return;
            }

            if (
                preserveCinematicScroll &&
                [
                    "ArrowDown",
                    "ArrowUp",
                    "End",
                    "Home",
                    "PageDown",
                    "PageUp",
                    " ",
                    "Spacebar",
                ].includes(event.key)
            ) {
                event.preventDefault();

                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusableElements =
                getFocusableElements(dialog);

            if (focusableElements.length === 0) {
                event.preventDefault();
                closeButtonRef.current?.focus();

                return;
            }

            const firstElement =
                focusableElements[0];

            const lastElement =
                focusableElements[
                focusableElements.length - 1
                    ];

            const activeElement =
                document.activeElement;

            const focusIsOutside =
                !(activeElement instanceof Node) ||
                !dialog.contains(activeElement);

            if (
                event.shiftKey &&
                (activeElement === firstElement ||
                    focusIsOutside)
            ) {
                event.preventDefault();
                lastElement.focus();

                return;
            }

            if (
                !event.shiftKey &&
                (activeElement === lastElement ||
                    focusIsOutside)
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        releaseEnvironmentRef.current =
            releaseEnvironment;

        root.dataset.projectModalOpen = "true";
        root.style.overflow = "hidden";
        root.style.overscrollBehavior = "none";

        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        body.style.overflow = "hidden";
        body.style.overscrollBehavior = "none";

        if (preserveCinematicScroll) {
            body.style.touchAction = "none";

            document.addEventListener(
                "wheel",
                preventDesktopScroll,
                {
                    capture: true,
                    passive: false,
                },
            );
            document.addEventListener(
                "touchmove",
                preventDesktopScroll,
                {
                    capture: true,
                    passive: false,
                },
            );
        }

        if (scrollbarWidth > 0) {
            body.style.paddingRight =
                `${scrollbarWidth}px`;
        }

        document.dispatchEvent(
            new Event("pixardia:project-modal-lock"),
        );

        for (const state of backgroundStates) {
            state.element.setAttribute("inert", "");
            state.element.setAttribute(
                "aria-hidden",
                "true",
            );
        }

        focusFrame =
            window.requestAnimationFrame(() => {
                closeButtonRef.current?.focus({
                    preventScroll: true,
                });
            });

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            openingTimelineRef.current?.kill();
            closingTimelineRef.current?.kill();

            releaseEnvironment();
        };
    }, [
        closeModal,
        triggerId,
    ]);

    function handleOverlayMouseDown(
        event: MouseEvent<HTMLDivElement>,
    ): void {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    return (
        <div
            ref={modalRootRef}
            className="fixed inset-0 isolate z-[200] overflow-hidden overscroll-contain"
            onMouseDown={handleOverlayMouseDown}
            data-project-modal-state={phase}
        >
            <div
                ref={backdropRef}
                className="pointer-events-none absolute inset-0 bg-black/25 backdrop-blur-[18px]"
                aria-hidden="true"
                data-project-modal-backdrop=""
            />

            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={summaryId}
                tabIndex={-1}
                className="relative h-dvh w-full min-w-0 overflow-hidden focus:outline-none"
            >
                <div
                    className="h-full w-full"
                    data-project-modal-content=""
                >
                    {children}
                </div>

                <div
                    ref={railRef}
                    className="pointer-events-none fixed right-[max(16px,env(safe-area-inset-right))] top-[max(16px,env(safe-area-inset-top))] z-20 flex items-center md:left-1/2 md:right-auto md:top-1/2 md:w-[clamp(132px,8.5vw,180px)] md:-translate-x-1/2 md:-translate-y-1/2 md:flex-col"
                    data-project-modal-rail=""
                >
                    <span
                        className="hidden h-[clamp(40px,10vh,110px)] w-px bg-[#BFC0C4] md:block"
                        aria-hidden="true"
                    />

                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Close project dialog"
                        onClick={closeModal}
                        className="pointer-events-auto inline-flex min-h-11 w-full min-w-[116px] items-center justify-center border border-black bg-black px-4 text-[11px] md:w-[calc(100%_-_32px)] md:max-w-[140px] font-black uppercase tracking-[0.04em] text-white transition-colors hover:bg-[#5E56E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7] md:my-7 md:min-w-0"
                    >
                        Exit system
                    </button>

                    <span
                        className="hidden h-[clamp(40px,10vh,110px)] w-px bg-[#BFC0C4] md:block"
                        aria-hidden="true"
                    />

                    <span className="mt-6 hidden whitespace-nowrap text-[9px] font-black uppercase tracking-[0.06em] text-white/55 md:block">
                        Safe mode active
                    </span>
                </div>
            </div>
        </div>
    );
}
