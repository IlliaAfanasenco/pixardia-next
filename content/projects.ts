import {
    type LocalizedText,
    type Project,
    type ProjectStatus,
    type ProjectType,
    type ServiceCode,
} from "@/types/services";

export const projectTypeLabels = {
    client: {
        en: "Client project",
        de: "Kundenprojekt",
    },
    internal: {
        en: "Internal project",
        de: "Internes Projekt",
    },
    concept: {
        en: "Concept project",
        de: "Konzeptprojekt",
    },
    educational: {
        en: "Educational project",
        de: "Lernprojekt",
    },
} satisfies Record<ProjectType, LocalizedText>;

export const projectStatusLabels = {
    planned: {
        en: "Planned",
        de: "Geplant",
    },
    in_progress: {
        en: "In progress",
        de: "In Arbeit",
    },
    completed: {
        en: "Completed",
        de: "Abgeschlossen",
    },
} satisfies Record<ProjectStatus, LocalizedText>;

export const projects = [
    {
        slug: "pixardia-digital-studio",
        title: "Pixardia Digital Studio",
        type: "internal",
        status: "in_progress",
        summary: {
            en: "A multilingual portfolio and lead-generation platform for a modern digital product studio.",
            de: "Eine mehrsprachige Portfolio- und Leadgenerierungsplattform für ein modernes Digitalstudio.",
        },
        description: {
            en: "Pixardia presents the studio's services, technical capabilities and selected work through a clear visual system, multilingual content and practical tools for project enquiries.",
            de: "Pixardia präsentiert die Dienstleistungen, technischen Kompetenzen und ausgewählte Arbeiten des Studios durch ein klares visuelles System, mehrsprachige Inhalte und praktische Möglichkeiten für Projektanfragen.",
        },
        challenge: {
            en: "The original prototype had a strong visual direction but contained disconnected sections, placeholder content, inconsistent service data and unfinished contact and AI functionality.",
            de: "Der ursprüngliche Prototyp hatte eine starke visuelle Richtung, enthielt jedoch unverbundene Bereiche, Platzhalterinhalte, inkonsistente Servicedaten sowie unfertige Kontakt- und KI-Funktionen.",
        },
        solution: {
            en: "The platform is being rebuilt around a unified content model, production-ready lead processing, accessible interfaces, multilingual SEO and an AI-assisted consultation flow.",
            de: "Die Plattform wird auf Basis eines einheitlichen Inhaltsmodells, einer produktionsreifen Lead-Verarbeitung, barrierearmer Oberflächen, mehrsprachiger SEO und eines KI-gestützten Beratungsablaufs neu aufgebaut.",
        },
        serviceCodes: [
            "BUSINESS_WEBSITE",
            "WEB_APPLICATION",
            "UI_UX_DESIGN",
            "AI_AUTOMATION",
        ],
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "PostgreSQL",
            "Prisma",
            "DeepSeek",
        ],
        year: 2026,
        coverImage: null,
        images: [],
        liveUrl: null,
        repositoryUrl: null,
        featured: true,
        order: 1,
    },
    {
        slug: "nexus-finance",
        title: "Nexus Finance",
        type: "concept",
        status: "in_progress",
        summary: {
            en: "A finance management platform with account analytics, transaction monitoring and clear data visualisation.",
            de: "Eine Finanzmanagement-Plattform mit Kontoanalysen, Transaktionsüberwachung und verständlicher Datenvisualisierung.",
        },
        description: {
            en: "Nexus Finance explores how a complex financial product can remain structured, readable and easy to navigate across desktop and mobile interfaces.",
            de: "Nexus Finance zeigt, wie ein komplexes Finanzprodukt auf Desktop- und Mobilgeräten strukturiert, verständlich und einfach bedienbar bleiben kann.",
        },
        challenge: {
            en: "Financial platforms often display large amounts of sensitive and interconnected data, which can make everyday actions difficult to understand and increase the risk of user mistakes.",
            de: "Finanzplattformen zeigen häufig große Mengen sensibler und miteinander verbundener Daten, wodurch alltägliche Aktionen schwer verständlich werden und das Risiko von Bedienfehlern steigt.",
        },
        solution: {
            en: "The interface separates essential actions from secondary analytics, uses consistent visual hierarchy and provides focused views for balances, transactions, budgets and account activity.",
            de: "Die Benutzeroberfläche trennt wichtige Aktionen von ergänzenden Analysen, nutzt eine konsistente visuelle Hierarchie und bietet fokussierte Ansichten für Kontostände, Transaktionen, Budgets und Kontoaktivitäten.",
        },
        serviceCodes: [
            "WEB_APPLICATION",
            "UI_UX_DESIGN",
            "AI_AUTOMATION",
        ],
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "PostgreSQL",
            "Prisma",
            "Redis",
            "Docker",
        ],
        year: 2026,
        coverImage: null,
        images: [],
        liveUrl: null,
        repositoryUrl: null,
        featured: true,
        order: 2,
    },
    {
        slug: "nordmarkt-commerce",
        title: "Nordmarkt Commerce",
        type: "concept",
        status: "planned",
        summary: {
            en: "A modern e-commerce platform focused on simple product discovery and a frictionless buying experience.",
            de: "Eine moderne E-Commerce-Plattform mit einfacher Produktsuche und einem reibungslosen Einkaufserlebnis.",
        },
        description: {
            en: "Nordmarkt Commerce is designed as a scalable online store for a growing European brand, combining product presentation, catalogue management and a clear purchase flow.",
            de: "Nordmarkt Commerce ist als skalierbarer Onlineshop für eine wachsende europäische Marke konzipiert und verbindet Produktpräsentation, Katalogverwaltung und einen klaren Kaufprozess.",
        },
        challenge: {
            en: "Large product catalogues can quickly become difficult to browse, especially when filtering, mobile navigation and checkout are treated as separate parts of the experience.",
            de: "Große Produktkataloge können schnell unübersichtlich werden, insbesondere wenn Filterung, mobile Navigation und Checkout als getrennte Bestandteile betrachtet werden.",
        },
        solution: {
            en: "The planned platform combines structured categories, fast search, useful filters, responsive product pages and a focused checkout flow within one consistent interface.",
            de: "Die geplante Plattform verbindet strukturierte Kategorien, schnelle Suche, hilfreiche Filter, responsive Produktseiten und einen fokussierten Checkout in einer einheitlichen Benutzeroberfläche.",
        },
        serviceCodes: [
            "ECOMMERCE",
            "UI_UX_DESIGN",
            "MAINTENANCE_SUPPORT",
        ],
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "PostgreSQL",
            "Prisma",
            "Stripe",
        ],
        year: 2026,
        coverImage: null,
        images: [],
        liveUrl: null,
        repositoryUrl: null,
        featured: true,
        order: 3,
    },
    {
        slug: "coreflow-ai-workspace",
        title: "CoreFlow AI Workspace",
        type: "educational",
        status: "planned",
        summary: {
            en: "An AI-assisted workspace for organising requests, internal knowledge and repetitive business operations.",
            de: "Ein KI-gestützter Arbeitsbereich zur Organisation von Anfragen, internem Wissen und wiederkehrenden Geschäftsprozessen.",
        },
        description: {
            en: "CoreFlow explores a practical AI workspace where teams can process incoming requests, search internal information and automate routine actions without losing human oversight.",
            de: "CoreFlow untersucht einen praktischen KI-Arbeitsbereich, in dem Teams eingehende Anfragen bearbeiten, interne Informationen durchsuchen und Routineaufgaben automatisieren können, ohne die menschliche Kontrolle zu verlieren.",
        },
        challenge: {
            en: "Business information is often spread across messages, documents and separate tools, while repetitive requests consume time and produce inconsistent responses.",
            de: "Geschäftsinformationen sind häufig über Nachrichten, Dokumente und verschiedene Tools verteilt, während wiederkehrende Anfragen Zeit kosten und zu uneinheitlichen Antworten führen.",
        },
        solution: {
            en: "The planned workspace combines structured requests, searchable knowledge, AI-assisted responses, validation rules and clear escalation to a responsible team member.",
            de: "Der geplante Arbeitsbereich verbindet strukturierte Anfragen, durchsuchbares Wissen, KI-gestützte Antworten, Validierungsregeln und eine klare Weiterleitung an verantwortliche Teammitglieder.",
        },
        serviceCodes: [
            "WEB_APPLICATION",
            "AI_AUTOMATION",
            "UI_UX_DESIGN",
        ],
        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Node.js",
            "PostgreSQL",
            "Prisma",
            "DeepSeek",
        ],
        year: 2026,
        coverImage: null,
        images: [],
        liveUrl: null,
        repositoryUrl: null,
        featured: true,
        order: 4,
    },
] satisfies readonly Project[];

export type ProjectSlug = (typeof projects)[number]["slug"];

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(): Project[] {
    return projects
        .filter((project) => project.featured)
        .sort((first, second) => first.order - second.order);
}

export function getProjectsByServiceCode(
    code: ServiceCode,
): Project[] {
    return projects
        .filter((project) =>
            project.serviceCodes.some(
                (serviceCode) => serviceCode === code,
            ),
        )
        .sort((first, second) => first.order - second.order);
}

export function getProjectsByType(type: ProjectType): Project[] {
    return projects
        .filter((project) => project.type === type)
        .sort((first, second) => first.order - second.order);
}