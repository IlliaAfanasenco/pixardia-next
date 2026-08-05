import {
    type LocalizedText,
    type Project,
    type ProjectStatus,
    type ProjectType,
    type ServiceCode,
} from "@/types/services";

function text(
    en: string,
    de: string,
): LocalizedText {
    return {
        en,
        de,
    };
}

export const projectTypeLabels = {
    client: text(
        "Client project",
        "Kundenprojekt",
    ),
    internal: text(
        "Internal project",
        "Internes Projekt",
    ),
    concept: text(
        "Concept project",
        "Konzeptprojekt",
    ),
    educational: text(
        "Educational project",
        "Lernprojekt",
    ),
} satisfies Record<ProjectType, LocalizedText>;

export const projectStatusLabels = {
    planned: text(
        "Planned",
        "Geplant",
    ),
    in_progress: text(
        "In progress",
        "In Arbeit",
    ),
    completed: text(
        "Completed",
        "Abgeschlossen",
    ),
} satisfies Record<ProjectStatus, LocalizedText>;

export const projects = [
    {
        slug: "pixardia-digital-studio",
        title: "Pixardia Digital Studio",
        type: "internal",
        status: "in_progress",
        summary: text(
            "A multilingual portfolio and lead-generation platform for a modern digital product studio.",
            "Eine mehrsprachige Portfolio- und Leadgenerierungsplattform für ein modernes Digitalstudio.",
        ),
        description: text(
            "Pixardia presents the studio's services, technical capabilities and selected work through a clear visual system, multilingual content and practical tools for project enquiries.",
            "Pixardia präsentiert die Dienstleistungen, technischen Kompetenzen und ausgewählte Arbeiten des Studios durch ein klares visuelles System, mehrsprachige Inhalte und praktische Möglichkeiten für Projektanfragen.",
        ),
        challenge: text(
            "The original prototype had a strong visual direction but contained disconnected sections, placeholder content, inconsistent service data and unfinished contact and AI functionality.",
            "Der ursprüngliche Prototyp hatte eine starke visuelle Richtung, enthielt jedoch unverbundene Bereiche, Platzhalterinhalte, inkonsistente Servicedaten sowie unfertige Kontakt- und KI-Funktionen.",
        ),
        solution: text(
            "The platform is being rebuilt around a unified content model, production-ready lead processing, accessible interfaces, multilingual SEO and an AI-assisted consultation flow.",
            "Die Plattform wird auf Basis eines einheitlichen Inhaltsmodells, einer produktionsreifen Lead-Verarbeitung, barrierearmer Oberflächen, mehrsprachiger SEO und eines KI-gestützten Beratungsablaufs neu aufgebaut.",
        ),
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
            "Upstash Redis",
            "DeepSeek",
        ],
        year: 2026,
        coverImage: null,
        images: [],
        liveUrl: null,
        repositoryUrl: null,
        featured: true,
        order: 1,
        caseStudy: {
            identifier: "PX-2026-001",
            subtitle: text(
                "A production-focused studio platform built around clear services, reliable lead intake and an AI-assisted consultation flow.",
                "Eine produktionsorientierte Studio-Plattform mit klaren Dienstleistungen, zuverlässiger Lead-Erfassung und einem KI-gestützten Beratungsablauf.",
            ),
            role: text(
                "Product strategy, UX architecture, frontend, backend and platform hardening.",
                "Produktstrategie, UX-Architektur, Frontend, Backend und technische Härtung der Plattform.",
            ),
            client: null,
            engagement: text(
                "Internal studio product",
                "Internes Studioprodukt",
            ),
            architecture: text(
                "A Next.js App Router application with typed content, server-side API routes, PostgreSQL and Prisma lead handling, and optional Redis-backed rate limiting.",
                "Eine Next.js-App-Router-Anwendung mit typisierten Inhalten, serverseitigen API-Routen, Lead-Verarbeitung mit PostgreSQL und Prisma sowie optionalem Redis-basiertem Rate Limiting.",
            ),
            facts: [
                {
                    label: text(
                        "Delivery stage",
                        "Projektphase",
                    ),
                    value: text(
                        "Production hardening",
                        "Produktionshärtung",
                    ),
                },
                {
                    label: text(
                        "Primary audience",
                        "Zielgruppe",
                    ),
                    value: text(
                        "Companies and startups",
                        "Unternehmen und Start-ups",
                    ),
                },
                {
                    label: text(
                        "Service region",
                        "Leistungsregion",
                    ),
                    value: text(
                        "Europe and remote",
                        "Europa und Remote",
                    ),
                },
            ],
            technologyGroups: [
                {
                    label: text(
                        "Interface",
                        "Benutzeroberfläche",
                    ),
                    items: [
                        "Next.js",
                        "React",
                        "TypeScript",
                        "Tailwind CSS",
                    ],
                },
                {
                    label: text(
                        "Platform and data",
                        "Plattform und Daten",
                    ),
                    items: [
                        "PostgreSQL",
                        "Prisma",
                        "Upstash Redis",
                        "DeepSeek",
                    ],
                },
            ],
            visualSystem: {
                colors: [
                    {
                        label: text(
                            "Primary",
                            "Primärfarbe",
                        ),
                        value: "#1E1E1E",
                    },
                    {
                        label: text(
                            "Accent",
                            "Akzentfarbe",
                        ),
                        value: "#5E56E7",
                    },
                    {
                        label: text(
                            "Surface",
                            "Fläche",
                        ),
                        value: "#FEFEFE",
                    },
                ],
                typeface:
                    "REM / Archivo / system sans",
            },
            qualitySignals: [
                {
                    label: text(
                        "Build verification",
                        "Build-Verifizierung",
                    ),
                    value: text(
                        "Verified locally",
                        "Lokal verifiziert",
                    ),
                    evidence: "verified",
                },
                {
                    label: text(
                        "API runtime checks",
                        "API-Laufzeitprüfungen",
                    ),
                    value: text(
                        "Verified locally",
                        "Lokal verifiziert",
                    ),
                    evidence: "verified",
                },
                {
                    label: text(
                        "Production telemetry",
                        "Produktions-Telemetrie",
                    ),
                    value: text(
                        "Pending deployment",
                        "Ausstehend bis zur Bereitstellung",
                    ),
                    evidence: "not_measured",
                },
            ],
            presentation: {
                desktopDirection: "left",
                centerLabel: text(
                    "Open system record",
                    "Systemakte öffnen",
                ),
            },
        },
    },
    {
        slug: "nexus-finance",
        title: "Nexus Finance",
        type: "concept",
        status: "in_progress",
        summary: text(
            "A finance management platform with account analytics, transaction monitoring and clear data visualisation.",
            "Eine Finanzmanagement-Plattform mit Kontoanalysen, Transaktionsüberwachung und verständlicher Datenvisualisierung.",
        ),
        description: text(
            "Nexus Finance explores how a complex financial product can remain structured, readable and easy to navigate across desktop and mobile interfaces.",
            "Nexus Finance zeigt, wie ein komplexes Finanzprodukt auf Desktop- und Mobilgeräten strukturiert, verständlich und einfach bedienbar bleiben kann.",
        ),
        challenge: text(
            "Financial platforms often display large amounts of sensitive and interconnected data, which can make everyday actions difficult to understand and increase the risk of user mistakes.",
            "Finanzplattformen zeigen häufig große Mengen sensibler und miteinander verbundener Daten, wodurch alltägliche Aktionen schwer verständlich werden und das Risiko von Bedienfehlern steigt.",
        ),
        solution: text(
            "The interface separates essential actions from secondary analytics, uses consistent visual hierarchy and provides focused views for balances, transactions, budgets and account activity.",
            "Die Benutzeroberfläche trennt wichtige Aktionen von ergänzenden Analysen, nutzt eine konsistente visuelle Hierarchie und bietet fokussierte Ansichten für Kontostände, Transaktionen, Budgets und Kontoaktivitäten.",
        ),
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
        caseStudy: {
            identifier: "NX-2026-002",
            subtitle: text(
                "A structured finance workspace designed to make balances, transactions and analytics easier to understand.",
                "Ein strukturierter Finanzarbeitsbereich, der Kontostände, Transaktionen und Analysen leichter verständlich macht.",
            ),
            role: text(
                "Product concept, UX architecture and interface system.",
                "Produktkonzept, UX-Architektur und Interface-System.",
            ),
            client: null,
            engagement: text(
                "Independent concept study",
                "Unabhängige Konzeptstudie",
            ),
            architecture: text(
                "A modular finance dashboard concept that separates account data, transaction workflows, budgets and analytical views into focused product areas.",
                "Ein modulares Finanz-Dashboard-Konzept, das Kontodaten, Transaktionsabläufe, Budgets und analytische Ansichten in klar abgegrenzte Produktbereiche aufteilt.",
            ),
            facts: [
                {
                    label: text(
                        "Product stage",
                        "Produktphase",
                    ),
                    value: text(
                        "Concept development",
                        "Konzeptentwicklung",
                    ),
                },
                {
                    label: text(
                        "Domain",
                        "Bereich",
                    ),
                    value: text(
                        "Finance management",
                        "Finanzmanagement",
                    ),
                },
                {
                    label: text(
                        "Evidence status",
                        "Nachweisstatus",
                    ),
                    value: text(
                        "No public client or production deployment",
                        "Kein öffentlicher Kunde und keine Produktionsbereitstellung",
                    ),
                },
            ],
            technologyGroups: [
                {
                    label: text(
                        "Product interface",
                        "Produktoberfläche",
                    ),
                    items: [
                        "Next.js",
                        "React",
                        "TypeScript",
                    ],
                },
                {
                    label: text(
                        "Data platform",
                        "Datenplattform",
                    ),
                    items: [
                        "PostgreSQL",
                        "Prisma",
                        "Redis",
                        "Docker",
                    ],
                },
            ],
            visualSystem: {
                colors: [
                    {
                        label: text(
                            "Primary",
                            "Primärfarbe",
                        ),
                        value: "#0B1020",
                    },
                    {
                        label: text(
                            "Accent",
                            "Akzentfarbe",
                        ),
                        value: "#6C63FF",
                    },
                    {
                        label: text(
                            "Surface",
                            "Fläche",
                        ),
                        value: "#F5F7FB",
                    },
                ],
                typeface:
                    "Inter Tight / JetBrains Mono",
            },
            qualitySignals: [
                {
                    label: text(
                        "Performance evidence",
                        "Performance-Nachweis",
                    ),
                    value: text(
                        "Not measured",
                        "Nicht gemessen",
                    ),
                    evidence: "not_measured",
                },
                {
                    label: text(
                        "Accessibility",
                        "Barrierefreiheit",
                    ),
                    value: text(
                        "Design target defined",
                        "Designziel definiert",
                    ),
                    evidence: "target",
                },
                {
                    label: text(
                        "Responsive validation",
                        "Responsive Validierung",
                    ),
                    value: text(
                        "Implementation pending",
                        "Implementierung ausstehend",
                    ),
                    evidence: "target",
                },
            ],
            presentation: {
                desktopDirection: "right",
                centerLabel: text(
                    "Inspect finance system",
                    "Finanzsystem prüfen",
                ),
            },
        },
    },
    {
        slug: "nordmarkt-commerce",
        title: "Nordmarkt Commerce",
        type: "concept",
        status: "planned",
        summary: text(
            "A modern e-commerce platform focused on simple product discovery and a frictionless buying experience.",
            "Eine moderne E-Commerce-Plattform mit einfacher Produktsuche und einem reibungslosen Einkaufserlebnis.",
        ),
        description: text(
            "Nordmarkt Commerce is designed as a scalable online store for a growing European brand, combining product presentation, catalogue management and a clear purchase flow.",
            "Nordmarkt Commerce ist als skalierbarer Onlineshop für eine wachsende europäische Marke konzipiert und verbindet Produktpräsentation, Katalogverwaltung und einen klaren Kaufprozess.",
        ),
        challenge: text(
            "Large product catalogues can quickly become difficult to browse, especially when filtering, mobile navigation and checkout are treated as separate parts of the experience.",
            "Große Produktkataloge können schnell unübersichtlich werden, insbesondere wenn Filterung, mobile Navigation und Checkout als getrennte Bestandteile betrachtet werden.",
        ),
        solution: text(
            "The planned platform combines structured categories, fast search, useful filters, responsive product pages and a focused checkout flow within one consistent interface.",
            "Die geplante Plattform verbindet strukturierte Kategorien, schnelle Suche, hilfreiche Filter, responsive Produktseiten und einen fokussierten Checkout in einer einheitlichen Benutzeroberfläche.",
        ),
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
        caseStudy: {
            identifier: "NM-2026-003",
            subtitle: text(
                "A commerce concept that connects product discovery, catalogue structure and checkout within one consistent experience.",
                "Ein Commerce-Konzept, das Produktsuche, Katalogstruktur und Checkout in einem konsistenten Erlebnis verbindet.",
            ),
            role: text(
                "Commerce strategy, user-flow design and scalable interface architecture.",
                "Commerce-Strategie, User-Flow-Design und skalierbare Interface-Architektur.",
            ),
            client: null,
            engagement: text(
                "Independent commerce concept",
                "Unabhängiges Commerce-Konzept",
            ),
            architecture: text(
                "A planned storefront architecture with structured catalogue data, search and filtering, responsive product pages and an isolated checkout flow.",
                "Eine geplante Storefront-Architektur mit strukturierten Katalogdaten, Suche und Filtern, responsiven Produktseiten und einem getrennten Checkout-Ablauf.",
            ),
            facts: [
                {
                    label: text(
                        "Product stage",
                        "Produktphase",
                    ),
                    value: text(
                        "Planned concept",
                        "Geplantes Konzept",
                    ),
                },
                {
                    label: text(
                        "Domain",
                        "Bereich",
                    ),
                    value: text(
                        "European e-commerce",
                        "Europäischer E-Commerce",
                    ),
                },
                {
                    label: text(
                        "Evidence status",
                        "Nachweisstatus",
                    ),
                    value: text(
                        "No public client or production deployment",
                        "Kein öffentlicher Kunde und keine Produktionsbereitstellung",
                    ),
                },
            ],
            technologyGroups: [
                {
                    label: text(
                        "Storefront",
                        "Storefront",
                    ),
                    items: [
                        "Next.js",
                        "React",
                        "TypeScript",
                    ],
                },
                {
                    label: text(
                        "Commerce platform",
                        "Commerce-Plattform",
                    ),
                    items: [
                        "PostgreSQL",
                        "Prisma",
                        "Stripe",
                    ],
                },
            ],
            visualSystem: {
                colors: [
                    {
                        label: text(
                            "Primary",
                            "Primärfarbe",
                        ),
                        value: "#1F2A24",
                    },
                    {
                        label: text(
                            "Accent",
                            "Akzentfarbe",
                        ),
                        value: "#D98B4D",
                    },
                    {
                        label: text(
                            "Surface",
                            "Fläche",
                        ),
                        value: "#F7F2E8",
                    },
                ],
                typeface:
                    "Manrope / system sans",
            },
            qualitySignals: [
                {
                    label: text(
                        "Catalogue performance",
                        "Katalog-Performance",
                    ),
                    value: text(
                        "Target defined",
                        "Ziel definiert",
                    ),
                    evidence: "target",
                },
                {
                    label: text(
                        "Checkout validation",
                        "Checkout-Validierung",
                    ),
                    value: text(
                        "Implementation pending",
                        "Implementierung ausstehend",
                    ),
                    evidence: "target",
                },
                {
                    label: text(
                        "Production metrics",
                        "Produktionsmetriken",
                    ),
                    value: text(
                        "Not measured",
                        "Nicht gemessen",
                    ),
                    evidence: "not_measured",
                },
            ],
            presentation: {
                desktopDirection: "left",
                centerLabel: text(
                    "Open commerce record",
                    "Commerce-Akte öffnen",
                ),
            },
        },
    },
    {
        slug: "coreflow-ai-workspace",
        title: "CoreFlow AI Workspace",
        type: "educational",
        status: "planned",
        summary: text(
            "An AI-assisted workspace for organising requests, internal knowledge and repetitive business operations.",
            "Ein KI-gestützter Arbeitsbereich zur Organisation von Anfragen, internem Wissen und wiederkehrenden Geschäftsprozessen.",
        ),
        description: text(
            "CoreFlow explores a practical AI workspace where teams can process incoming requests, search internal information and automate routine actions without losing human oversight.",
            "CoreFlow untersucht einen praktischen KI-Arbeitsbereich, in dem Teams eingehende Anfragen bearbeiten, interne Informationen durchsuchen und Routineaufgaben automatisieren können, ohne die menschliche Kontrolle zu verlieren.",
        ),
        challenge: text(
            "Business information is often spread across messages, documents and separate tools, while repetitive requests consume time and produce inconsistent responses.",
            "Geschäftsinformationen sind häufig über Nachrichten, Dokumente und verschiedene Tools verteilt, während wiederkehrende Anfragen Zeit kosten und zu uneinheitlichen Antworten führen.",
        ),
        solution: text(
            "The planned workspace combines structured requests, searchable knowledge, AI-assisted responses, validation rules and clear escalation to a responsible team member.",
            "Der geplante Arbeitsbereich verbindet strukturierte Anfragen, durchsuchbares Wissen, KI-gestützte Antworten, Validierungsregeln und eine klare Weiterleitung an verantwortliche Teammitglieder.",
        ),
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
        caseStudy: {
            identifier: "CF-2026-004",
            subtitle: text(
                "An educational AI workspace concept built around structured requests, searchable knowledge and human-controlled automation.",
                "Ein edukatives KI-Workspace-Konzept für strukturierte Anfragen, durchsuchbares Wissen und menschlich kontrollierte Automatisierung.",
            ),
            role: text(
                "Workflow research, AI interaction design and application architecture.",
                "Workflow-Research, KI-Interaktionsdesign und Anwendungsarchitektur.",
            ),
            client: null,
            engagement: text(
                "Educational prototype concept",
                "Edukatives Prototyp-Konzept",
            ),
            architecture: text(
                "A planned human-in-the-loop workspace with structured request intake, searchable knowledge, validated AI responses and explicit escalation paths.",
                "Ein geplanter Human-in-the-Loop-Arbeitsbereich mit strukturierter Anfrageerfassung, durchsuchbarem Wissen, validierten KI-Antworten und eindeutigen Eskalationswegen.",
            ),
            facts: [
                {
                    label: text(
                        "Product stage",
                        "Produktphase",
                    ),
                    value: text(
                        "Educational planning",
                        "Edukative Planung",
                    ),
                },
                {
                    label: text(
                        "Domain",
                        "Bereich",
                    ),
                    value: text(
                        "AI-assisted operations",
                        "KI-gestützte Abläufe",
                    ),
                },
                {
                    label: text(
                        "Control model",
                        "Kontrollmodell",
                    ),
                    value: text(
                        "Human review required",
                        "Menschliche Prüfung erforderlich",
                    ),
                },
            ],
            technologyGroups: [
                {
                    label: text(
                        "Application",
                        "Anwendung",
                    ),
                    items: [
                        "Next.js",
                        "React",
                        "TypeScript",
                        "Node.js",
                    ],
                },
                {
                    label: text(
                        "Knowledge and AI",
                        "Wissen und KI",
                    ),
                    items: [
                        "PostgreSQL",
                        "Prisma",
                        "DeepSeek",
                    ],
                },
            ],
            visualSystem: {
                colors: [
                    {
                        label: text(
                            "Primary",
                            "Primärfarbe",
                        ),
                        value: "#111827",
                    },
                    {
                        label: text(
                            "Accent",
                            "Akzentfarbe",
                        ),
                        value: "#22C55E",
                    },
                    {
                        label: text(
                            "Surface",
                            "Fläche",
                        ),
                        value: "#F8FAFC",
                    },
                ],
                typeface:
                    "IBM Plex Sans / JetBrains Mono",
            },
            qualitySignals: [
                {
                    label: text(
                        "AI evaluation",
                        "KI-Evaluierung",
                    ),
                    value: text(
                        "Evaluation plan required",
                        "Evaluierungsplan erforderlich",
                    ),
                    evidence: "target",
                },
                {
                    label: text(
                        "Human oversight",
                        "Menschliche Kontrolle",
                    ),
                    value: text(
                        "Required by design",
                        "Im Design vorgeschrieben",
                    ),
                    evidence: "target",
                },
                {
                    label: text(
                        "Production evidence",
                        "Produktionsnachweis",
                    ),
                    value: text(
                        "Not measured",
                        "Nicht gemessen",
                    ),
                    evidence: "not_measured",
                },
            ],
            presentation: {
                desktopDirection: "right",
                centerLabel: text(
                    "Inspect workflow record",
                    "Workflow-Akte prüfen",
                ),
            },
        },
    },
] as const satisfies readonly Project[];

function assertProjectContract(
    items: readonly Project[],
): void {
    const slugs = new Set<string>();
    const identifiers = new Set<string>();
    const orders = new Set<number>();

    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
    const identifierPattern =
        /^[A-Z]{2}-\d{4}-\d{3}$/u;

    const colorPattern =
        /^#[0-9A-F]{6}$/iu;

    for (const project of items) {
        if (!slugPattern.test(project.slug)) {
            throw new Error(
                `Invalid project slug: ${project.slug}`,
            );
        }

        if (slugs.has(project.slug)) {
            throw new Error(
                `Duplicate project slug: ${project.slug}`,
            );
        }

        slugs.add(project.slug);

        if (
            !identifierPattern.test(
                project.caseStudy.identifier,
            )
        ) {
            throw new Error(
                `Invalid case identifier for ${project.slug}: ${project.caseStudy.identifier}`,
            );
        }

        if (
            identifiers.has(
                project.caseStudy.identifier,
            )
        ) {
            throw new Error(
                `Duplicate case identifier: ${project.caseStudy.identifier}`,
            );
        }

        identifiers.add(
            project.caseStudy.identifier,
        );

        if (orders.has(project.order)) {
            throw new Error(
                `Duplicate project order: ${project.order}`,
            );
        }

        orders.add(project.order);

        if (
            project.type === "client" &&
            !project.caseStudy.client
        ) {
            throw new Error(
                `Client project ${project.slug} requires a client name.`,
            );
        }

        if (
            project.caseStudy.technologyGroups.length ===
            0
        ) {
            throw new Error(
                `Project ${project.slug} requires technology groups.`,
            );
        }

        for (
            const group of
            project.caseStudy.technologyGroups
            ) {
            if (group.items.length === 0) {
                throw new Error(
                    `Project ${project.slug} contains an empty technology group.`,
                );
            }

            for (const technology of group.items) {
                if (
                    !project.technologies.includes(
                        technology,
                    )
                ) {
                    throw new Error(
                        `Technology ${technology} in ${project.slug} is missing from the canonical technology list.`,
                    );
                }
            }
        }

        if (
            project.caseStudy.visualSystem.colors
                .length < 3
        ) {
            throw new Error(
                `Project ${project.slug} requires at least three visual-system colors.`,
            );
        }

        for (
            const color of
            project.caseStudy.visualSystem.colors
            ) {
            if (!colorPattern.test(color.value)) {
                throw new Error(
                    `Invalid color ${color.value} in project ${project.slug}.`,
                );
            }
        }

        if (
            project.caseStudy.qualitySignals.length ===
            0
        ) {
            throw new Error(
                `Project ${project.slug} requires quality signals.`,
            );
        }

        const media = [
            ...(project.coverImage
                ? [project.coverImage]
                : []),
            ...project.images,
        ];

        for (const asset of media) {
            if (!asset.src.startsWith("/")) {
                throw new Error(
                    `Project media path must start with /: ${asset.src}`,
                );
            }

            if (
                asset.width <= 0 ||
                asset.height <= 0
            ) {
                throw new Error(
                    `Project media dimensions must be positive: ${asset.src}`,
                );
            }

            if (
                !asset.alt.en.trim() ||
                !asset.alt.de.trim()
            ) {
                throw new Error(
                    `Project media requires English and German alt text: ${asset.src}`,
                );
            }
        }
    }
}

assertProjectContract(projects);

export type ProjectSlug =
    (typeof projects)[number]["slug"];

export function getProjectBySlug(
    slug: string,
): Project | undefined {
    return projects.find(
        (project) => project.slug === slug,
    );
}

export function getFeaturedProjects(): Project[] {
    return projects
        .filter((project) => project.featured)
        .sort(
            (first, second) =>
                first.order - second.order,
        );
}

export function getProjectsByServiceCode(
    code: ServiceCode,
): Project[] {
    return projects
        .filter((project) =>
            project.serviceCodes.some(
                (serviceCode) =>
                    serviceCode === code,
            ),
        )
        .sort(
            (first, second) =>
                first.order - second.order,
        );
}

export function getProjectsByType(
    type: ProjectType,
): Project[] {
    return projects
        .filter(
            (project) =>
                project.type === type,
        )
        .sort(
            (first, second) =>
                first.order - second.order,
        );
}
