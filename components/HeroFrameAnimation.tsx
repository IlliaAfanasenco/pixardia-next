"use client";

import { useRef, type RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import styles from "./HeroFrameAnimation.module.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 65;
const FRAME_SIZE = 960;
// Keep previously cached opaque frames separate from this transparent export.
const frameUrl = (index: number) =>
    `/images/hero-handshake/frame-${String(index + 1).padStart(3, "0")}.webp?v=transparent-d823ea33`;

type Frame = { image: CanvasImageSource; close: () => void };
type Props = {
    className?: string;
    canvasRef?: RefObject<HTMLCanvasElement | null>;
};

// offsetTop excludes the existing character bob and tablet depth transforms.
function layoutTop(element: HTMLElement) {
    let top = 0;
    for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
        top += node.offsetTop;
    }
    return top;
}

export default function HeroFrameAnimation({ className, canvasRef }: Props) {
    const localRef = useRef<HTMLCanvasElement>(null);
    const ref = canvasRef ?? localRef;

    useGSAP(() => {
        const canvas = ref.current;
        const hero = canvas?.closest<HTMLElement>("section");
        const context = canvas?.getContext("2d", { alpha: true });
        if (!canvas || !hero || !context) return;

        const media = gsap.matchMedia();
        media.add({ motion: "(prefers-reduced-motion: no-preference)", reduced: "(prefers-reduced-motion: reduce)" }, (match) => {
            const animate = Boolean(match.conditions?.motion);
            const controller = new AbortController();
            const sources = new Map<number, Promise<Blob>>();
            const frames = new Map<number, Frame>();
            const decoding = new Set<number>();
            const failed = new Set<number>();
            let disposed = false;
            let target = 0;
            let direction = 1;
            let raf = 0;
            let drawn = -1;

            const source = (index: number) => {
                if (!sources.has(index)) {
                    sources.set(index, fetch(frameUrl(index), {
                        signal: controller.signal,
                        cache: "force-cache",
                    }).then((response) => {
                        if (!response.ok) throw new Error(`Hero frame ${index + 1}: ${response.status}`);
                        return response.blob();
                    }));
                }
                return sources.get(index)!;
            };

            const load = async (index: number): Promise<Frame> => {
                const blob = await source(index);
                if (typeof createImageBitmap === "function") {
                    try {
                        const bitmap = await createImageBitmap(blob);
                        return { image: bitmap, close: () => bitmap.close() };
                    } catch {
                        if (controller.signal.aborted) throw new Error("Hero frame loading cancelled");
                    }
                }
                const url = URL.createObjectURL(blob);
                const image = new window.Image();
                image.decoding = "async";
                try {
                    image.src = url;
                    await image.decode();
                    return { image, close: () => image.removeAttribute("src") };
                } finally {
                    URL.revokeObjectURL(url);
                }
            };

            // Keep compressed sources, but only decode a small window around the playhead.
            const wanted = () => {
                const indices = [target];
                if (animate) {
                    for (let distance = 1; distance <= 8; distance++) {
                        for (const index of [target + distance * direction, target - distance * direction]) {
                            if (index >= 0 && index < FRAME_COUNT) indices.push(index);
                        }
                    }
                }
                return indices;
            };

            const draw = () => {
                raf = 0;
                if (disposed || !canvas.clientWidth || !canvas.clientHeight) return;
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
                const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
                const resized = canvas.width !== width || canvas.height !== height;
                let nearest = -1;
                for (const index of frames.keys()) {
                    if (nearest < 0 || Math.abs(index - target) < Math.abs(nearest - target)) nearest = index;
                }
                if (nearest < 0 || (!resized && nearest === drawn)) return;
                if (resized) {
                    canvas.width = width;
                    canvas.height = height;
                }
                const size = Math.min(width, height);
                context.clearRect(0, 0, width, height);
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";
                context.drawImage(frames.get(nearest)!.image, (width - size) / 2, (height - size) / 2, size, size);
                canvas.style.backgroundImage = "none";
                canvas.dataset.frame = String(nearest + 1);
                drawn = nearest;
            };
            const requestDraw = () => {
                if (!disposed && !raf) raf = window.requestAnimationFrame(draw);
            };

            const pump = () => {
                if (disposed) return;
                const indices = wanted();
                for (const [index, frame] of frames) {
                    if (!indices.includes(index)) {
                        frame.close();
                        frames.delete(index);
                    }
                }
                while (decoding.size < 2) {
                    const index = indices.find((value) => !frames.has(value) && !decoding.has(value) && !failed.has(value));
                    if (index === undefined) break;
                    decoding.add(index);
                    void load(index).then((frame) => {
                        if (disposed || !wanted().includes(index)) frame.close();
                        else {
                            frames.set(index, frame);
                            requestDraw();
                        }
                    }).catch(() => {
                        if (!disposed) failed.add(index);
                    }).finally(() => {
                        decoding.delete(index);
                        pump();
                    });
                }
            };

            const stage = hero.closest<HTMLElement>("[data-cinematic-stage]");
            const range = () => {
                const existing = ScrollTrigger.getAll().find((trigger) =>
                    trigger.trigger === stage && trigger.animation instanceof gsap.core.Timeline &&
                    "hero-to-crafting" in trigger.animation.labels,
                );
                if (existing && existing.animation instanceof gsap.core.Timeline) {
                    return [existing.start, existing.start + (existing.end - existing.start) *
                        existing.animation.labels["hero-to-crafting"] / existing.animation.duration()];
                }
                const header = document.querySelector<HTMLElement>("[data-site-header]");
                // Finish while the complete illustration is still below the sticky header.
                return [0, Math.max(1, Math.min(
                    layoutTop(hero) + hero.offsetHeight - window.innerHeight * 0.5,
                    layoutTop(canvas) - (header?.offsetHeight ?? 0) - 12,
                ))];
            };
            const sync = () => {
                const [start, end] = range();
                const progress = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
                const next = animate ? Math.round(progress * (FRAME_COUNT - 1)) : 0;
                if (next !== target) {
                    direction = Math.sign(next - target);
                    target = next;
                    pump();
                }
                requestDraw();
            };

            const observer = new ResizeObserver(() => { sync(); requestDraw(); });
            observer.observe(canvas);
            window.addEventListener("resize", sync);
            let trigger: ScrollTrigger | undefined;
            if (animate) {
                // Observe the existing scroll space; never pin or add scroll distance.
                trigger = ScrollTrigger.create({
                    trigger: hero,
                    start: 0,
                    end: () => Math.max(1, ScrollTrigger.maxScroll(window)),
                    refreshPriority: -1,
                    onUpdate: sync,
                    onRefresh: sync,
                });
                ScrollTrigger.addEventListener("refresh", sync);
            }
            pump();
            // Display frame one first; prefetch the remaining compressed frames with bounded concurrency.
            if (animate) {
                void source(0).then(async () => {
                    let next = 1;
                    await Promise.all(Array.from({ length: 3 }, async () => {
                        while (!disposed && next < FRAME_COUNT) {
                            const index = next++;
                            try { await source(index); } catch { /* The poster remains available on load failure. */ }
                        }
                    }));
                }).catch(() => {});
            }
            sync();

            return () => {
                disposed = true;
                controller.abort();
                trigger?.kill();
                ScrollTrigger.removeEventListener("refresh", sync);
                observer.disconnect();
                window.removeEventListener("resize", sync);
                window.cancelAnimationFrame(raf);
                for (const frame of frames.values()) frame.close();
                frames.clear();
                sources.clear();
            };
        });
        return () => media.revert();
    }, { dependencies: [ref] });

    return (
        <canvas
            ref={ref}
            width={FRAME_SIZE}
            height={FRAME_SIZE}
            aria-hidden="true"
            data-hero-handshake=""
            className={`${styles.canvas} ${className ?? ""}`}
            style={{ backgroundImage: `url("${frameUrl(0)}")`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}
        />
    );
}
