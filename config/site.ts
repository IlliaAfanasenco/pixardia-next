export const siteConfig = {
    name: "Pixardia",

    title: "Pixardia — Custom Web, Mobile & Software Development Studio",

    description:
        "Pixardia helps businesses grow through custom software development. We design and build websites, mobile applications, Telegram bots, SaaS platforms, desktop software and automation solutions tailored to your goals.",

    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixardia.com",

    ogImage: "/og-image.jpg",

    keywords: [
        "software development company",
        "web development agency",
        "mobile app development",
        "custom software development",
        "Telegram bot development",
        "desktop application development",
        "SaaS development",
        "business automation",
        "React development",
        "Next.js agency",
        "UI UX design",
        "startup MVP development",
        "digital transformation",
        "custom business solutions",
        "web studio Germany",
        "software agency Germany",
        "Pixardia"
    ],

    links: {
        home: "/",
        services: "/services",
        projects: "/projects",
        contact: "/contact"
    },

    contact: {
        email: "hello@pixardia.com",
        telegram: "https://t.me/your_username"
    },

    creator: "Pixardia"
} as const;