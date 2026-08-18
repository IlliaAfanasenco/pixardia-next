import {
    existsSync,
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

describe("project modal route contract", () => {
    it("uses the root parallel route slot", () => {
        expect(
            existsSync(
                "app/@projectModal/(.)projects/[slug]/page.tsx",
            ),
        ).toBe(true);

        expect(
            existsSync(
                "app/@projectModal/default.tsx",
            ),
        ).toBe(true);

        expect(
            existsSync(
                "app/@projectModal/[...catchAll]/page.tsx",
            ),
        ).toBe(true);
    });

    it("removes the broken projects-local slot", () => {
        expect(
            existsSync(
                "app/projects/@modal",
            ),
        ).toBe(false);

        expect(
            existsSync(
                "app/projects/layout.tsx",
            ),
        ).toBe(false);
    });

    it("renders the modal outside the site shell", () => {
        const layout =
            read("app/layout.tsx");

        expect(layout).toContain(
            "projectModal: ReactNode",
        );

        expect(layout).toContain(
            'data-site-shell=""',
        );

        expect(layout).toContain(
            "{projectModal ?? null}",
        );
    });

    it("provides null fallback routes", () => {
        expect(
            read(
                "app/@projectModal/default.tsx",
            ),
        ).toContain("return null");

        expect(
            read(
                "app/@projectModal/[...catchAll]/page.tsx",
            ),
        ).toContain("return null");
    });

    it("keeps intercepted and canonical routes separate", () => {
        const intercepted =
            read(
                "app/@projectModal/(.)projects/[slug]/page.tsx",
            );

        expect(intercepted).toContain(
            "<ProjectModal",
        );

        expect(intercepted).toContain(
            'variant="modal"',
        );

        expect(intercepted).not.toContain(
            "generateStaticParams",
        );
    });

    it("opens canonical project routes from the homepage archive", () => {
        const archive =
            read(
                "components/ArchiveSection.tsx",
            );

        expect(archive).toContain(
            "getFeaturedProjects",
        );

        expect(archive).toContain(
            'href={`/projects/${project.slug}`}',
        );

        expect(archive).toContain(
            'id={`project-modal-trigger-${project.slug}`}',
        );

        expect(archive).toContain(
            'scroll={false}',
        );

        expect(archive).toContain(
            'aria-haspopup="dialog"',
        );

        expect(archive).not.toContain(
            'href="#"',
        );

        expect(archive).not.toContain(
            "NexusPaySystem",
        );
    });

    it("makes the complete site shell inert", () => {
        const modal =
            read(
                "features/projects/ProjectModal.tsx",
            );

        expect(modal).toContain(
            '"[data-site-shell]"',
        );

        expect(modal).not.toContain(
            '"[data-projects-route-content]"',
        );

        expect(modal).toContain(
            'setAttribute("inert", "")',
        );
    });
});
