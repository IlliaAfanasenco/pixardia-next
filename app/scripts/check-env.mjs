import {
    readFile,
} from "node:fs/promises";

const mode = process.argv[2];

const productionRequired = [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_CONTACT_EMAIL",
    "DATABASE_URL",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "RESEND_API_KEY",
    "LEAD_NOTIFICATION_TO",
    "LEAD_NOTIFICATION_FROM",
];

const exampleRequired = [
    ...productionRequired,
    "NEXT_PUBLIC_TELEGRAM_URL",
    "NEXT_PUBLIC_WHATSAPP_URL",
    "NEXT_PUBLIC_LINKEDIN_URL",
    "NEXT_PUBLIC_GITHUB_URL",
    "DEEPSEEK_API_KEY",
    "DEEPSEEK_MODEL",
];

const publicSecretTokens = [
    "DATABASE",
    "RESEND",
    "UPSTASH",
    "DEEPSEEK",
    "TOKEN",
    "SECRET",
    "PASSWORD",
    "API_KEY",
];

function normalize(value) {
    return typeof value === "string"
        ? value.trim()
        : "";
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(
        value,
    );
}

function extractMailbox(value) {
    const normalized = normalize(value);

    const angleMatch =
        normalized.match(/<([^<>]+)>$/u);

    return normalize(
        angleMatch?.[1] ?? normalized,
    );
}

function requireAbsoluteUrl(
    name,
    value,
    {
        httpsOnly = false,
    } = {},
) {
    try {
        const url = new URL(value);

        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {
            throw new Error();
        }

        if (
            httpsOnly &&
            url.protocol !== "https:"
        ) {
            throw new Error();
        }
    } catch {
        return `${name} must be a valid ${
            httpsOnly ? "HTTPS" : "absolute"
        } URL`;
    }

    return null;
}

function requireDatabaseUrl(value) {
    try {
        const url = new URL(value);

        if (
            url.protocol !== "postgres:" &&
            url.protocol !== "postgresql:"
        ) {
            throw new Error();
        }
    } catch {
        return (
            "DATABASE_URL must be a valid " +
            "postgresql:// or postgres:// URL"
        );
    }

    return null;
}

function validatePublicSecretNames(
    keys,
) {
    const errors = [];

    for (const key of keys) {
        if (!key.startsWith("NEXT_PUBLIC_")) {
            continue;
        }

        if (
            publicSecretTokens.some(
                (token) =>
                    key.includes(token),
            )
        ) {
            errors.push(
                `${key} looks like a server secret but is public`,
            );
        }
    }

    return errors;
}

function parseExample(source) {
    const values = new Map();

    for (const rawLine of source.split(/\r?\n/u)) {
        const line = rawLine.trim();

        if (
            !line ||
            line.startsWith("#") ||
            !line.includes("=")
        ) {
            continue;
        }

        const separator =
            line.indexOf("=");

        const key =
            line.slice(0, separator).trim();

        const value =
            line.slice(separator + 1).trim();

        values.set(
            key,
            value,
        );
    }

    return values;
}

function validateProduction(env) {
    const errors = [];

    for (const key of productionRequired) {
        if (!normalize(env[key])) {
            errors.push(
                `${key} is required for production`,
            );
        }
    }

    const siteUrl =
        normalize(
            env.NEXT_PUBLIC_SITE_URL,
        );

    if (siteUrl) {
        const error =
            requireAbsoluteUrl(
                "NEXT_PUBLIC_SITE_URL",
                siteUrl,
                {
                    httpsOnly: true,
                },
            );

        if (error) {
            errors.push(error);
        }
    }

    const contactEmail =
        normalize(
            env.NEXT_PUBLIC_CONTACT_EMAIL,
        );

    if (
        contactEmail &&
        !isValidEmail(contactEmail)
    ) {
        errors.push(
            "NEXT_PUBLIC_CONTACT_EMAIL must be a valid email address",
        );
    }

    const databaseUrl =
        normalize(
            env.DATABASE_URL,
        );

    if (databaseUrl) {
        const error =
            requireDatabaseUrl(
                databaseUrl,
            );

        if (error) {
            errors.push(error);
        }
    }

    const redisUrl =
        normalize(
            env.UPSTASH_REDIS_REST_URL,
        );

    if (redisUrl) {
        const error =
            requireAbsoluteUrl(
                "UPSTASH_REDIS_REST_URL",
                redisUrl,
                {
                    httpsOnly: true,
                },
            );

        if (error) {
            errors.push(error);
        }
    }

    const recipients = (
        env.LEAD_NOTIFICATION_TO ?? ""
    )
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    if (
        recipients.length > 0 &&
        recipients.some(
            (value) =>
                !isValidEmail(value),
        )
    ) {
        errors.push(
            "LEAD_NOTIFICATION_TO must contain valid comma-separated email addresses",
        );
    }

    const from =
        normalize(
            env.LEAD_NOTIFICATION_FROM,
        );

    if (
        from &&
        !isValidEmail(
            extractMailbox(from),
        )
    ) {
        errors.push(
            "LEAD_NOTIFICATION_FROM must contain a valid sender email address",
        );
    }

    errors.push(
        ...validatePublicSecretNames(
            Object.keys(env),
        ),
    );

    return errors;
}

async function checkExample() {
    const source =
        await readFile(
            ".env.example",
            "utf8",
        );

    const values =
        parseExample(source);

    const errors = [];

    for (const key of exampleRequired) {
        if (!values.has(key)) {
            errors.push(
                `.env.example is missing ${key}`,
            );
        }
    }

    errors.push(
        ...validatePublicSecretNames(
            [...values.keys()],
        ),
    );

    if (errors.length > 0) {
        for (const error of errors) {
            console.error(
                `[env-contract] ${error}`,
            );
        }

        process.exitCode = 1;
        return;
    }

    console.log(
        `[env-contract] .env.example contract PASS (${values.size} keys)`,
    );
}

async function checkProduction() {
    const errors =
        validateProduction(
            process.env,
        );

    if (errors.length > 0) {
        for (const error of errors) {
            console.error(
                `[env-contract] ${error}`,
            );
        }

        process.exitCode = 1;
        return;
    }

    console.log(
        "[env-contract] production environment PASS",
    );
}

if (mode === "--example") {
    await checkExample();
} else if (mode === "--production") {
    await checkProduction();
} else {
    console.error(
        "Usage: node scripts/check-env.mjs --example|--production",
    );

    process.exitCode = 2;
}
