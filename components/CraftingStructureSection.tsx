"use client";
import { useI18n } from "@/i18n/LocaleProvider";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import ProcessAdvisorChat from "@/features/process-advisor/ProcessAdvisorChat";
import SuggestionCard, { SuggestionIcons } from "@/features/process-advisor/SuggestionCard";
import { useProjectDesk } from "@/features/process-advisor/useProjectDesk";

/* Divided by the scene zoom (--cz) so the mascot keeps its size when the layer is scaled up. */
const MASCOT_WIDTH = "calc(clamp(90px,8.8vw,127px) / var(--cz, 1))";

function Mascot({ front = false }: { front?: boolean }) {
    return (
        <div
            aria-hidden="true"
            style={{ "--mascot-w": MASCOT_WIDTH } as React.CSSProperties}
            className={`pointer-events-none absolute right-8 ${
                front
                    ? "z-20 max-lg:hidden"
                    : "z-0 bottom-full h-[58px] w-[58px] overflow-hidden"
            } lg:bottom-auto lg:right-full lg:top-[12%] lg:h-auto lg:w-[var(--mascot-w)] lg:overflow-visible lg:[margin-right:calc(var(--mascot-w)*-0.236)]`}
        >
            <Image
                src="/images/alienPeek.png"
                alt=""
                width={127}
                height={246}
                sizes="(min-width: 1024px) 127px, 76px"
                className={`absolute left-0 top-[-20px] h-auto w-[76px] max-w-none -scale-x-100 select-none lg:static lg:w-full ${
                    front ? "[clip-path:inset(56%_10%_24%_74%)]" : ""
                }`}
            />
        </div>
    );
}

export default function CraftingStructureSection() {
    const { t } = useI18n();
    const desk = useProjectDesk(t);
    const inputRef = useRef<HTMLInputElement>(null);
    const [highlighted, setHighlighted] = useState(false);
    const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (highlightTimer.current) clearTimeout(highlightTimer.current);
    }, []);

    function focusChat() {
        inputRef.current?.focus();
        setHighlighted(true);
        if (highlightTimer.current) clearTimeout(highlightTimer.current);
        highlightTimer.current = setTimeout(() => setHighlighted(false), 1400);
    }

    function startGuided(mode: "new" | "improve") {
        desk.begin(mode);
        focusChat();
    }

    return (
        <section
            id="crafting-structure"
            className="relative overflow-x-clip bg-white py-6 sm:py-8 lg:py-8"
            data-story-section="crafting-structure"
            data-story-step="2"
            data-cinematic-scene="crafting"
            data-motion="fade-up"
            data-motion-state="pending"
        >
            <div
                className="site-container grid gap-10 lg:grid-cols-[minmax(0,46fr)_minmax(0,54fr)] lg:items-stretch lg:gap-[clamp(48px,7vw,100px)]"
                data-cinematic-layer=""
            >
                <div
                    className="@container flex min-w-0 flex-col items-start lg:min-h-[clamp(500px,54svh,640px)] lg:self-stretch"
                    data-cinematic-element="crafting-copy"
                >
                    <div className="flex w-full flex-col items-start">
                        <p className="text-[calc(12px*var(--vk,1))] font-bold uppercase tracking-[0.03em] text-[#C5C6C8]">
                            {t("02 / YOUR IDEAS. OUR EXPERTISE.")}
                        </p>

                        <h2 className="mt-4 flex w-full flex-col items-start text-[clamp(2.4rem,10.8cqw,6.5rem)] font-black uppercase leading-[0.88] tracking-[-0.045em]">
                            <span className="whitespace-nowrap text-[#1E1E1E]">{t("GREAT PROJECTS")}</span>
                            <span className="whitespace-nowrap text-[#1E1E1E]">{t("START WITH A")}</span>
                            <span className="whitespace-nowrap text-[#C5C6C8]">{t("CONVERSATION.")}</span>
                        </h2>

                    </div>

                    <div className="mt-4 max-w-[520px] lg:mt-[clamp(16px,2.2svh,30px)] font-bold tracking-[-0.02em]">
                        <p className="text-[calc(clamp(18px,1.7vw,22px)*var(--vk,1))] leading-[1.2] text-[#1E1E1E]">
                            {t("Have something in mind?")}
                        </p>
                        <p className="mt-1.5 text-[calc(15px*var(--vk,1))] leading-[1.35] text-[#969696] md:text-[calc(16px*var(--vk,1))]">
                            {t("Tell us what you’re planning. We’ll ask a few simple questions and help you figure out the next step.")}
                        </p>
                    </div>

                    <div
                        className="mt-6 w-full max-w-[560px] lg:max-w-[calc(560px*var(--vk,1))] lg:pt-5"
                        data-cinematic-element="crafting-card"
                    >
                        <p className="text-[calc(12px*var(--vk,1))] font-bold uppercase tracking-[0.03em] text-[#686868]">
                            {t("WHAT WOULD YOU LIKE TO DO?")}
                        </p>

                        <div className="mt-2.5 grid gap-2.5">
                            <SuggestionCard
                                title={t("Build something new")}
                                description={t("I have an idea for a website, app or digital product.")}
                                icon={SuggestionIcons.build}
                                onSelect={() => startGuided("new")}
                            />
                            <SuggestionCard
                                title={t("Improve what I already have")}
                                description={t("I want to upgrade an existing website or product.")}
                                icon={SuggestionIcons.improve}
                                onSelect={() => startGuided("improve")}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={focusChat}
                            className="group mt-2.5 flex min-h-[calc(52px*var(--vk,1))] w-full items-center justify-between gap-6 bg-black px-5 text-[calc(14px*var(--vk,1))] font-bold uppercase tracking-[0.03em] text-white transition-colors duration-300 hover:bg-[#2A2A2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                            {t("START A CONVERSATION")}
                            <span
                                aria-hidden="true"
                                className="text-lg leading-none text-white transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                            >
                                →
                            </span>
                        </button>
                    </div>
                </div>

                <div
                    className="relative min-w-0 max-lg:mt-5 lg:self-stretch"
                    data-cinematic-element="crafting-terminal"
                >
                    {/* Decorative mascot. Back layer sits under the terminal; the front layer repeats only the
                        gripping fingers above the frame so the hand reads as holding the edge. */}
                    <Mascot />
                    <Mascot front />
                    <div className="relative z-10 lg:absolute lg:inset-0">
                        <ProcessAdvisorChat inputRef={inputRef} desk={desk} highlighted={highlighted} />
                    </div>
                </div>
            </div>
        </section>
    );
}
