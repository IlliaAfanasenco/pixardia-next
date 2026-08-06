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

export const terminalLimits = {
    messageMinLength: 2,
    messageMaxLength: 800,
    requestMaxBytes: 8_192,
    providerResponseMaxBytes: 65_536,
} as const;

export type TerminalRequest = {
    message: string;
    language: TerminalLanguage;
};

export type TerminalResult = {
    answer: string;
    category: TerminalCategory;
    shouldLeadToContact: boolean;
};

export type DeepSeekMessage = {
    role: "system" | "user";
    content: string;
};
