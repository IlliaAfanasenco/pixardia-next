"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/motion/gsap";

const finalProgress = 80;
const cinematicDesktopQuery =
    "(min-width: 1280px) and (min-height: 800px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export default function ProductProgress() {
    const rootRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const root = rootRef.current;
            const progressPath = root?.querySelector<SVGPathElement>(
                "[data-product-progress]",
            );
            const progressValue = root?.querySelector<SVGTextElement>(
                "[data-product-progress-value]",
            );

            if (!root || !progressPath || !progressValue) {
                return;
            }

            const pathLength = progressPath.getTotalLength();
            const value = { progress: 0 };
            let progressTween: gsap.core.Tween | null = null;
            const setProgress = (progress: number) => {
                value.progress = progress;
                progressValue.textContent = `${Math.round(progress)}%`;
                gsap.set(progressPath, {
                    strokeDasharray: pathLength,
                    strokeDashoffset:
                        pathLength * (1 - progress / finalProgress),
                });
            };
            const resetProgress = () => {
                progressTween?.kill();
                progressTween = null;
                setProgress(0);
            };
            const playProgress = () => {
                resetProgress();
                progressTween = gsap.to(value, {
                    progress: finalProgress,
                    duration: 2,
                    ease: "power2.inOut",
                    onUpdate: () => setProgress(value.progress),
                    onComplete: () => {
                        progressTween = null;
                    },
                });
            };

            const mm = gsap.matchMedia();

            mm.add(
                {
                    reduce: "(prefers-reduced-motion: reduce)",
                    cinematicDesktop: cinematicDesktopQuery,
                    fallback:
                        "(prefers-reduced-motion: no-preference)",
                },
                (context) => {
                    if (context.conditions?.reduce) {
                        setProgress(finalProgress);

                        return;
                    }

                    resetProgress();

                    if (context.conditions?.cinematicDesktop) {
                        return;
                    }

                    const observer = new IntersectionObserver(
                        ([entry]) => {
                            if (entry?.isIntersecting) {
                                playProgress();
                            } else {
                                resetProgress();
                            }
                        },
                        {
                            threshold: 0.45,
                        },
                    );

                    observer.observe(root);

                    return () => observer.disconnect();
                },
            );

            return () => {
                progressTween?.kill();
                mm.revert();
            };
        },
        { scope: rootRef },
    );

    return (
        <div
            ref={rootRef}
            className="h-[120px] w-[160px] max-w-full"
            aria-hidden="true"
        >
            <svg
                width="160"
                height="120"
                viewBox="0 0 84 84"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-auto max-w-full"
            >
                <defs>
                    <filter
                        id="product-progress-track"
                        colorInterpolationFilters="sRGB"
                    >
                        <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0.91 0 0 0 0 0.90 0 0 0 0 0.89 0 0 0 1 0"
                        />
                    </filter>

                    <mask id="product-progress-mask">
                        <path
                            d="M42 4 A38 38 0 1 1 5.85 30.26"
                            fill="none"
                            stroke="white"
                            strokeWidth="14"
                            strokeLinecap="round"
                            data-product-progress=""
                        />
                    </mask>
                </defs>

                <image
                    href="/icons/statisticsProd.svg"
                    width="84"
                    height="84"
                    filter="url(#product-progress-track)"
                />

                <circle
                    cx="42"
                    cy="42"
                    r="25"
                    fill="white"
                />

                <image
                    href="/icons/statisticsProd.svg"
                    width="84"
                    height="84"
                    mask="url(#product-progress-mask)"
                />

                <text
                    x="42"
                    y="42"
                    fill="#5B5A5A"
                    fontFamily="Arial, sans-serif"
                    fontSize="23"
                    fontWeight="700"
                    letterSpacing="-0.5"
                    textAnchor="middle"
                    dominantBaseline="central"
                    data-product-progress-value=""
                >
                    0%
                </text>
            </svg>
        </div>
    );
}
