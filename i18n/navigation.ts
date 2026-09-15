import { isLocale, type SiteLocale } from "./config";

/** Prefix a known locale-neutral public route, including its query and hash. */
export function localePath(locale: SiteLocale, path: string): `/${string}` {
    const suffix = path === "/" ? "" : path.replace(/^\/(?=[?#])/, "");
    return `/${locale}${suffix}`;
}

export function switchLocale(path: string, locale: SiteLocale): string {
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
