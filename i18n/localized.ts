import type { SiteLocale } from "./config";

export function localized<T>(value: Record<SiteLocale, T>, locale: SiteLocale): T {
    return value[locale];
}
