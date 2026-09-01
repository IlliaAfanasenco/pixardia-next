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

describe("project modal gallery contract", () => {
    const gallery = read(
        "features/projects/ProjectModalGallery.tsx",
    );

    const caseStudy = read(
        "features/projects/ProjectCaseStudy.tsx",
    );

    const modalStyles = read(
        "features/projects/ProjectModalCaseStudy.module.css",
    );

    it("supports multiple images without breaking the existing media fields", () => {
        const projectTypes = read(
            "types/services.ts",
        );

        expect(projectTypes).toContain(
            "coverImage: ProjectMediaAsset | null",
        );

        expect(projectTypes).toContain(
            "images: readonly ProjectMediaAsset[]",
        );

        expect(caseStudy).toContain(
            "...(project.coverImage",
        );

        expect(caseStudy).toContain(
            "...project.images",
        );
    });

    it("only exposes controls when multiple images exist", () => {
        expect(gallery).toContain(
            "media.length > 1",
        );

        expect(gallery).toContain(
            "{hasNavigation ? (",
        );

        expect(gallery).toContain(
            'aria-label="Show previous project image"',
        );

        expect(gallery).toContain(
            'aria-label="Show next project image"',
        );
    });

    it("supports keyboard, swipe, reset and reduced motion", () => {
        expect(gallery).toContain(
            'event.key === "ArrowLeft"',
        );

        expect(gallery).toContain(
            'event.key === "ArrowRight"',
        );

        expect(gallery).toContain(
            "handleTouchStart",
        );

        expect(gallery).toContain(
            "handleTouchEnd",
        );

        expect(gallery).toContain(
            "prefers-reduced-motion: reduce",
        );

        expect(caseStudy).toContain(
            "key={project.slug}",
        );
    });

    it("keeps desktop panels scroll-free and height-aware", () => {
        expect(modalStyles).toContain(
            "height: 100dvh",
        );

        expect(modalStyles).toContain(
            "overflow: visible !important",
        );

        expect(modalStyles).toContain(
            "max-height: 900px",
        );

        expect(modalStyles).toContain(
            "max-height: 760px",
        );

        expect(modalStyles).not.toContain(
            "transform: scale",
        );
    });

    it("uses the current case accent only for technology hover and focus", () => {
        expect(caseStudy).toContain(
            '"--case-accent": accentColor',
        );

        expect(caseStudy).toContain(
            "hover:border-[var(--case-accent)]",
        );

        expect(caseStudy).toContain(
            "focus-visible:text-[var(--case-accent)]",
        );

        expect(caseStudy).not.toContain(
            "index === 4",
        );
    });
});
