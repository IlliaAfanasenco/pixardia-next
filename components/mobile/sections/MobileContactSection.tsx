"use client";

import { useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { siteConfig } from "@/config/site";
import { getServiceBySlug } from "@/content/services";
import { ContactApiError, createLead } from "@/features/contact/contactApi";
import { useI18n } from "@/i18n/LocaleProvider";
import { publicPath } from "@/i18n/navigation";
import { leadSchema, type LeadInput } from "@/lib/validators/lead";
import type { ServiceCode } from "@/types/services";
import styles from "./MobileContactSection.module.css";

type ProjectType = "web" | "apps" | "automation" | "other";
const projectTypes: readonly ProjectType[] = ["web", "apps", "automation", "other"];
const serviceCodes: Record<ProjectType, ServiceCode> = {
    web: "BUSINESS_WEBSITE",
    apps: "WEB_APPLICATION",
    automation: "AI_AUTOMATION",
    other: "BUSINESS_WEBSITE",
};

type FormState = {
    name: string;
    email: string;
    message: string;
    projectType: ProjectType | null;
    serviceCode: ServiceCode | null;
    privacyAccepted: boolean;
    website: string;
};
type FieldErrors = Partial<Record<keyof LeadInput, string>>;
const initialForm: FormState = { name: "", email: "", message: "", projectType: null, serviceCode: null, privacyAccepted: false, website: "" };

function subscribeToService(onChange: () => void) {
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
}
function getServiceSnapshot() {
    return new URLSearchParams(window.location.search).get("service") ?? "";
}
function getServerSnapshot() { return ""; }

function getPrefill(query: string, fallback: ServiceCode) {
    const alias = query === "experiences" ? "other" : projectTypes.find((type) => type === query);
    if (alias) return { projectType: alias, serviceCode: serviceCodes[alias] };
    const serviceCode = getServiceBySlug(query)?.code ?? fallback;
    const projectType: ProjectType = serviceCode === "AI_AUTOMATION" ? "automation"
        : serviceCode === "UI_UX_DESIGN" || serviceCode === "MAINTENANCE_SUPPORT" ? "other" : "web";
    return { projectType, serviceCode };
}

export default function MobileContactSection({ defaultServiceCode = "BUSINESS_WEBSITE" }: { defaultServiceCode?: ServiceCode }) {
    const { locale, dictionary, t } = useI18n();
    const copy = dictionary.mobileContact;
    const text = dictionary.contact;
    const id = useId();
    const serviceQuery = useSyncExternalStore(subscribeToService, getServiceSnapshot, getServerSnapshot);
    const prefill = getPrefill(serviceQuery, defaultServiceCode);
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [requestError, setRequestError] = useState("");
    const submitting = useRef(false);
    const isSubmitting = status === "submitting";
    const selectedType = form.projectType ?? prefill.projectType;
    const selectedServiceCode = form.serviceCode ?? prefill.serviceCode;
    // Keep the exact mobile choice without adding fields to the existing API contract.
    const messagePrefix = `${copy.projectTypeLabel} ${copy.projectTypes[selectedType]}\n\n`;

    function updateForm(patch: Partial<FormState>) {
        setForm((current) => ({ ...current, ...patch }));
        setErrors((current) => {
            const next = { ...current };
            for (const field of Object.keys(patch)) delete next[field as keyof FieldErrors];
            return next;
        });
        setStatus("idle");
        setRequestError("");
    }

    function localizeErrors(issues: { path: PropertyKey[]; message: string }[]): FieldErrors {
        const result: FieldErrors = {};
        for (const issue of issues) {
            const field = issue.path[0] as keyof LeadInput;
            if (!Object.hasOwn(leadSchema.shape, field) || result[field]) continue;
            result[field] = field === "serviceCode" ? t("Please select a project type")
                : Object.hasOwn(dictionary.ui, issue.message) ? t(issue.message) : t("Please check this field");
        }
        return result;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submitting.current) return;
        setStatus("idle");
        setRequestError("");
        const parsed = leadSchema.safeParse({
            name: form.name, email: form.email, message: form.message,
            serviceCode: selectedServiceCode, language: locale,
            privacyAccepted: form.privacyAccepted, website: form.website,
        });
        if (!parsed.success) {
            setErrors(localizeErrors(parsed.error.issues));
            return;
        }
        const payload = leadSchema.safeParse({ ...parsed.data, message: messagePrefix + parsed.data.message });
        if (!payload.success) {
            setErrors(localizeErrors(payload.error.issues));
            return;
        }
        setErrors({});
        submitting.current = true;
        setStatus("submitting");
        try {
            await createLead(payload.data);
            setForm(initialForm);
            setStatus("success");
        } catch (error) {
            if (error instanceof ContactApiError) {
                const issues = Object.entries(error.fields ?? {}).flatMap(([field, messages]) =>
                    messages?.[0] ? [{ path: [field], message: messages[0] }] : []);
                setErrors(localizeErrors(issues));
            }
            setRequestError(error instanceof ContactApiError && error.status === 429 ? text.rateLimit : text.error);
            setStatus("error");
        } finally {
            submitting.current = false;
        }
    }

    return (
        <section id="contact" data-mobile-section="contact" aria-labelledby={`${id}-title`} className={styles.section}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id={`${id}-title`} className={styles.title}>
                <span>{copy.titleLine1}</span>
                <span>{copy.titleLine2}</span>
                <span>{copy.titleLine3}</span>
            </h2>
            <p className={styles.description}>{copy.description}</p>
            <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
                <div className={styles.field}>
                    <label htmlFor={`${id}-name`}>{text.nameLabel}</label>
                    <div className={styles.inputWrap}>
                        <FieldIcon type="user" />
                        <input id={`${id}-name`} name="name" type="text" autoComplete="name" required maxLength={80}
                            placeholder={copy.namePlaceholder} value={form.name} disabled={isSubmitting}
                            onChange={(event) => updateForm({ name: event.target.value })}
                            aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} />
                    </div>
                    {errors.name && <p id={`${id}-name-error`} role="alert" className={styles.error}>{errors.name}</p>}
                </div>
                <div className={styles.field}>
                    <label htmlFor={`${id}-email`}>{text.emailLabel}</label>
                    <div className={styles.inputWrap}>
                        <FieldIcon type="email" />
                        <input id={`${id}-email`} name="email" type="email" autoComplete="email" autoCapitalize="none" required maxLength={254}
                            placeholder={copy.emailPlaceholder} value={form.email} disabled={isSubmitting}
                            onChange={(event) => updateForm({ email: event.target.value })}
                            aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? `${id}-email-error` : undefined} />
                    </div>
                    {errors.email && <p id={`${id}-email-error`} role="alert" className={styles.error}>{errors.email}</p>}
                </div>
                <fieldset role="radiogroup" aria-labelledby={`${id}-project-label`} className={styles.projectTypes} disabled={isSubmitting}
                    aria-invalid={Boolean(errors.serviceCode)} aria-describedby={errors.serviceCode ? `${id}-service-error` : undefined}>
                    <legend id={`${id}-project-label`}>{copy.projectTypeLabel}</legend>
                    <div className={styles.options}>
                        {projectTypes.map((type) => (
                            <label key={type} className={styles.option}>
                                <input type="radio" name="projectType" value={type} required checked={selectedType === type}
                                    onChange={() => updateForm({ projectType: type, serviceCode: serviceCodes[type] })} />
                                <FieldIcon type={type} />
                                <span>{copy.projectTypes[type]}</span>
                            </label>
                        ))}
                    </div>
                    {errors.serviceCode && <p id={`${id}-service-error`} role="alert" className={styles.error}>{errors.serviceCode}</p>}
                </fieldset>
                <div className={styles.field}>
                    <label htmlFor={`${id}-message`}>{copy.messageLabel}</label>
                    <textarea id={`${id}-message`} name="message" required rows={5} maxLength={3000 - messagePrefix.length}
                        placeholder={copy.messagePlaceholder} value={form.message} disabled={isSubmitting}
                        onChange={(event) => updateForm({ message: event.target.value })}
                        aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? `${id}-message-error` : undefined} />
                    {errors.message && <p id={`${id}-message-error`} role="alert" className={styles.error}>{errors.message}</p>}
                </div>
                <p className={styles.privacyNote}><FieldIcon type="shield" /><span>{copy.privacyNote}</span></p>
                <div className={styles.honeypot} aria-hidden="true">
                    <label htmlFor={`${id}-website`}>{t("website")}</label>
                    <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website}
                        onChange={(event) => updateForm({ website: event.target.value })} />
                </div>
                <div>
                    <div className={styles.consent}>
                        <label htmlFor={`${id}-privacy`}>
                            <input id={`${id}-privacy`} name="privacyAccepted" type="checkbox" required checked={form.privacyAccepted} disabled={isSubmitting}
                                onChange={(event) => updateForm({ privacyAccepted: event.target.checked })}
                                aria-invalid={Boolean(errors.privacyAccepted)} aria-describedby={errors.privacyAccepted ? `${id}-privacy-error` : undefined} />
                            <span>{text.privacy}</span>
                        </label>
                        <a href={publicPath(locale, siteConfig.links.privacy)} aria-label={t("Open privacy policy")}>↗</a>
                    </div>
                    {errors.privacyAccepted && <p id={`${id}-privacy-error`} role="alert" className={styles.error}>{errors.privacyAccepted}</p>}
                </div>
                <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className={styles.submit}>
                    <span>{isSubmitting ? copy.submitting : copy.submit}</span>
                    <span aria-hidden="true">→</span>
                </button>
                {status === "success" && <p role="status" className={styles.success}>{text.success}</p>}
                {status === "error" && <p role="alert" className={styles.error}>{requestError}</p>}
            </form>
        </section>
    );
}

function FieldIcon({ type }: { type: ProjectType | "user" | "email" | "shield" }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {type === "user" && <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>}
            {type === "email" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>}
            {type === "web" && <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20M6 6.5h.01M9 6.5h.01" /></>}
            {type === "apps" && <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M10 18h4" /></>}
            {type === "automation" && <><rect x="4" y="7" width="16" height="13" rx="3" /><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6M2 12h2m16 0h2" /></>}
            {type === "other" && <><path d="m12 3 9 9-9 9-9-9 9-9Z" /><path d="M12 8v5m0 3h.01" /></>}
            {type === "shield" && <><path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z" /><path d="m8 12 3 3 5-6" /></>}
        </svg>
    );
}
