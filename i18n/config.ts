export const siteLocales = ["en", "de"] as const;
export type SiteLocale = (typeof siteLocales)[number];
export const defaultLocale: SiteLocale = "en";

export function isLocale(value: string): value is SiteLocale {
    return siteLocales.some((locale) => locale === value);
}
