import type { ReactNode } from "react";

import "../globals.css";

import { LocaleProvider } from "@/i18n/LocaleProvider";

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

export default function MobilePreviewLayout({
                                                children,
                                            }: {
    children: ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <head>
            <script dangerouslySetInnerHTML={{ __html: introBootstrap }} />
        </head>
        <body>
        <LocaleProvider locale="en">
            {children}
        </LocaleProvider>
        </body>
        </html>
    );
}
