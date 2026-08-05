import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type PageMetadataOptions = Readonly<{
    title: string;
    description: string;
    path: `/${string}`;
    absoluteTitle?: boolean;
}>;

function createAbsoluteUrl(path: `/${string}`): string {
    return new URL(path, `${siteConfig.url}/`).toString();
}

export function createPageMetadata({
    title,
    description,
    path,
    absoluteTitle = false,
}: PageMetadataOptions): Metadata {
    const socialTitle = absoluteTitle
        ? title
        : `${title} | ${siteConfig.name}`;

    return {
        title: absoluteTitle
            ? {
                  absolute: title,
              }
            : title,

        description,

        alternates: {
            canonical: path,
        },

        openGraph: {
            type: "website",
            locale: "en_US",
            url: createAbsoluteUrl(path),
            siteName: siteConfig.name,
            title: socialTitle,
            description,
        },

        twitter: {
            card: "summary",
            title: socialTitle,
            description,
        },

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
                "max-snippet": -1,
                "max-video-preview": -1,
            },
        },
    };
}
