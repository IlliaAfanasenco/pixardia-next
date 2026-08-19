import {
    defineConfig,
    devices,
} from "@playwright/test";

export default defineConfig({
    testDir: "./tests/e2e",

    fullyParallel: false,

    forbidOnly:
        process.env.CI === "true",

    retries:
        process.env.CI === "true"
            ? 1
            : 0,

    workers:
        process.env.CI === "true"
            ? 1
            : undefined,

    reporter:
        process.env.CI === "true"
            ? "line"
            : "list",

    timeout: 30_000,

    expect: {
        timeout: 7_000,
    },

    use: {
        baseURL:
            "http://localhost:3100",

        trace:
            "retain-on-failure",

        screenshot:
            "only-on-failure",

        video:
            "retain-on-failure",
    },

    projects: [
        {
            name: "chromium-desktop",

            use: {
                ...devices[
                    "Desktop Chrome"
                ],
            },
        },

        {
            name: "chromium-mobile",

            use: {
                ...devices[
                    "Pixel 7"
                ],
            },
        },
    ],

    webServer: {
        command:
            "pnpm build && pnpm exec next start --hostname localhost --port 3100",

        url:
            "http://localhost:3100",

        reuseExistingServer: false,

        timeout:
            120_000,

        env: {
            ...process.env,

            PLAYWRIGHT_E2E: "1",

            UPSTASH_REDIS_REST_URL: "",
            UPSTASH_REDIS_REST_TOKEN: "",

            DATABASE_URL:
                process.env.DATABASE_URL ??
                "postgresql://postgres:postgres@127.0.0.1:5432/pixardia_e2e",

            NEXT_PUBLIC_SITE_URL:
                "http://localhost:3100",

            NEXT_PUBLIC_CONTACT_EMAIL:
                "e2e@pixardia.invalid",
        },
    },
});
