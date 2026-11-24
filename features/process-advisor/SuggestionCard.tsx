import type { ReactNode } from "react";

type SuggestionCardProps = {
    title: string;
    description: string;
    icon: ReactNode;
    onSelect: () => void;
};

export default function SuggestionCard({ title, description, icon, onSelect }: SuggestionCardProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className="group flex w-full items-center gap-4 border border-[#C5C6C8] bg-white px-4 py-[calc(10px*var(--vk,1))] text-left transition-[background-color,border-color] duration-300 hover:border-[#1E1E1E] hover:bg-[#F7F9FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1E1E]"
        >
            <span className="flex size-6 shrink-0 items-center justify-center text-[#1E1E1E]">{icon}</span>
            <span className="min-w-0 flex-1">
                <span className="block text-[calc(15px*var(--vk,1))] font-bold leading-[1.2] tracking-[-0.02em] text-[#1E1E1E]">{title}</span>
                <span className="mt-1 block text-[calc(13px*var(--vk,1))] font-bold leading-[1.3] tracking-[-0.01em] text-[#969696]">{description}</span>
            </span>
            <span
                aria-hidden="true"
                className="text-lg leading-none text-[#1E1E1E] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            >
                →
            </span>
        </button>
    );
}

const iconProps = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
};

export const SuggestionIcons = {
    build: (
        <svg {...iconProps}>
            <rect x="4" y="4" width="16" height="16" rx="1" />
            <path d="M12 8v8M8 12h8" />
        </svg>
    ),
    improve: (
        <svg {...iconProps}>
            <path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3" />
            <path d="M18 3v4h-4M6 21v-4h4" />
        </svg>
    ),
};
