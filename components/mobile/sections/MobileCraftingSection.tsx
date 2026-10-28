    "use client";

    import { useLayoutEffect, useRef } from "react";
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";
    import styles from "./MobileCraftingSection.module.css";

    gsap.registerPlugin(ScrollTrigger);

    const FRAME_COUNT = 192;
    const STATS = [
        { value: "50+", label: "Projects" },
        { value: "99.9%", label: "Uptime" },
        { value: "30+", label: "Clients" },
        { value: "3+", label: "Years" },
    ];

    export default function MobileCraftingSection() {
        const sectionRef = useRef<HTMLElement>(null);
        const stageRef = useRef<HTMLDivElement>(null);
        const canvasRef = useRef<HTMLCanvasElement>(null);

        useLayoutEffect(() => {
            const section = sectionRef.current;
            const stage = stageRef.current;
            const canvas = canvasRef.current;
            const context = canvas?.getContext("2d");

            if (!section || !stage || !canvas || !context) return;

            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;
            const playhead = { frame: reducedMotion ? FRAME_COUNT - 1 : 0 };
            const frames: HTMLImageElement[] = [];
            let renderedFrame = -1;
            let disposed = false;
            let width = 0;
            let height = 0;

            const render = () => {
                if (disposed) return;

                const requestedFrame = Math.round(playhead.frame);
                const ready = (index: number) =>
                    frames[index]?.complete && frames[index].naturalWidth > 0;
                const index = ready(requestedFrame)
                    ? requestedFrame
                    : Math.max(renderedFrame, 0);

                if (!ready(index) || index === renderedFrame) return;

                const image = frames[index];
                const scale = Math.min(
                    width / image.naturalWidth,
                    height / image.naturalHeight,
                );
                const drawWidth = image.naturalWidth * scale;
                const drawHeight = image.naturalHeight * scale;

                context.clearRect(0, 0, width, height);
                context.drawImage(
                    image,
                    (width - drawWidth) / 2,
                    (height - drawHeight) / 2,
                    drawWidth,
                    drawHeight,
                );
                renderedFrame = index;
            };

            const resize = () => {
                section.style.setProperty("--stage-height", `${stage.getBoundingClientRect().height}px`);
                width = canvas.clientWidth;
                height = canvas.clientHeight;
                const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.round(width * pixelRatio);
                canvas.height = Math.round(height * pixelRatio);
                context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
                renderedFrame = -1;
                render();
            };

            const resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(canvas);
            resizeObserver.observe(stage);
            resize();

            const ctx = gsap.context(() => {
                if (reducedMotion) return;

                gsap.to(playhead, {
                    frame: FRAME_COUNT - 1,
                    snap: "frame",
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: () => `top ${window.getComputedStyle(stage).top}`,
                        // Preserve the original 65svh scrub distance as the visible
                        // stage becomes shorter than the full-height canvas.
                        end: () => `+=${section.getBoundingClientRect().height - stage.getBoundingClientRect().height}`,
                        scrub: 0.7,
                        invalidateOnRefresh: true,
                    },
                    onUpdate: render,
                });
            }, section);

            for (let index = 0; index < FRAME_COUNT; index++) {
                if (reducedMotion && index !== FRAME_COUNT - 1) continue;

                const image = new window.Image();
                frames[index] = image;
                image.decoding = "async";
                image.fetchPriority = index === 0 || index === FRAME_COUNT - 1 ? "high" : "low";
                image.onload = render;
                image.src = `/images/handshake-sequence/frame-${String(index + 1).padStart(4, "0")}.webp`;
            }

            return () => {
                disposed = true;
                ctx.revert();
                resizeObserver.disconnect();
                frames.forEach((image) => {
                    image.onload = null;
                    image.removeAttribute("src");
                });
            };
        }, []);

        return (
            <section
                ref={sectionRef}
                data-mobile-section="crafting"
                className={styles.section}
            >
                <div ref={stageRef} className={styles.stage}>
                    {/* Text stays above the animation. */}
                    <div className={`pointer-events-none relative z-20 px-5 pt-5 text-center ${styles.scene}`}>
                        <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#c6c6c8]">
                            Deploymentprotocol02
                        </p>
                        <h2 className="mt-2 uppercase leading-[0.9] tracking-[-0.055em]">
                <span className="block text-[clamp(29px,10vw,43px)] font-black text-[#5848ff]">
                  A PARTNER
                </span>
                            <span className="block text-[clamp(25px,8.65vw,37px)] font-black text-[#c4c4c6]">
                  YOU CAN TRUST
                </span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-[310px] text-[15px] font-semibold uppercase leading-[1.15] text-[#c4c4c6]">
                            We create websites that<br />
                            don&apos;t just look good — they<br />
                            work, convert and grow<br />
                            your business
                        </p>
                    </div>

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 isolate select-none"
                    >
                        <canvas
                            ref={canvasRef}
                            width={496}
                            height={864}
                            className={`absolute inset-0 w-full ${styles.canvas}`}
                        />
                    </div>

                    {/* Stats stay above the animation. */}
                    <div
                        className={styles.marquee}
                        tabIndex={0}
                        role="group"
                        aria-label="Partner statistics"
                        onPointerDown={(event) => {
                            event.currentTarget.dataset.pressed = "true";
                        }}
                        onPointerUp={(event) => {
                            delete event.currentTarget.dataset.pressed;
                        }}
                        onPointerCancel={(event) => {
                            delete event.currentTarget.dataset.pressed;
                        }}
                        onPointerLeave={(event) => {
                            delete event.currentTarget.dataset.pressed;
                        }}
                        onBlur={(event) => {
                            delete event.currentTarget.dataset.pressed;
                        }}
                    >
                        <div className={styles.track}>
                            {[false, true].map((duplicate) => (
                                <div
                                    key={String(duplicate)}
                                    className={styles.statsGroup}
                                    aria-hidden={duplicate ? true : undefined}
                                >
                                    {STATS.map((stat) => <Stat key={stat.label} {...stat} />)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    function Stat({ value, label }: { value: string; label: string }) {
        return (
            <div className={styles.stat}>
                <div className="text-[23px] font-black leading-none text-[#5848ff]">
                    {value}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase text-[#414141]">
                    {label}
                </div>
            </div>
        );
    }
