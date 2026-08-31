import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

type PageMetadataOptions = Readonly<{
    title: string;
    description: string;
    path: `/${string}`;
    absoluteTitle?: boolean;
    socialTitle?: string;
    socialDescription?: string;
}>;

function createAbsoluteUrl(path: `/${string}`): string {
    return new URL(path, `${siteConfig.url}/`).toString();
}

export function createPageMetadata({
    title,
    description,
    path,
    absoluteTitle = false,
    socialTitle,
    socialDescription,
}: PageMetadataOptions): Metadata {
    const resolvedSocialTitle =
        socialTitle ??
        (absoluteTitle
            ? title
            : `${title} | ${siteConfig.name}`);

    const resolvedSocialDescription =
        socialDescription ?? description;

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
            title: resolvedSocialTitle,
            description: resolvedSocialDescription,
        },

        twitter: {
            card: "summary",
            title: resolvedSocialTitle,
            description: resolvedSocialDescription,
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
