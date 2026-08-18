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

describe("responsive cinematic cleanup contract", () => {
    const hero = read(
        "components/HeroSection.tsx",
    );

    const runtime = read(
        "components/presentation/CinematicRuntime.tsx",
    );

    it("keeps the hero character in normal flow below cinematic desktop", () => {
        expect(
            hero,
        ).toContain(
            "min-[1200px]:absolute",
        );

        expect(
            hero,
        ).not.toContain(
            "sm:absolute",
        );

        expect(
            hero,
        ).toContain(
            "min-[1200px]:-translate-x-1/2",
        );
    });

    it("bounds the responsive character composition inside the viewport", () => {
        expect(
            hero,
        ).toContain(
            "w-[min(86vw,340px)]",
        );

        expect(
            hero,
        ).toContain(
            "sm:w-[clamp(340px,44vw,470px)]",
        );

        expect(
            hero,
        ).toContain(
            "max-w-full",
        );
    });

    it("explicitly clears desktop GSAP presentation styles when cinematic mode exits", () => {
        expect(
            runtime,
        ).toContain(
            "runtimeStyledElements",
        );

        expect(
            runtime,
        ).toContain(
            '"transform,opacity,visibility,clipPath"',
        );

        expect(
            runtime,
        ).toContain(
            '"[data-cinematic-element]"',
        );

        expect(
            runtime,
        ).toContain(
            "clearProps:",
        );
    });

    it("preserves the cinematic desktop media-query boundary", () => {
        expect(
            runtime,
        ).toContain(
            "(min-width: 1200px)",
        );

        expect(
            runtime,
        ).toContain(
            "(min-height: 800px)",
        );
    });
});
