import { existsSync } from "node:fs";
import { createElement, type AnchorHTMLAttributes, type ImgHTMLAttributes } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import ArchiveCard from "@/components/archive/ArchiveCard";
import { getArchiveProjects } from "@/components/archive/archive-projects";
import { projectClassificationLabels, projects } from "@/content/projects";
import ProjectCaseStudy from "@/features/projects/ProjectCaseStudy";
import type { SiteLocale } from "@/i18n/config";
import { translator } from "@/i18n/getDictionary";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import type { LocalizedText, Project } from "@/types/services";

vi.mock("next/image", () => ({
    default: ({ src, alt, width, height, className }: ImgHTMLAttributes<HTMLImageElement>) =>
        createElement("img", { src, alt, width, height, className }),
}));

vi.mock("next/link", () => ({
    default: ({ href, children, className, id }: AnchorHTMLAttributes<HTMLAnchorElement>) =>
        createElement("a", { href, className, id }, children),
}));

const allProjects: readonly Project[] = projects;
const nordmarkt = allProjects.find((project) => project.slug === "nordmarkt-commerce")!;
const gallery = nordmarkt.caseStudy.gallery!;
const variants = ["page", "modal"] as const;
const locales = ["en", "de"] as const;
const text = (en: string, de: string): LocalizedText => ({ en, de });

function render(project: Project, locale: SiteLocale, variant: "page" | "modal"): string {
    return renderToStaticMarkup(
        <LocaleProvider locale={locale}>
            <ProjectCaseStudy project={project} locale={locale} variant={variant} titleId="case-title" summaryId="case-summary" />
        </LocaleProvider>,
    );
}

function content(html: string): string {
    return html.replace(/<[^>]+>/gu, " ")
        .replace(/&amp;/gu, "&")
        .replace(/&#x27;|&#39;/gu, "'")
        .replace(/&quot;/gu, '"')
        .replace(/\s+/gu, " ")
        .trim();
}

function headings(html: string): string[] {
    return Array.from(html.matchAll(/<h[1-6]\b[^>]*>(.*?)<\/h[1-6]>/gu), ([, value]) => content(value));
}

const minimalProject: Project = {
    slug: "minimal-concept",
    title: "Minimal concept",
    type: "concept",
    status: "planned",
    summary: text("A concept summary.", "Eine Konzeptzusammenfassung."),
    description: text("A proposed product.", "Ein vorgeschlagenes Produkt."),
    serviceCodes: [],
    technologies: [],
    year: 2026,
    coverImage: null,
    images: [],
    liveUrl: null,
    repositoryUrl: null,
    featured: false,
    order: 99,
    caseStudy: {
        identifier: "TEST-2026-099",
        subtitle: text("An optional-content case study.", "Eine Fallstudie mit optionalen Inhalten."),
        visualSystem: {
            colors: [{ label: text("Primary", "Primärfarbe"), value: "#202020" }],
            typeface: "Test Sans",
        },
        presentation: { desktopDirection: "left", centerLabel: text("Concept", "Konzept") },
    },
};

describe("NORDMARKT archive preview", () => {
    const entry = getArchiveProjects().find(({ project }) => project.slug === "nordmarkt-commerce")!;

    it("restores the original archive record", () => {
        expect(nordmarkt.title).toBe("Nordmarkt Commerce");
        expect(nordmarkt.summary.en).toBe("A scalable commerce platform connecting product discovery, catalogue management and a focused purchasing journey.");
        expect(nordmarkt.technologies).toEqual(["Next.js", "React", "TypeScript", "PostgreSQL", "Prisma", "Stripe"]);
        expect(nordmarkt.coverImage).toBeNull();
        expect(nordmarkt.images).toHaveLength(0);
        expect(nordmarkt.archivePreview).toBeUndefined();
        expect(entry.variant).toBe("nordmarkt");
    });

    for (const locale of locales) {
        it(`renders the technical diagram, never a gallery screenshot (${locale})`, () => {
            const html = renderToStaticMarkup(createElement(ArchiveCard, { ...entry, locale, index: 2 }));
            expect(html).toContain('data-project-visual-scene="nordmarkt"');
            expect(html).toContain(translator(locale)("Purchase flow"));
            expect(html).not.toContain("/images/projects/nordmarkt/");
            for (const technology of nordmarkt.technologies) expect(html).toContain(`alt="${technology}"`);
        });
    }
});

describe("NORDMARKT case-study content", () => {
    it("is a studio concept with no claimed results", () => {
        expect(nordmarkt.type).toBe("concept");
        expect(nordmarkt.caseStudy.classification).toBe("studio_concept");
        expect(nordmarkt.caseStudy.results).toBeUndefined();
        expect(nordmarkt.caseStudy.qualitySignals).toBeUndefined();
        expect(nordmarkt.liveUrl).toBeNull();
        expect(nordmarkt.caseStudy.commercialCta?.label.en).toBe("Build something similar ↗");
    });

    it("uses all five gallery views in order, with matching ratios and per-view copy", () => {
        expect(gallery.map(({ media }) => media.src)).toEqual([
            "/images/projects/nordmarkt/16x9/01-storefront.webp",
            "/images/projects/nordmarkt/16x9/02-catalogue.webp",
            "/images/projects/nordmarkt/16x9/03-product-detail.webp",
            "/images/projects/nordmarkt/16x9/04-checkout.webp",
            "/images/projects/nordmarkt/16x9/05-store-dashboard.webp",
        ]);
        expect(gallery.map(({ title }) => title.en)).toEqual(["Storefront", "Product catalogue", "Product detail", "Checkout", "Store dashboard"]);
        const ratio = gallery[0].media.width / gallery[0].media.height;
        expect(ratio).toBeCloseTo(16 / 9, 2);
        for (const { media } of gallery) {
            expect(existsSync(`public${media.src}`)).toBe(true);
            expect(media.width / media.height).toBeCloseTo(ratio, 2);
        }
        for (const locale of locales) {
            expect(new Set(gallery.map(({ media }) => media.alt[locale])).size).toBe(5);
            expect(new Set(gallery.map(({ description }) => description[locale])).size).toBe(5);
        }
        expect(gallery[4].description.en).toMatch(/illustrative/u);
    });

    for (const locale of locales) {
        for (const variant of variants) {
            it(`renders ${locale} ${variant} with the full concept narrative`, () => {
                const html = render(nordmarkt, locale, variant);
                const body = content(html);
                const t = translator(locale);
                expect(html).toContain(`data-project-case-study-variant="${variant}"`);
                expect(body).toContain(projectClassificationLabels.studio_concept[locale]);
                for (const copy of [nordmarkt.caseStudy.subtitle, nordmarkt.caseStudy.category!, nordmarkt.description, nordmarkt.challenge!, nordmarkt.solution!, nordmarkt.caseStudy.capabilitiesNote!]) {
                    expect(body).toContain(copy[locale]);
                }
                for (const group of nordmarkt.caseStudy.featureGroups!) {
                    expect(body).toContain(group.label[locale]);
                    for (const item of group.items) expect(body).toContain(item[locale]);
                }
                for (const item of nordmarkt.caseStudy.scope!) expect(body).toContain(item[locale]);
                expect(html).toContain(`href="/${locale}/contact?project=nordmarkt-commerce"`);
                expect(body).toContain(nordmarkt.caseStudy.commercialCta!.label[locale]);
                expect(body).toContain(nordmarkt.caseStudy.visualSystem.typeface);
                for (const label of ["Quality signals", "Performance Audit", "Verified results"]) {
                    expect(headings(html)).not.toContain(t(label));
                }
                expect(body).not.toMatch(/Shopify|Lighthouse|99\.9%|production-ready/iu);
                expect(body).not.toContain(t("Live project ↗"));
                if (variant === "page") {
                    expect((html.match(/<img\b/gu) ?? []).length).toBe(5);
                    for (const slide of gallery) {
                        expect(html).toContain(`alt="${slide.media.alt[locale]}"`);
                        expect(body).toContain(slide.description[locale]);
                    }
                } else {
                    expect(headings(html)).toContain(t("Proposed stack"));
                    expect(headings(html)).not.toContain(t("Engine & Logic"));
                    expect(html).toContain('data-gallery-count="5"');
                    expect(html).toContain('data-gallery-index="0"');
                    expect(html).toContain("data-project-gallery-caption");
                    expect(body).toContain(gallery[0].title[locale]);
                    expect(body).toContain(gallery[0].description[locale]);
                    expect(body).not.toContain(gallery[1].description[locale]);
                    expect(html).toContain("aspect-ratio:1672 / 941");
                    expect(html).toContain(`aria-label="${t("Show next project image")}"`);
                    expect(html).toContain(`alt="${gallery[0].media.alt[locale]}"`);
                    expect(html.match(/data-project-technology=""/gu)).toHaveLength(6);
                }
            });
        }
    }
});

describe("reusable case-study template", () => {
    for (const variant of variants) {
        it(`omits missing optional sections in the ${variant} variant`, () => {
            const html = render(minimalProject, "en", variant);
            const body = content(html);
            expect(body).toContain("Minimal concept");
            expect(body).toContain("Test Sans");
            for (const label of ["Challenge", "Solution", "Product capabilities", "Project scope", "Technology groups", "Engine & Logic", "Proposed stack", "Quality signals", "Performance Audit", "Verified results", "System structure", "Project record"]) {
                expect(headings(html)).not.toContain(label);
            }
            expect(body).not.toMatch(/\bClient\b|\bRole\b|\bEngagement\b|Live project|Build something similar|Studio Concept|Real Project|undefined|null/u);
            expect(html).not.toContain("data-project-technology");
            expect(html).not.toContain("data-project-gallery");
            expect(html).not.toContain("data-project-feature-groups");
            expect(html).not.toContain("data-project-scope");
        });

        it(`renders client details, verified results and links for a real project (${variant})`, () => {
            const clientProject: Project = {
                ...minimalProject,
                title: "Client delivery",
                type: "client",
                status: "completed",
                liveUrl: "https://client.example/product",
                caseStudy: {
                    ...minimalProject.caseStudy,
                    classification: "real_project",
                    clientProfile: { name: "Example Client GmbH", industry: text("Retail", "Handel"), website: "https://client.example" },
                    role: text("Product design and engineering", "Produktdesign und Entwicklung"),
                    technologyGroups: [{ label: text("Interface", "Oberfläche"), items: ["Supported Framework"] }],
                    featureGroups: [{ label: text("Customer experience", "Kundenerlebnis"), items: [text("Order tracking", "Sendungsverfolgung")] }],
                    results: [{ label: text("Checkout completion", "Checkout-Abschluss"), value: text("+18% in 90 days", "+18 % in 90 Tagen"), source: text("Client analytics", "Kundenanalyse") }],
                    links: [{ label: text("Launch article ↗", "Launch-Artikel ↗"), href: "https://client.example/news" }],
                    commercialCta: { label: text("Discuss a project ↗", "Projekt besprechen ↗"), href: "/contact?project=client-delivery" },
                },
            };
            const html = render(clientProject, "en", variant);
            const body = content(html);
            expect(body).toContain("Real Project");
            expect(body).toContain("Example Client GmbH");
            expect(body).toContain("Order tracking");
            expect(body).toContain("Supported Framework");
            expect(headings(html)).toContain(variant === "modal" ? "Engine & Logic" : "Technology groups");
            expect(headings(html)).toContain("Verified results");
            expect(body).toContain("+18% in 90 days");
            expect(body).toContain("Client analytics");
            expect(html).toContain('href="https://client.example/product"');
            expect(html).toContain('href="https://client.example/news"');
            expect(html).toContain('href="https://client.example"');
            expect(html).toContain('href="/en/contact?project=client-delivery"');
        });
    }

    it("leaves the other archive projects on their legacy gallery data", () => {
        for (const project of allProjects.filter(({ caseStudy }) => !caseStudy.gallery)) {
            expect(project.caseStudy.gallery).toBeUndefined();
            expect(project.caseStudy.classification).toBeUndefined();
            const html = render(project, "en", "modal");
            expect(html).toContain(`data-gallery-count="${project.images.length + (project.coverImage ? 1 : 0)}"`);
            expect(html).not.toContain("data-project-gallery-caption");
        }
    });
});
