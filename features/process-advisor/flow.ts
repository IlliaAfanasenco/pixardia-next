/**
 * Deterministic project-discovery flow (frontend prototype).
 *
 * Pure functions only: given the answers so far, `nextStep` returns the next
 * question. A real backend can later replace these three functions
 * (`classify`, `applyAnswer`, `nextStep`) without touching the UI.
 * All strings are English message keys, translated at render time.
 */

export type Mode = "new" | "improve";
export type CategoryId = "restaurant" | "shop" | "app" | "website" | "other";

export type Answers = {
    mode: Mode;
    category?: CategoryId;
    detail?: string;
    features?: string[];
    budget?: string;
};

export type StepId = "intent" | "category" | "detail" | "features" | "budget" | "summary";

export type Step = {
    id: StepId;
    question: string;
    hint?: string;
    options?: readonly string[];
    multi?: boolean;
    skippable?: boolean;
};

export const NOT_SURE = "Not sure yet";

type Category = {
    label: string;
    improveLabel: string;
    detail: { question: string; summaryLabel: string; options: readonly string[] };
    features: { question: string; options: readonly string[] };
    pattern: RegExp;
};

const CATEGORIES: Record<CategoryId, Category> = {
    restaurant: {
        label: "Restaurant Website",
        improveLabel: "Restaurant Website Upgrade",
        detail: {
            question: "Is your restaurant a single location or part of a larger business?",
            summaryLabel: "BUSINESS SIZE",
            options: ["Single location", "Multiple locations", "Just starting"],
        },
        features: {
            question: "What would you like your website to include?",
            options: ["Digital menu", "Table reservations", "Online ordering", "Photo gallery", "Contact and location", NOT_SURE],
        },
        pattern: /restaurant|caf[eé]|bistro|gastro|pizzeria|imbiss/,
    },
    shop: {
        label: "Online Shop",
        improveLabel: "Online Shop Upgrade",
        detail: {
            question: "What will you sell?",
            summaryLabel: "OFFER",
            options: ["Physical products", "Digital products", "Services", NOT_SURE],
        },
        features: {
            question: "What should your shop include?",
            options: ["Product catalog", "Online payments", "Customer accounts", "Order management", NOT_SURE],
        },
        pattern: /shop|store|e-?commerce|sell|verkauf|laden|handel/,
    },
    app: {
        label: "Web Application",
        improveLabel: "Web Application Upgrade",
        detail: {
            question: "Who will use it?",
            summaryLabel: "AUDIENCE",
            options: ["Customers", "My team", "Both", NOT_SURE],
        },
        features: {
            question: "What should the application include?",
            options: ["User accounts", "Dashboard", "Payments", "Integrations", "Admin area", NOT_SURE],
        },
        pattern: /\bapp\b|application|platform|dashboard|software|anwendung|plattform/,
    },
    website: {
        label: "Website",
        improveLabel: "Website Upgrade",
        detail: {
            question: "What kind of business is it for?",
            summaryLabel: "BUSINESS",
            options: ["Small business", "Larger company", "Personal brand", "Just starting"],
        },
        features: {
            question: "What should your website include?",
            options: ["Several pages", "Contact form", "Blog or news", "Online booking", "Multiple languages", NOT_SURE],
        },
        pattern: /web ?site|landing|homepage|webseite|\bseite\b|\bsite\b/,
    },
    other: {
        label: "Digital Product",
        improveLabel: "Digital Product Upgrade",
        detail: {
            question: "Who will use it?",
            summaryLabel: "AUDIENCE",
            options: ["Customers", "My team", "Both", NOT_SURE],
        },
        features: {
            question: "What should it include?",
            options: ["User accounts", "Dashboard", "Payments", "Integrations", "Admin area", NOT_SURE],
        },
        pattern: /$^/,
    },
};

const IMPROVE_OPTIONS = [
    "Fresh design",
    "Faster performance",
    "New features",
    "Better mobile experience",
    "Updated content",
    NOT_SURE,
] as const;

const CATEGORY_OPTIONS: Record<string, CategoryId> = {
    Website: "website",
    "Web application": "app",
    "Online shop": "shop",
    Restaurant: "restaurant",
    "Something else": "other",
};

const BUDGET_OPTIONS = ["Under €1,000", "€1,000–€2,500", "€2,500+", NOT_SURE] as const;
const IMPROVE_PATTERN = /redesign|improve|upgrade|existing|relaunch|update|verbessern|bestehend|überarbeit|erneuer/;

export const INTRO_STEP: Step = {
    id: "intent",
    question: "Hi! What are you looking to create?",
    hint: "Tell me a little about your idea. We can take it from there.",
};

export function initialAnswers(): Answers {
    return { mode: "new" };
}

/** Keyword match for free text. Unrecognised text is kept out of the summary. */
export function classify(text: string): { category?: CategoryId; mode?: Mode } {
    const value = text.toLowerCase();
    const category = (["restaurant", "shop", "app", "website"] as const).find((id) =>
        CATEGORIES[id].pattern.test(value),
    );
    return { category, mode: IMPROVE_PATTERN.test(value) ? "improve" : undefined };
}

export function applyAnswer(answers: Answers, step: Step, value: string | string[]): Answers {
    const text = Array.isArray(value) ? value.join(", ") : value;

    switch (step.id) {
        case "intent": {
            const found = classify(text);
            return { ...answers, mode: found.mode ?? answers.mode, category: found.category };
        }
        case "category":
            return { ...answers, category: CATEGORY_OPTIONS[text] ?? classify(text).category ?? "other" };
        case "detail":
            return { ...answers, detail: text };
        case "features":
            return { ...answers, features: Array.isArray(value) ? value : [value] };
        case "budget":
            return { ...answers, budget: text };
        default:
            return answers;
    }
}

export function nextStep(answers: Answers): Step {
    const improve = answers.mode === "improve";
    const category = answers.category ? CATEGORIES[answers.category] : undefined;

    if (!category) {
        return {
            id: "category",
            question: improve ? "What would you like to improve?" : "What are you looking to build?",
            options: Object.keys(CATEGORY_OPTIONS),
        };
    }
    if (answers.detail === undefined) {
        return { id: "detail", ...category.detail, skippable: true };
    }
    if (!answers.features) {
        return {
            id: "features",
            question: improve ? "Which areas need the most attention?" : category.features.question,
            options: improve ? IMPROVE_OPTIONS : category.features.options,
            multi: true,
            skippable: true,
        };
    }
    if (answers.budget === undefined) {
        return { id: "budget", question: "Do you have a budget range in mind?", options: BUDGET_OPTIONS, skippable: true };
    }
    return { id: "summary", question: "Thanks! Here’s a short summary of your project." };
}

export type SummaryRow = readonly [label: string, value: string];

export function buildSummary(answers: Answers, t: (key: string) => string): SummaryRow[] {
    const category = CATEGORIES[answers.category ?? "other"];
    const improve = answers.mode === "improve";
    const rows: SummaryRow[] = [["PROJECT TYPE", t(improve ? category.improveLabel : category.label)]];

    if (answers.detail) rows.push([category.detail.summaryLabel, t(answers.detail)]);
    if (answers.features) rows.push([improve ? "IMPROVEMENTS" : "FEATURES", answers.features.map(t).join(", ")]);
    if (answers.budget) rows.push(["BUDGET", t(answers.budget)]);
    rows.push(["NEXT STEP", "Discuss the Project"]);

    return rows.map(([label, value]) => [t(label), t(value)] as const);
}

/** Opening user line for the two cards on the left. */
export const STARTERS: Record<Mode, string> = {
    new: "I have an idea for a website, app or digital product.",
    improve: "I want to upgrade an existing website or product.",
};
