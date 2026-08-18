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

describe("P2 project case study contract", () => {
    const caseStudy = read(
        "features/projects/ProjectCaseStudy.tsx",
    );

    it("renders the full project narrative", () => {
        for (const marker of [
            "Project overview",
            "Challenge",
            "Solution",
            "System structure",
            "Project record",
            "Technology groups",
            "Quality signals",
            "Interface language",
            "Continue through",
        ]) {
            expect(caseStudy).toContain(
                marker,
            );
        }
    });

    it("uses canonical project fields", () => {
        const compact =
            caseStudy.replace(/\s+/gu, "");

        for (const marker of [
            "project.description.en",
            "project.challenge.en",
            "project.solution.en",
            "project.caseStudy.architecture.en",
            "project.caseStudy.facts",
            "project.caseStudy.technologyGroups",
            "project.caseStudy.qualitySignals",
            "project.caseStudy.visualSystem",
        ]) {
            expect(compact).toContain(
                marker,
            );
        }
    });

    it("distinguishes evidence semantics", () => {
        expect(caseStudy).toContain(
            'verified: "Verified"',
        );

        expect(caseStudy).toContain(
            'target: "Target"',
        );

        expect(caseStudy).toContain(
            'not_measured: "Not measured"',
        );
    });

    it("only renders media when media exists", () => {
        expect(caseStudy).toContain(
            "media.length > 0",
        );

        expect(caseStudy).toContain(
            "<Image",
        );
    });

    it("provides next-project navigation", () => {
        expect(caseStudy).toContain(
            "nextProject",
        );

        expect(caseStudy).toContain(
            'href={`/projects/${nextProject.slug}`}',
        );
    });

    it("supports modal and canonical page variants", () => {
        expect(caseStudy).toContain(
            'variant === "modal"',
        );

        expect(caseStudy).toContain(
            'variant === "page"',
        );
    });
});
