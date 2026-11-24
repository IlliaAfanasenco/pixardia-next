"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion/gsap";
import { useI18n } from "@/i18n/LocaleProvider";
import {
    DESKTOP_INTRO_ATTRIBUTE as ATTRIBUTE,
    DESKTOP_INTRO_QUERY,
    DESKTOP_INTRO_STORAGE_KEY,
    FRAME_COUNT,
    REDUCED_MOTION_QUERY,
    frameUrl,
} from "./config";
import styles from "./DesktopIntro.module.css";

/*
 * THE FIRST HANDSHAKE
 *
 * States: loading (static HTML, before hydration) → initializing → connection → handshake → reveal → ready.
 * The characters are the Hero's own 65-frame transparent handshake sequence (same URLs and cache mode, so
 * the Hero reuses the downloaded frames). Playback is paced by actual loading, never by a bare timer:
 * the playhead can only advance over frames that have arrived, pauses before the clasp until the critical
 * resources (all intro frames, fonts, first-screen Hero) are ready or a hard deadline passes, and is never looped.
 */
const REACH_FRAME = 46; // arms extended, hands not yet touching
const CONTACT_FRAME = 53; // the clasp
const MAX_WAIT_MS = 5000; // measured from navigation start: never block the site longer than this
const MIN_CONNECTION_MS = 0; // pacing comes from frame speed below
const CONNECTION_SPEED = 130; // frames per second
const HANDSHAKE_SPEED = 95;

type Bitmap = CanvasImageSource & { close?: () => void };

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
const race = (promise: Promise<unknown>, ms: number) => Promise.race([promise.catch(() => undefined), wait(ms)]);

export default function DesktopIntro() {
    const { t } = useI18n();
    const [done, setDone] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);
    const figureRef = useRef<HTMLDivElement>(null);
    const leftRef = useRef<HTMLCanvasElement>(null);
    const rightRef = useRef<HTMLCanvasElement>(null);
    const starRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLSpanElement>(null);
    const percentRef = useRef<HTMLSpanElement>(null);
    const metaRef = useRef<HTMLSpanElement>(null);
    const chromeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = document.documentElement;
        const overlay = overlayRef.current;
        const figure = figureRef.current;
        const left = leftRef.current;
        const right = rightRef.current;
        const star = starRef.current;
        const glow = glowRef.current;
        const percent = percentRef.current;
        const meta = metaRef.current;
        if (!overlay || !figure || !left || !right || !star || !glow || !percent || !meta) return;

        let played = false;
        try { played = sessionStorage.getItem(DESKTOP_INTRO_STORAGE_KEY) === "1"; } catch { /* Storage may be disabled. */ }
        if (played || !window.matchMedia(DESKTOP_INTRO_QUERY).matches || window.matchMedia(REDUCED_MOTION_QUERY).matches) {
            root.removeAttribute(ATTRIBUTE);
            return;
        }
        window.clearTimeout(Number(root.dataset.desktopIntroTimer));
        delete root.dataset.desktopIntroTimer;

        const startedAt = performance.now();
        const savedScroll = { x: window.scrollX, y: window.scrollY };
        const abort = new AbortController();
        const contexts = [left.getContext("2d", { alpha: true }), right.getContext("2d", { alpha: true })];
        const blobs: (Blob | undefined)[] = [];
        const settled = new Set<number>();
        const bitmaps = new Map<number, Bitmap>();
        const decoding = new Set<number>();
        const timelines: gsap.core.Animation[] = [];
        let disposed = false;
        let playhead = 0;
        let limit = 0;
        let speed = 0;
        let drawn = -1;
        let sized = "";
        let shown = 0;
        let fontsReady = false;
        let heroReady = false;

        const setPhase = (phase: string) => {
            if (disposed) return;
            root.setAttribute(ATTRIBUTE, phase);
            overlay.dataset.phase = phase;
        };

        // --- input is blocked while the loader owns the screen (Lenis listens on window) -----------------
        const block = (event: Event) => { event.preventDefault(); event.stopImmediatePropagation(); };
        const blockKeys = (event: KeyboardEvent) => {
            if (["Tab", " ", "PageUp", "PageDown", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) block(event);
        };
        window.addEventListener("wheel", block, { capture: true, passive: false });
        window.addEventListener("touchmove", block, { capture: true, passive: false });
        window.addEventListener("keydown", blockKeys, { capture: true });

        // --- frames ------------------------------------------------------------------------------------
        const contiguous = () => { let n = 0; while (n < FRAME_COUNT && settled.has(n)) n++; return n; };
        const loadedCount = () => blobs.reduce((total, blob) => total + (blob ? 1 : 0), 0);
        const fetchFrame = async (index: number) => {
            try {
                const response = await fetch(frameUrl(index), { signal: abort.signal, cache: "force-cache" });
                if (!response.ok) throw new Error(String(response.status));
                blobs[index] = await response.blob();
            } catch { /* A missing frame is skipped; the sequence never blocks on one failure. */ }
            settled.add(index);
        };
        let nextFetch = 0;
        const framesDone = Promise.all(Array.from({ length: 4 }, async () => {
            while (!disposed && nextFetch < FRAME_COUNT) await fetchFrame(nextFetch++);
        }));
        const decode = async (index: number) => {
            const blob = blobs[index];
            if (!blob || bitmaps.has(index) || decoding.has(index)) return;
            decoding.add(index);
            try {
                let bitmap: Bitmap | undefined;
                if (typeof createImageBitmap === "function") bitmap = await createImageBitmap(blob).catch(() => undefined);
                if (!bitmap) {
                    const url = URL.createObjectURL(blob);
                    const image = new window.Image();
                    image.decoding = "async";
                    try { image.src = url; await image.decode(); bitmap = image; } finally { URL.revokeObjectURL(url); }
                }
                if (disposed) bitmap.close?.(); else bitmaps.set(index, bitmap);
            } catch { /* The nearest decoded frame stays on screen. */ } finally { decoding.delete(index); }
        };
        const pump = () => {
            const current = Math.round(playhead);
            const wanted = new Set<number>([0, current]);
            for (let step = 1; step <= 6; step++) if (current + step < FRAME_COUNT) wanted.add(current + step);
            for (const [index, bitmap] of bitmaps) {
                if (!wanted.has(index) && index < current - 2) { bitmap.close?.(); bitmaps.delete(index); }
            }
            for (const index of wanted) { if (decoding.size >= 3) break; void decode(index); }
        };

        // --- canvas ------------------------------------------------------------------------------------
        const draw = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const width = Math.max(1, Math.round(left.clientWidth * dpr));
            const height = Math.max(1, Math.round(left.clientHeight * dpr));
            const key = `${width}x${height}`;
            const resized = key !== sized;
            const target = Math.round(playhead);
            let nearest = -1;
            for (const index of bitmaps.keys()) {
                if (nearest < 0 || Math.abs(index - target) < Math.abs(nearest - target)) nearest = index;
            }
            if (nearest < 0 || (!resized && nearest === drawn)) return;
            if (resized) { for (const canvas of [left, right]) { canvas.width = width; canvas.height = height; } sized = key; }
            const size = Math.min(width, height);
            for (const [i, context] of contexts.entries()) {
                if (!context) continue;
                context.clearRect(0, 0, width, height);
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";
                if (i === 1 && right.style.visibility === "hidden") continue;
                context.drawImage(bitmaps.get(nearest)!, (width - size) / 2, (height - size) / 2, size, size);
            }
            drawn = nearest;
            meta.dataset.frame = String(nearest + 1).padStart(3, "0");
        };
        meta.dataset.frame = "001";

        // --- progress: the share of tracked critical resources that are ready ---------------------------
        const realProgress = () => 0.7 * (loadedCount() / FRAME_COUNT) + (fontsReady ? 0.1 : 0) + (heroReady ? 0.2 : 0);
        let progressCap = 0.98;
        const tick = (_time: number, delta: number) => {
            if (disposed) return;
            if (speed > 0) {
                const cap = Math.min(limit, contiguous() - 1);
                if (playhead < cap) playhead = Math.min(cap, playhead + (speed * delta) / 1000);
            }
            shown += (Math.min(realProgress(), progressCap) - shown) * Math.min(1, delta / 120);
            percent.dataset.value = String(Math.min(100, Math.round(shown * 100))).padStart(3, "0");
            pump();
            draw();
        };
        gsap.ticker.add(tick);
        const resizeObserver = new ResizeObserver(() => { sized = ""; draw(); });
        resizeObserver.observe(left);

        // --- other critical resources --------------------------------------------------------------------
        const fonts = race(document.fonts.ready, 2500).then(() => { fontsReady = true; });
        const hero = (async () => {
            const hasFrame = () => Boolean(document.querySelector<HTMLElement>("[data-hero-handshake]")?.dataset.frame);
            while (!disposed && !hasFrame()) await wait(40);
            const images = Array.from(document.querySelectorAll<HTMLImageElement>("#hero img"));
            await Promise.all(images.map((image) => image.complete ? undefined : image.decode().catch(() => undefined)));
            heroReady = true;
        })();
        const critical = Promise.all([framesDone, fonts, hero]);

        const finish = (completed: boolean) => {
            if (disposed) return;
            disposed = true;
            abort.abort();
            gsap.ticker.remove(tick);
            timelines.forEach((animation) => animation.kill());
            resizeObserver.disconnect();
            window.removeEventListener("wheel", block, { capture: true });
            window.removeEventListener("touchmove", block, { capture: true });
            window.removeEventListener("keydown", blockKeys, { capture: true });
            for (const bitmap of bitmaps.values()) bitmap.close?.();
            bitmaps.clear();
            blobs.length = 0;
            root.removeAttribute(ATTRIBUTE);
            window.scrollTo({ left: savedScroll.x, top: savedScroll.y, behavior: "instant" });
            if (completed) {
                try { sessionStorage.setItem(DESKTOP_INTRO_STORAGE_KEY, "1"); } catch { /* Storage may be disabled. */ }
                setDone(true);
            }
        };

        // --- the sequence --------------------------------------------------------------------------------
        void (async () => {
            setPhase("initializing");
            const frameZero = (async () => { while (!disposed && !bitmaps.has(0) && performance.now() - startedAt < 2500) { await wait(30); } })();
            await frameZero;
            if (disposed) return;

            if (bitmaps.has(0)) {
                figure.dataset.visible = "true";
                for (const [canvas, x] of [[left, -16], [right, 16]] as const) {
                    timelines.push(gsap.fromTo(canvas, { xPercent: x, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.34, ease: "power3.out" }));
                }
                await wait(340);
                if (disposed) return;
                // Converged: one canvas shows the whole frame, so no seam can appear while the sequence plays.
                left.style.clipPath = "none";
                right.style.visibility = "hidden";
                sized = "";

                setPhase("connection");
                limit = REACH_FRAME;
                timelines.push(gsap.to({ s: 0 }, { s: CONNECTION_SPEED, duration: 0.15, ease: "power1.in", onUpdate() { speed = this.targets()[0].s; } }));
                await wait(MIN_CONNECTION_MS);
            }

            // Natural pause before the clasp until everything critical is ready (or the deadline passes).
            const deadline = Math.max(0, MAX_WAIT_MS - performance.now());
            await race(critical, deadline);
            if (disposed) return;
            while (!disposed && bitmaps.size && playhead < Math.min(REACH_FRAME, contiguous() - 1) - 0.5 && performance.now() < MAX_WAIT_MS + 1200) await wait(30);
            if (disposed) return;

            setPhase("handshake");
            limit = FRAME_COUNT - 1;
            speed = HANDSHAKE_SPEED;
            const clasp = Date.now();
            while (!disposed && bitmaps.size && playhead < CONTACT_FRAME && Date.now() - clasp < 1200) await wait(16);
            if (disposed) return;
            progressCap = 1;
            timelines.push(
                gsap.to(star, { opacity: 1, scale: 1, rotation: 0, duration: 0.42, ease: "back.out(2.2)" }),
                gsap.fromTo(glow, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }),
            );
            while (!disposed && bitmaps.size && playhead < FRAME_COUNT - 1.5 && Date.now() - clasp < 1800) await wait(16);
            await wait(90);
            if (disposed) return;

            // Reveal: the star grows, then a circular opening grows out of it onto the finished Hero.
            setPhase("reveal");
            const box = overlay.getBoundingClientRect();
            const starBox = star.getBoundingClientRect();
            const cx = starBox.left + starBox.width / 2 - box.left;
            const cy = starBox.top + starBox.height / 2 - box.top;
            overlay.style.setProperty("--hole-x", `${cx}px`);
            overlay.style.setProperty("--hole-y", `${cy}px`);
            const radius = Math.hypot(Math.max(cx, box.width - cx), Math.max(cy, box.height - cy)) + 24;
            const hole = { r: 0 };
            const reveal = gsap.timeline({ onComplete: () => finish(true) });
            timelines.push(reveal);
            const chrome = [chromeRef.current, overlay.querySelector<HTMLElement>("[data-intro-bottom]")].filter(Boolean);
            reveal
                .to(chrome, { opacity: 0, duration: 0.25, ease: "power1.out" }, 0)
                .to(figure, { opacity: 0, duration: 0.3, ease: "power1.out" }, 0.05)
                .to(glow, { opacity: 0, duration: 0.3 }, 0)
                .to(star, { scale: 7, rotation: 45, duration: 0.42, ease: "power2.in" }, 0)
                .to(star, { opacity: 0, duration: 0.18, ease: "none" }, 0.34)
                .to(hole, {
                    r: radius,
                    duration: 0.5,
                    ease: "power3.inOut",
                    onUpdate: () => overlay.style.setProperty("--hole", `${hole.r.toFixed(1)}px`),
                }, 0.2);
        })();

        return () => finish(false);
    }, []);

    if (done) return null;

    return (
        <div
            ref={overlayRef}
            className={styles.overlay}
            data-desktop-intro-overlay=""
            data-phase="loading"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div ref={chromeRef} className={styles.top}>
                <span className={styles.logo}>PIXARDIA</span>
                <span ref={metaRef} className={styles.meta} data-frame="001" aria-hidden="true" />
            </div>

            <div className={styles.stage} aria-hidden="true">
                <div ref={figureRef} className={styles.figure} data-visible="false">
                    <span ref={glowRef} className={styles.glow} />
                    <canvas ref={leftRef} className={`${styles.canvas} ${styles.canvasLeft}`} width={960} height={960} />
                    <canvas ref={rightRef} className={`${styles.canvas} ${styles.canvasRight}`} width={960} height={960} />
                    <div ref={starRef} className={styles.star}>
                        <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.57739 -1.3113e-06L19.1682 10.2112L33.1628 9.57737L22.9516 19.1682L23.5855 33.1628L13.9947 22.9516L1.65701e-05 23.5855L10.2112 13.9947L9.57739 -1.3113e-06Z" fill="#1E1E1E" />
                        </svg>
                    </div>
                </div>
            </div>

            <div data-intro-bottom="">
                <div className={styles.bottom}>
                    <span className={styles.status}>
                        <span className={styles.labelA}>{t("ESTABLISHING CONNECTION")}</span>
                        <span className={styles.labelB}>{t("INITIALIZING EXPERIENCE")}</span>
                        <span className={styles.labelC}>{t("LET'S BUILD SOMETHING.")}</span>
                    </span>
                    <span ref={percentRef} className={styles.percent} data-value="000" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}
