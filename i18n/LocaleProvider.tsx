"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteLocale } from "./config";
import { getDictionary, translator } from "./getDictionary";

const LocaleContext = createContext<SiteLocale | null>(null);

export function LocaleProvider({ locale, children }: { locale: SiteLocale; children: ReactNode }) {
    return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
    const locale = useContext(LocaleContext);
    if (!locale) throw new Error("LocaleProvider is required for localized UI");
    return { locale, t: translator(locale), dictionary: getDictionary(locale) };
}
