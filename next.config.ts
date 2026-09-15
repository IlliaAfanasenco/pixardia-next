import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    distDir:
        process.env.PLAYWRIGHT_E2E === "1"
            ? ".next-playwright"
            : ".next",

    experimental: { globalNotFound: true },
    async redirects() {
        return [
            { source: "/", destination: "/en", permanent: true },
            ...["services", "projects", "contact"].map((route) => ({
                source: `/${route}/:path*`,
                destination: `/en/${route}/:path*`,
                permanent: true,
            })),
        ];
    },
};

export default nextConfig;
