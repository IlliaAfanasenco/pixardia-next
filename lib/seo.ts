import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { type SiteLocale } from "@/i18n/config";
import { localePath } from "@/i18n/navigation";

type PageMetadataOptions = Readonly<{
    title: string;
    description: string;
    path: `/${string}`;
    locale: SiteLocale;
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
    locale,
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
            canonical: localePath(locale, path),
            languages: {
                en: localePath("en", path),
                de: localePath("de", path),
                "x-default": localePath("en", path),
            },
        },

        openGraph: {
            type: "website",
            locale: locale === "de" ? "de_DE" : "en_US",
            alternateLocale: [locale === "de" ? "en_US" : "de_DE"],
            url: createAbsoluteUrl(localePath(locale, path)),
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
