import {
    type Service,
    type ServiceCode,
    type ServiceOption,
} from "@/types/services";

export const services = [
    {
        code: "BUSINESS_WEBSITE",
        slug: "business-website",
        title: {
            en: "Business Website",
            de: "Unternehmenswebsites",
        },
        shortDescription: {
            en: "Professional websites built to strengthen trust, communicate value and generate qualified enquiries.",
            de: "Professionelle Websites, die Ihr Unternehmen präsentieren und qualifizierte Anfragen generieren.",
        },
        description: {
            en: "We create high-performance business websites that turn complex offers into clear user journeys and dependable enquiry channels.",
            de: "Wir konzipieren und entwickeln schnelle, responsive und suchmaschinenfreundliche Websites für Unternehmen, die einen starken und vertrauenswürdigen Online-Auftritt benötigen.",
        },
        deliverables: {
            en: [
                "responsive website",
                "content structure",
                "contact and enquiry forms",
                "basic technical SEO",
                "analytics integration",
                "deployment support",
            ],
            de: [
                "responsive Website",
                "Inhaltsstruktur",
                "Kontakt- und Anfrageformulare",
                "technische SEO-Grundlagen",
                "Analytics-Integration",
                "Unterstützung beim Deployment",
            ],
        },
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "PostgreSQL",
        ],
        timeline: {
            en: "Usually 3–6 weeks",
            de: "In der Regel 3–6 Wochen",
        },
        priceFrom: null,
        featured: true,
        order: 1,
    },
    {
        code: "LANDING_PAGE",
        slug: "landing-page",
        title: {
            en: "Landing Page",
            de: "Landingpages",
        },
        shortDescription: {
            en: "Focused campaign experiences designed to present an offer clearly and guide visitors towards action.",
            de: "Fokussierte Landingpages für Kampagnen, Produkte, Dienstleistungen und Leadgenerierung.",
        },
        description: {
            en: "We combine focused messaging, intentional UX and fast frontend delivery to support campaigns, launches and lead generation.",
            de: "Wir erstellen conversion-orientierte Landingpages mit klaren Botschaften, überzeugenden Handlungsaufforderungen und schnellen Ladezeiten.",
        },
        deliverables: {
            en: [
                "page structure",
                "responsive design",
                "lead form",
                "analytics integration",
                "basic SEO setup",
                "deployment",
            ],
            de: [
                "Seitenstruktur",
                "responsives Design",
                "Lead-Formular",
                "Analytics-Integration",
                "grundlegende SEO-Einrichtung",
                "Deployment",
            ],
        },
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
        ],
        timeline: {
            en: "Usually 1–3 weeks",
            de: "In der Regel 1–3 Wochen",
        },
        priceFrom: null,
        featured: true,
        order: 2,
    },
    {
        code: "WEB_APPLICATION",
        slug: "web-application",
        title: {
            en: "Web Application",
            de: "Webanwendungen",
        },
        shortDescription: {
            en: "Custom digital platforms, dashboards and internal tools built around specific workflows.",
            de: "Individuelle Webplattformen, Dashboards, Portale und interne Geschäftstools.",
        },
        description: {
            en: "We design and engineer scalable web applications around real operations, user roles, data flows and long-term product goals.",
            de: "Wir entwickeln zuverlässige Webanwendungen, die auf Geschäftsprozesse, Nutzer und langfristige Produktziele zugeschnitten sind.",
        },
        deliverables: {
            en: [
                "product architecture",
                "responsive interface",
                "authentication",
                "database integration",
                "API development",
                "deployment support",
            ],
            de: [
                "Produktarchitektur",
                "responsive Benutzeroberfläche",
                "Authentifizierung",
                "Datenbankintegration",
                "API-Entwicklung",
                "Unterstützung beim Deployment",
            ],
        },
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Node.js",
            "PostgreSQL",
            "Prisma",
        ],
        timeline: {
            en: "Usually 6–14 weeks",
            de: "In der Regel 6–14 Wochen",
        },
        priceFrom: null,
        featured: true,
        order: 3,
    },
    {
        code: "ECOMMERCE",
        slug: "ecommerce",
        title: {
            en: "E-commerce",
            de: "E-Commerce",
        },
        shortDescription: {
            en: "Reliable online stores with clear navigation, practical management and frictionless purchasing journeys.",
            de: "Moderne Onlineshops mit klarer Produktsuche und einem komfortablen Einkaufserlebnis.",
        },
        description: {
            en: "We build scalable commerce platforms that connect catalogue management, product discovery, checkout and essential integrations.",
            de: "Wir entwickeln skalierbare E-Commerce-Lösungen mit Produktkatalogen, Integrationen und einem klaren Weg vom Entdecken bis zum Kauf.",
        },
        deliverables: {
            en: [
                "product catalogue",
                "product and category pages",
                "shopping cart",
                "checkout integration",
                "order workflow",
                "analytics setup",
            ],
            de: [
                "Produktkatalog",
                "Produkt- und Kategorieseiten",
                "Warenkorb",
                "Checkout-Integration",
                "Bestellprozess",
                "Analytics-Einrichtung",
            ],
        },
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "PostgreSQL",
            "Stripe",
        ],
        timeline: {
            en: "Usually 6–12 weeks",
            de: "In der Regel 6–12 Wochen",
        },
        priceFrom: null,
        featured: false,
        order: 4,
    },
    {
        code: "WEBSITE_REDESIGN",
        slug: "website-redesign",
        title: {
            en: "Website Redesign",
            de: "Website-Redesign",
        },
        shortDescription: {
            en: "Strategic improvements to outdated websites, including structure, visuals, usability and performance.",
            de: "Eine vollständige visuelle und technische Erneuerung einer bestehenden Website.",
        },
        description: {
            en: "We turn outdated websites into clear, responsive and maintainable digital platforms without losing valuable existing content.",
            de: "Wir verbessern veraltete Websites durch eine neue Inhaltsstruktur, eine moderne Benutzeroberfläche und eine stabile technische Grundlage.",
        },
        deliverables: {
            en: [
                "website audit",
                "content restructuring",
                "interface redesign",
                "responsive development",
                "performance improvements",
                "migration support",
            ],
            de: [
                "Website-Audit",
                "Neustrukturierung der Inhalte",
                "Redesign der Benutzeroberfläche",
                "responsive Entwicklung",
                "Performance-Optimierung",
                "Unterstützung bei der Migration",
            ],
        },
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
        ],
        timeline: {
            en: "Usually 3–8 weeks",
            de: "In der Regel 3–8 Wochen",
        },
        priceFrom: null,
        featured: false,
        order: 5,
    },
    {
        code: "UI_UX_DESIGN",
        slug: "ui-ux-design",
        title: {
            en: "UX & UI Design",
            de: "UI- und UX-Design",
        },
        shortDescription: {
            en: "Intuitive user journeys and consistent interface systems designed around real tasks.",
            de: "Klare Benutzeroberflächen und Nutzerabläufe für Websites und digitale Produkte.",
        },
        description: {
            en: "We translate product requirements into usable flows, responsive interfaces and scalable design systems ready for engineering.",
            de: "Wir verwandeln Produktanforderungen in verständliche Nutzerabläufe, strukturierte Benutzeroberflächen und konsistente visuelle Systeme.",
        },
        deliverables: {
            en: [
                "user flows",
                "wireframes",
                "responsive layouts",
                "interface design",
                "component system",
                "developer handoff",
            ],
            de: [
                "User Flows",
                "Wireframes",
                "responsive Layouts",
                "Interface-Design",
                "Komponentensystem",
                "Übergabe an die Entwicklung",
            ],
        },
        technologies: ["Figma", "Design Systems", "Prototyping"],
        timeline: {
            en: "Usually 2–6 weeks",
            de: "In der Regel 2–6 Wochen",
        },
        priceFrom: null,
        featured: false,
        order: 6,
    },
    {
        code: "AI_AUTOMATION",
        slug: "ai-automation",
        title: {
            en: "AI & Automation",
            de: "KI-Automatisierung",
        },
        shortDescription: {
            en: "Smart integrations and automated workflows that reduce repetitive work and improve efficiency.",
            de: "Praktische KI-Lösungen zur Automatisierung von Kommunikation, Analyse und wiederkehrenden Abläufen.",
        },
        description: {
            en: "We connect AI services, business data and validation rules to automate useful work while preserving control and human oversight.",
            de: "Wir integrieren KI in Websites und Geschäftsprozesse, wenn sie einen messbaren praktischen Nutzen schafft und keine unnötige Komplexität erzeugt.",
        },
        deliverables: {
            en: [
                "workflow analysis",
                "AI assistant integration",
                "structured prompts",
                "API integration",
                "guardrails and validation",
                "usage documentation",
            ],
            de: [
                "Analyse der Arbeitsabläufe",
                "Integration eines KI-Assistenten",
                "strukturierte Prompts",
                "API-Integration",
                "Schutzmechanismen und Validierung",
                "Nutzungsdokumentation",
            ],
        },
        technologies: [
            "DeepSeek",
            "OpenAI",
            "Next.js",
            "Node.js",
            "TypeScript",
        ],
        timeline: {
            en: "Usually 2–8 weeks",
            de: "In der Regel 2–8 Wochen",
        },
        priceFrom: null,
        featured: true,
        order: 7,
    },
    {
        code: "MAINTENANCE_SUPPORT",
        slug: "maintenance-support",
        title: {
            en: "Maintenance & Support",
            de: "Wartung und Support",
        },
        shortDescription: {
            en: "Ongoing technical support, security updates, performance improvements and product development.",
            de: "Laufende technische Wartung, Verbesserungen und Produktsupport.",
        },
        description: {
            en: "We keep digital products stable, secure and current while delivering planned improvements after launch.",
            de: "Wir halten digitale Produkte stabil, sicher und aktuell und setzen geplante Verbesserungen um.",
        },
        deliverables: {
            en: [
                "dependency updates",
                "bug fixes",
                "performance monitoring",
                "small improvements",
                "technical consultation",
                "release support",
            ],
            de: [
                "Abhängigkeitsupdates",
                "Fehlerbehebungen",
                "Performance-Monitoring",
                "kleinere Verbesserungen",
                "technische Beratung",
                "Release-Unterstützung",
            ],
        },
        technologies: [
            "Next.js",
            "React",
            "Node.js",
            "PostgreSQL",
        ],
        timeline: {
            en: "Monthly or on demand",
            de: "Monatlich oder nach Bedarf",
        },
        priceFrom: null,
        featured: false,
        order: 8,
    },
] satisfies readonly Service[];

export const serviceOptions: ServiceOption[] = services.map((service) => ({
    value: service.code,
    label: service.title.en,
}));

export function getServiceBySlug(slug: string): Service | undefined {
    return services.find((service) => service.slug === slug);
}

export function getServiceByCode(
    code: ServiceCode,
): Service | undefined {
    return services.find((service) => service.code === code);
}

export function getFeaturedServices(): Service[] {
    return services
        .filter((service) => service.featured)
        .sort((first, second) => first.order - second.order);
}
