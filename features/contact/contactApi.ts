import { type LeadInput } from "@/lib/validators/lead";

type CreateLeadResponse =
    | {
    ok: true;
}
    | {
    ok: false;
    error: string;
    fields?: Record<string, string[] | undefined>;
};

export class ContactApiError extends Error {
    status: number;
    fields?: Record<string, string[] | undefined>;

    constructor(
        message: string,
        status: number,
        fields?: Record<string, string[] | undefined>,
    ) {
        super(message);

        this.name = "ContactApiError";
        this.status = status;
        this.fields = fields;
    }
}

export async function createLead(
    data: LeadInput,
): Promise<void> {
    const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = (await response
        .json()
        .catch(() => null)) as CreateLeadResponse | null;

    if (!response.ok || !result?.ok) {
        throw new ContactApiError(
            result && !result.ok
                ? result.error
                : "request_failed",
            response.status,
            result && !result.ok
                ? result.fields
                : undefined,
        );
    }
}