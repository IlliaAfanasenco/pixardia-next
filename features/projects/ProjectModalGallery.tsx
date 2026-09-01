"use client";

import Image from "next/image";
import {
    type CSSProperties,
    type KeyboardEvent,
    type TouchEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    ProjectMediaAsset,
} from "@/types/services";

type ProjectModalGalleryProps = {
    projectKey: string;
    projectTitle: string;
    media: readonly ProjectMediaAsset[];
    imageLabel: string;
    primaryColor: string;
    accentColor: string;
    surfaceColor: string;
    className?: string;
};

export default function ProjectModalGallery({
                                                projectKey,
                                                projectTitle,
                                                media,
                                                imageLabel,
                                                primaryColor,
                                                accentColor,
                                                surfaceColor,
                                                className = "",
                                            }: ProjectModalGalleryProps) {
    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [isChanging, setIsChanging] =
        useState(false);

    const touchStartX = useRef<number | null>(
        null,
    );

    const transitionTimer =
        useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );

    const hasNavigation = media.length > 1;
    const currentMedia = media[currentIndex];

    useEffect(
        () => () => {
            if (transitionTimer.current) {
                clearTimeout(
                    transitionTimer.current,
                );
            }
        },
        [],
    );

    const selectImage = useCallback(
        (nextIndex: number) => {
            if (
                media.length < 2 ||
                nextIndex === currentIndex
            ) {
                return;
            }

            const normalizedIndex =
                (nextIndex + media.length) %
                media.length;

            const reduceMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                ).matches;

            if (reduceMotion) {
                setCurrentIndex(normalizedIndex);

                return;
            }

            setIsChanging(true);

            if (transitionTimer.current) {
                clearTimeout(
                    transitionTimer.current,
                );
            }

            transitionTimer.current = setTimeout(
                () => {
                    setCurrentIndex(normalizedIndex);
                    setIsChanging(false);
                },
                110,
            );
        },
        [currentIndex, media.length],
    );

    function handleKeyDown(
        event: KeyboardEvent<HTMLDivElement>,
    ): void {
        if (!hasNavigation) {
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            selectImage(currentIndex - 1);
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            selectImage(currentIndex + 1);
        }
    }

    function handleTouchStart(
        event: TouchEvent<HTMLDivElement>,
    ): void {
        touchStartX.current =
            event.touches[0]?.clientX ?? null;
    }

    function handleTouchEnd(
        event: TouchEvent<HTMLDivElement>,
    ): void {
        if (
            !hasNavigation ||
            touchStartX.current === null
        ) {
            return;
        }

        const touchEndX =
            event.changedTouches[0]?.clientX;

        if (touchEndX === undefined) {
            return;
        }

        const distance =
            touchEndX - touchStartX.current;

        touchStartX.current = null;

        if (Math.abs(distance) < 42) {
            return;
        }

        selectImage(
            currentIndex + (distance < 0 ? 1 : -1),
        );
    }

    return (
        <div
            className={`relative overflow-hidden border border-[#696A6D] bg-[#EFF0F3] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
            style={{
                outlineColor: accentColor,
            }}
            role="group"
            aria-label={`${projectTitle} project gallery`}
            tabIndex={hasNavigation ? 0 : -1}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            data-project-gallery=""
            data-gallery-project={projectKey}
            data-gallery-index={currentIndex}
            data-gallery-count={media.length}
        >
            {currentMedia ? (
                <Image
                    key={currentMedia.src}
                    src={currentMedia.src}
                    alt={currentMedia.alt.en}
                    fill
                    priority={currentIndex === 0}
                    sizes="(max-width: 767px) 100vw, 41vw"
                    className={`object-contain transition-opacity duration-150 motion-reduce:transition-none ${
                        isChanging
                            ? "opacity-25"
                            : "opacity-100"
                    }`}
                />
            ) : (
                <div
                    className="absolute inset-0 overflow-hidden"
                    role="img"
                    aria-label={`${projectTitle} system preview`}
                    style={{
                        backgroundColor: surfaceColor,
                        backgroundImage: `linear-gradient(135deg, ${accentColor}18 0%, transparent 44%), radial-gradient(circle at 76% 28%, ${primaryColor}20 0%, transparent 34%)`,
                    }}
                >
                    <div className="absolute inset-[12%] border border-black/10" />

                    <div
                        className="absolute bottom-[14%] left-[10%] h-px w-[44%]"
                        style={{
                            backgroundColor: accentColor,
                        }}
                    />

                    <span className="absolute bottom-[12%] right-[9%] text-[clamp(28px,5vw,62px)] font-black uppercase leading-none tracking-[-0.05em] text-black/[0.06]">
                        {projectTitle}
                    </span>
                </div>
            )}

            <span className="absolute left-3 top-3 bg-black px-3 py-2 text-[11px] font-black uppercase tracking-[0.05em] text-white sm:left-4 sm:top-4">
                {imageLabel}
            </span>

            {hasNavigation ? (
                <>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 sm:bottom-4 sm:left-4">
                        {media.map((asset, index) => (
                            <button
                                key={asset.src}
                                type="button"
                                aria-label={`Show image ${index + 1} of ${media.length}`}
                                aria-current={
                                    index === currentIndex
                                        ? "true"
                                        : undefined
                                }
                                onClick={() =>
                                    selectImage(index)
                                }
                                className="h-6 w-6 p-[9px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                style={{
                                    outlineColor:
                                        accentColor,
                                }}
                            >
                                <span
                                    className="block h-0.5 w-full transition-colors duration-150"
                                    style={{
                                        backgroundColor:
                                            index ===
                                            currentIndex
                                                ? accentColor
                                                : "#1E1E1E",
                                    }}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center bg-black text-white sm:bottom-4 sm:right-4">
                        <button
                            type="button"
                            aria-label="Show previous project image"
                            onClick={() =>
                                selectImage(
                                    currentIndex - 1,
                                )
                            }
                            className="grid size-9 place-items-center border-r border-white/30 text-base font-black transition-colors hover:text-[var(--gallery-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gallery-accent)]"
                            style={{
                                "--gallery-accent":
                                    accentColor,
                            } as CSSProperties}
                        >
                            ←
                        </button>

                        <span
                            className="min-w-[64px] px-2 text-center font-mono text-[10px] font-black tracking-[0.05em]"
                            aria-live="polite"
                        >
                            {String(
                                currentIndex + 1,
                            ).padStart(2, "0")}
                            {" / "}
                            {String(media.length).padStart(
                                2,
                                "0",
                            )}
                        </span>

                        <button
                            type="button"
                            aria-label="Show next project image"
                            onClick={() =>
                                selectImage(
                                    currentIndex + 1,
                                )
                            }
                            className="grid size-9 place-items-center border-l border-white/30 text-base font-black transition-colors hover:text-[var(--gallery-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gallery-accent)]"
                            style={{
                                "--gallery-accent":
                                    accentColor,
                            } as CSSProperties}
                        >
                            →
                        </button>
                    </div>
                </>
            ) : null}
        </div>
    );
}
