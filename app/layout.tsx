import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),

    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.name}`,
    },

    description: siteConfig.description,
    keywords: [...siteConfig.keywords],

    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.creator,

    category: "technology",
};

type RootLayoutProps = Readonly<{
    children: ReactNode;
    projectModal: ReactNode;
}>;

export default function RootLayout({
                                       children,
                                       projectModal,
                                   }: RootLayoutProps) {
    return (
        <html lang="en">
        <body>
        <div
            id="top"
            className="flex min-h-screen flex-col"
            data-site-shell=""
        >
            <a
                className="skip-link"
                href="#main-content"
            >
                Skip to main content
            </a>

            <Header />

            <main
                id="main-content"
                className="flex-1"
                tabIndex={-1}
            >
                {children}
            </main>

            <Footer />
        </div>

        {projectModal ?? null}
        </body>
        </html>
    );
}
