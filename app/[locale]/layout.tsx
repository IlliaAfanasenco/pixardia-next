import { siteLocales } from "@/i18n/config";
import { routeLocale } from "@/i18n/server";
import { getDictionary, translator } from "@/i18n/getDictionary";
import { LocaleProvider } from "@/i18n/LocaleProvider";
export function generateStaticParams() { return siteLocales.map(locale => ({ locale })); }
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "../globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { siteConfig } from "@/config/site";

export async function generateMetadata({ params }: RootLayoutProps): Promise<Metadata> {
    const locale = await routeLocale(params);
    return {
    metadataBase: new URL(siteConfig.url),

    title: {
        default: getDictionary(locale).seo.title,
        template: `%s | ${siteConfig.name}`,
    },

    description: getDictionary(locale).seo.description,
    keywords: [...siteConfig.keywords],

    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,

    category: "technology",
    };
}

type RootLayoutProps = Readonly<{
    children: ReactNode;
    projectModal: ReactNode;
    params: Promise<{ locale: string }>;
}>;

export default async function RootLayout({
                                       params,
                                       children,
                                       projectModal,
                                   }: RootLayoutProps) {
    const locale = await routeLocale(params);
    const t = translator(locale);
    return (
        <html lang={locale}>
        <body>
        <LocaleProvider locale={locale}>
        <div
            id="top"
            className="flex min-h-screen flex-col"
            data-site-shell=""
        >
            <a
                className="skip-link"
                href="#main-content"
            >
                {t("Skip to main content")}
            </a>

            <Header />

            <main
                id="main-content"
                className="flex-1"
                tabIndex={-1}
            >
                {children}
            </main>

            <Footer locale={locale} />
        </div>

        {projectModal ?? null}
        </LocaleProvider>
        </body>
        </html>
    );
}
