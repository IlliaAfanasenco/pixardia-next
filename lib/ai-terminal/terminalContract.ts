export const terminalLanguages = ["en", "de"] as const;

export type TerminalLanguage = (typeof terminalLanguages)[number];

export const terminalCategories = [
    "service",
    "pricing",
    "timeline",
    "preparation",
    "contact",
    "off_topic",
    "unknown",
] as const;

export type TerminalCategory = (typeof terminalCategories)[number];

export type TerminalHistoryMessage = {
    role: "user" | "assistant";
    content: string;
};

export type TerminalRequest = {
    message: string;
    history: TerminalHistoryMessage[];
    language: TerminalLanguage;
};

export type TerminalResult = {
    answer: string;
    category: TerminalCategory;
    shouldLeadToContact: boolean;
};

export type DeepSeekMessage = {
    role: "system" | "user" | "assistant";
    content: string;
};