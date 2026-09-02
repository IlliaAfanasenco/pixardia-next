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

describe("cinematic director contract", () => {
    const runtime = read(
        "components/presentation/CinematicRuntime.tsx",
    );

    it("uses Lenis as the single smoothing source for the pinned master timeline", () => {
        expect(runtime).toMatch(
            /new Lenis\(\{[\s\S]*?lerp:\s*0\.1(?:0)?[\s\S]*?wheelMultiplier:\s*0\.88/,
        );

        expect(runtime).toMatch(
            /trigger:\s*stage,[\s\S]*?scrub:\s*true,[\s\S]*?pin:\s*true/,
        );

        expect(runtime).not.toContain("scrub: 0.28");
    });

    it("uses decisive masks instead of translucent pinned-scene crossfades", () => {
        expect(runtime).toContain(
            'clipPath: "inset(0 100% 0 0)"',
        );

        expect(runtime).toContain(
            'clipPath: "inset(0 0 0 100%)"',
        );

        for (const staleOverlap of [
            "autoAlpha: 0.56",
            "autoAlpha: 0.52",
            "autoAlpha: 0.58",
            "autoAlpha: 0.46",
        ]) {
            expect(runtime).not.toContain(staleOverlap);
        }
    });

    it("gives Neural an explicit boot and contraction lifecycle", () => {
        expect(runtime).toContain(
            '.addLabel("neural")',
        );

        expect(runtime).toContain(
            '.addLabel("neural-to-product")',
        );

        expect(runtime).toContain(
            "neuralNetworkPaths",
        );

        expect(runtime).toContain(
            "strokeDashoffset: 1",
        );

        expect(runtime).toContain(
            "strokeDashoffset: 0",
        );

        expect(runtime).toContain(
            'from: "end"',
        );

        expect(runtime).toMatch(
            /neuralCore,[\s\S]*?scale:\s*0\.82/,
        );
    });

    it("primes the masked Product scene before the convergence bridge completes", () => {
        const handoff = runtime.indexOf(
            '.addLabel("neural-to-product")',
        );
        const productMask = runtime.indexOf(
            ".set(\n                            productLayer",
            handoff,
        );
        const convergence = runtime.indexOf(
            ".fromTo(\n                            '[data-cinematic-signal-path=\"convergence\"]'",
            handoff,
        );
        const productReveal = runtime.indexOf(
            ".to(\n                            productLayer",
            productMask,
        );

        expect(handoff).toBeGreaterThanOrEqual(0);
        expect(productMask).toBeGreaterThan(handoff);
        expect(convergence).toBeGreaterThan(productMask);
        expect(productReveal).toBeGreaterThan(convergence);
        expect(runtime.slice(productReveal, productReveal + 420)).toContain(
            "duration: 0.42",
        );
    });

    it("starts the evidence frame before Product is fully released", () => {
        const bridge = runtime.indexOf(
            '.addLabel("product-to-archive-signal")',
        );
        const evidence = runtime.indexOf(
            ".set(\n                            evidenceInterlude",
            bridge,
        );
        const productSceneRelease = runtime.indexOf(
            ".to(\n                            scenes[3]",
            evidence,
        );

        expect(bridge).toBeGreaterThanOrEqual(0);
        expect(evidence).toBeGreaterThan(bridge);
        expect(productSceneRelease).toBeGreaterThan(evidence);
        expect(runtime).toContain(
            '.addLabel("product-clean-release")',
        );
        expect(runtime).toContain(
            "duration: 0.34",
        );
    });
});
