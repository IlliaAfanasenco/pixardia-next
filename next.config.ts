import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    distDir:
        process.env.PLAYWRIGHT_E2E === "1"
            ? ".next-playwright"
            : ".next",

    /* config options here */
};

export default nextConfig;
