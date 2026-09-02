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

describe("header home navigation contract", () => {
    const header = read(
        "components/layout/Header.tsx",
    );
    const runtime = read(
        "components/presentation/CinematicRuntime.tsx",
    );

    it("keeps an anchor fallback to the first homepage section", () => {
        expect(header).toContain(
            'href={`${siteConfig.links.home}#hero`}',
        );
        expect(header).toContain(
            'aria-label="Pixardia home"',
        );
    });

    it("routes same-page logo clicks through the cinematic director when available", () => {
        expect(header).toContain(
            'new CustomEvent("pixardia:navigate-target"',
        );
        expect(header).toContain(
            'target: "hero"',
        );
        expect(header).toContain(
            '[data-cinematic-runtime="ready"]',
        );

        expect(runtime).toContain(
            '"pixardia:navigate-target"',
        );
        expect(runtime).toContain(
            "handleExternalNavigation",
        );
        expect(runtime).toContain(
            "scrollToTarget(",
        );
        expect(runtime).toContain(
            "const runDirectedScroll",
        );
        expect(runtime).toContain(
            "duration: 0.95",
        );
        expect(runtime).toContain(
            'ease: "power3.inOut"',
        );
        expect(runtime).toContain(
            "immediate: true",
        );
        expect(runtime).toContain(
            "force: true",
        );
        expect(runtime).toContain(
            "element.getBoundingClientRect().top",
        );
        expect(runtime).toContain(
            "window.scrollY +",
        );
        expect(runtime).toContain(
            "onComplete: () =>",
        );
    });

    it("preserves modifier-click behavior and cleans up the runtime listener", () => {
        expect(header).toContain("event.metaKey");
        expect(header).toContain("event.ctrlKey");
        expect(runtime).toMatch(
            /removeEventListener\([\s\S]*?"pixardia:navigate-target"[\s\S]*?handleExternalNavigation/,
        );
    });
});
