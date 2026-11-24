import type { FormEvent, Ref } from "react";

type ChatInputProps = {
    inputRef: Ref<HTMLInputElement>;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    placeholder: string;
    label: string;
    sendLabel: string;
    note: string;
};

export default function ChatInput({ inputRef, value, onChange, onSubmit, disabled, placeholder, label, sendLabel, note }: ChatInputProps) {
    const canSend = value.trim().length > 0 && !disabled;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (canSend) onSubmit();
    }

    return (
        <form onSubmit={handleSubmit} className="shrink-0 border-t border-[#343636] p-3 sm:p-4">
            <div className="flex items-center gap-2 border border-[#454747] bg-[#151616] py-1 pl-3 pr-1 transition-colors duration-300 focus-within:border-[#EDEDED]">
                <span aria-hidden="true" className="font-mono text-sm font-bold text-[#747676]">&gt;</span>
                <label htmlFor="process-advisor-input" className="sr-only">
                    {label}
                </label>
                <input
                    id="process-advisor-input"
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    maxLength={300}
                    autoComplete="off"
                    placeholder={placeholder}
                    className="h-11 min-w-0 flex-1 bg-transparent text-base text-[#EDEDED] outline-none placeholder:text-[#747676] sm:text-[calc(14px*var(--vk,1))]"
                />
                <button
                    type="submit"
                    disabled={!canSend}
                    aria-label={sendLabel}
                    className="flex size-11 shrink-0 items-center justify-center bg-[#EDEDED] text-[#101111] transition-[background-color,opacity] duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#EDEDED] motion-reduce:transition-none"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </button>
            </div>
            <p className="mt-2.5 font-mono text-[9px] uppercase leading-snug tracking-[0.06em] text-[#5F6262]">{note}</p>
        </form>
    );
}
