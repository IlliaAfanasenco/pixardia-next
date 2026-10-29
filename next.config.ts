
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["192.168.0.201"],

    distDir:
        process.env.PLAYWRIGHT_E2E === "1"
            ? ".next-playwright"
            : ".next",

    experimental: { globalNotFound: true },

    async redirects() {
        return [
            // Mobile devices -> mobile version
            {
                source: "/",
                has: [
                    {
                        type: "header",
                        key: "user-agent",
                        value: ".*(iPhone|iPod|Android|Mobile).*",
                    },
                ],
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
