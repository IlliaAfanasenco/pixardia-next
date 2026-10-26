import {
    type LocalizedText,
    type Project,
    type ProjectClassification,
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
        "Digital studio platform",
        "Internes Projekt",
    ),
    concept: text(
        "Studio initiative",
        "Konzeptprojekt",
    ),
    educational: text(
        "Product initiative",
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

export const projectClassificationLabels = {
    real_project: text(
        "Real Project",
        "Realisiertes Projekt",
    ),
    studio_concept: text(
        "Studio Concept",
        "Studio-Konzept",
    ),
} satisfies Record<ProjectClassification, LocalizedText>;

export const projects = [
    {
        slug: "pixardia-digital-studio",
        title: "Pixardia",
        type: "internal",
        status: "in_progress",
        summary: text(
            "An AI-augmented digital studio website presenting web and software services through interactive storytelling and a clear project enquiry path.",
            "Eine mehrsprachige Portfolio- und Leadgenerierungsplattform für ein modernes Digitalstudio.",
        ),
        description: text(
            "Pixardia is the studio's own platform: an interactive site that shows how it designs and builds, from a scroll-driven hero and a connected capability map to a project archive and a structured enquiry form.",
            "Pixardia präsentiert die Dienstleistungen, technischen Kompetenzen und ausgewählte Arbeiten des Studios durch ein klares visuelles System, mehrsprachige Inhalte und praktische Möglichkeiten für Projektanfragen.",
        ),
        challenge: text(
            "Present a wide range of services credibly without a generic agency template: distinctive, motion-rich storytelling that still stays readable, fast to navigate and usable on phones and tablets.",
            "Der ursprüngliche Prototyp hatte eine starke visuelle Richtung, enthielt jedoch unverbundene Bereiche, Platzhalterinhalte, inkonsistente Servicedaten sowie unfertige Kontakt- und KI-Funktionen.",
        ),
        solution: text(
            "A typed content model, an original character-led visual system, dedicated desktop, tablet and mobile treatments, reduced-motion handling and a validated server-side enquiry flow.",
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
                "A digital studio, built as its own best case.",
                "Ein Digitalstudio – als eigener bester Fall gebaut.",
            ),
            category: text(
                "Digital Studio Platform",
                "Digitalstudio-Plattform",
            ),
            role: text(
                "Product strategy, UX architecture, frontend, backend and platform hardening.",
                "Produktstrategie, UX-Architektur, Frontend, Backend und technische Härtung der Plattform.",
            ),
            client: null,
            engagement: text(
                "Studio-owned platform",
                "Studio-eigene Plattform",
            ),
            architecture: text(
                "A Next.js App Router application with typed content, GSAP and Lenis driven scroll scenes, server-side API routes, PostgreSQL and Prisma lead handling, and optional Redis-backed rate limiting.",
                "Eine Next.js-App-Router-Anwendung mit typisierten Inhalten, serverseitigen API-Routen, Lead-Verarbeitung mit PostgreSQL und Prisma sowie optionalem Redis-basiertem Rate Limiting.",
            ),
            facts: [
                {
                    label: text(
                        "Delivery stage",
                        "Projektphase",
                    ),
                    value: text(
                        "Active development",
                        "In aktiver Entwicklung",
                    ),
                },
                {
                    label: text(
                        "Primary audience",
                        "Zielgruppe",
                    ),
                    value: text(
                        "Ambitious businesses",
                        "Unternehmen und Start-ups",
                    ),
                },
                {
                    label: text(
                        "Service region",
                        "Leistungsregion",
                    ),
                    value: text(
                        "Germany and worldwide",
                        "Europa und Remote",
                    ),
                },
            ],
            gallery: [
                {
                    media: {
                        src: "/images/projects/pixardia/16x9/01-hero-experience.webp",
                        alt: text(
                            "Pixardia hero with the Digital Agency headline, astronaut and alien characters on laptop and mobile screens",
                            "Pixardia-Hero mit der Headline Digital Agency sowie Astronaut und Alien auf Laptop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Hero experience", "Hero-Erlebnis"),
                    description: text(
                        "Editorial typography, the astronaut and alien characters and a scroll-driven hero scene, with a dedicated mobile composition.",
                        "Editoriale Typografie, Astronaut- und Alien-Figuren und eine scrollgesteuerte Hero-Szene mit eigener Mobile-Komposition.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/pixardia/16x9/02-neural-system.webp",
                        alt: text(
                            "Pixardia neural system interface connecting strategy, UX, engineering and security capabilities around a central core",
                            "Pixardia-Neural-System-Oberfläche, die Strategie, UX, Engineering und Security um einen zentralen Kern verbindet",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Neural system", "Neural System"),
                    description: text(
                        "Studio capabilities shown as one connected system: strategy, UI/UX, engineering and security around a central node, driven by motion.",
                        "Studio-Kompetenzen als vernetztes System: Strategie, UI/UX, Engineering und Security um einen zentralen Knoten, bewegungsgesteuert.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/pixardia/16x9/03-project-archive.webp",
                        alt: text(
                            "Pixardia project archive with technical schematic previews and an open case-study view with a gallery",
                            "Pixardia-Projektarchiv mit technischen Schema-Vorschauen und geöffneter Fallstudie mit Galerie",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Project archive", "Projektarchiv"),
                    description: text(
                        "Schematic card previews for each project, opening into an interactive case study with a gallery and structured project data.",
                        "Schematische Kartenvorschauen je Projekt, die sich zu einer interaktiven Fallstudie mit Galerie und strukturierten Projektdaten öffnen.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/pixardia/16x9/04-responsive-experience.webp",
                        alt: text(
                            "Pixardia interface shown on a laptop, a tablet and a phone",
                            "Pixardia-Oberfläche auf Laptop, Tablet und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Responsive experience", "Responsive Erlebnis"),
                    description: text(
                        "Separate desktop, tablet and mobile treatments rather than one scaled layout, with motion adapted per device class.",
                        "Getrennte Desktop-, Tablet- und Mobile-Umsetzungen statt eines skalierten Layouts, mit je Gerät angepasster Bewegung.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/pixardia/16x9/05-project-enquiry.webp",
                        alt: text(
                            "Pixardia contact page with a project enquiry form showing name, email, project type and project details",
                            "Pixardia-Kontaktseite mit Projektanfrage-Formular für Name, E-Mail, Projekttyp und Projektdetails",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Project enquiry", "Projektanfrage"),
                    description: text(
                        "A structured enquiry form: name, email, project type and details with a privacy consent, posted to a validated server-side lead endpoint.",
                        "Strukturiertes Anfrageformular: Name, E-Mail, Projekttyp und Details mit Datenschutz-Einwilligung, gesendet an einen validierten Server-Endpunkt.",
                    ),
                },
            ],
            featureGroups: [
                {
                    label: text("Experience", "Erlebnis"),
                    items: [
                        text("Scroll-driven hero scene", "Scrollgesteuerte Hero-Szene"),
                        text("Frame-sequence animation", "Frame-Sequenz-Animation"),
                        text("Neural system visualisation", "Neural-System-Visualisierung"),
                        text("Technical project archive", "Technisches Projektarchiv"),
                        text("Interactive case studies", "Interaktive Fallstudien"),
                        text("EN / DE localisation", "Lokalisierung EN / DE"),
                    ],
                },
                {
                    label: text("Engineering", "Engineering"),
                    items: [
                        text("Dedicated mobile & tablet views", "Eigene Mobile- & Tablet-Ansichten"),
                        text("Reduced-motion handling", "Berücksichtigung von Reduced Motion"),
                        text("Typed content model", "Typisiertes Inhaltsmodell"),
                        text("Validated project enquiry API", "Validierte Projektanfrage-API"),
                        text("Optional Redis rate limiting", "Optionales Redis-Rate-Limiting"),
                        text("AI-assisted terminal (DeepSeek)", "KI-gestütztes Terminal (DeepSeek)"),
                    ],
                },
            ],
            scope: [
                text("Brand & visual identity", "Marke & visuelle Identität"),
                text("UX architecture & storytelling", "UX-Architektur & Storytelling"),
                text("Scroll & motion engineering", "Scroll- & Motion-Engineering"),
                text("Desktop, tablet & mobile", "Desktop, Tablet & Mobile"),
                text("Lead intake & API", "Lead-Erfassung & API"),
                text("EN / DE content", "Inhalte EN / DE"),
            ],
            capabilitiesNote: text(
                "A real, actively developed studio project — not a client engagement. Features listed are in the current code; no traffic or business results are claimed.",
                "Ein reales, aktiv weiterentwickeltes Studioprojekt – kein Kundenauftrag. Aufgeführte Funktionen sind im aktuellen Code enthalten; keine Reichweiten- oder Geschäftsergebnisse behauptet.",
            ),
            commercialCta: {
                label: text(
                    "Build something similar ↗",
                    "Ähnliches Projekt starten ↗",
                ),
                href: "/contact?project=pixardia-digital-studio",
            },
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
            presentation: {
                desktopDirection: "left",
                centerLabel: text(
                    "Explore Pixardia case",
                    "Systemakte öffnen",
                ),
            },
        },
    },
    {
        slug: "moneta-finance-analytics",
        title: "Moneta",
        type: "concept",
        status: "planned",
        summary: text(
            "A premium finance platform connecting accounts, transactions, payments and analytics in one clear workspace.",
            "Eine Premium-Finanzplattform, die Konten, Transaktionen, Zahlungen und Analysen in einem klaren Arbeitsbereich verbindet.",
        ),
        description: text(
            "A studio concept for a finance and analytics SaaS: one product for everyday account management, payments, spending insight and operational oversight across desktop and mobile.",
            "Studio-Konzept für eine Finanz- und Analyse-SaaS: ein Produkt für Kontoverwaltung, Zahlungen, Ausgabenanalyse und operative Übersicht auf Desktop und Mobilgerät.",
        ),
        challenge: text(
            "Finance tools bury balances, payments and reports in separate screens, so users lose context, misread figures and hesitate before moving money.",
            "Finanz-Tools verteilen Kontostände, Zahlungen und Berichte auf getrennte Ansichten – Nutzer verlieren den Überblick, deuten Zahlen falsch und zögern bei Überweisungen.",
        ),
        solution: text(
            "One calm interface: a financial overview, per-account detail, a guided payment flow, spending insights and an operations view, all built on the same data model and visual hierarchy.",
            "Eine ruhige Oberfläche: Finanzübersicht, Kontodetails, geführter Zahlungsablauf, Ausgabenanalyse und Operations-Ansicht – auf demselben Datenmodell und derselben visuellen Hierarchie.",
        ),
        serviceCodes: [
            "WEB_APPLICATION",
            "UI_UX_DESIGN",
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
            identifier: "MN-2026-002",
            subtitle: text(
                "Finance, made legible.",
                "Finanzen, klar dargestellt.",
            ),
            category: text(
                "Finance & Analytics Platform",
                "Finanz- & Analyseplattform",
            ),
            classification: "studio_concept",
            role: text(
                "Product strategy, UX architecture, data-visualisation design and interface system.",
                "Produktstrategie, UX-Architektur, Datenvisualisierung und Interface-System.",
            ),
            client: null,
            engagement: text(
                "Self-initiated studio concept",
                "Eigeninitiiertes Studio-Konzept",
            ),
            architecture: text(
                "A planned modular finance application separating accounts, transactions, payments, analytics and operations into focused areas on one shared data layer.",
                "Eine geplante modulare Finanzanwendung, die Konten, Transaktionen, Zahlungen, Analysen und Operations in klar getrennte Bereiche auf einer gemeinsamen Datenschicht gliedert.",
            ),
            facts: [
                {
                    label: text(
                        "Product stage",
                        "Produktphase",
                    ),
                    value: text(
                        "Platform definition",
                        "Geplantes Konzept",
                    ),
                },
                {
                    label: text(
                        "Domain",
                        "Bereich",
                    ),
                    value: text(
                        "Finance & analytics SaaS",
                        "Finanz- & Analyse-SaaS",
                    ),
                },
                {
                    label: text(
                        "Evidence status",
                        "Nachweisstatus",
                    ),
                    value: text(
                        "No client, no production deployment",
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
            gallery: [
                {
                    media: {
                        src: "/images/projects/moneta/16x9/01-financial-overview.webp",
                        alt: text(
                            "Moneta financial overview concept with total balance, accounts and recent transactions on laptop and mobile screens",
                            "Moneta-Konzept einer Finanzübersicht mit Gesamtsaldo, Konten und letzten Transaktionen auf Laptop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Financial overview", "Finanzübersicht"),
                    description: text(
                        "Total balance, a balance trend, monthly spending and recent transactions on one screen, with the same structure on mobile.",
                        "Gesamtsaldo, Saldenverlauf, Monatsausgaben und letzte Transaktionen auf einem Screen – mit gleicher Struktur auf dem Smartphone.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/moneta/16x9/02-accounts.webp",
                        alt: text(
                            "Moneta accounts concept with account list, cash flow and recent activity on desktop and mobile",
                            "Moneta-Kontenkonzept mit Kontoliste, Cashflow und letzter Aktivität auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Accounts", "Konten"),
                    description: text(
                        "Checking, savings, investment and credit accounts with balances, cash-flow bars and an account-health summary beside recent activity.",
                        "Giro-, Spar-, Anlage- und Kreditkonten mit Salden, Cashflow-Balken und Kontostatus neben der letzten Aktivität.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/moneta/16x9/03-payments.webp",
                        alt: text(
                            "Moneta payments concept with a send-money form, recipients and scheduled payments on desktop and mobile",
                            "Moneta-Zahlungskonzept mit Überweisungsformular, Empfängern und geplanten Zahlungen auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Payments", "Zahlungen"),
                    description: text(
                        "A guided send-money form: recipient, amount, source account and schedule in one view, with bills and scheduled payments alongside.",
                        "Geführtes Überweisungsformular: Empfänger, Betrag, Quellkonto und Termin in einer Ansicht, daneben Rechnungen und geplante Zahlungen.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/moneta/16x9/04-spending-insights.webp",
                        alt: text(
                            "Moneta spending insights concept with category breakdown, monthly budgets and a spending trend on desktop and mobile",
                            "Moneta-Konzept zur Ausgabenanalyse mit Kategorien, Monatsbudgets und Ausgabenverlauf auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Spending insights", "Ausgabenanalyse"),
                    description: text(
                        "Category breakdown, spending trend, monthly budgets and savings goals, with suggestions framed as proposed guidance. All figures are illustrative.",
                        "Kategorien, Ausgabenverlauf, Monatsbudgets und Sparziele mit Hinweisen als vorgeschlagene Orientierung. Alle Zahlen sind beispielhaft.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/moneta/16x9/05-operations-dashboard.webp",
                        alt: text(
                            "Moneta operations dashboard concept with transaction monitoring, flagged activity and support tickets on desktop and mobile",
                            "Moneta-Operations-Dashboard-Konzept mit Transaktionsüberwachung, markierter Aktivität und Support-Tickets auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Operations dashboard", "Operations-Dashboard"),
                    description: text(
                        "Transaction monitoring with status filters, flagged activity, support tickets and card controls for the team behind the product. Figures are illustrative.",
                        "Transaktionsüberwachung mit Statusfiltern, markierter Aktivität, Support-Tickets und Kartenkontrollen für das Team hinter dem Produkt. Zahlen sind beispielhaft.",
                    ),
                },
            ],
            featureGroups: [
                {
                    label: text("Customer experience", "Kundenerlebnis"),
                    items: [
                        text("Balance & trend overview", "Saldo- & Verlaufsübersicht"),
                        text("Multi-account management", "Verwaltung mehrerer Konten"),
                        text("Transaction history & search", "Transaktionshistorie & Suche"),
                        text("Guided send-money flow", "Geführter Überweisungsablauf"),
                        text("Scheduled payments", "Geplante Zahlungen"),
                        text("Budgets & savings goals", "Budgets & Sparziele"),
                    ],
                },
                {
                    label: text("Insight & operations", "Analyse & Betrieb"),
                    items: [
                        text("Spending by category", "Ausgaben nach Kategorie"),
                        text("Cash-flow reporting", "Cashflow-Berichte"),
                        text("Transaction monitoring", "Transaktionsüberwachung"),
                        text("Flagged-activity review", "Prüfung markierter Aktivität"),
                        text("Support ticket overview", "Support-Ticket-Übersicht"),
                        text("Card controls", "Kartenkontrollen"),
                    ],
                },
            ],
            scope: [
                text("UX architecture & flows", "UX-Architektur & Flows"),
                text("Dashboard & account UI", "Dashboard- & Konten-UI"),
                text("Payment flow", "Zahlungsablauf"),
                text("Data-visualisation system", "Datenvisualisierungs-System"),
                text("Responsive desktop & mobile", "Responsiv: Desktop & Mobile"),
                text("Design tokens", "Design-Tokens"),
            ],
            capabilitiesNote: text(
                "Studio concept — proposed features, not a live financial product. No integrations are implemented; all figures are illustrative.",
                "Studio-Konzept – vorgeschlagene Funktionen, kein laufendes Finanzprodukt. Keine Integrationen umgesetzt; alle Zahlen sind beispielhaft.",
            ),
            commercialCta: {
                label: text(
                    "Build something similar ↗",
                    "Ähnliches Projekt starten ↗",
                ),
                href: "/contact?project=moneta-finance-analytics",
            },
            visualSystem: {
                colors: [
                    {
                        label: text(
                            "Primary",
                            "Primärfarbe",
                        ),
                        value: "#123D2E",
                    },
                    {
                        label: text(
                            "Accent",
                            "Akzentfarbe",
                        ),
                        value: "#3F9B6B",
                    },
                    {
                        label: text(
                            "Surface",
                            "Fläche",
                        ),
                        value: "#F6F5F1",
                    },
                ],
                typeface:
                    "Inter / system sans",
            },
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
            "A scalable commerce platform connecting product discovery, catalogue management and a focused purchasing journey.",
            "Eine moderne E-Commerce-Plattform mit einfacher Produktsuche und einem reibungslosen Einkaufserlebnis.",
        ),
        description: text(
            "A studio concept for a premium sneaker brand: one platform that takes shoppers from first impression to order and gives the merchant one place for catalogue, orders and stock.",
            "Studio-Konzept für eine Premium-Sneaker-Marke: eine Plattform vom ersten Eindruck bis zur Bestellung – und für den Händler ein Ort für Katalog, Bestellungen und Lager.",
        ),
        challenge: text(
            "Template stores stop scaling: large catalogues get hard to browse, product pages hide sizing and delivery, and stock and orders live in separate tools.",
            "Template-Shops stoßen an Grenzen: Große Kataloge werden unübersichtlich, Größen und Lieferinfos sind versteckt, Lager und Bestellungen liegen in getrennten Tools.",
        ),
        solution: text(
            "One design system from storefront to admin: structured filters, decision-ready product pages, a four-step checkout and a dashboard on the same data.",
            "Ein Designsystem von der Storefront bis zur Verwaltung: klare Filter, entscheidungsreife Produktseiten, Checkout in vier Schritten und ein Dashboard auf denselben Daten.",
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
        // Archive thumbnails come from the designed system preview; the case-study
        // gallery lives in caseStudy.gallery so it can change independently.
        coverImage: null,
        images: [],
        liveUrl: null,
        repositoryUrl: null,
        featured: true,
        order: 3,
        caseStudy: {
            identifier: "NM-2026-003",
            subtitle: text(
                "Commerce, designed to convert.",
                "Commerce, der zum Kauf führt.",
            ),
            category: text(
                "E-Commerce Platform",
                "E-Commerce-Plattform",
            ),
            classification: "studio_concept",
            role: text(
                "Commerce strategy, user-flow design and interface system.",
                "Commerce-Strategie, User-Flow-Design und Interface-System.",
            ),
            client: null,
            engagement: text(
                "Self-initiated studio concept",
                "Eigeninitiiertes Studio-Konzept",
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
                        "Platform definition",
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
                        "No client, no production deployment",
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
            gallery: [
                {
                    media: {
                        src: "/images/projects/nordmarkt/16x9/01-storefront.webp",
                        alt: text(
                            "NORDMARKT storefront concept with a premium sneaker hero on laptop and mobile screens",
                            "NORDMARKT-Storefront-Konzept mit einem Premium-Sneaker im Hero auf Laptop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Storefront", "Storefront"),
                    description: text(
                        "Editorial hero, product-first imagery and one clear call to action. Navigation, search and cart stay one tap away on every device.",
                        "Editorialer Hero, produktzentrierte Bilder und ein klarer Call-to-Action. Navigation, Suche und Warenkorb bleiben auf jedem Gerät erreichbar.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/nordmarkt/16x9/02-catalogue.webp",
                        alt: text(
                            "NORDMARKT catalogue concept with sneaker product cards, categories and filters on desktop and mobile",
                            "NORDMARKT-Katalogkonzept mit Sneaker-Produktkarten, Kategorien und Filtern auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Product catalogue", "Produktkatalog"),
                    description: text(
                        "Categories with item counts, filters for size, colour and brand, plus sorting and a grid view. Cards show price and colourways at a glance.",
                        "Kategorien mit Artikelzahl, Filter für Größe, Farbe und Marke plus Sortierung und Rasteransicht. Karten zeigen Preis und Farbvarianten.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/nordmarkt/16x9/03-product-detail.webp",
                        alt: text(
                            "NORDMARKT sneaker product detail concept with an image gallery, colour choices and size selection",
                            "NORDMARKT-Konzept einer Sneaker-Produktseite mit Bildergalerie, Farbauswahl und Größenauswahl",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Product detail", "Produktdetail"),
                    description: text(
                        "Multi-angle gallery, colour variants and a size grid beside Add to cart. Shipping, returns, warranty and product details sit in the same view.",
                        "Mehrere Ansichten, Farbvarianten und Größenraster direkt am Warenkorb. Versand, Rückgabe, Garantie und Produktdetails in derselben Ansicht.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/nordmarkt/16x9/04-checkout.webp",
                        alt: text(
                            "NORDMARKT checkout concept with shipping information and an order summary on desktop and mobile",
                            "NORDMARKT-Checkout-Konzept mit Versandinformationen und Bestellübersicht auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Checkout", "Checkout"),
                    description: text(
                        "A proposed four-step flow: cart, shipping, payment, review. The order summary with quantities, shipping and tax stays visible throughout.",
                        "Vorgeschlagener Ablauf in vier Schritten: Warenkorb, Versand, Zahlung, Prüfung. Die Übersicht mit Mengen, Versand und Steuern bleibt sichtbar.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/nordmarkt/16x9/05-store-dashboard.webp",
                        alt: text(
                            "NORDMARKT store dashboard concept with illustrative analytics, orders and inventory on desktop and mobile",
                            "NORDMARKT-Konzept eines Shop-Dashboards mit beispielhaften Analysen, Bestellungen und Lagerbeständen auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Store dashboard", "Shop-Dashboard"),
                    description: text(
                        "Sales, orders, conversion and order value with top products, recent orders and stock status. All figures shown are illustrative, not measured.",
                        "Umsatz, Bestellungen, Conversion und Bestellwert mit Top-Produkten und Lagerstatus. Alle gezeigten Zahlen sind beispielhaft, keine Messwerte.",
                    ),
                },
            ],
            featureGroups: [
                {
                    label: text("Customer experience", "Kundenerlebnis"),
                    items: [
                        text("Category navigation & search", "Kategorienavigation & Suche"),
                        text("Size, colour & price filters", "Filter für Größe, Farbe & Preis"),
                        text("Variant and size selection", "Varianten- & Größenauswahl"),
                        text("Cart with editable quantities", "Warenkorb mit Mengenänderung"),
                        text("Four-step guided checkout", "Geführter Checkout in 4 Schritten"),
                        text("Accounts & order history", "Kundenkonto & Bestellhistorie"),
                    ],
                },
                {
                    label: text("Merchant operations", "Händlerverwaltung"),
                    items: [
                        text("Product & variant management", "Produkt- & Variantenpflege"),
                        text("Stock levels per product", "Lagerbestand pro Produkt"),
                        text("Orders with fulfilment status", "Bestellungen mit Versandstatus"),
                        text("Sales & conversion overview", "Umsatz- & Conversion-Übersicht"),
                        text("Top-product reporting", "Auswertung der Top-Produkte"),
                        text("Customer records", "Kundendaten"),
                    ],
                },
            ],
            scope: [
                text("UX architecture & flows", "UX-Architektur & Flows"),
                text("Storefront & product UI", "Storefront- & Produkt-UI"),
                text("Checkout flow", "Checkout-Ablauf"),
                text("Merchant dashboard", "Händler-Dashboard"),
                text("Responsive desktop & mobile", "Responsiv: Desktop & Mobile"),
                text("Design tokens", "Design-Tokens"),
            ],
            capabilitiesNote: text(
                "Studio concept — proposed features, not a live store. Dashboard figures are illustrative, not business results.",
                "Studio-Konzept – vorgeschlagene Funktionen, kein laufender Shop. Dashboard-Zahlen sind beispielhaft, keine Geschäftsergebnisse.",
            ),
            commercialCta: {
                label: text(
                    "Build something similar ↗",
                    "Ähnliches Projekt starten ↗",
                ),
                href: "/contact?project=nordmarkt-commerce",
            },
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
        slug: "synapse-ai-workspace",
        title: "Synapse AI",
        type: "concept",
        status: "planned",
        summary: text(
            "An AI-assisted workspace connecting tasks, knowledge, documents and controlled business automation.",
            "Ein KI-gestützter Arbeitsbereich, der Aufgaben, Wissen, Dokumente und kontrollierte Geschäftsautomatisierung verbindet.",
        ),
        description: text(
            "A studio concept for an intelligent business workspace: requests, internal knowledge and team collaboration in one place, with AI proposing work and people approving it.",
            "Studio-Konzept für einen intelligenten Business-Arbeitsbereich: Anfragen, internes Wissen und Teamarbeit an einem Ort – die KI schlägt vor, Menschen entscheiden.",
        ),
        challenge: text(
            "Requests arrive by message, documents live in separate tools and routine work is repeated by hand, so answers are slow, inconsistent and hard to trace.",
            "Anfragen kommen per Nachricht, Dokumente liegen in getrennten Tools und Routinearbeit wird manuell wiederholt – Antworten sind langsam, uneinheitlich und schwer nachvollziehbar.",
        ),
        solution: text(
            "A shared workspace with a structured request queue, searchable knowledge, AI-drafted outputs and an explicit human review step before anything is approved or sent.",
            "Ein gemeinsamer Arbeitsbereich mit strukturierter Anfrage-Queue, durchsuchbarem Wissen, KI-Entwürfen und einem festen Prüfschritt durch Menschen vor jeder Freigabe.",
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
            identifier: "SY-2026-004",
            subtitle: text(
                "AI that proposes. People that decide.",
                "KI schlägt vor. Menschen entscheiden.",
            ),
            category: text(
                "Intelligent Business Workspace",
                "Intelligenter Business-Arbeitsbereich",
            ),
            classification: "studio_concept",
            role: text(
                "Workflow research, AI interaction design and application architecture.",
                "Workflow-Research, KI-Interaktionsdesign und Anwendungsarchitektur.",
            ),
            client: null,
            engagement: text(
                "Self-initiated studio concept",
                "Eigeninitiiertes Studio-Konzept",
            ),
            architecture: text(
                "A planned human-in-the-loop workspace: structured request intake, a searchable knowledge layer, AI-drafted outputs, review and approval steps, and an audit trail.",
                "Ein geplanter Human-in-the-Loop-Arbeitsbereich: strukturierte Anfrageerfassung, durchsuchbare Wissensebene, KI-Entwürfe, Prüf- und Freigabeschritte sowie ein Prüfprotokoll.",
            ),
            facts: [
                {
                    label: text(
                        "Product stage",
                        "Produktphase",
                    ),
                    value: text(
                        "Platform definition",
                        "Geplantes Konzept",
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
            gallery: [
                {
                    media: {
                        src: "/images/projects/synapse-ai/16x9/01-ai-workspace.webp",
                        alt: text(
                            "Synapse AI workspace concept with a home view, request summary, knowledge library and human review panel on laptop and mobile screens",
                            "Synapse-AI-Arbeitsbereichskonzept mit Startansicht, Anfragen, Wissensbibliothek und Prüfbereich auf Laptop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("AI workspace", "KI-Arbeitsbereich"),
                    description: text(
                        "A home view that gathers open requests, knowledge and items waiting for human review, with the same overview on mobile.",
                        "Eine Startansicht mit offenen Anfragen, Wissen und Elementen zur menschlichen Prüfung – mit gleicher Übersicht auf dem Smartphone.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/synapse-ai/16x9/02-requests-queue.webp",
                        alt: text(
                            "Synapse AI requests queue concept with filters, statuses, priorities and owners on desktop and mobile",
                            "Synapse-AI-Konzept einer Anfrage-Queue mit Filtern, Status, Prioritäten und Zuständigen auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Requests queue", "Anfrage-Queue"),
                    description: text(
                        "A structured queue with status, priority, owner and due date, plus saved views and filters to triage incoming work.",
                        "Strukturierte Queue mit Status, Priorität, Zuständigkeit und Fälligkeit sowie gespeicherten Ansichten und Filtern zur Priorisierung.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/synapse-ai/16x9/04-human-review.webp",
                        alt: text(
                            "Synapse AI human review concept with an AI draft, review steps, comments and approval actions on desktop and mobile",
                            "Synapse-AI-Konzept der menschlichen Prüfung mit KI-Entwurf, Prüfschritten, Kommentaren und Freigabe auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("Human review", "Menschliche Prüfung"),
                    description: text(
                        "An AI-drafted output with review steps, comments, version history and explicit approve or request-changes actions before anything is final.",
                        "Ein KI-Entwurf mit Prüfschritten, Kommentaren, Versionsverlauf und ausdrücklicher Freigabe oder Änderungsanforderung vor dem Abschluss.",
                    ),
                },
                {
                    media: {
                        src: "/images/projects/synapse-ai/16x9/05-ai-analytics.webp",
                        alt: text(
                            "Synapse AI analytics concept with request volume, agent performance and usage by team on desktop and mobile",
                            "Synapse-AI-Analysekonzept mit Anfragevolumen, Agentenleistung und Nutzung nach Team auf Desktop und Smartphone",
                        ),
                        width: 1672,
                        height: 941,
                    },
                    title: text("AI analytics", "KI-Analysen"),
                    description: text(
                        "Request volume, usage by team and agent performance to monitor how automation behaves. All figures shown are illustrative, not measured.",
                        "Anfragevolumen, Nutzung nach Team und Agentenleistung zur Beobachtung der Automatisierung. Alle gezeigten Zahlen sind beispielhaft, keine Messwerte.",
                    ),
                },
            ],
            featureGroups: [
                {
                    label: text("Work & knowledge", "Arbeit & Wissen"),
                    items: [
                        text("Structured request intake", "Strukturierte Anfrageerfassung"),
                        text("Task status, owners & due dates", "Status, Zuständige & Fristen"),
                        text("Saved views & filters", "Gespeicherte Ansichten & Filter"),
                        text("Searchable knowledge library", "Durchsuchbare Wissensbibliothek"),
                        text("Document handling", "Dokumentenverwaltung"),
                        text("Team comments & collaboration", "Kommentare & Zusammenarbeit"),
                    ],
                },
                {
                    label: text("AI & control", "KI & Kontrolle"),
                    items: [
                        text("AI-drafted responses", "KI-Entwürfe für Antworten"),
                        text("Human review & approval", "Prüfung & Freigabe durch Menschen"),
                        text("Version history", "Versionsverlauf"),
                        text("Rule-based automation", "Regelbasierte Automatisierung"),
                        text("Escalation to a team member", "Eskalation an Teammitglieder"),
                        text("Usage & performance analytics", "Nutzungs- & Leistungsanalysen"),
                    ],
                },
            ],
            scope: [
                text("Workflow research & flows", "Workflow-Research & Flows"),
                text("Workspace & queue UI", "Workspace- & Queue-UI"),
                text("Review & approval flow", "Prüf- & Freigabeablauf"),
                text("AI interaction design", "KI-Interaktionsdesign"),
                text("Responsive desktop & mobile", "Responsiv: Desktop & Mobile"),
                text("Design tokens", "Design-Tokens"),
            ],
            capabilitiesNote: text(
                "Studio concept — proposed features, not a live product. AI behaviour is not implemented or evaluated; analytics figures are illustrative.",
                "Studio-Konzept – vorgeschlagene Funktionen, kein laufendes Produkt. KI-Verhalten ist weder umgesetzt noch evaluiert; Analysezahlen sind beispielhaft.",
            ),
            commercialCta: {
                label: text(
                    "Build something similar ↗",
                    "Ähnliches Projekt starten ↗",
                ),
                href: "/contact?project=synapse-ai-workspace",
            },
            visualSystem: {
                colors: [
                    {
                        label: text(
                            "Primary",
                            "Primärfarbe",
                        ),
                        value: "#1E1B4B",
                    },
                    {
                        label: text(
                            "Accent",
                            "Akzentfarbe",
                        ),
                        value: "#5B5BF0",
                    },
                    {
                        label: text(
                            "Surface",
                            "Fläche",
                        ),
                        value: "#F6F7FC",
                    },
                ],
                typeface:
                    "Inter / system sans",
            },
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
            project.caseStudy.client != null &&
            !project.caseStudy.client.trim()
        ) {
            throw new Error(
                `Project ${project.slug} contains an empty client name.`,
            );
        }

        for (
            const group of
            project.caseStudy.technologyGroups ?? []
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

        const caseStudy = project.caseStudy;
        const isConcept =
            project.type === "concept" ||
            caseStudy.classification === "studio_concept";

        if (
            caseStudy.classification === "real_project" &&
            project.type !== "client"
        ) {
            throw new Error(
                `Project ${project.slug} is classified as a real project but is not client work.`,
            );
        }

        if (isConcept && caseStudy.results?.length) {
            throw new Error(
                `Concept ${project.slug} cannot declare verified results.`,
            );
        }

        for (const group of caseStudy.featureGroups ?? []) {
            if (group.items.length === 0) {
                throw new Error(
                    `Project ${project.slug} contains an empty feature group.`,
                );
            }
        }

        const gallery = caseStudy.gallery ?? [];

        for (const slide of gallery) {
            for (const copy of [slide.title, slide.description]) {
                if (!copy.en.trim() || !copy.de.trim()) {
                    throw new Error(
                        `Gallery slide ${slide.media.src} in ${project.slug} requires English and German copy.`,
                    );
                }
            }
        }

        // One frame ratio per gallery keeps every view edge to edge without cropping.
        const galleryRatios = gallery.map(
            ({ media }) => media.width / media.height,
        );

        if (
            galleryRatios.some(
                (ratio) =>
                    Math.abs(ratio - galleryRatios[0]) > 0.01,
            )
        ) {
            throw new Error(
                `Gallery images in ${project.slug} must share one aspect ratio.`,
            );
        }

        const media = [
            ...(project.coverImage
                ? [project.coverImage]
                : []),
            ...project.images,
            ...gallery.map((slide) => slide.media),
            ...(project.archivePreview?.image
                ? [project.archivePreview.image]
                : []),
        ];
        const mediaSources = new Set<string>();

        for (const asset of media) {
            if (!asset.src.startsWith("/")) {
                throw new Error(
                    `Project media path must start with /: ${asset.src}`,
                );
            }

            if (mediaSources.has(asset.src)) {
                throw new Error(
                    `Duplicate project media in ${project.slug}: ${asset.src}`,
                );
            }

            mediaSources.add(asset.src);

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
