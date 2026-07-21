const DEFAULT_DEVELOPMENT_URL = "http://localhost:3000";

export const siteLocales = ["en", "de"] as const;

export type SiteLocale = (typeof siteLocales)[number];

function getRequiredProductionValue(
    name: string,
    value: string | undefined,
): string {
    const normalizedValue = value?.trim() ?? "";

    if (!normalizedValue && process.env.NODE_ENV === "production") {
        throw new Error(`${name} must be configured for production.`);
    }

    return normalizedValue;
}

function normalizeSiteUrl(value: string | undefined): string {
    const normalizedValue = value?.trim();

    if (!normalizedValue) {
        if (process.env.NODE_ENV === "production") {
            throw new Error(
                "NEXT_PUBLIC_SITE_URL must be configured for production.",
            );
        }

        return DEFAULT_DEVELOPMENT_URL;
    }

    try {
        return new URL(normalizedValue).origin;
    } catch {
        throw new Error(
            "NEXT_PUBLIC_SITE_URL must be a valid absolute URL, for example https://pixardia.com.",
        );
    }
}

function normalizeOptionalUrl(
    name: string,
    value: string | undefined,
): string {
    const normalizedValue = value?.trim() ?? "";

    if (!normalizedValue) {
        return "";
    }

    try {
        return new URL(normalizedValue).toString();
    } catch {
        throw new Error(`${name} must be a valid absolute URL.`);
    }
}

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

const contactEmail = getRequiredProductionValue(
    "NEXT_PUBLIC_CONTACT_EMAIL",
    process.env.NEXT_PUBLIC_CONTACT_EMAIL,
);

const telegramUrl = normalizeOptionalUrl(
    "NEXT_PUBLIC_TELEGRAM_URL",
    process.env.NEXT_PUBLIC_TELEGRAM_URL,
);

const whatsappUrl = normalizeOptionalUrl(
    "NEXT_PUBLIC_WHATSAPP_URL",
    process.env.NEXT_PUBLIC_WHATSAPP_URL,
);

const linkedinUrl = normalizeOptionalUrl(
    "NEXT_PUBLIC_LINKEDIN_URL",
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
);

const githubUrl = normalizeOptionalUrl(
    "NEXT_PUBLIC_GITHUB_URL",
    process.env.NEXT_PUBLIC_GITHUB_URL,
);

export const siteConfig = {
    name: "Pixardia",
    shortName: "Pixardia",
    creator: "Pixardia Digital Studio",

    title: "Pixardia — Web, App & AI Product Studio",

    description:
        "Pixardia designs and develops modern websites, web applications, digital products and AI-powered business solutions for companies and startups.",

    url: siteUrl,
    defaultLocale: "en" satisfies SiteLocale,
    locales: siteLocales,

    ogImage: "/og-image.jpg",

    keywords: [
        "web development studio",
        "custom website development",
        "web application development",
        "business website development",
        "landing page development",
        "AI business automation",
        "Next.js development",
        "React development",
        "UI UX design",
        "startup MVP development",
        "software development Germany",
        "digital product studio",
        "Pixardia",
    ],

    links: {
        home: "/",
        services: "/services",
        projects: "/projects",
        contact: "/contact",
        privacy: "/privacy",
        imprint: "/imprint",
    },

    contact: {
        email: contactEmail,
        telegram: telegramUrl,
        whatsapp: whatsappUrl,
        linkedin: linkedinUrl,
        github: githubUrl,
    },

    serviceAreas: [
        "Germany",
        "European Union",
        "Ukraine",
        "Moldova",
        "Remote",
    ],

    socialLinks: [
        {
            label: "Telegram",
            href: telegramUrl,
        },
        {
            label: "WhatsApp",
            href: whatsappUrl,
        },
        {
            label: "LinkedIn",
            href: linkedinUrl,
        },
        {
            label: "GitHub",
            href: githubUrl,
        },
    ].filter((item) => item.href.length > 0),
} as const;

export type SiteConfig = typeof siteConfig;