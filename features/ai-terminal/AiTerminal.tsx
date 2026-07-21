"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";

import {
    type TerminalUiMessage,
} from "@/features/ai-terminal/useAiTerminal";

type AiTerminalProps = {
    messages: TerminalUiMessage[];
    isSubmitting: boolean;
    error: string;
};

type TerminalMessageProps = {
    message: TerminalUiMessage;
    reducedMotion: boolean;
    onProgress: () => void;
};

type IdleTerminalStateProps = {
    reducedMotion: boolean;
    onProgress: () => void;
};

const reducedMotionQuery =
    "(prefers-reduced-motion: reduce)";

const missionSteps = [
    {
        code: "01",
        title: "DISCOVER",
        description: "project context",
        status: "READY",
    },
    {
        code: "02",
        title: "ARCHITECT",
        description: "service route",
        status: "READY",
    },
    {
        code: "03",
        title: "DEPLOY",
        description: "contact handoff",
        status: "STANDBY",
    },
] as const;

const signalBars = [
    38,
    64,
    46,
    82,
    58,
    92,
    68,
    44,
    76,
    54,
    88,
    62,
];

const IDLE_STAGE_COUNT = 4;

function subscribeReducedMotion(
    callback: () => void,
): () => void {
    const mediaQuery = window.matchMedia(
        reducedMotionQuery,
    );

    mediaQuery.addEventListener("change", callback);

    return () => {
        mediaQuery.removeEventListener(
            "change",
            callback,
        );
    };
}

function getReducedMotionSnapshot(): boolean {
    return window.matchMedia(
        reducedMotionQuery,
    ).matches;
}

function getReducedMotionServerSnapshot(): boolean {
    return false;
}

function useReducedMotion(): boolean {
    return useSyncExternalStore(
        subscribeReducedMotion,
        getReducedMotionSnapshot,
        getReducedMotionServerSnapshot,
    );
}

function TerminalMessage({
                             message,
                             reducedMotion,
                             onProgress,
                         }: TerminalMessageProps) {
    const shouldAnimate =
        message.role === "assistant" &&
        !reducedMotion;

    const [visibleLength, setVisibleLength] =
        useState(0);

    const [visible, setVisible] =
        useState(false);

    useEffect(() => {
        const frameId =
            window.requestAnimationFrame(() => {
                setVisible(true);
            });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, []);

    useEffect(() => {
        if (!shouldAnimate) {
            return;
        }

        const targetSteps = Math.min(
            100,
            Math.max(
                26,
                Math.ceil(
                    message.content.length / 4,
                ),
            ),
        );

        const chunkSize = Math.max(
            1,
            Math.ceil(
                message.content.length /
                targetSteps,
            ),
        );

        const intervalId = window.setInterval(
            () => {
                setVisibleLength((current) => {
                    const next = Math.min(
                        message.content.length,
                        current + chunkSize,
                    );

                    if (
                        next >=
                        message.content.length
                    ) {
                        window.clearInterval(
                            intervalId,
                        );
                    }

                    return next;
                });
            },
            18,
        );

        return () => {
            window.clearInterval(intervalId);
        };
    }, [
        message.content,
        shouldAnimate,
    ]);

    const displayedLength = shouldAnimate
        ? visibleLength
        : message.content.length;

    const isTyping =
        shouldAnimate &&
        displayedLength <
        message.content.length;

    useEffect(() => {
        onProgress();
    }, [
        displayedLength,
        onProgress,
    ]);

    return (
        <div
            className={`transition duration-300 ${
                visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
            }`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p
                    className={
                        message.role === "user"
                            ? "font-bold text-[#938BF3]"
                            : "font-bold text-[#75B887]"
                    }
                >
                    {message.role === "user"
                        ? "visitor@signal:~$"
                        : "pixardia@ai:~$"}
                </p>

                {message.category && (
                    <span className="border border-[#424545] px-2 py-0.5 text-[9px] uppercase tracking-[0.08em] text-[#777A7A]">
                        {message.category}
                    </span>
                )}
            </div>

            <p className="sr-only">
                {message.content}
            </p>

            <p
                aria-hidden="true"
                className={
                    message.role === "user"
                        ? "mt-1 whitespace-pre-wrap break-words text-[#B8B3F6]"
                        : "mt-1 whitespace-pre-wrap break-words text-[#A7D3B2]"
                }
            >
                {message.content.slice(
                    0,
                    displayedLength,
                )}

                {isTyping && (
                    <span className="ml-0.5 inline-block animate-pulse text-[#75B887]">
                        ▌
                    </span>
                )}
            </p>
        </div>
    );
}

function IdleTerminalState({
                               reducedMotion,
                               onProgress,
                           }: IdleTerminalStateProps) {
    const [visibleStage, setVisibleStage] =
        useState(0);

    const displayedStage = reducedMotion
        ? IDLE_STAGE_COUNT
        : visibleStage;

    useEffect(() => {
        if (
            reducedMotion ||
            visibleStage >= IDLE_STAGE_COUNT
        ) {
            return;
        }

        const timeoutId = window.setTimeout(
            () => {
                setVisibleStage((current) =>
                    Math.min(
                        current + 1,
                        IDLE_STAGE_COUNT,
                    ),
                );
            },
            visibleStage === 0 ? 180 : 260,
        );

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [
        reducedMotion,
        visibleStage,
    ]);

    useEffect(() => {
        onProgress();
    }, [
        displayedStage,
        onProgress,
    ]);

    return (
        <div className="space-y-4">
            <div
                className={`transition duration-500 ${
                    displayedStage >= 1
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                }`}
            >
                <div className="flex items-center justify-between border border-[#353838] bg-white/[0.015] px-3 py-2">
                    <p className="font-bold text-[#C7CACA]">
                        MISSION CONTROL
                    </p>

                    <p className="text-[9px] tracking-[0.12em] text-[#75B887]">
                        LINK ESTABLISHED
                    </p>
                </div>
            </div>

            <div
                className={`grid gap-3 transition duration-500 sm:grid-cols-[1.2fr_0.8fr] ${
                    displayedStage >= 2
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                }`}
            >
                <div className="border border-[#353838] bg-white/[0.015] p-3">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-[#BFC1C1]">
                            MISSION PIPELINE
                        </p>

                        <span className="text-[9px] text-[#666969]">
                            PX/03
                        </span>
                    </div>

                    <div className="mt-3 space-y-2">
                        {missionSteps.map(
                            (step, index) => (
                                <div
                                    key={step.code}
                                    className="grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-2 border-b border-[#292C2C] pb-2 last:border-b-0 last:pb-0"
                                    style={{
                                        transitionDelay: `${index * 70}ms`,
                                    }}
                                >
                                    <span className="text-[#555858]">
                                        {step.code}
                                    </span>

                                    <div className="min-w-0">
                                        <p className="font-bold text-[#989B9B]">
                                            {step.title}
                                        </p>

                                        <p className="truncate text-[9px] text-[#5F6262]">
                                            {
                                                step.description
                                            }
                                        </p>
                                    </div>

                                    <span
                                        className={
                                            step.status ===
                                            "READY"
                                                ? "text-[9px] text-[#75B887]"
                                                : "text-[9px] text-[#8D86E8]"
                                        }
                                    >
                                        {step.status}
                                    </span>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                <div className="flex min-h-36 flex-col border border-[#353838] bg-white/[0.015] p-3">
                    <div className="flex items-center justify-between">
                        <p className="font-bold text-[#BFC1C1]">
                            SIGNAL
                        </p>

                        <span className="text-[9px] text-[#75B887]">
                            OPEN
                        </span>
                    </div>

                    <div className="mt-4 flex flex-1 items-end justify-between gap-1">
                        {signalBars.map(
                            (height, index) => (
                                <span
                                    key={`${height}-${index}`}
                                    className={`w-full origin-bottom bg-[#75B887]/70 transition-transform duration-500 ${
                                        displayedStage >=
                                        3
                                            ? "scale-y-100"
                                            : "scale-y-0"
                                    } ${
                                        reducedMotion
                                            ? ""
                                            : "animate-pulse"
                                    }`}
                                    style={{
                                        height: `${height}%`,
                                        transitionDelay: `${index * 35}ms`,
                                        animationDelay: `${index * 90}ms`,
                                    }}
                                />
                            ),
                        )}
                    </div>

                    <div className="mt-3 flex justify-between text-[8px] text-[#555858]">
                        <span>INPUT</span>
                        <span>ANALYSIS</span>
                        <span>ROUTE</span>
                    </div>
                </div>
            </div>

            <div
                className={`border border-[#3C4140] bg-[#132019] px-3 py-3 transition duration-500 ${
                    displayedStage >= 4
                        ? "translate-y-0 opacity-100"
                        : "translate-y-2 opacity-0"
                }`}
            >
                <p className="font-bold text-[#75B887]">
                    pixardia@core:~$
                </p>

                <p className="mt-1 text-[#91B79A]">
                    Send a project brief to calculate
                    the strongest service path.
                </p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[9px] uppercase tracking-[0.08em] text-[#657168]">
                    <span>scope detection</span>
                    <span>stack routing</span>
                    <span>human handoff</span>
                </div>
            </div>
        </div>
    );
}

export default function AiTerminal({
                                       messages,
                                       isSubmitting,
                                       error,
                                   }: AiTerminalProps) {
    const reducedMotion =
        useReducedMotion();

    const scrollContainerRef =
        useRef<HTMLDivElement | null>(null);

    const scrollToBottom = useCallback(() => {
        window.requestAnimationFrame(() => {
            const container =
                scrollContainerRef.current;

            if (!container) {
                return;
            }

            container.scrollTop =
                container.scrollHeight;
        });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [
        messages,
        isSubmitting,
        error,
        scrollToBottom,
    ]);

    return (
        <div className="relative w-full">
            <div className="overflow-hidden border border-[#454747] bg-[#101111] shadow-[0_20px_55px_rgba(0,0,0,0.2)]">
                <div className="flex h-10 items-center border-b border-[#343636] bg-[#292A2A] px-3 sm:px-4">
                    <div className="flex gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#E76F51]" />
                        <span className="h-3 w-3 rounded-full bg-[#E9C46A]" />
                        <span className="h-3 w-3 rounded-full bg-[#2A9D63]" />
                    </div>

                    <p className="min-w-0 flex-1 truncate px-3 text-center font-mono text-[10px] font-bold text-[#B9BABA] sm:text-xs">
                        Pixardia AI Terminal
                    </p>

                    <p className="hidden font-mono text-[9px] text-[#747676] sm:block">
                        PX/CORE
                    </p>
                </div>

                <div className="relative flex min-h-[520px] flex-col p-4 font-mono text-[11px] leading-[1.55] sm:min-h-[590px] sm:p-6 sm:text-xs lg:min-h-[620px]">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.025] via-transparent to-white/[0.015]" />

                    <div className="relative">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <p className="text-[clamp(32px,8vw,58px)] font-black leading-none tracking-[-0.08em] text-[#7DA68A]">
                                PIXARDIA
                            </p>

                            <span className="border border-[#39413D] px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-[#75B887]">
                                core online
                            </span>
                        </div>

                        <p className="mt-3 text-[#858787]">
                            SYSTEM INTERFACE V4.0.2
                            {" // "}
                            CORE: NEURAL-NET-V8
                        </p>
                    </div>

                    <div className="relative mt-5 grid grid-cols-2 border-y border-[#343636] sm:grid-cols-4">
                        <div className="border-b border-r border-[#343636] px-3 py-3 sm:border-b-0">
                            <p className="text-[8px] text-[#5F6262]">
                                CORE
                            </p>

                            <p className="mt-1 font-bold text-[#75B887]">
                                ACTIVE
                            </p>
                        </div>

                        <div className="border-b border-[#343636] px-3 py-3 sm:border-b-0 sm:border-r">
                            <p className="text-[8px] text-[#5F6262]">
                                MODE
                            </p>

                            <p className="mt-1 font-bold text-[#8B83EA]">
                                ARCHITECT
                            </p>
                        </div>

                        <div className="border-r border-[#343636] px-3 py-3">
                            <p className="text-[8px] text-[#5F6262]">
                                GUARD
                            </p>

                            <p className="mt-1 font-bold text-[#75B887]">
                                ENABLED
                            </p>
                        </div>

                        <div className="px-3 py-3">
                            <p className="text-[8px] text-[#5F6262]">
                                CHANNEL
                            </p>

                            <p className="mt-1 font-bold text-[#B8BABA]">
                                READY
                            </p>
                        </div>
                    </div>

                    <div
                        ref={scrollContainerRef}
                        id="pixardia-ai-terminal-log"
                        role="log"
                        aria-live="polite"
                        aria-relevant="additions"
                        className="relative mt-4 min-h-[260px] flex-1 space-y-5 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:#4A4C4C_transparent] [scrollbar-width:thin]"
                    >
                        {messages.length === 0 ? (
                            <IdleTerminalState
                                reducedMotion={
                                    reducedMotion
                                }
                                onProgress={
                                    scrollToBottom
                                }
                            />
                        ) : (
                            <div className="flex items-center justify-between border-b border-[#303333] pb-3">
                                <div>
                                    <p className="font-bold text-[#BFC2C2]">
                                        LIVE SESSION
                                    </p>

                                    <p className="mt-0.5 text-[9px] text-[#606363]">
                                        project signal stream
                                    </p>
                                </div>

                                <span className="text-[9px] text-[#75B887]">
                                    {String(
                                        messages.length,
                                    ).padStart(2, "0")}{" "}
                                    EVENTS
                                </span>
                            </div>
                        )}

                        {messages.map((message) => (
                            <TerminalMessage
                                key={message.id}
                                message={message}
                                reducedMotion={
                                    reducedMotion
                                }
                                onProgress={
                                    scrollToBottom
                                }
                            />
                        ))}

                        {isSubmitting && (
                            <div className="border-l-2 border-[#75B887] pl-3 text-[#75B887]">
                                <p className="font-bold">
                                    pixardia@ai:~$
                                </p>

                                <p className="mt-1 animate-pulse">
                                    mapping project signal...
                                </p>

                                <div className="mt-2 h-1 overflow-hidden bg-[#253129]">
                                    <div className="h-full w-2/3 animate-pulse bg-[#75B887]" />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div
                                role="alert"
                                className="border border-[#704040] bg-[#211616] px-3 py-2 text-[#D58585]"
                            >
                                <p className="font-bold">
                                    system@error:~$
                                </p>

                                <p className="mt-1">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#343636] pt-3 text-[#666969]">
                        <p>
                            <span className="text-[#75B887]">
                                pixardia@system:~$
                            </span>{" "}
                            transmission channel ready
                            <span className="ml-1 inline-block animate-pulse text-[#75B887]">
                                ▌
                            </span>
                        </p>

                        <span className="text-[8px] uppercase tracking-[0.12em] text-[#4F5353]">
                            secure session
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}