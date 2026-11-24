import type { ReactNode } from "react";

import "@/app/globals.css";

import { siteLocales } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { mobilePreviewLocale } from "@/i18n/server";

// Run during HTML parsing so a slow hydration cannot show the finished scene
// before the intro. With blocked/disabled JS the Hero remains ordinary HTML.
const introBootstrap = `(() => {
    const root = document.documentElement;
    let played = false;
    try { played = sessionStorage.getItem('pixardia:mobile-intro:complete') === '1'; } catch {}
    if (played || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.dataset.mobileIntroBoot = 'pending';
    root.dataset.mobileIntroTimer = String(setTimeout(() => {
        root.dataset.mobileIntroBoot = 'expired';
        delete root.dataset.mobileIntroTimer;
    }, 5000));
})();`;

// `/mobile-preview` is the default locale; `/mobile-preview/<locale>` selects another one.
// Only the text language changes: every locale renders the same mobile components.
export function generateStaticParams() {
    return [{ lang: [] }, ...siteLocales.filter((locale) => locale !== "en").map((locale) => ({ lang: [locale] }))];
}

export default async function MobilePreviewLayout({
                                                children,
                                                params,
                                            }: {
    children: ReactNode;
    params: Promise<{ lang?: string[] }>;
}) {
    const locale = await mobilePreviewLocale(params);
    return (
        <html lang={locale} suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{ __html: introBootstrap }} />
        </head>
        <body>
        <LocaleProvider locale={locale}>
            {children}
        </LocaleProvider>
        </body>
        </html>
    );
}
