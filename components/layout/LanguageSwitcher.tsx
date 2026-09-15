"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/LocaleProvider";
import { siteLocales } from "@/i18n/config";
import { switchLocale } from "@/i18n/navigation";

export default function LanguageSwitcher() {
    const pathname = usePathname();
    const { locale, t } = useI18n();

    return (
        <nav aria-label={t("Language")} className="flex shrink-0 items-center gap-1 text-[11px] font-bold sm:text-xs">
            {siteLocales.map((language) => (
                <a
                    key={language}
                    href={switchLocale(pathname, language)}
                    hrefLang={language}
                    lang={language}
                    aria-current={language === locale ? "page" : undefined}
                    aria-label={t(language === "en" ? "Switch language to English" : "Switch language to German")}
                    className={`px-1 py-2 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${language === locale ? "text-[#1E1E1E] underline underline-offset-4" : "text-[#777777] hover:text-black"}`}
                    onClick={(event) => {
                        // A document navigation updates the root language and avoids carrying
                        // an intercepted modal's background across locale boundaries.
                        event.currentTarget.href = switchLocale(
                            window.location.pathname + window.location.search + window.location.hash,
                            language,
                        );
                    }}
                >
                    {language.toUpperCase()}
                </a>
            ))}
        </nav>
    );
}
