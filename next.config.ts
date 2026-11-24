
import type { NextConfig } from "next";

const mobileUserAgent = {
    type: "header" as const,
    key: "user-agent",
    value: ".*(iPhone|iPod|Android|Mobile).*",
};

const nextConfig: NextConfig = {
    allowedDevOrigins: ["192.168.0.201", "192.168.0.18"],

    distDir:
        process.env.PLAYWRIGHT_E2E === "1"
            ? ".next-playwright"
            : ".next",

    experimental: { globalNotFound: true },

    async redirects() {
        return [
            // The remembered language (cookie set by the language switcher) and the
            // device type are independent: each root redirect combines them.
            ...(["de"] as const).flatMap((locale) => [
                {
                    source: "/",
                    has: [mobileUserAgent, { type: "cookie" as const, key: "pixardia-locale", value: locale }],
                    destination: `/mobile-preview/${locale}`,
                    permanent: false,
                },
                {
                    source: "/",
                    has: [{ type: "cookie" as const, key: "pixardia-locale", value: locale }],
                    destination: `/${locale}`,
                    permanent: false,
                },
            ]),

            // Mobile devices -> mobile version
            {
                source: "/",
                has: [mobileUserAgent],
                destination: "/mobile-preview",
                permanent: false,
            },

            // Desktop and tablets -> desktop version
            {
                source: "/",
                destination: "/en",
                permanent: false,
            },

            // Preserve existing redirects
            ...["services", "projects", "contact"].map(
                (route) => ({
                    source: `/${route}/:path*`,
                    destination: `/en/${route}/:path*`,
                    permanent: true,
                })
            ),
        ];
    },
};

export default nextConfig;
