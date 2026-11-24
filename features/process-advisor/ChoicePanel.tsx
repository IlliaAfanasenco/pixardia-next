import type { Step } from "./flow";

type ChoicePanelProps = {
    step: Step;
    selected: string[];
    translate: (key: string) => string;
    onPick: (option: string) => void;
    onToggle: (option: string) => void;
    onContinue: () => void;
    onSkip: () => void;
    labels: { hintSingle: string; hintMulti: string; next: string; skip: string };
};

/** Answer options for the current question. Typed answers stay available in the input. */
export default function ChoicePanel({ step, selected, translate, onPick, onToggle, onContinue, onSkip, labels }: ChoicePanelProps) {
    if (!step.options) return null;
    const multi = Boolean(step.multi);

    return (
        <div className="space-y-2.5 pt-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#747676]">
                {multi ? labels.hintMulti : labels.hintSingle}
            </p>

            <div className="flex flex-wrap gap-2">
                {step.options.map((option) => {
                    const active = selected.includes(option);
                    return (
                        <button
                            key={option}
                            type="button"
                            aria-pressed={multi ? active : undefined}
                            onClick={() => (multi ? onToggle(option) : onPick(option))}
                            className={`flex min-h-[calc(40px*var(--vk,1))] items-center gap-2 border px-3 text-left text-[calc(13px*var(--vk,1))] font-bold leading-tight transition-colors duration-200 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#EDEDED] motion-reduce:transition-none ${
                                active
                                    ? "border-[#EDEDED] bg-[#EDEDED] text-[#101111]"
                                    : "border-[#454747] bg-transparent text-[#D6D8D8] hover:border-[#B9BABA] hover:bg-[#242626]"
                            }`}
                        >
                            {multi && (
                                <span
                                    aria-hidden="true"
                                    className={`flex size-3 shrink-0 items-center justify-center border text-[9px] leading-none ${
                                        active ? "border-[#101111]" : "border-[#747676]"
                                    }`}
                                >
                                    {active ? "✓" : ""}
                                </span>
                            )}
                            {translate(option)}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-4">
                {multi && (
                    <button
                        type="button"
                        onClick={onContinue}
                        disabled={selected.length === 0}
                        className="min-h-10 bg-[#EDEDED] px-4 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-[#101111] transition-opacity duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        {labels.next}
                    </button>
                )}
                {step.skippable && (
                    <button
                        type="button"
                        onClick={onSkip}
                        className="min-h-10 font-mono text-[10px] uppercase tracking-[0.1em] text-[#9A9C9C] underline-offset-4 transition-colors hover:text-[#EDEDED] hover:underline"
                    >
                        {labels.skip}
                    </button>
                )}
            </div>
        </div>
    );
}
