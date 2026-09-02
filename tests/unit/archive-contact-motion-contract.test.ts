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

describe("archive and contact motion contract", () => {
    const archive = read(
        "components/ArchiveSection.tsx",
    );
    const contact = read(
        "components/ContactSection.tsx",
    );
    const runtime = read(
        "components/presentation/CinematicRuntime.tsx",
    );

    it("exposes explicit editorial hooks instead of animating generic text selectors", () => {
        for (const hook of [
            "data-archive-kicker",
            "data-archive-title",
            "data-archive-intro",
            "data-archive-card",
            "data-archive-card-visual",
            "data-archive-card-copy",
            "data-archive-cta",
        ]) {
            expect(archive).toContain(hook);
        }

        expect(runtime).not.toContain(
            'archiveSection,\n                            "p, h2"',
        );
    });

    it("uses alternating restrained card movement and staged internal reveals", () => {
        expect(runtime).toContain(
            '.addLabel("archive-editorial")',
        );
        expect(runtime).toContain(
            "index % 2 === 0 ? -30 : 30",
        );
        expect(runtime).toContain(
            'clipPath: "inset(0 0 14% 0)"',
        );
        expect(runtime).toContain(
            "archiveCardCopies",
        );
    });

    it("gives Contact a converging copy, visual and form sequence with a final settled state", () => {
        for (const hook of [
            "data-contact-kicker",
            "data-contact-title",
            "data-contact-stamp",
            "data-contact-rule",
            "data-contact-copy",
            "data-contact-visual",
            "data-contact-form-wrap",
            "data-contact-form-visual",
        ]) {
            expect(contact).toContain(hook);
        }

        expect(runtime).toContain(
            '.addLabel("contact-convergence", 0.2)',
        );
        expect(runtime).toContain(
            '.addLabel("contact-settled", 0.78)',
        );
        expect(runtime).toMatch(
            /contactCopy,[\s\S]*?x:\s*-24/,
        );
        expect(runtime).toMatch(
            /contactFormWrap,[\s\S]*?x:\s*28/,
        );
    });

    it("lets Lenis own natural-flow smoothing for Archive and Contact", () => {
        expect(runtime).toMatch(
            /const archiveEntryTrigger[\s\S]*?scrub:\s*true/,
        );
        expect(runtime).toMatch(
            /const archiveContactHandoffTrigger[\s\S]*?scrub:\s*true/,
        );
    });
});
