import { existsSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ArchiveCard from "@/components/archive/ArchiveCard";
import ArchiveSystemPreview from "@/components/archive/ArchiveSystemPreview";
import { getArchiveProjects } from "@/components/archive/archive-projects";
import { localized } from "@/i18n/localized";

const archive = getArchiveProjects();

describe("archive project visual contract", () => {
    it("renders a distinct system preview for each configured project", () => {
        expect(archive).toHaveLength(4);
        expect(new Set(archive.map(({ variant }) => variant)).size).toBe(4);
        for (const [index, entry] of archive.entries()) {
            const html = renderToStaticMarkup(createElement(ArchiveCard, { ...entry, locale: "en", index }));
            expect(html).toContain(`data-project-visual-scene="${entry.variant}"`);
            expect(html).toContain(entry.project.caseStudy.identifier);
            expect(html).toContain("System preview");
            expect(html).toContain("Explore case →");
        }
    });

    it("preserves localized case-study URLs and modal focus targets", () => {
        for (const locale of ["en", "de"] as const) {
            for (const [index, entry] of archive.entries()) {
                const html = renderToStaticMarkup(createElement(ArchiveCard, { ...entry, locale, index }));
                expect(html).toContain(`href="/${locale}/projects/${entry.project.slug}"`);
                expect(html).toContain(`id="project-modal-trigger-${entry.project.slug}"`);
                expect(html).toContain('aria-haspopup="dialog"');
                expect(html).toContain(localized(entry.project.summary, locale));
            }
        }
    });

    it("uses configured technologies with accessible names and real local icon assets", () => {
        for (const [index, entry] of archive.entries()) {
            const html = renderToStaticMarkup(createElement(ArchiveCard, { ...entry, locale: "en", index }));
            for (const technology of entry.project.technologies) {
                expect(html).toContain(`alt="${technology}"`);
            }
            expect(html).not.toContain(`${entry.project.technologies.length} technologies`);
            const sources = [...html.matchAll(/src="(\/icons\/technologies\/[^"?]+\.svg)"/g)];
            expect(sources.length).toBe(entry.project.technologies.length * 2);
            for (const [, source] of sources) expect(existsSync(`public${source}`)).toBe(true);
        }
    });

    it("keeps supplied project covers and German preview labels", () => {
        const html = renderToStaticMarkup(createElement(ArchiveSystemPreview, {
            projectId: "PX-2026-001", variant: "pixardia", technologies: [], locale: "de",
            coverImage: { src: "/images/1.png", alt: { en: "Project cover", de: "Projektbild" }, width: 400, height: 300 },
        }));
        expect(html).toContain('alt="Projektbild"');
        expect(html).toContain("Systemvorschau");
        expect(html).toContain("Projekt ansehen →");
        expect(html).not.toContain("Content &amp; services");
    });
});
