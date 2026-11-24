import Link from "next/link";

import styles from "./ProcessAdvisor.module.css";

export type AdvisorMessage = {
    id: string;
    role: "ai" | "user";
    text: string;
    hint?: string;
    summary?: {
        title: string;
        rows: ReadonlyArray<readonly [string, string]>;
        ctaLabel: string;
        note: string;
    };
};

type Labels = { desk: string; user: string; ctaHref: string };

/** Small monospace caption above each message: the technical layer. */
function Caption({ children, right = false }: { children: string; right?: boolean }) {
    return (
        <p
            className={`mb-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.12em] ${
                right ? "text-right text-[#747676]" : "text-[#B9BABA]"
            }`}
        >
            {children}
        </p>
    );
}

export default function ChatMessage({ message, labels }: { message: AdvisorMessage; labels: Labels }) {
    if (message.role === "user") {
        return (
            <div className={`${styles.message} flex flex-col items-end`}>
                <Caption right>{labels.user}</Caption>
                <p className="max-w-[88%] break-words border border-[#454747] bg-[#242626] px-3.5 py-2.5 text-[calc(14px*var(--vk,1))] leading-[1.5] text-[#EDEDED] sm:max-w-[80%]">
                    {message.text}
                </p>
            </div>
        );
    }

    return (
        <div className={`${styles.message} flex flex-col items-start`}>
            <Caption>{labels.desk}</Caption>
            <div className="w-full min-w-0 max-w-[94%] break-words border border-[#343636] border-l-2 border-l-[#EDEDED] bg-[#171818] px-3.5 py-3 text-[calc(14px*var(--vk,1))] leading-[1.55] text-[#D6D8D8] sm:max-w-[88%]">
                <p className="font-bold text-[#EDEDED]">{message.text}</p>
                {message.hint && <p className="mt-1.5 text-[#9A9C9C]">{message.hint}</p>}

                {message.summary && (
                    <div className="mt-3 border border-[#343636] bg-[#101111]">
                        <p className="border-b border-[#343636] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[#B9BABA]">
                            {message.summary.title}
                        </p>
                        <dl>
                            {message.summary.rows.map(([label, value]) => (
                                <div
                                    key={label}
                                    className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 border-b border-[#343636] px-3 py-2 last:border-b-0 sm:grid-cols-[120px_minmax(0,1fr)]"
                                >
                                    <dt className="font-mono text-[9px] uppercase leading-[1.7] tracking-[0.08em] text-[#747676]">{label}</dt>
                                    <dd className="text-[calc(13px*var(--vk,1))] font-bold leading-[1.4] text-[#EDEDED]">{value}</dd>
                                </div>
                            ))}
                        </dl>
                        <Link
                            href={labels.ctaHref}
                            className="flex min-h-11 items-center justify-between gap-4 bg-[#EDEDED] px-3 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-[#101111] transition-colors duration-300 hover:bg-white"
                        >
                            {message.summary.ctaLabel}
                        </Link>
                        <p className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.06em] text-[#5F6262]">{message.summary.note}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export function TypingIndicator({ label, caption }: { label: string; caption: string }) {
    return (
        <div className={`${styles.message} flex flex-col items-start`} role="status">
            <Caption>{caption}</Caption>
            <div className="flex h-[38px] items-center gap-1.5 border border-[#343636] border-l-2 border-l-[#EDEDED] bg-[#171818] px-3.5">
                <span className="sr-only">{label}</span>
                <span aria-hidden="true" className={styles.dot} />
                <span aria-hidden="true" className={styles.dot} />
                <span aria-hidden="true" className={styles.dot} />
            </div>
        </div>
    );
}
