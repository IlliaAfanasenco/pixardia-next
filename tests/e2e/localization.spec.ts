import { expect, test } from "@playwright/test";
import { siteLocales } from "../../i18n/config";
import { getDictionary } from "../../i18n/getDictionary";
import { projects } from "../../content/projects";
import { services } from "../../content/services";

test("redirects root and legacy public routes without duplicating English pages", async ({ request }) => {
    for (const path of ["/", "/services", "/services/business-website", "/projects", "/projects/nexus-finance", "/contact"]) {
        const response = await request.get(`${path}?source=legacy`, { maxRedirects: 0 });
        expect(response.status()).toBe(308);
        expect(new URL(response.headers().location, "http://localhost:3100").pathname).toBe(path === "/" ? "/en" : `/en${path}`);
        expect(response.headers().location).toContain("source=legacy");
    }
});

test("rejects unknown locales and keeps APIs outside locale routes", async ({ request }) => {
    for (const path of ["/fr", "/fr/services", "/fr/projects/nexus-finance", "/de/api/leads", "/en/api/terminal"]) {
        const response = await request.get(path);
        expect(response.status()).toBe(404);
        expect(await response.text()).not.toContain('id="hero-title"');
    }
    for (const path of ["/api/leads", "/api/terminal"]) {
        expect((await request.get(path)).status()).toBe(405);
    }
});

for (const locale of siteLocales) {
    const other = locale === "en" ? "de" : "en";
    const copy = getDictionary(locale);
    test.describe(locale, () => {
        test("server HTML, content, metadata and sitemap are localized", async ({ request, page }) => {
            for (const path of ["", "/services", "/services/business-website", "/projects", "/projects/nexus-finance", "/contact"]) {
                const response = await request.get(`/${locale}${path}`);
                expect(response.status()).toBe(200);
                const html = await response.text();
                expect(html).toMatch(new RegExp(`<html[^>]*lang="${locale}"`));
                expect(html).toContain(`rel="canonical" href="http://localhost:3100/${locale}${path}"`);
                for (const language of siteLocales) expect(html).toContain(`hrefLang="${language}" href="http://localhost:3100/${language}${path}"`);
                expect(html).toContain(`property="og:locale" content="${locale === "de" ? "de_DE" : "en_US"}"`);
            }
            await page.goto(`/${locale}`);
            await expect(page.locator("html")).toHaveAttribute("lang", locale);
            await expect(page.locator("#hero-title")).toContainText(copy.ui.Agency);
            const sitemap = await (await request.get("/sitemap.xml")).text();
            for (const path of ["", "/services", "/projects", "/contact", ...services.map(s => `/services/${s.slug}`), ...projects.map(p => `/projects/${p.slug}`)]) expect(sitemap).toContain(`<loc>http://localhost:3100/${locale}${path}</loc>`);
            expect(sitemap).not.toContain("/api/");
        });

        test("switches equivalent routes and preserves query and hash", async ({ page }) => {
            for (const path of ["", "/services", "/services/business-website", "/projects/nexus-finance", "/contact"]) {
                await page.goto(`/${locale}${path}?source=switch#main-content`);
                const switcher = page.getByRole("navigation", { name: copy.ui.Language, exact: true });
                await expect(switcher.locator(`[lang="${locale}"]`)).toHaveAttribute("aria-current", "page");
                await switcher.locator(`[lang="${other}"]`).focus();
                await page.keyboard.press("Enter");
                await expect(page).toHaveURL(`http://localhost:3100/${other}${path}?source=switch#main-content`);
                await expect(page.locator("html")).toHaveAttribute("lang", other);
                await expect(page.getByRole("dialog")).toHaveCount(0);
            }
        });

        test("renders existing localized service and standalone project content", async ({ page }) => {
            await page.goto(`/${locale}/services`);
            for (const service of services) await expect(page.getByRole("heading", { name: service.title[locale], exact: true })).toBeVisible();
            await page.goto(`/${locale}/services/business-website`);
            await expect(page.locator("#service-page-title")).toHaveText(services[0].title[locale]);
            await expect(page.locator("main")).toContainText(services[0].description[locale]);
            const project = projects.find(p => p.slug === "nexus-finance")!;
            await page.goto(`/${locale}/projects/nexus-finance`);
            await expect(page.getByRole("dialog")).toHaveCount(0);
            await expect(page.locator("#project-page-summary")).toHaveText(project.caseStudy.subtitle[locale]);
            await expect(page.locator("main")).toContainText(project.challenge[locale]);
            await expect(page.locator("main")).toContainText(project.solution[locale]);
        });

        test("preserves modal history, focus and gallery reset", async ({ page }) => {
            await page.goto(`/${locale}`);
            const trigger = page.locator('#project-modal-trigger-nexus-finance');
            await trigger.scrollIntoViewIfNeeded();
            await trigger.click();
            await expect(page).toHaveURL(`http://localhost:3100/${locale}/projects/nexus-finance`);
            const dialog = page.getByRole("dialog");
            await expect(dialog).toBeVisible();
            await expect(dialog).toContainText(projects.find(p => p.slug === "nexus-finance")!.summary[locale]);
            const gallery = dialog.locator("[data-project-gallery]");
            await expect(gallery).toHaveAttribute("data-gallery-index", "0");
            await dialog.getByRole("button", { name: copy.ui["Show next project image"] }).click();
            await expect(gallery).toHaveAttribute("data-gallery-index", "1");
            await dialog.getByRole("button", { name: copy.ui["Close project dialog"] }).click();
            await expect(dialog).toHaveCount(0);
            await expect(page).toHaveURL(`http://localhost:3100/${locale}`);
            await expect(trigger).toBeFocused();
            await trigger.click();
            await expect(dialog).toBeVisible();
            await expect(gallery).toHaveAttribute("data-gallery-index", "0");
            await page.keyboard.press("Escape");
            await expect(dialog).toHaveCount(0);
            await expect(trigger).toBeFocused();
        });

        test("preserves cinematic desktop and document-flow mobile home navigation", async ({ page }, testInfo) => {
            if (!testInfo.project.name.includes("mobile")) await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(`/${locale}`);
            const html = page.locator("html");
            const navigator = page.locator("[data-cinematic-navigator]");
            if (testInfo.project.name.includes("mobile")) {
                await expect(navigator).toBeHidden();
                await expect(html).not.toHaveAttribute("data-cinematic-runtime", "ready");
                await page.locator("#projects").scrollIntoViewIfNeeded();
                await expect(page.locator("#projects")).toBeInViewport();
            } else {
                await expect(html).toHaveAttribute("data-cinematic-runtime", "ready");
                for (const target of ["neural", "contact", "archive"]) {
                    await navigator.locator(`[data-cinematic-nav-target="${target}"]`).click();
                    await expect(html).toHaveAttribute("data-cinematic-active", target, { timeout: 10_000 });
                }
            }
            await page.locator("header[data-site-header]").getByRole("link", { name: copy.ui["Pixardia home"], exact: true }).click();
            if (testInfo.project.name.includes("mobile")) {
                await expect(page).toHaveURL(`http://localhost:3100/${locale}#hero`);
                await expect(page.locator("#hero")).toBeInViewport();
                await expect(html).not.toHaveAttribute("data-cinematic-runtime", "ready");
            } else {
                await expect(html).toHaveAttribute("data-cinematic-active", "hero", { timeout: 10_000 });
                await expect(page).toHaveURL(`http://localhost:3100/${locale}`);
            }
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
        });

        test("sends the active locale to the terminal", async ({ page }) => {
            await page.route("**/api/terminal", route => route.fulfill({ json: { answer: locale === "de" ? "Erzählen Sie uns von Ihrem Projekt." : "Tell us about your project.", category: "contact", shouldLeadToContact: true } }));
            await page.goto(`/${locale}`);
            await page.getByRole("textbox", { name: copy.ui["Describe your project"], exact: true }).fill("We need a business website");
            const sent = page.waitForRequest(request => request.url().endsWith("/api/terminal") && request.method() === "POST");
            await page.getByRole("button", { name: copy.ui["build project route →"], exact: true }).click();
            expect((await sent).postDataJSON().language).toBe(locale);
        });

        test("localizes contact validation, API payload and success/error states", async ({ page }) => {
            let status = 201;
            await page.route("**/api/leads", route => route.fulfill({ status, json: status === 201 ? { ok: true } : { ok: false, error: "too_many_requests" } }));
            await page.goto(`/${locale}/contact?service=business-website`);
            const submit = page.getByRole("button", { name: copy.contact.submit, exact: true });
            await submit.click();
            await expect(page.locator("#client-name-error")).toHaveText(copy.ui["Name is too short"]);
            await expect(page.locator("#privacy-accepted-error")).toHaveText(copy.ui["Please accept the privacy policy"]);
            for (const result of [201, 429]) {
                status = result;
                await page.getByLabel(copy.contact.nameLabel, { exact: true }).fill("Locale Tester");
                await page.getByLabel(copy.contact.emailLabel, { exact: true }).fill("locale@example.com");
                await page.getByLabel(copy.contact.messageLabel, { exact: true }).fill("We need a multilingual business website for our company.");
                await page.locator("#privacy-accepted").check();
                const sent = page.waitForRequest(request => request.url().endsWith("/api/leads") && request.method() === "POST");
                await submit.click();
                expect((await sent).postDataJSON().language).toBe(locale);
                await expect(page.getByText(result === 201 ? copy.contact.success : copy.contact.rateLimit, { exact: true })).toBeVisible();
            }
        });
    });
}
