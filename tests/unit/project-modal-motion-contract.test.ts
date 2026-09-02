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

describe("project modal motion contract", () => {
    const modal = read(
        "features/projects/ProjectModal.tsx",
    );

    const motion = read(
        "lib/motion/tokens.ts",
    );

    const caseStudy = read(
        "features/projects/ProjectCaseStudy.tsx",
    );

    it("uses GSAP curtain motion instead of CSS visibility toggles", () => {
        expect(modal).toContain(
            'data-project-modal-panel="left"',
        );
        expect(modal).toContain(
            'data-project-modal-panel="right"',
        );
        expect(modal).toContain("xPercent: -104");
        expect(modal).toContain("xPercent: 104");
        expect(modal).toContain("openingTimelineRef");
        expect(modal).toContain("closingTimelineRef");
        expect(modal).not.toContain(
            "setTimeout(\n            () => router.back()",
        );
        expect(modal).not.toContain("router.back()");
        expect(modal).toContain("router.replace(returnHrefRef.current");
        expect(modal).toContain("navigationCommittedRef");
    });

    it("uses a narrow fixed center rail so the two panels read as curtains", () => {
        expect(caseStudy).toContain(
            "md:grid-cols-[minmax(0,1fr)_clamp(132px,8.5vw,180px)_minmax(0,1fr)]",
        );
    });

    it("hard-locks cinematic scrolling while the modal is open", () => {
        expect(modal).toContain(
            'new Event("pixardia:project-modal-lock")',
        );
        expect(modal).toContain(
            'new Event("pixardia:project-modal-unlock")',
        );
        expect(modal).toContain(
            'body.style.position = "fixed"',
        );
        expect(modal).toContain(
            'root.style.overflow = "hidden"',
        );
        expect(modal).toContain(
            'body.style.overscrollBehavior = "none"',
        );
        expect(modal).toContain(
            'document.addEventListener(\n                "wheel",\n                preventDesktopScroll',
        );
        expect(modal).toContain(
            'document.addEventListener(\n                "touchmove",\n                preventDesktopScroll',
        );
        expect(modal).toContain(
            'window.scrollTo({\n                top: scrollY',
        );
    });

    it("releases inert state and pointer interception before soft navigation", () => {
        expect(modal).toContain(
            "releaseEnvironmentRef",
        );
        expect(modal).toContain(
            "releaseEnvironmentRef.current?.();",
        );
        expect(modal).toContain(
            'modalRoot.style.pointerEvents = "none"',
        );
        expect(modal).toContain(
            'modalRoot.setAttribute(\n                "aria-hidden",\n                "true"',
        );

        expect(
            modal.indexOf(
                "releaseEnvironmentRef.current?.();",
            ),
        ).toBeLessThan(
            modal.indexOf(
                "router.replace(returnHrefRef.current",
            ),
        );
    });

    it("keeps reduced motion and accessibility behavior", () => {
        expect(modal).toContain(
            "prefers-reduced-motion: reduce",
        );
        expect(modal).toContain(
            'setAttribute("inert", "")',
        );
        expect(modal).toContain(
            'event.key === "Escape"',
        );
        expect(modal).toContain(
            "getFocusableElements",
        );
    });

    it("centralizes motion timing and easing", () => {
        expect(motion).toContain("curtainIn");
        expect(motion).toContain("curtainOut");
        expect(motion).toContain("curtainIn: 0.64");
        expect(modal).toContain("motionTokens");
    });
});
