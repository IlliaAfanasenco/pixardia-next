import { notFound } from "next/navigation";
import { defaultLocale, isLocale } from "./config";

export async function routeLocale(params: Promise<{ locale: string }>) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    return locale;
}

/** Optional catch-all `[[...lang]]` of the mobile preview: no segment is the default locale, one valid locale segment selects it. */
export async function mobilePreviewLocale(params: Promise<{ lang?: string[] }>) {
    const { lang } = await params;
    if (!lang || lang.length === 0) return defaultLocale;
    if (lang.length === 1 && isLocale(lang[0])) return lang[0];
    notFound();
}
