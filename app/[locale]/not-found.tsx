"use client";
import { useI18n } from "@/i18n/LocaleProvider";
import { localePath } from "@/i18n/navigation";
import Link from "next/link";

export default function NotFound() {
    const { locale, t } = useI18n();
    return (
        <section
            className="container-custom py-16 sm:py-24"
            aria-labelledby="not-found-title"
        >
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#777777]">{t("Error 404")}</p>

            <h1
                id="not-found-title"
                className="mt-3 text-4xl font-black uppercase tracking-tight text-[#1E1E1E]"
            >{t("Page not found")}</h1>

            <p className="mt-5 max-w-xl">{t("This page is unavailable. Return to Pixardia to explore our capabilities and selected work.")}</p>

            <Link
                href={localePath(locale, "/")}
                className="mt-6 inline-flex font-bold underline underline-offset-4"
            >{t("Return to Pixardia")}</Link>
        </section>
    );
}
