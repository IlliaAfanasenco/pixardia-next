import { defaultLocale, isLocale, type SiteLocale } from "./config";

/** Prefix a known locale-neutral public route, including its query and hash. */
export function localePath(locale: SiteLocale, path: string): `/${string}` {
    const suffix = path === "/" ? "" : path.replace(/^\/(?=[?#])/, "");
    return `/${locale}${suffix}`;
}

/** The dedicated mobile layout lives beside the localized desktop routes: /mobile-preview (default locale) and /mobile-preview/<locale>. */
const MOBILE_PREVIEW_ROOT = "/mobile-preview";

export function mobilePreviewPath(locale: SiteLocale): string {
    return locale === defaultLocale ? MOBILE_PREVIEW_ROOT : `${MOBILE_PREVIEW_ROOT}/${locale}`;
}

/** Splits a mobile-preview URL into its locale and the remaining path/query/hash, or null for any other URL. */
export function parseMobilePreviewPath(path: string): { locale: SiteLocale; rest: string } | null {
    const match = path.match(/^\/mobile-preview(?:\/([^/?#]+))?(?=[/?#]|$)(.*)$/);
    if (!match) return null;
    if (match[1] === undefined) return { locale: defaultLocale, rest: match[2] };
    return isLocale(match[1]) ? { locale: match[1], rest: match[2] } : null;
}

/** Language and interface version are independent: a mobile-preview URL stays on mobile-preview. */
export function switchLocale(path: string, locale: SiteLocale): string {
    const mobile = parseMobilePreviewPath(path);
    if (mobile) return `${mobilePreviewPath(locale)}${mobile.rest}`;
    const match = path.match(/^\/([^/?#]+)(.*)$/);
    if (!match || !isLocale(match[1])) return localePath(locale, "/");
    return localePath(locale, match[2] || "/");
}

export function isLocaleHome(pathname: string): boolean {
    return isLocale(pathname.replace(/^\//, "").replace(/\/$/, ""));
}

export function publicPath(locale: SiteLocale, path: string): string {
    return /^\/(?:$|[?#]|(?:services|projects|contact)(?:[/?#]|$))/.test(path)
        ? localePath(locale, path) : path;
}

export const LOCALE_COOKIE = "pixardia-locale";

/** Remembers the chosen language for the root redirect on the next visit; it never selects a layout. */
export function localeCookie(locale: SiteLocale): string {
    return `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}
