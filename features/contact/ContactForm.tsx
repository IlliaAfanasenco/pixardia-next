"use client";

import {
    type ChangeEvent,
    type FormEvent,
    useState,
} from "react";

import { services } from "@/content/services";
import {
    ContactApiError,
    createLead,
} from "@/features/contact/contactApi";
import { leadSchema } from "@/lib/validators/lead";
import {
    type ServiceCode,
} from "@/types/services";

type ContactFormProps = {
    language?: "en" | "de";
    defaultServiceCode?: ServiceCode;
};

type FormState = {
    name: string;
    email: string;
    phone: string;
    message: string;
    serviceCode: ServiceCode;
    privacyAccepted: boolean;
    website: string;
};

type FieldErrors = Partial<
    Record<keyof FormState, string>
>;

const fallbackServiceCode: ServiceCode =
    "BUSINESS_WEBSITE";

function getInitialState(
    defaultServiceCode: ServiceCode,
): FormState {
    return {
        name: "",
        email: "",
        phone: "",
        message: "",
        serviceCode: defaultServiceCode,
        privacyAccepted: false,
        website: "",
    };
}

function getValidationErrors(
    issues: {
        path: PropertyKey[];
        message: string;
    }[],
): FieldErrors {
    const errors: FieldErrors = {};

    for (const issue of issues) {
        const field = issue.path[0];

        if (
            typeof field === "string" &&
            field in getInitialState(fallbackServiceCode) &&
            !errors[field as keyof FormState]
        ) {
            errors[field as keyof FormState] =
                issue.message;
        }
    }

    return errors;
}

export default function ContactForm({
                                        language = "en",
                                        defaultServiceCode = fallbackServiceCode,
                                    }: ContactFormProps) {
    const [form, setForm] = useState<FormState>(() =>
        getInitialState(defaultServiceCode),
    );

    const [errors, setErrors] =
        useState<FieldErrors>({});

    const [status, setStatus] = useState<
        "idle" | "submitting" | "success" | "error"
    >("idle");

    const [requestError, setRequestError] =
        useState("");

    function updateTextField(
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ): void {
        const field = event.target.name as keyof FormState;
        const value = event.target.value;

        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        setRequestError("");
        setStatus("idle");

        const parsed = leadSchema.safeParse({
            ...form,
            language,
        });

        if (!parsed.success) {
            setErrors(
                getValidationErrors(parsed.error.issues),
            );

            return;
        }

        setErrors({});
        setStatus("submitting");

        try {
            await createLead(parsed.data);

            setForm(
                getInitialState(defaultServiceCode),
            );

            setStatus("success");
        } catch (error) {
            if (
                error instanceof ContactApiError &&
                error.status === 429
            ) {
                setRequestError(
                    "Too many requests. Please try again later.",
                );
            } else {
                setRequestError(
                    "The request could not be sent. Please try again.",
                );
            }

            setStatus("error");
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div>
                <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="name"
                    value={form.name}
                    onChange={updateTextField}
                />

                {errors.name && (
                    <p role="alert">{errors.name}</p>
                )}
            </div>

            <div>
                <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="email"
                    value={form.email}
                    onChange={updateTextField}
                />

                {errors.email && (
                    <p role="alert">{errors.email}</p>
                )}
            </div>

            <div>
                <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="phone"
                    value={form.phone}
                    onChange={updateTextField}
                />

                {errors.phone && (
                    <p role="alert">{errors.phone}</p>
                )}
            </div>

            <div>
                <select
                    name="serviceCode"
                    value={form.serviceCode}
                    onChange={(event) => {
                        setForm((current) => ({
                            ...current,
                            serviceCode: event.target
                                .value as ServiceCode,
                        }));

                        setErrors((current) => ({
                            ...current,
                            serviceCode: undefined,
                        }));
                    }}
                >
                    {services.map((service) => (
                        <option
                            key={service.code}
                            value={service.code}
                        >
                            {service.title[language]}
                        </option>
                    ))}
                </select>

                {errors.serviceCode && (
                    <p role="alert">
                        {errors.serviceCode}
                    </p>
                )}
            </div>

            <div>
                <textarea
                    name="message"
                    placeholder="message"
                    value={form.message}
                    onChange={updateTextField}
                />

                {errors.message && (
                    <p role="alert">{errors.message}</p>
                )}
            </div>

            <div
                aria-hidden="true"
                className="hidden"
            >
                <label htmlFor="website">
                    website
                </label>

                <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={updateTextField}
                />
            </div>

            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={form.privacyAccepted}
                        onChange={(event) => {
                            setForm((current) => ({
                                ...current,
                                privacyAccepted:
                                event.target.checked,
                            }));

                            setErrors((current) => ({
                                ...current,
                                privacyAccepted: undefined,
                            }));
                        }}
                    />

                    I agree to the privacy policy
                </label>

                {errors.privacyAccepted && (
                    <p role="alert">
                        {errors.privacyAccepted}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={status === "submitting"}
            >
                {status === "submitting"
                    ? "sending..."
                    : "send request"}
            </button>

            {status === "success" && (
                <p role="status">
                    Your request has been sent.
                </p>
            )}

            {status === "error" && (
                <p role="alert">{requestError}</p>
            )}
        </form>
    );
}