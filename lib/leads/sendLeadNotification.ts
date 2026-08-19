const RESEND_API_URL =
    "https://api.resend.com/emails";

const REQUEST_TIMEOUT_MS = 8_000;

export type LeadNotificationInput = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    language: string;
    serviceCode: string;
    serviceSlug: string;
    sourcePage: string | null;
    createdAt: Date;
};

export type LeadNotificationResult =
    | {
          status: "sent";
      }
    | {
          status: "skipped";
          reason: "not_configured";
      };

export type LeadNotificationErrorCode =
    | "timeout"
    | "network_error"
    | "provider_error";

export class LeadNotificationError extends Error {
    code: LeadNotificationErrorCode;
    status?: number;

    constructor(
        code: LeadNotificationErrorCode,
        status?: number,
    ) {
        super(code);

        this.name = "LeadNotificationError";
        this.code = code;
        this.status = status;
    }
}

type NotificationConfig = {
    apiKey: string;
    from: string;
    to: string[];
};

function getNotificationConfig():
    | NotificationConfig
    | null {
    const apiKey =
        process.env.RESEND_API_KEY?.trim();

    const from =
        process.env.LEAD_NOTIFICATION_FROM?.trim();

    const to = (
        process.env.LEAD_NOTIFICATION_TO ?? ""
    )
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

    if (
        !apiKey ||
        !from ||
        to.length === 0
    ) {
        return null;
    }

    return {
        apiKey,
        from,
        to,
    };
}

function buildLeadNotificationText(
    input: LeadNotificationInput,
): string {
    return [
        "New Pixardia lead",
        "",
        `Lead ID: ${input.id}`,
        `Created: ${input.createdAt.toISOString()}`,
        `Service: ${input.serviceCode} (${input.serviceSlug})`,
        `Language: ${input.language}`,
        `Source: ${input.sourcePage ?? "unknown"}`,
        "",
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Phone: ${input.phone ?? "not provided"}`,
        "",
        "Message:",
        input.message,
    ].join("\n");
}

export async function sendLeadNotification(
    input: LeadNotificationInput,
    fetchImpl: typeof fetch = fetch,
): Promise<LeadNotificationResult> {
    const config =
        getNotificationConfig();

    if (!config) {
        return {
            status: "skipped",
            reason: "not_configured",
        };
    }

    const controller =
        new AbortController();

    const timeoutId = setTimeout(
        () => {
            controller.abort();
        },
        REQUEST_TIMEOUT_MS,
    );

    try {
        const response = await fetchImpl(
            RESEND_API_URL,
            {
                method: "POST",
                headers: {
                    Authorization:
                        `Bearer ${config.apiKey}`,
                    "Content-Type":
                        "application/json",
                    "Idempotency-Key":
                        `lead-created/${input.id}`,
                },
                body: JSON.stringify({
                    from: config.from,
                    to: config.to,
                    reply_to: input.email,
                    subject:
                        `New Pixardia lead - ${input.serviceCode}`,
                    text:
                        buildLeadNotificationText(
                            input,
                        ),
                }),
                cache: "no-store",
                signal: controller.signal,
            },
        );

        if (!response.ok) {
            throw new LeadNotificationError(
                "provider_error",
                response.status,
            );
        }

        return {
            status: "sent",
        };
    } catch (error) {
        if (
            error instanceof
            LeadNotificationError
        ) {
            throw error;
        }

        if (controller.signal.aborted) {
            throw new LeadNotificationError(
                "timeout",
            );
        }

        throw new LeadNotificationError(
            "network_error",
        );
    } finally {
        clearTimeout(timeoutId);
    }
}
