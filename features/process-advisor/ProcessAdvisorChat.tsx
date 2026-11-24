"use client";

import { useEffect, useRef, useSyncExternalStore, type Ref } from "react";

import { useI18n } from "@/i18n/LocaleProvider";

import { publicPath } from "@/i18n/navigation";

import ChatInput from "./ChatInput";
import ChatMessage, { TypingIndicator } from "./ChatMessage";
import ChoicePanel from "./ChoicePanel";
import type { useProjectDesk } from "./useProjectDesk";
import styles from "./ProcessAdvisor.module.css";

type ProcessAdvisorChatProps = {
    inputRef: Ref<HTMLInputElement>;
    desk: ReturnType<typeof useProjectDesk>;
    highlighted: boolean;
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
    const query = window.matchMedia(reducedMotionQuery);
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
}

export default function ProcessAdvisorChat({ inputRef, desk, highlighted }: ProcessAdvisorChatProps) {
    const { t, locale } = useI18n();
    const { messages, step, isTyping } = desk;
    const scrollRef = useRef<HTMLDivElement>(null);
    const reducedMotion = useSyncExternalStore(
        subscribeReducedMotion,
        () => window.matchMedia(reducedMotionQuery).matches,
        () => false,
    );

    // Scroll only the conversation container, never the page.
    useEffect(() => {
        const node = scrollRef.current;
        if (!node) return;
        node.scrollTo({ top: node.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
    }, [messages, isTyping, step, reducedMotion]);

    const controlClass =
        "font-mono text-[9px] uppercase tracking-[0.1em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:text-[#EDEDED]";

    return (
        <div
            data-process-advisor-window=""
            className={`flex min-w-0 flex-col overflow-hidden border bg-[#101111] shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-colors duration-500 max-lg:h-[clamp(500px,76svh,640px)] lg:absolute lg:inset-0 motion-reduce:transition-none ${
                highlighted ? "border-[#EDEDED]" : "border-[#454747]"
            }`}
        >
            <header className="flex h-10 shrink-0 items-center gap-3 border-b border-[#343636] bg-[#292A2A] px-3 sm:px-4">
                <span className="flex gap-2" aria-hidden="true">
                    <span className="size-3 rounded-full bg-[#E76F51]" />
                    <span className="size-3 rounded-full bg-[#E9C46A]" />
                    <span className="size-3 rounded-full bg-[#2A9D63]" />
                </span>
                <p className="min-w-0 flex-1 truncate px-1 text-center font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#B9BABA] sm:text-xs">
                    PIXARDIA / {t("PROJECT DESK")}
                </p>
                <p className="flex shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[#9A9C9C]">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#EDEDED]" />
                    PX/CORE
                </p>
            </header>

            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#343636] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-[#5F6262] sm:px-4">
                <span className="min-w-0 truncate">{t("SESSION 001 / PROJECT DISCOVERY / READY")}</span>
                <span className="flex shrink-0 items-center gap-3 text-[#9A9C9C]">
                    <button type="button" onClick={desk.back} disabled={!desk.canGoBack} className={controlClass}>
                        ← {t("BACK")}
                    </button>
                    <button type="button" onClick={desk.restart} className={controlClass}>
                        {t("RESTART")}
                    </button>
                </span>
            </div>

            <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-label={t("Project Desk conversation")}
                className={`${styles.scroll} min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5 sm:py-5`}
            >
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                        labels={{ desk: t("PROJECT DESK"), user: t("YOU"), ctaHref: publicPath(locale, "/contact") }}
                    />
                ))}
                {isTyping && <TypingIndicator label={t("Project Desk is typing")} caption={t("PROJECT DESK")} />}
                {step && !isTyping && (
                    <ChoicePanel
                        key={step.id}
                        step={step}
                        selected={desk.selected}
                        translate={t}
                        onPick={desk.answer}
                        onToggle={desk.toggle}
                        onContinue={desk.submitSelection}
                        onSkip={desk.skip}
                        labels={{
                            hintSingle: t("SELECT ONE"),
                            hintMulti: t("SELECT ALL THAT APPLY"),
                            next: t("CONTINUE →"),
                            skip: t("SKIP"),
                        }}
                    />
                )}
            </div>

            <ChatInput
                inputRef={inputRef}
                value={desk.input}
                onChange={desk.setInput}
                onSubmit={desk.submitText}
                disabled={isTyping || step?.id === "summary"}
                placeholder={t(step?.id === "intent" ? "Describe what you’d like to create..." : "Or type your own answer...")}
                label={t("Message Project Desk")}
                sendLabel={t("Send message")}
                note={t("Preview — guided prototype. Nothing is sent or saved.")}
            />
        </div>
    );
}
