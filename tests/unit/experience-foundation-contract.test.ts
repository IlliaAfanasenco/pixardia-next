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

const homepageSections = [
    {
        file: "components/HeroSection.tsx",
        id: "hero",
        storySection: "hero",
        step: "1",
        cinematicScene: "hero",
    },
    {
        file: "components/CraftingStructureSection.tsx",
        id: "crafting-structure",
        storySection: "crafting-structure",
        step: "2",
        cinematicScene: "crafting",
    },
    {
        file: "components/ProductSection.tsx",
        id: "process",
        storySection: "product-process",
        step: "3",
        cinematicScene: "product",
    },
] as const;

const protectedHashes = {
    archive:
        "1E841B5EEF8B44125D811015439994880972EF63AEE87008892F718B03481FB4",
    contact:
        "E525350D12DC96B2204A964B93F42EA8EE19A5D20A5AEE77F718556919EC87B4",
    projectModal:
        "4188444A5F6CE17770D6870D9EC51832B5FF43438F7BFF97BD5B3F7231A49F1B",
    projectData:
        "F0F889E4FDB733323F5CA1F64CABE8FBB4CEDE62927CCD4DF1D9AB4C7DA21053",
    modalRoute:
        "28249A4767DE3C99CA2E1E4BDE45388A00CF40640A1F016D064CA3E92F7E6A35",
    projectPage:
        "F406AB413EB233764760F208F2A6E325A9DCB97E71F970A2E12F11E9AB5FA604",
    packageJson:
        "E98BD2197D792837D31310992C6E956F2FB34707E014C832F47D98CF5EF655F2",
    lockfile:
        "CFE0E4EA4399D9B7357029D5447324E34BDE14DF575281D6078D678A59942E90",
} as const;

describe("experience foundation contract", () => {
    it("mounts one isolated client cinematic runtime on the homepage", () => {
        const runtimePath =
            "components/presentation/CinematicRuntime.tsx";
        const homepage = read("app/page.tsx");

        expect(existsSync(runtimePath)).toBe(true);
        expect(homepage).toContain(
            'data-cinematic-stage=""',
        );
        expect(homepage).toContain("<CinematicRuntime />");
        expect(homepage).not.toMatch(
            /MotionRuntime|StorylineOverlay/,
        );

        const runtime = read(runtimePath);

        expect(runtime).toContain('"use client"');
        expect(runtime).toContain("useEffect");
        expect(runtime).toContain("ScrollTrigger");
        expect(runtime).toContain("gsap.registerPlugin");
        expect(runtime).toContain("gsap.matchMedia");
        expect(runtime).toContain("const timeline = gsap.timeline");
        expect(runtime).toContain("ScrollTrigger.create");
        expect(homepage).toContain(
            "</div>\n            <CinematicRuntime />\n            <ArchiveSection />",
        );
    });

    it("uses the required official motion dependencies only", () => {
        const packageJson = JSON.parse(
            read("package.json"),
        ) as {
            dependencies?: Record<string, string>;
            devDependencies?: Record<string, string>;
        };
        const installedPackages = new Set([
            ...Object.keys(
                packageJson.dependencies ?? {},
            ),
            ...Object.keys(
                packageJson.devDependencies ?? {},
            ),
        ]);

        for (const dependency of [
            "gsap",
            "@gsap/react",
            "lenis",
        ]) {
            expect(installedPackages.has(dependency)).toBe(
                true,
            );
        }

        for (const dependency of [
            "framer-motion",
            "motion",
            "locomotive-scroll",
            "react-gsap",
            "gsap-react",
            "three",
            "@react-three/fiber",
            "anime.js",
            "aos",
        ]) {
            expect(installedPackages.has(dependency)).toBe(
                false,
            );
        }
    });

    it("defines a single pinned ScrollTrigger stage without snap or wheel interception", () => {
        const runtime = read(
            "components/presentation/CinematicRuntime.tsx",
        );

        expect(runtime).toContain("pin: true");
        expect(runtime.match(/pin:\s*true/g)).toHaveLength(1);
        expect(runtime).toContain("pinSpacing: true");
        expect(runtime).toContain("scrub: 0.18");
        expect(runtime).toContain("invalidateOnRefresh: true");
        expect(runtime).toContain('start: "top top"');
        expect(runtime).toContain("end: () =>");
        expect(runtime).not.toMatch(/\bsnap\s*:/);
        expect(runtime).not.toMatch(
            /(?:wheel|scroll)[\s\S]{0,80}preventDefault|preventDefault[\s\S]{0,80}(?:wheel|scroll)/,
        );
        expect(runtime).not.toMatch(/window\.scrollTo/);
        expect(runtime).not.toMatch(
            /new IntersectionObserver/,
        );
    });

    it("integrates Lenis through the GSAP ticker and cleans it up", () => {
        const runtime = read(
            "components/presentation/CinematicRuntime.tsx",
        );

        expect(runtime).toContain('import Lenis from "lenis"');
        expect(runtime.match(/new Lenis/g)).toHaveLength(1);
        expect(runtime).toContain(
            'lenis.on("scroll", ScrollTrigger.update)',
        );
        expect(runtime.match(/gsap\.ticker\.add/g)).toHaveLength(
            1,
        );
        expect(runtime).toContain("lenis.raf(time * 1000)");
        expect(runtime).toContain(
            "gsap.ticker.lagSmoothing(0)",
        );
        expect(runtime).toContain("gsap.ticker.remove");
        expect(runtime).toContain(
            'lenis.off("scroll", ScrollTrigger.update)',
        );
        expect(runtime).toContain(
            'control.removeEventListener(\n                                "click"',
        );
        expect(runtime).toContain("lenis.destroy()");
        expect(runtime).not.toMatch(/autoRaf/);
        expect(runtime).not.toMatch(
            /requestAnimationFrame\([^)]*lenis/,
        );
    });

    it("keeps explicit timeline labels for the presentation storyboard", () => {
        const runtime = read(
            "components/presentation/CinematicRuntime.tsx",
        );

        for (const label of [
            "hero",
            "hero-to-crafting",
            "crafting",
            "crafting-to-product",
            "product",
            "product-deconstruct",
            "product-to-archive-signal",
            "product-to-archive",
            "product-clean-release",
        ]) {
            expect(runtime).toContain(`.addLabel("${label}")`);
        }

        expect(runtime).toContain(
            '[data-cinematic-product-card]',
        );
        expect(runtime).toContain("stagger");
        expect(runtime).toContain(
            '[data-cinematic-veil]',
        );
        expect(runtime).toContain(
            "[data-cinematic-signal-path]",
        );
        expect(runtime).toContain("getLabelScroll");
        expect(runtime).toContain("timeline.labels[label]");
        expect(runtime).toContain("trigger.start +");
        expect(runtime).toContain(
            "trigger.end - trigger.start",
        );
        expect(runtime).toContain("autoAlpha: 0");
        expect(runtime).toContain("product-clean-release");
    });

    it("extends the same runtime across Archive and Contact without pinning natural-flow sections", () => {
        const runtime = read(
            "components/presentation/CinematicRuntime.tsx",
        );
        const styles = read("app/globals.css");
        const signalRoute = read(
            "components/presentation/SignalRoute.tsx",
        );

        for (const name of [
            "productArchiveHandoffTrigger",
            "archiveEntryTrigger",
            "archiveActiveTrigger",
            "archiveContactHandoffTrigger",
            "contactChapterTrigger",
        ]) {
            expect(runtime).toContain(name);
        }

        for (const label of [
            "archive-handoff",
            "archive-entry",
            "archive-active",
            "archive-outro",
            "contact-entry",
            "contact-settled",
        ]) {
            expect(runtime).toContain(`.addLabel("${label}")`);
        }

        expect(runtime).toContain("trigger: archiveSection");
        expect(runtime).toContain("trigger: contactSection");
        expect(runtime).toContain("setFlowChapter(\"archive\")");
        expect(runtime).toContain("setFlowChapter(\"contact\")");
        expect(runtime).toContain("flowTimelines");
        expect(runtime).toContain("flowTriggers");
        expect(runtime).not.toMatch(
            /(?:archive|contact)[\s\S]{0,160}pin:\s*true/i,
        );
        expect(runtime).toContain(
            "[data-cinematic-signal]",
        );
        expect(runtime).toContain(
            '[data-cinematic-signal-path="convergence"]',
        );
        expect(runtime).toContain(
            "gsap.set(signalRoute",
        );
        expect(styles).toContain(
            ".cinematic-signal-route",
        );
        expect(signalRoute).toContain(
            'data-cinematic-signal-path="convergence"',
        );
        expect(signalRoute).not.toContain(
            'data-cinematic-signal-path="vertical"',
        );
    });

    it("uses desktop-only stage CSS and mobile natural flow", () => {
        const styles = read("app/globals.css");

        expect(styles).toContain("--cinematic-content-max");
        expect(styles).toContain("--cinematic-gutter");
        expect(styles).toContain("--cinematic-header-offset");
        expect(styles).toContain("--cinematic-nav-right");
        expect(styles).toContain("--cinematic-stage-height");
        expect(styles).toContain(
            '.cinematic-stage[data-cinematic-mode="desktop"]',
        );
        expect(styles).toContain("min-height: var(--cinematic-stage-height)");
        expect(styles).toContain(
            "> [data-cinematic-scene]",
        );
        expect(styles).toContain("position: absolute");
        expect(styles).toContain(
            "@media (max-width: 1199px), (max-height: 799px), (hover: none), (pointer: coarse)",
        );
        expect(styles).not.toMatch(
            /animation-timeline|view-timeline|scroll-snap(?:-type|-align|-stop)?\s*:/,
        );
        expect(styles).not.toMatch(
            /scroll-behavior:\s*smooth/,
        );
    });

    it("provides clickable viewport-fixed navigator controls and full-stage veil", () => {
        const navigator = read(
            "components/presentation/SceneNavigator.tsx",
        );
        const veil = read(
            "components/presentation/TransitionVeil.tsx",
        );
        const styles = read("app/globals.css");

        expect(navigator).toContain(
            'aria-label="Homepage presentation scenes"',
        );
        expect(navigator).toContain(
            'data-cinematic-navigator=""',
        );
        expect(navigator).toContain(
            "data-cinematic-nav-fill",
        );
        expect(navigator.match(/<button/g)).toHaveLength(1);
        expect(navigator.match(/data-cinematic-nav-target/g)).toHaveLength(
            1,
        );
        expect(navigator).toContain('type="button"');
        expect(navigator).toContain("Archive");
        expect(navigator).toContain("Contact");
        expect(veil).toContain('aria-hidden="true"');
        expect(veil).toContain('data-cinematic-veil=""');
        expect(styles).toMatch(
            /\.cinematic-navigator\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?right:\s*var\(--cinematic-nav-right\);[\s\S]*?pointer-events:\s*auto;/,
        );
        expect(styles).toContain(
            "--cinematic-nav-right: clamp(18px, 1.8vw, 52px)",
        );
        expect(styles).toMatch(
            /\.cinematic-navigator__link\s*\{[\s\S]*?min-width:\s*44px;[\s\S]*?min-height:\s*44px;/,
        );
        expect(styles).toContain('[aria-current="step"]');
        expect(styles).toContain(":focus-visible");
        expect(styles).toMatch(
            /\.cinematic-signal-route path\s*\{[\s\S]*?pointer-events:\s*none;/,
        );
        expect(styles).toMatch(
            /\.cinematic-transition-veil\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?inset:\s*0;/,
        );
        expect(styles).not.toMatch(/backdrop-filter|filter:\s*blur/);
        const runtime = read(
            "components/presentation/CinematicRuntime.tsx",
        );

        expect(runtime).toContain("autoAlpha: 0.09");
        expect(runtime).not.toContain("autoAlpha: 0.15");
        expect(runtime).not.toContain("autoAlpha: 0.14");
        expect(runtime).not.toContain("autoAlpha: 0.13");
        expect(styles).not.toContain(
            'path[data-cinematic-signal-path="vertical"]',
        );
    });

    it("updates continuous progress without React per-frame rerenders", () => {
        const runtime = read(
            "components/presentation/CinematicRuntime.tsx",
        );

        expect(runtime).not.toMatch(/useState|setState/);
        expect(runtime).toContain("gsap.quickSetter");
        expect(runtime).toContain("navigatorProgressByChapter");
        expect(runtime).toContain("archive: 0.75");
        expect(runtime).toContain("contact: 1");
        expect(runtime).toContain("self.progress * 0.25");
        expect(runtime).not.toMatch(
            /timeline\.to\(\s*navigatorFill/,
        );
        expect(runtime).toContain("--cinematic-progress");
        expect(runtime).not.toMatch(/getBoundingClientRect/);
    });

    it("keeps the homepage order and stable scene hooks explicit", () => {
        const homepage = read("app/page.tsx");
        const componentOrder = [
            "<HeroSection />",
            "<CraftingStructureSection />",
            "<ProductSection />",
            "<CinematicRuntime />",
            "<ArchiveSection />",
            "<ContactSection />",
        ];

        const positions = componentOrder.map(
            (component) => homepage.indexOf(component),
        );

        expect(
            positions.every((position) => position >= 0),
        ).toBe(true);
        expect(positions).toEqual(
            [...positions].sort((left, right) => left - right),
        );

        for (const section of homepageSections) {
            const source = read(section.file);

            expect(source).toContain(
                `id="${section.id}"`,
            );
            expect(source).toContain(
                `data-story-section="${section.storySection}"`,
            );
            expect(source).toContain(
                `data-story-step="${section.step}"`,
            );
            expect(source).toContain(
                `data-cinematic-scene="${section.cinematicScene}"`,
            );
            expect(source).toContain("data-cinematic-layer");
        }
    });

    it("preserves protected Archive, project data, and modal architecture", () => {
        const archive = read(
            "components/ArchiveSection.tsx",
        );
        const modal = read(
            "components/projects/ProjectModal.tsx",
        );
        const modalRoute = read(
            "app/@projectModal/(.)projects/[slug]/page.tsx",
        );
        const projectPage = read(
            "app/projects/[slug]/page.tsx",
        );

        expect(archive).toContain(
            "const caseStudies = [",
        );
        expect(archive).toContain("caseStudies.map");
        expect(archive).not.toMatch(
            /@\/content\/projects|ProjectCaseStudy|projects\.map/,
        );
        expect(read("content/projects.ts")).toContain(
            "export const projects",
        );
        expect(modal).toContain("ProjectModal");
        expect(modalRoute).toContain("ProjectModal");
        expect(projectPage).toContain("Project");
    });

    it("keeps protected content and dependency files unchanged for the polish pass", async () => {
        const { createHash } = await import("node:crypto");

        function hash(path: string): string {
            return createHash("sha256")
                .update(read(path))
                .digest("hex")
                .toUpperCase();
        }

        expect(hash("components/ArchiveSection.tsx")).toBe(
            protectedHashes.archive,
        );
        expect(hash("components/ContactSection.tsx")).toBe(
            protectedHashes.contact,
        );
        expect(
            hash("components/projects/ProjectModal.tsx"),
        ).toBe(protectedHashes.projectModal);
        expect(hash("content/projects.ts")).toBe(
            protectedHashes.projectData,
        );
        expect(
            hash(
                "app/@projectModal/(.)projects/[slug]/page.tsx",
            ),
        ).toBe(protectedHashes.modalRoute);
        expect(hash("app/projects/[slug]/page.tsx")).toBe(
            protectedHashes.projectPage,
        );
        expect(hash("package.json")).toBe(
            protectedHashes.packageJson,
        );
        expect(hash("pnpm-lock.yaml")).toBe(
            protectedHashes.lockfile,
        );
    });
});
