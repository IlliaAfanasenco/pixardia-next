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

describe("archive project visual contract", () => {
    const archive = read(
        "components/ArchiveSection.tsx",
    );

    it("removes the old generic white placeholder composition", () => {
        expect(
            archive,
        ).not.toContain(
            "ProjectVisualPlaceholder",
        );

        expect(
            archive,
        ).not.toContain(
            'h-[38%] w-[56%]',
        );

        expect(
            archive,
        ).not.toContain(
            "grid grid-cols-3 gap-2 opacity-70",
        );
    });

    it("keeps real project cover images as the preferred source", () => {
        expect(
            archive,
        ).toContain(
            "project.coverImage ?",
        );

        expect(
            archive,
        ).toContain(
            "<ProjectVisualFallback",
        );
    });

    it("provides a distinct fallback visual for every featured project", () => {
        expect(
            archive,
        ).toContain(
            'data-project-visual-scene="pixardia"',
        );

        expect(
            archive,
        ).toContain(
            'data-project-visual-scene="nexus"',
        );

        expect(
            archive,
        ).toContain(
            'data-project-visual-scene="nordmarkt"',
        );

        expect(
            archive,
        ).toContain(
            'data-project-visual-scene="coreflow"',
        );
    });

    it("does not touch project modal routing", () => {
        expect(
            archive,
        ).toContain(
            'href={`/projects/${project.slug}`}',
        );

        expect(
            archive,
        ).toContain(
            "scroll={false}",
        );

        expect(
            archive,
        ).toContain(
            'aria-haspopup="dialog"',
        );
    });
});
