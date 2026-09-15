import en, { type Dictionary } from "./messages/en";
import de from "./messages/de";
import type { SiteLocale } from "./config";

export type MessageKey = keyof Dictionary["ui"];
export function getDictionary(locale: SiteLocale): Dictionary {
    return locale === "de" ? de : en;
}

/** UI labels may also contain proper names; those pass through unchanged. */
export function translator(locale: SiteLocale) {
    const { ui } = getDictionary(locale);
    return (message: string, values: Record<string, string | number> = {}): string => {
        const copy = Object.hasOwn(ui, message) ? ui[message as MessageKey] : message;
        return copy.replace(/\{(\w+)\}/g, (token, key: string) =>
            Object.hasOwn(values, key) ? String(values[key]) : token,
        );
    };
}
