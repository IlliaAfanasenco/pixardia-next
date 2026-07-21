"use client";

import Image from "next/image";
import Link from "next/link";
import {
    type FormEvent,
} from "react";

import AiTerminal from "@/features/ai-terminal/AiTerminal";
import { useAiTerminal } from "@/features/ai-terminal/useAiTerminal";

const tags = [
    {
        top: "security",
        bottom: "End-To-End",
    },
    {
        top: "speed",
        bottom: "Optimized",
    },
    {
        top: "stack",
        bottom: "Scalable",
    },
];

export default function CraftingStructureSection() {
    const {
        input,
        setInput,
        messages,
        error,
        isSubmitting,
        shouldLeadToContact,
        submit,
        reset,
    } = useAiTerminal("en");

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): void {
        event.preventDefault();

        void submit();
    }

    return (
        <section className="relative overflow-x-clip py-10 sm:py-14 lg:py-20">
            <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-[clamp(40px,6vw,92px)]">
                <div className="flex min-w-0 flex-col items-start">
                    <p className="text-xs font-bold uppercase tracking-[0.03em] text-[#C5C6C8]">
                        DEPLOYMENTPROTOCOL02
                    </p>

                    <h2 className="mt-7 flex flex-col items-start text-[clamp(44px,7.5vw,104px)] font-black uppercase leading-[0.86] tracking-[-0.045em]">
                        <span className="text-[#1E1E1E]">
                            crafting
                        </span>

                        <span className="text-[#C5C6C8]">
                            structure
                        </span>
                    </h2>

                    <p className="mt-7 max-w-[620px] text-left text-lg font-bold uppercase leading-[1.2] tracking-[-0.03em] text-[#1E1E1E] md:text-[clamp(18px,2vw,24px)]">
                        We create websites that don’t just
                        look good — they work, convert and
                        grow your business.
                    </p>

                    <div className="mt-8 flex items-center gap-6 text-left sm:gap-10">
                        <div>
                            <p className="text-[32px] font-black uppercase leading-none tracking-[0.03em] md:text-4xl">
                                99.9%
                            </p>

                            <p className="mt-1 text-sm font-bold uppercase leading-[1.2] tracking-[0.1em] text-[#C5C6C8] md:text-base">
                                uptime core
                            </p>
                        </div>

                        <div className="h-14 w-px shrink-0 bg-[#C5C6C8]" />

                        <div>
                            <p className="text-[32px] font-black uppercase leading-none tracking-[0.03em] md:text-4xl">
                                clean
                            </p>

                            <p className="mt-1 text-sm font-bold uppercase leading-[1.2] tracking-[0.1em] text-[#C5C6C8] md:text-base">
                                architecture
                            </p>
                        </div>
                    </div>

                    <div className="mt-9 w-full max-w-[500px] border-b-4 border-r-4 border-[#1B1B1B] bg-white text-left">
                        <div className="p-4 sm:p-[18px_20px_20px]">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-4">
                                    <Image
                                        src="/icons/starCS.svg"
                                        alt=""
                                        width={21}
                                        height={21}
                                        className="shrink-0"
                                    />

                                    <p className="truncate text-sm font-bold uppercase leading-[1.2] tracking-[0.01em] text-[#3D5FB5]">
                                        ai architect
                                    </p>
                                </div>

                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F7F7F7]">
                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            isSubmitting
                                                ? "animate-pulse bg-[#E9C46A]"
                                                : "bg-[#30D13B]"
                                        }`}
                                    />
                                </div>
                            </div>

                            <p className="mt-6 text-sm font-bold leading-[1.3] tracking-[0.01em] text-[#C5C6C8]">
                                Describe your product, goals
                                and required functionality.
                                The result will appear in the
                                terminal.
                            </p>

                            <form
                                className="mt-5"
                                onSubmit={handleSubmit}
                            >
                                <label
                                    htmlFor="ai-project-signal"
                                    className="sr-only"
                                >
                                    Describe your project
                                </label>

                                <input
                                    id="ai-project-signal"
                                    type="text"
                                    value={input}
                                    onChange={(event) => {
                                        setInput(
                                            event.target.value,
                                        );
                                    }}
                                    maxLength={800}
                                    placeholder="Are you ready to take your project to the next level?"
                                    className="h-11 w-full bg-[#F3F4F6] px-4 text-sm font-bold leading-[1.2] tracking-[0.01em] text-[#1E1E1E] outline-none placeholder:text-[#C5C6C8] focus:ring-2 focus:ring-[#3D5FB5] md:h-10"
                                    disabled={isSubmitting}
                                    aria-invalid={Boolean(
                                        error,
                                    )}
                                    aria-controls="pixardia-ai-terminal-log"
                                    autoComplete="off"
                                />

                                {error && (
                                    <p
                                        role="alert"
                                        className="mt-2 text-xs font-bold leading-5 text-red-600"
                                    >
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="mt-[15px] flex h-11 w-full items-center justify-center bg-[#1E1E1E] transition hover:bg-[#2A2A2A] disabled:cursor-not-allowed disabled:opacity-60 md:h-10"
                                    disabled={isSubmitting}
                                >
                                    <span className="text-sm font-bold uppercase leading-[1.2] tracking-[0.03em] text-[#EDEDED]">
                                        {isSubmitting
                                            ? "analysing..."
                                            : "generate stack →"}
                                    </span>
                                </button>
                            </form>

                            {(shouldLeadToContact ||
                                messages.length > 0) && (
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {shouldLeadToContact && (
                                        <Link
                                            href="/contact"
                                            className="border border-[#3D5FB5] px-3 py-3 text-center text-xs font-bold uppercase tracking-[0.03em] text-[#3D5FB5] transition hover:bg-[#3D5FB5] hover:text-white"
                                        >
                                            contact form →
                                        </Link>
                                    )}

                                    {messages.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={reset}
                                            className={`border border-[#C9C9CB] px-3 py-3 text-xs font-bold uppercase tracking-[0.03em] text-[#909094] transition hover:border-black hover:text-black ${
                                                shouldLeadToContact
                                                    ? ""
                                                    : "sm:col-span-2"
                                            }`}
                                        >
                                            clear terminal
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="min-w-0">
                    <div className="relative mx-auto w-full max-w-[760px]">
                        <div className="relative min-[1800px]:pl-28">
                            <AiTerminal
                                messages={messages}
                                isSubmitting={
                                    isSubmitting
                                }
                                error={error}
                            />

                            <Image
                                src="/images/alienCS.png"
                                alt=""
                                aria-hidden="true"
                                width={104}
                                height={104}
                                className="pointer-events-none absolute left-0 top-[58%] z-20 hidden h-auto w-[104px] -translate-y-1/2 object-contain min-[1800px]:block"
                            />
                        </div>

                        <div className="mt-6 grid w-full gap-3 sm:grid-cols-3 sm:gap-4 min-[1800px]:pl-28">
                            {tags.map((tag) => (
                                <div
                                    key={`${tag.top}-${tag.bottom}`}
                                    className="flex min-h-16 flex-col items-center justify-center border-b-2 border-r-2 border-[#BDBDBD] px-3 text-center"
                                >
                                    <span className="text-xs font-bold uppercase leading-[1.2] tracking-[0.03em] text-[#C5C6C8] sm:text-sm">
                                        {tag.top}
                                    </span>

                                    <span className="mt-1.5 text-sm font-bold leading-[1.2] tracking-[0.03em] text-[#1E1E1E] sm:text-base">
                                        {tag.bottom}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}