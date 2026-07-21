"use client";

import Image from "next/image";
import {
    type ChangeEvent,
    type FormEvent,
    useState,
} from "react";

import { siteConfig } from "@/config/site";
import { services } from "@/content/services";
import {
    ContactApiError,
    createLead,
} from "@/features/contact/contactApi";
import { leadSchema } from "@/lib/validators/lead";
import { type ServiceCode } from "@/types/services";

type ContactSectionProps = {
    language?: "en" | "de";
    defaultServiceCode?: ServiceCode;
};

type FormState = {
    name: string;
    email: string;
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

const inputFieldClass =
    "w-full border-0 bg-transparent p-0 text-xs font-bold leading-none text-black outline-none placeholder:text-[#CFCFD3]";

const fieldWrapperClass =
    "flex flex-col gap-3.5 border-b-2 border-black pb-2";

const copy = {
    en: {
        intro:
            "Your project deserves a clear strategy and reliable implementation. Tell us what you are planning, and we will review the next steps.",
        location: "Location: Remote / Europe",
        responseTime: "Response Time: Usually within 24 hours",
        availability: "Availability: Open for new projects",
        connect: "Connect via channels",
        nameLabel: "Client name",
        namePlaceholder: "Your name",
        emailLabel: "Contact email",
        emailPlaceholder: "example@mail.com",
        serviceLabel: "Project type",
        messageLabel: "Additional briefing",
        messagePlaceholder:
            "Describe your goals, required functionality and current project stage...",
        privacy: "I agree to the privacy policy",
        submit: "Initialize dialogue",
        submitting: "Sending request...",
        success: "Your request has been sent successfully.",
        error: "The request could not be sent. Please try again.",
        rateLimit:
            "Too many requests. Please wait a moment and try again.",
    },
    de: {
        intro:
            "Ihr Projekt verdient eine klare Strategie und eine zuverlässige Umsetzung. Beschreiben Sie Ihr Vorhaben, damit wir die nächsten Schritte prüfen können.",
        location: "Standort: Remote / Europa",
        responseTime:
            "Antwortzeit: In der Regel innerhalb von 24 Stunden",
        availability: "Verfügbarkeit: Neue Projekte möglich",
        connect: "Kontaktkanäle",
        nameLabel: "Name",
        namePlaceholder: "Ihr Name",
        emailLabel: "E-Mail",
        emailPlaceholder: "beispiel@mail.de",
        serviceLabel: "Projekttyp",
        messageLabel: "Projektbeschreibung",
        messagePlaceholder:
            "Beschreiben Sie Ihre Ziele, benötigte Funktionen und den aktuellen Projektstand...",
        privacy: "Ich stimme der Datenschutzerklärung zu",
        submit: "Anfrage senden",
        submitting: "Anfrage wird gesendet...",
        success: "Ihre Anfrage wurde erfolgreich gesendet.",
        error:
            "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        rateLimit:
            "Zu viele Anfragen. Bitte warten Sie kurz und versuchen Sie es erneut.",
    },
} as const;

function getInitialState(
    defaultServiceCode: ServiceCode,
): FormState {
    return {
        name: "",
        email: "",
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
    const formFields = getInitialState(
        fallbackServiceCode,
    );

    for (const issue of issues) {
        const field = issue.path[0];

        if (
            typeof field === "string" &&
            field in formFields &&
            !errors[field as keyof FormState]
        ) {
            errors[field as keyof FormState] =
                issue.message;
        }
    }

    return errors;
}

function getServerErrors(
    fields:
        | Record<string, string[] | undefined>
        | undefined,
): FieldErrors {
    if (!fields) {
        return {};
    }

    const errors: FieldErrors = {};
    const formFields = getInitialState(
        fallbackServiceCode,
    );

    for (const [field, messages] of Object.entries(
        fields,
    )) {
        if (
            field in formFields &&
            messages?.[0]
        ) {
            errors[field as keyof FormState] =
                messages[0];
        }
    }

    return errors;
}

export default function ContactSection({
                                           language = "en",
                                           defaultServiceCode = fallbackServiceCode,
                                       }: ContactSectionProps) {
    const text = copy[language];

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

    const contactLinks = [
        ...(siteConfig.contact.email
            ? [
                {
                    label: "Email",
                    href: `mailto:${siteConfig.contact.email}`,
                },
            ]
            : []),
        ...siteConfig.socialLinks,
    ];

    function updateTextField(
        event: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ): void {
        const field =
            event.target.name as keyof FormState;

        setForm((current) => ({
            ...current,
            [field]: event.target.value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));

        if (status !== "idle") {
            setStatus("idle");
            setRequestError("");
        }
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        setStatus("idle");
        setRequestError("");

        const parsed = leadSchema.safeParse({
            name: form.name,
            email: form.email,
            message: form.message,
            serviceCode: form.serviceCode,
            language,
            privacyAccepted: form.privacyAccepted,
            website: form.website,
        });

        if (!parsed.success) {
            setErrors(
                getValidationErrors(
                    parsed.error.issues,
                ),
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
            if (error instanceof ContactApiError) {
                setErrors(
                    getServerErrors(error.fields),
                );

                setRequestError(
                    error.status === 429
                        ? text.rateLimit
                        : text.error,
                );
            } else {
                setRequestError(text.error);
            }

            setStatus("error");
        }
    }

    return (
        <section
            className="w-full py-16 md:py-24"
            aria-labelledby="contact-title"
        >
            <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">
                <div className="flex justify-center gap-3 xl:justify-start">
                    <div
                        className="h-2 w-2 bg-[#5149DA]"
                        aria-hidden="true"
                    />

                    <p className="text-xs font-bold uppercase leading-none text-[#C5C6C8]">
                        DEPLOYMENTPROTOCOL05
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-center gap-6 text-center xl:flex-row xl:items-start xl:justify-between xl:text-left">
                    <h2
                        id="contact-title"
                        className="max-w-[720px] text-[clamp(40px,7vw,94px)] font-black uppercase leading-[0.86] tracking-[-0.03em] text-[#202021]"
                    >
                        Ready for Archive
                    </h2>

                    <Image
                        src="/images/stampCon.svg"
                        alt=""
                        aria-hidden="true"
                        width={160}
                        height={160}
                        className="hidden h-auto w-[clamp(90px,12vw,160px)] object-contain xl:block"
                    />
                </div>

                <div className="mt-[34px] h-0.5 w-full bg-[#353638]" />

                <div className="grid grid-cols-1 justify-items-center gap-10 text-center xl:grid-cols-[minmax(280px,1fr)_minmax(420px,620px)] xl:items-center xl:justify-items-stretch xl:gap-[clamp(32px,6vw,80px)] xl:text-left">
                    <div className="flex w-full max-w-[620px] flex-col items-center xl:max-w-none xl:items-start">
                        <p className="mt-6 max-w-[440px] text-sm font-bold leading-[1.3] text-[#C5C6C8]">
                            {text.intro}
                        </p>

                        <div className="mt-[18px] flex flex-col gap-3">
                            <p className="text-xs font-bold leading-none text-[#C5C6C8]">
                                {text.location}
                            </p>

                            <p className="text-xs font-bold leading-none text-[#C5C6C8]">
                                {text.responseTime}
                            </p>

                            <p className="text-xs font-bold leading-none text-[#C5C6C8]">
                                {text.availability}
                            </p>
                        </div>

                        <p className="mt-[30px] text-sm font-bold uppercase leading-none text-[#C7C8CA]">
                            {text.connect}
                        </p>

                        <div className="mt-[21px] flex flex-wrap justify-center gap-3 sm:gap-5 xl:justify-start">
                            {contactLinks.map((item) => {
                                const isExternal =
                                    item.href.startsWith(
                                        "http",
                                    );

                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target={
                                            isExternal
                                                ? "_blank"
                                                : undefined
                                        }
                                        rel={
                                            isExternal
                                                ? "noreferrer"
                                                : undefined
                                        }
                                        className="border border-[#1E1E1E] px-4 py-[15px] text-xs font-bold leading-none transition hover:bg-[#1E1E1E] hover:text-white"
                                    >
                                        {item.label}
                                    </a>
                                );
                            })}
                        </div>

                        <div className="mt-[34px] flex items-center justify-center gap-[15px] xl:justify-start">
                            <Image
                                src="/images/pixardiaLogoCon.svg"
                                alt="Pixardia Studio"
                                width={48}
                                height={48}
                                className="h-auto w-auto"
                            />

                            <div>
                                <p className="text-sm font-bold uppercase leading-none text-[#6A6A6B]">
                                    Pixardia Studio
                                </p>

                                <p className="mt-1 text-xs font-bold leading-none text-[#D4D5D7]">
                                    build_with_passion.exe
                                </p>
                            </div>
                        </div>

                        <Image
                            src="/images/astronautAlienContacts.png"
                            alt=""
                            aria-hidden="true"
                            width={247}
                            height={247}
                            className="mt-2.5 h-auto w-full max-w-[247px] object-contain"
                        />

                        <p className="mt-2.5 text-xs font-bold leading-none text-[#D7D8DA] min-[361px]:text-sm">
                            {new Date().getFullYear()} Pixardia {"//"} All rights reserved
                        </p>
                    </div>

                    <div className="relative w-full max-w-[620px] xl:max-w-none">
                        <Image
                            src="/images/astronautCon.png"
                            alt=""
                            aria-hidden="true"
                            width={161}
                            height={161}
                            className="pointer-events-none absolute hidden h-auto object-contain xl:left-[calc(0%-19.5%)] xl:top-[28%] xl:block xl:w-[26%] xl:max-w-[161px]"
                        />

                        <form
                            className="mt-6 w-full border-[3px] border-black px-5 py-6 shadow-[7px_7px_0_-2px_#000] min-[361px]:shadow-[11px_11px_0_-3px_#000] md:px-[clamp(20px,5vw,58px)] md:py-[clamp(24px,4vw,39px)]"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div className="mb-[38px] flex flex-col gap-[38px] sm:mb-[54px] sm:flex-row sm:gap-[23px]">
                                <div
                                    className={`${fieldWrapperClass} sm:w-1/2`}
                                >
                                    <label
                                        className="text-sm font-bold uppercase leading-none text-[#C1C1C1]"
                                        htmlFor="client-name"
                                    >
                                        {text.nameLabel}
                                    </label>

                                    <input
                                        className={inputFieldClass}
                                        id="client-name"
                                        name="name"
                                        type="text"
                                        placeholder={
                                            text.namePlaceholder
                                        }
                                        autoComplete="name"
                                        value={form.name}
                                        onChange={
                                            updateTextField
                                        }
                                        aria-invalid={
                                            Boolean(
                                                errors.name,
                                            )
                                        }
                                        aria-describedby={
                                            errors.name
                                                ? "client-name-error"
                                                : undefined
                                        }
                                    />

                                    {errors.name && (
                                        <p
                                            id="client-name-error"
                                            role="alert"
                                            className="text-xs font-bold text-red-600"
                                        >
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div
                                    className={`${fieldWrapperClass} sm:w-1/2`}
                                >
                                    <label
                                        className="text-sm font-bold uppercase leading-none text-[#C1C1C1]"
                                        htmlFor="contact-email"
                                    >
                                        {text.emailLabel}
                                    </label>

                                    <input
                                        className={inputFieldClass}
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        placeholder={
                                            text.emailPlaceholder
                                        }
                                        autoComplete="email"
                                        value={form.email}
                                        onChange={
                                            updateTextField
                                        }
                                        aria-invalid={
                                            Boolean(
                                                errors.email,
                                            )
                                        }
                                        aria-describedby={
                                            errors.email
                                                ? "contact-email-error"
                                                : undefined
                                        }
                                    />

                                    {errors.email && (
                                        <p
                                            id="contact-email-error"
                                            role="alert"
                                            className="text-xs font-bold text-red-600"
                                        >
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div
                                className={`${fieldWrapperClass} mb-[38px]`}
                            >
                                <label
                                    className="text-sm font-bold uppercase leading-none text-[#C1C1C1]"
                                    htmlFor="project-service"
                                >
                                    {text.serviceLabel}
                                </label>

                                <select
                                    className={inputFieldClass}
                                    id="project-service"
                                    name="serviceCode"
                                    value={
                                        form.serviceCode
                                    }
                                    onChange={(event) => {
                                        setForm(
                                            (current) => ({
                                                ...current,
                                                serviceCode:
                                                    event
                                                        .target
                                                        .value as ServiceCode,
                                            }),
                                        );

                                        setErrors(
                                            (current) => ({
                                                ...current,
                                                serviceCode:
                                                undefined,
                                            }),
                                        );
                                    }}
                                >
                                    {services.map(
                                        (service) => (
                                            <option
                                                key={
                                                    service.code
                                                }
                                                value={
                                                    service.code
                                                }
                                            >
                                                {
                                                    service
                                                        .title[
                                                        language
                                                        ]
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>

                                {errors.serviceCode && (
                                    <p
                                        role="alert"
                                        className="text-xs font-bold text-red-600"
                                    >
                                        {
                                            errors.serviceCode
                                        }
                                    </p>
                                )}
                            </div>

                            <div
                                className={`${fieldWrapperClass} mb-[38px]`}
                            >
                                <label
                                    className="text-sm font-bold uppercase leading-none text-[#C1C1C1]"
                                    htmlFor="additional-briefing"
                                >
                                    {text.messageLabel}
                                </label>

                                <textarea
                                    className={`${inputFieldClass} min-h-[60px] resize-y leading-[1.2]`}
                                    id="additional-briefing"
                                    name="message"
                                    placeholder={
                                        text.messagePlaceholder
                                    }
                                    value={form.message}
                                    onChange={
                                        updateTextField
                                    }
                                    aria-invalid={
                                        Boolean(
                                            errors.message,
                                        )
                                    }
                                    aria-describedby={
                                        errors.message
                                            ? "additional-briefing-error"
                                            : undefined
                                    }
                                />

                                {errors.message && (
                                    <p
                                        id="additional-briefing-error"
                                        role="alert"
                                        className="text-xs font-bold text-red-600"
                                    >
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <div
                                className="hidden"
                                aria-hidden="true"
                            >
                                <label htmlFor="contact-website">
                                    website
                                </label>

                                <input
                                    id="contact-website"
                                    name="website"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={form.website}
                                    onChange={
                                        updateTextField
                                    }
                                />
                            </div>

                            <div className="mb-6">
                                <label className="flex cursor-pointer items-start gap-3 text-left text-xs font-bold leading-5 text-[#777779]">
                                    <input
                                        type="checkbox"
                                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#5149DA]"
                                        checked={
                                            form.privacyAccepted
                                        }
                                        onChange={(
                                            event,
                                        ) => {
                                            setForm(
                                                (current) => ({
                                                    ...current,
                                                    privacyAccepted:
                                                    event
                                                        .target
                                                        .checked,
                                                }),
                                            );

                                            setErrors(
                                                (current) => ({
                                                    ...current,
                                                    privacyAccepted:
                                                    undefined,
                                                }),
                                            );
                                        }}
                                    />

                                    <span>
                                        {text.privacy}{" "}
                                        <a
                                            href={
                                                siteConfig
                                                    .links
                                                    .privacy
                                            }
                                            className="underline transition hover:text-black"
                                        >
                                            ↗
                                        </a>
                                    </span>
                                </label>

                                {errors.privacyAccepted && (
                                    <p
                                        role="alert"
                                        className="mt-2 text-left text-xs font-bold text-red-600"
                                    >
                                        {
                                            errors.privacyAccepted
                                        }
                                    </p>
                                )}
                            </div>

                            <button
                                className="min-h-16 w-full bg-[#1F1F1F] text-base font-bold uppercase text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                                type="submit"
                                disabled={
                                    status ===
                                    "submitting"
                                }
                                aria-busy={
                                    status ===
                                    "submitting"
                                }
                            >
                                {status === "submitting"
                                    ? text.submitting
                                    : text.submit}
                            </button>

                            <div
                                className="mt-4 min-h-5 text-center text-xs font-bold"
                                aria-live="polite"
                            >
                                {status === "success" && (
                                    <p
                                        role="status"
                                        className="text-green-700"
                                    >
                                        {text.success}
                                    </p>
                                )}

                                {status === "error" && (
                                    <p
                                        role="alert"
                                        className="text-red-600"
                                    >
                                        {requestError}
                                    </p>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}