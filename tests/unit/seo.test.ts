import {
    describe,
    expect,
    it,
} from "vitest";

import { siteConfig } from "@/config/site";
import {
    createPageMetadata,
} from "@/lib/seo";

const description =
    "Selected Pixardia digital product case studies.";

describe("createPageMetadata", () => {
    it("creates canonical and social metadata for a route", () => {
        const metadata = createPageMetadata({
            title: "Projects",
            description,
            path: "/projects",
        });

        expect(metadata.title).toBe("Projects");

        expect(metadata.description).toBe(
            description,
        );

        expect(metadata.alternates).toEqual({
            canonical: "/projects",
        });

        expect(metadata.openGraph).toMatchObject({
            type: "website",
            locale: "en_US",
            url: new URL(
                "/projects",
                `${siteConfig.url}/`,
            ).toString(),
            siteName: siteConfig.name,
            title: "Projects | Pixardia",
            description,
        });

        expect(metadata.twitter).toMatchObject({
            card: "summary",
            title: "Projects | Pixardia",
            description,
        });

        expect(metadata.robots).toMatchObject({
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        });
    });

    it("uses an absolute title for the homepage", () => {
        const metadata = createPageMetadata({
            title: siteConfig.title,
            description: siteConfig.description,
            path: "/",
            absoluteTitle: true,
        });

        expect(metadata.title).toEqual({
            absolute: siteConfig.title,
        });

        expect(metadata.openGraph).toMatchObject({
            title: siteConfig.title,
        });

        expect(metadata.twitter).toMatchObject({
            title: siteConfig.title,
        });
    });

    it("does not advertise missing social images", () => {
        const metadata = createPageMetadata({
            title: "Services",
            description,
            path: "/services",
        });

        expect(metadata.openGraph).not.toHaveProperty(
            "images",
        );

        expect(metadata.twitter).not.toHaveProperty(
            "images",
        );
    });
});
