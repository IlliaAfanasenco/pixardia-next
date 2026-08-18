import Image from "next/image";

import {
    type TerminalUiMessage,
} from "@/features/ai-terminal/useAiTerminal";

type PixardiaStructureLabProps = {
    messages: TerminalUiMessage[];
    isSubmitting: boolean;
    error: string;
};

const structureSteps = [
    {
        code: "01",
        title: "brief",
        status: "received",
    },
    {
        code: "02",
        title: "design",
        status: "mapping",
    },
    {
        code: "03",
        title: "build",
        status: "ready",
    },
    {
        code: "04",
        title: "launch",
        status: "standby",
    },
] as const;

const systemMetrics = [
    {
        label: "security",
        value: "End-To-End",
    },
    {
        label: "speed",
        value: "Optimized",
    },
    {
        label: "stack",
        value: "Scalable",
    },
] as const;

export default function PixardiaStructureLab({
    messages,
    isSubmitting,
    error,
}: PixardiaStructureLabProps) {
    const visibleMessages = messages.slice(-2);

    return (
        <div
            className="flex h-full flex-col border border-[#1E1E1E] bg-white text-left shadow-[8px_8px_0_#1E1E1E]"
            data-crafting-workspace=""
        >
            <div className="flex h-12 items-center justify-between border-b border-[#1E1E1E] px-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Image
                        src="/icons/star.svg"
                        alt=""
                        aria-hidden="true"
                        width={24}
                        height={24}
                        className="size-6 shrink-0"
                    />

                    <p className="truncate text-xs font-black uppercase tracking-[0.08em] text-[#1E1E1E]">
                        Pixardia / Structure Lab
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <span
                        className={`size-2 rounded-full ${
                            error
                                ? "bg-red-500"
                                : isSubmitting
                                  ? "animate-pulse bg-[#5E56E7]"
                                  : "bg-[#30D13B]"
                        }`}
                    />

                    <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#808188]">
                        {error
                            ? "signal error"
                            : isSubmitting
                              ? "mapping"
                              : "system active"}
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-end justify-between gap-5">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#808188]">
                            deployment protocol / 02
                        </p>

                        <h3 className="mt-2 text-[clamp(28px,2.4vw,38px)] font-black uppercase leading-[0.9] tracking-[-0.04em] text-[#1E1E1E]">
                            Structure Blueprint
                        </h3>
                    </div>

                    <span className="border border-[#5E56E7] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#5E56E7]">
                        AI assisted
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-4 border-y border-[#C5C6C8]">
                    {structureSteps.map((step, index) => (
                        <div
                            key={step.code}
                            className={`relative min-w-0 px-3 py-3 ${
                                index < structureSteps.length - 1
                                    ? "border-r border-[#C5C6C8]"
                                    : ""
                            }`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black text-[#808188]">
                                    {step.code}
                                </span>

                                <span
                                    className={`size-2 rounded-full ${
                                        index === 1
                                            ? "bg-[#5E56E7]"
                                            : index < 3
                                              ? "bg-[#1E1E1E]"
                                              : "border border-[#808188] bg-white"
                                    }`}
                                />
                            </div>

                            <p className="mt-3 truncate text-sm font-black uppercase leading-none tracking-[0.02em] text-[#1E1E1E]">
                                {step.title}
                            </p>

                            <p
                                className={`mt-1 truncate text-[9px] font-bold uppercase tracking-[0.08em] ${
                                    index === 1
                                        ? "text-[#5E56E7]"
                                        : "text-[#A7A7AA]"
                                }`}
                            >
                                {step.status}
                            </p>
                        </div>
                    ))}
                </div>

                <div
                    className="mt-5 flex min-h-[128px] flex-1 flex-col border-l-4 border-[#5E56E7] bg-[#F3F3F4] p-4"
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions"
                >
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#5E56E7]">
                            Project Signal
                        </p>

                        <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#A7A7AA]">
                            {String(messages.length).padStart(2, "0")} events
                        </span>
                    </div>

                    {error ? (
                        <p className="mt-4 text-sm font-bold leading-[1.35] text-red-600">
                            {error}
                        </p>
                    ) : isSubmitting ? (
                        <div className="mt-4 flex flex-1 flex-col justify-center">
                            <p className="text-sm font-bold uppercase leading-[1.25] tracking-[0.02em] text-[#1E1E1E]">
                                Mapping the strongest service route…
                            </p>

                            <div className="mt-4 h-1.5 overflow-hidden bg-[#D8D8DA]">
                                <div className="h-full w-2/3 animate-pulse bg-[#5E56E7]" />
                            </div>
                        </div>
                    ) : visibleMessages.length > 0 ? (
                        <div className="mt-3 max-h-[180px] flex-1 space-y-2 overflow-y-auto pr-2">
                            {visibleMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className="grid grid-cols-[72px_minmax(0,1fr)] gap-3"
                                >
                                    <span
                                        className={`text-[9px] font-black uppercase tracking-[0.08em] ${
                                            message.role === "assistant"
                                                ? "text-[#5E56E7]"
                                                : "text-[#808188]"
                                        }`}
                                    >
                                        {message.role === "assistant"
                                            ? "Pixardia"
                                            : "Brief"}
                                    </span>

                                    <p className="line-clamp-2 text-xs font-bold leading-[1.35] text-[#1E1E1E]">
                                        {message.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-4 flex flex-1 items-end justify-between gap-6">
                            <p className="max-w-[360px] text-sm font-bold uppercase leading-[1.3] tracking-[0.01em] text-[#1E1E1E]">
                                Add your brief to generate a focused product structure.
                            </p>

                            <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.08em] text-[#A7A7AA]">
                                waiting for input
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 border-t border-[#1E1E1E]">
                {systemMetrics.map((metric, index) => (
                    <div
                        key={metric.label}
                        className={`px-3 py-3 text-center ${
                            index < systemMetrics.length - 1
                                ? "border-r border-[#C5C6C8]"
                                : ""
                        }`}
                    >
                        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#A7A7AA]">
                            {metric.label}
                        </p>

                        <p className="mt-1 text-xs font-black leading-none text-[#1E1E1E]">
                            {metric.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
