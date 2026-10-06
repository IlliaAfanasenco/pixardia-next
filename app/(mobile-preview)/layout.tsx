import type { ReactNode } from "react";

import "../globals.css";

import { LocaleProvider } from "@/i18n/LocaleProvider";

export default function MobilePreviewLayout({
                                                children,
                                            }: {
    children: ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <LocaleProvider locale="en">
            {children}
        </LocaleProvider>
        </body>
        </html>
    );
}
