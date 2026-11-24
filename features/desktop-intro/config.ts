/** Shared by the inline bootstrap script and the DesktopIntro component. */
export const DESKTOP_INTRO_STORAGE_KEY = "pixardia:desktop-intro:complete";
export const DESKTOP_INTRO_ATTRIBUTE = "data-desktop-intro";
/** Tablet and wider. Phones are redirected to the dedicated mobile preview and never reach this page. */
export const DESKTOP_INTRO_QUERY = "(min-width: 768px)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
/** If React has not taken over by then (blocked or very slow JS) the static loader is removed. */
export const DESKTOP_INTRO_FAILSAFE_MS = 7000;

export const FRAME_COUNT = 65;
export const frameUrl = (index: number) =>
    `/images/hero-handshake/frame-${String(index + 1).padStart(3, "0")}.webp?v=transparent-d823ea33`;

/**
 * Runs while the HTML is parsed, before first paint, so the white loader is the very first thing on
 * screen and the Hero is never flashed before it. Eligibility mirrors the component's own check.
 */
export const desktopIntroBootstrap = `(() => {
    const root = document.documentElement;
    let played = false;
    try { played = sessionStorage.getItem(${JSON.stringify(DESKTOP_INTRO_STORAGE_KEY)}) === '1'; } catch {}
    if (played || !matchMedia(${JSON.stringify(DESKTOP_INTRO_QUERY)}).matches || matchMedia(${JSON.stringify(REDUCED_MOTION_QUERY)}).matches) return;
    root.setAttribute(${JSON.stringify(DESKTOP_INTRO_ATTRIBUTE)}, 'loading');
    root.dataset.desktopIntroTimer = String(setTimeout(() => {
        if (root.getAttribute(${JSON.stringify(DESKTOP_INTRO_ATTRIBUTE)}) === 'loading') root.removeAttribute(${JSON.stringify(DESKTOP_INTRO_ATTRIBUTE)});
        delete root.dataset.desktopIntroTimer;
    }, ${DESKTOP_INTRO_FAILSAFE_MS}));
})();`;
