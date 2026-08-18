import {
    readFileSync,
} from "node:fs";

import {
    describe,
    expect,
    it,
} from "vitest";

function read(path: string): string {
    return readFileSync(path, "utf8");
}

function countMatches(
    source: string,
    pattern: RegExp,
): number {
    return [...source.matchAll(pattern)].length;
}

describe("accessibility source contract", () => {
    it("uses one page h1 and one secondary h2 on project and service indexes", () => {
        const projects =
            read("app/projects/page.tsx");

        const services =
            read("app/services/page.tsx");

        expect(
            countMatches(projects, /<h1\b/g),
        ).toBe(1);

        expect(
            countMatches(projects, /<h2\b/g),
        ).toBe(1);

        expect(projects).toMatch(
            /<h1[\s\S]*?id="projects-page-title"/,
        );

        expect(
            countMatches(services, /<h1\b/g),
        ).toBe(1);

        expect(
            countMatches(services, /<h2\b/g),
        ).toBe(1);

        expect(services).toMatch(
            /<h1[\s\S]*?id="services-page-title"/,
        );
    });

    it("associates the service error with the select", () => {
        const contact =
            read("components/ContactSection.tsx");

        expect(contact).toContain(
            'id="project-service-error"',
        );

        expect(contact).toContain(
            '"project-service-error"',
        );
    });

    it("associates the privacy error with the checkbox", () => {
        const contact =
            read("components/ContactSection.tsx");

        expect(contact).toContain(
            'id="privacy-accepted"',
        );

        expect(contact).toContain(
            'id="privacy-accepted-error"',
        );

        expect(contact).toContain(
            '"privacy-accepted-error"',
        );
    });

    it("names the privacy policy link", () => {
        const contact =
            read("components/ContactSection.tsx");

        expect(contact).toContain(
            '"Open privacy policy"',
        );

        expect(contact).toContain(
            '"Datenschutzerklärung öffnen"',
        );
    });

    it("provides a reduced-motion fallback", () => {
        const css =
            read("app/globals.css");

        expect(css).toContain(
            "@media (prefers-reduced-motion: reduce)",
        );

        expect(css).toContain(
            "animation-duration: 0.01ms !important",
        );

        expect(css).toContain(
            "transition-duration: 0.01ms !important",
        );
    });

    it("preserves the project modal contract", () => {
        const modal =
            read(
                "features/projects/ProjectModal.tsx",
            );

        expect(modal).toContain(
            'role="dialog"',
        );

        expect(modal).toContain(
            'aria-modal="true"',
        );

        expect(modal).toContain(
            'event.key === "Escape"',
        );

        expect(modal).toContain(
            'setAttribute("inert", "")',
        );
    });
});
