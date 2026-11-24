"use client";

import { useEffect } from "react";
import { isLocale } from "@/i18n/config";
import { parseMobilePreviewPath } from "@/i18n/navigation";

/*
 * Single source of internal navigation for the dedicated mobile layout.
 *
 * Shared copy and the shared footer link to the desktop routes (/contact, /services, /#hero …).
 * Inside the mobile preview every such link is intercepted here and becomes a smooth scroll to the
 * matching mobile section, so language, layout and the running animations are never reset.
 * Legal pages, project case studies, external links and the language switcher are left alone.
 */
const SECTION_BY_PATH: Record<string, string> = {
    "/": "hero",
    "/contact": "contact",
    "/services": "neural",
    "/projects": "projects",
};
const SECTION_BY_HASH: Record<string, string> = {
    hero: "hero",
    "crafting-structure": "crafting",
    "neural-system": "neural",
    projects: "projects",
    contact: "contact",
};
const MENU_DIALOG_ID = "pixardia-mobile-menu";

function resolveSection(url: URL): string | null {
    const preview = parseMobilePreviewPath(url.pathname);
    if (preview) {
        // Only in-page anchors of the current document are ours.
        const id = url.hash.slice(1);
        return url.pathname === window.location.pathname && id && document.getElementById(id) ? id : null;
    }
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments[0] && isLocale(segments[0])) segments.shift();
    const path = `/${segments.join("/")}`;
    if (path === "/") return SECTION_BY_HASH[url.hash.slice(1)] ?? (url.hash ? null : "hero");
    if (path.startsWith("/services/")) return "neural";
    return SECTION_BY_PATH[path] ?? null;
}

function scrollToSection(id: string, url: URL) {
    const target = document.getElementById(id);
    if (!target) return;
    const service = id === "contact" ? url.searchParams.get("service") : null;
    window.history.replaceState(null, "", `${window.location.pathname}${service ? `?service=${encodeURIComponent(service)}` : ""}#${id}`);
    // The contact form reads ?service= through a popstate subscription.
    if (id === "contact") window.dispatchEvent(new PopStateEvent("popstate"));
    target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
    });
}

export default function MobilePreviewNavigation() {
    useEffect(() => {
        function onClick(event: MouseEvent) {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
            if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
            const dialog = anchor.closest("dialog");
            // The menu has its own close-then-scroll handler.
            if (dialog?.id === MENU_DIALOG_ID || anchor.closest(`#${MENU_DIALOG_ID}`)) return;
            const url = new URL(anchor.href, window.location.href);
            if (url.origin !== window.location.origin) return;
            const id = resolveSection(url);
            if (!id) return;

            event.preventDefault();
            if (dialog?.open) {
                // Same as Escape: the project modal closes itself, then we scroll.
                dialog.dispatchEvent(new Event("cancel", { cancelable: true }));
                const started = performance.now();
                const wait = () => {
                    if (!dialog.isConnected || !dialog.open || performance.now() - started > 1200) {
                        requestAnimationFrame(() => scrollToSection(id, url));
                    } else {
                        requestAnimationFrame(wait);
                    }
                };
                wait();
                return;
            }
            scrollToSection(id, url);
        }
        document.addEventListener("click", onClick, true);
        return () => document.removeEventListener("click", onClick, true);
    }, []);

    return null;
}
