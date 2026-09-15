import { describe, expect, it } from "vitest";
import { isLocale, siteLocales } from "@/i18n/config";
import { getDictionary, translator } from "@/i18n/getDictionary";
import { localized } from "@/i18n/localized";
import { isLocaleHome, localePath, publicPath, switchLocale } from "@/i18n/navigation";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";
import sitemap from "@/app/sitemap";

function paths(value: object, prefix = ""): string[] {
    return Object.entries(value).flatMap(([key, item]) =>
        typeof item === "object" ? paths(item, `${prefix}${key}.`) : [`${prefix}${key}`],
    ).sort();
}

describe("locale contracts", () => {
    it("validates only the canonical supported locales", () => {
        expect(siteLocales).toEqual(["en", "de"]);
        for (const value of ["fr", "DE", "", "en-US", "constructor", "__proto__"]) expect(isLocale(value)).toBe(false);
        for (const value of siteLocales) expect(isLocale(value)).toBe(true);
    });

    it("keeps dictionaries in exact structural parity with nonempty German text", () => {
        expect(paths(getDictionary("de"))).toEqual(paths(getDictionary("en")));
        for (const copy of Object.values(getDictionary("de").ui)) expect(copy.trim()).not.toBe("");
        expect(getDictionary("de").contact.intro).not.toBe(getDictionary("en").contact.intro);
        expect(translator("de")("Open {title} case study", { title: "Nexus Finance" })).toBe("Projekt Nexus Finance ansehen");
    });

    it.each(["/", "/services", "/services/business-website", "/projects", "/projects/nexus-finance", "/contact"])("preserves the equivalent route for %s", (path) => {
        expect(switchLocale(localePath("en", path), "de")).toBe(localePath("de", path));
        expect(switchLocale(`${localePath("de", path)}?source=test#hero`, "en")).toBe(`${localePath("en", path)}?source=test#hero`);
    });

    it("recognizes locale homepages and leaves external and API links outside locale routing", () => {
        expect(isLocaleHome("/en")).toBe(true);
        expect(isLocaleHome("/de/")).toBe(true);
        for (const path of ["/", "/fr", "/en/projects"]) expect(isLocaleHome(path)).toBe(false);
        for (const path of ["/api/leads", "/api/terminal", "/icons/star.svg", "mailto:hello@example.com", "https://example.com"]) expect(publicPath("de", path)).toBe(path);
        expect(publicPath("de", "/#projects")).toBe("/de#projects");
    });

    it("uses existing domain content with stable slugs", () => {
        for (const locale of siteLocales) {
            for (const service of services) expect(localized(service.title, locale)).toBe(service.title[locale]);
            for (const project of projects) expect(localized(project.summary, locale)).toBe(project.summary[locale]);
        }
    });

    it.each(siteLocales)("produces canonical, hreflang and OG metadata for %s", (locale) => {
        const meta = createPageMetadata({ locale, path: "/services/business-website", title: "Example", description: "Example description" });
        expect(meta.alternates).toEqual({ canonical: `/${locale}/services/business-website`, languages: {
            en: "/en/services/business-website", de: "/de/services/business-website", "x-default": "/en/services/business-website",
        } });
        expect(meta.openGraph).toMatchObject({ locale: locale === "de" ? "de_DE" : "en_US", alternateLocale: [locale === "de" ? "en_US" : "de_DE"] });
    });

    it("lists every localized public route exactly once with alternates", () => {
        const entries = sitemap();
        const publicRoutes = ["", "/services", "/projects", "/contact", ...services.map(s => `/services/${s.slug}`), ...projects.map(p => `/projects/${p.slug}`)];
        expect(entries.map(e => e.url).sort()).toEqual(siteLocales.flatMap(locale => publicRoutes.map(path => `${siteConfig.url}/${locale}${path}`)).sort());
        expect(new Set(entries.map(e => e.url)).size).toBe(entries.length);
        for (const entry of entries) expect(Object.keys(entry.alternates!.languages!)).toEqual(["en", "de"]);
    });
});
