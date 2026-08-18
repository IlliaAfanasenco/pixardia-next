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

describe("runtime continuity contract", () => {
    it("keeps the GSAP pin inside a React-owned shell", () => {
        const homepage = read("app/page.tsx");

        expect(homepage).toContain(
            'data-cinematic-pin-shell=""',
        );

        expect(homepage).toContain(
            'data-cinematic-stage=""',
        );
    });

    it("preserves cinematic chapter state while a project modal is open", () => {
        const runtime = read(
            "components/presentation/CinematicRuntime.tsx",
        );
        const modal = read(
            "features/projects/ProjectModal.tsx",
        );

        expect(runtime).toContain(
            "root.dataset.projectModalOpen",
        );

        expect(modal).toContain(
            'root.dataset.projectModalOpen = "true"',
        );

        expect(modal).toContain(
            "preserveCinematicScroll",
        );

        expect(modal).toContain(
            'root.style.overflow = "hidden"',
        );
    });

    it("provides a dedicated lifecycle to evidence transition", () => {
        const runtime = read(
            "components/presentation/CinematicRuntime.tsx",
        );
        const interlude = read(
            "components/presentation/EvidenceInterlude.tsx",
        );

        expect(runtime).toContain(
            "EvidenceInterlude",
        );

        expect(runtime).toContain(
            "evidenceInterlude",
        );

        expect(interlude).toContain(
            "04 / EVIDENCE",
        );

        expect(interlude).toContain(
            "From process",
        );

        expect(interlude).toContain(
            "to proof",
        );
    });

    it("uses one five-chapter narrative", () => {
        expect(
            read("components/CraftingStructureSection.tsx"),
        ).toContain("02 / STRUCTURE");

        expect(
            read("components/ProductSection.tsx"),
        ).toContain("03 / LIFECYCLE");

        expect(
            read("components/ArchiveSection.tsx"),
        ).toContain("04 / EVIDENCE");

        expect(
            read("components/ContactSection.tsx"),
        ).toContain("05 / CONNECTION");
    });
});
