"use client";

import {
    type MouseEvent,
    type ReactNode,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { useRouter } from "next/navigation";

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

export default function ProjectModal({
                                         children,
                                         titleId,
                                         summaryId,
                                         triggerId,
                                     }: ProjectModalProps) {
    const router = useRouter();

    const dialogRef =
        useRef<HTMLDivElement | null>(null);

    const closeButtonRef =
        useRef<HTMLButtonElement | null>(null);

    const triggerRef =
        useRef<HTMLElement | null>(null);

    const closingRef = useRef(false);

    const closeModal = useCallback(() => {
        if (closingRef.current) {
            return;
        }

        closingRef.current = true;
        router.back();
    }, [router]);

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

        const scrollY = window.scrollY;
        const scrollbarWidth =
            window.innerWidth -
            document.documentElement.clientWidth;
        const preserveCinematicScroll =
            root.dataset.cinematicRuntime === "ready";
        const previousModalOpen =
            root.dataset.projectModalOpen;
        const previousRootOverflow =
            root.style.overflow;

        root.dataset.projectModalOpen = "true";

        const previousBodyStyles = {
            position: body.style.position,
            top: body.style.top,
            left: body.style.left,
            right: body.style.right,
            width: body.style.width,
            overflow: body.style.overflow,
            paddingRight: body.style.paddingRight,
        };

        if (preserveCinematicScroll) {
            root.style.overflow = "hidden";
            body.style.overflow = "hidden";
        } else {
            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
            body.style.overflow = "hidden";
        }

        if (scrollbarWidth > 0) {
            body.style.paddingRight =
                `${scrollbarWidth}px`;
        }

        const siteShell =
            document.querySelector<HTMLElement>(
                "[data-site-shell]",
            );

        const backgroundElements:
            HTMLElement[] =
            siteShell
                ? [siteShell]
                : [];

        const backgroundStates:
            BackgroundElementState[] =
            backgroundElements.map((element) => ({
                element,
                hadInert:
                    element.hasAttribute("inert"),
                ariaHidden:
                    element.getAttribute("aria-hidden"),
            }));

        for (const state of backgroundStates) {
            state.element.setAttribute("inert", "");
            state.element.setAttribute(
                "aria-hidden",
                "true",
            );
        }

        const focusFrame =
            window.requestAnimationFrame(() => {
                closeButtonRef.current?.focus({
                    preventScroll: true,
                });
            });

        function handleKeyDown(
            event: KeyboardEvent,
        ): void {
            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();

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

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.cancelAnimationFrame(
                focusFrame,
            );

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

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
                previousRootOverflow;

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

            if (!preserveCinematicScroll) {
                window.scrollTo({
                    top: scrollY,
                    left: 0,
                    behavior: "auto",
                });
            }

            const focusTarget =
                triggerRef.current;

            window.requestAnimationFrame(() => {
                if (
                    focusTarget?.isConnected
                ) {
                    focusTarget.focus({
                        preventScroll: true,
                    });
                }
            });
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
            className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain bg-black/70 sm:p-6"
            onMouseDown={handleOverlayMouseDown}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={summaryId}
                tabIndex={-1}
                className="relative min-h-dvh w-full min-w-0 bg-white shadow-2xl sm:mx-auto sm:min-h-0 sm:max-w-5xl sm:border sm:border-[#1E1E1E]"
            >
                <div className="sticky top-0 z-10 flex justify-end border-b border-[#1E1E1E] bg-white px-5 py-4 sm:px-8">
                    <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Close project dialog"
                        onClick={closeModal}
                        className="inline-flex min-h-11 items-center justify-center border border-[#1E1E1E] px-5 text-sm font-bold uppercase tracking-[0.05em] text-[#1E1E1E] transition-colors hover:bg-[#1E1E1E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7]"
                    >
                        Close
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
