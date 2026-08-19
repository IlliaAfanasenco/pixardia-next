import {
    spawnSync,
} from "node:child_process";

import {
    describe,
    expect,
    it,
} from "vitest";

function runChecker(
    mode: "--example" | "--production",
    env: NodeJS.ProcessEnv = process.env,
) {
    return spawnSync(
        process.execPath,
        [
            "scripts/check-env.mjs",
            mode,
        ],
        {
            cwd: process.cwd(),
            env,
            encoding: "utf8",
        },
    );
}

function validProductionEnv():
    NodeJS.ProcessEnv {
    return {
        ...process.env,

        NEXT_PUBLIC_SITE_URL:
            "https://pixardia.example",

        NEXT_PUBLIC_CONTACT_EMAIL:
            "hello@pixardia.example",

        DATABASE_URL:
            "postgresql://postgres:postgres@127.0.0.1:5432/pixardia",

        UPSTASH_REDIS_REST_URL:
            "https://example.upstash.io",

        UPSTASH_REDIS_REST_TOKEN:
            "test-token",

        RESEND_API_KEY:
            "re_test_key",

        LEAD_NOTIFICATION_TO:
            "owner@pixardia.example",

        LEAD_NOTIFICATION_FROM:
            "Pixardia Leads <leads@pixardia.example>",
    };
}

describe("environment deployment contract", () => {
    it("keeps .env.example synchronized with the declared contract", () => {
        const result =
            runChecker(
                "--example",
            );

        expect(result.status).toBe(0);

        expect(result.stdout).toContain(
            ".env.example contract PASS",
        );
    });

    it("accepts a complete production environment", () => {
        const result =
            runChecker(
                "--production",
                validProductionEnv(),
            );

        expect(result.status).toBe(0);

        expect(result.stdout).toContain(
            "production environment PASS",
        );
    });

    it("rejects production when lead delivery is not configured", () => {
        const env =
            validProductionEnv();

        env.RESEND_API_KEY = "";

        const result =
            runChecker(
                "--production",
                env,
            );

        expect(result.status).toBe(1);

        expect(result.stderr).toContain(
            "RESEND_API_KEY is required for production",
        );
    });

    it("rejects an insecure production site URL", () => {
        const env =
            validProductionEnv();

        env.NEXT_PUBLIC_SITE_URL =
            "http://pixardia.example";

        const result =
            runChecker(
                "--production",
                env,
            );

        expect(result.status).toBe(1);

        expect(result.stderr).toContain(
            "NEXT_PUBLIC_SITE_URL must be a valid HTTPS URL",
        );
    });

    it("rejects server-secret-looking NEXT_PUBLIC variables", () => {
        const env =
            validProductionEnv();

        env.NEXT_PUBLIC_DATABASE_PASSWORD =
            "should-not-be-public";

        const result =
            runChecker(
                "--production",
                env,
            );

        expect(result.status).toBe(1);

        expect(result.stderr).toContain(
            "looks like a server secret but is public",
        );
    });
});
