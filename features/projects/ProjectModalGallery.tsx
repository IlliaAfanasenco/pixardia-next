"use client";
import { localized } from "@/i18n/localized";
import { useI18n } from "@/i18n/LocaleProvider";

import Image from "next/image";
import mobileStyles from "./ProjectModalGallery.module.css";
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

export type ProjectModalGalleryCaption = {
    title: string;
    description: string;
};

type ProjectModalGalleryProps = {
    projectKey: string;
    projectTitle: string;
    media: readonly ProjectMediaAsset[];
    imageLabel: string;
    primaryColor: string;
    accentColor: string;
    surfaceColor: string;
    className?: string;
    /** Per-image context, rendered below the frame and kept in sync with the active image. */
    captions?: readonly ProjectModalGalleryCaption[];
    captionClassName?: string;
    frameStyle?: CSSProperties;
    /** Dedicated mobile archive layout; the desktop gallery remains the default. */
    presentation?: "mobile";
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
                                                captions,
                                                captionClassName = "",
                                                frameStyle,
                                                presentation,
                                            }: ProjectModalGalleryProps) {
    const { t, locale } = useI18n();
    const [currentIndex, setCurrentIndex] =
        useState(0);

    const [isChanging, setIsChanging] =
        useState(false);

    const touchStartX = useRef<number | null>(
        null,
    );
    const touchStartY = useRef<number | null>(null);

    const transitionTimer =
        useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );

    const hasNavigation = media.length > 1;
    const currentMedia = media[currentIndex];
    const currentCaption = captions?.[currentIndex];

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
        touchStartY.current =
            event.touches.length === 1 ? event.touches[0]?.clientY ?? null : null;
        if (presentation === "mobile" && event.touches.length !== 1) {
            touchStartX.current = null;
        }
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
        const verticalDistance = event.changedTouches[0].clientY - (touchStartY.current ?? event.changedTouches[0].clientY);

        touchStartX.current = null;
        touchStartY.current = null;

        if (Math.abs(distance) < 42 || (presentation === "mobile" && Math.abs(distance) < Math.abs(verticalDistance) * 1.2)) {
            return;
        }

        selectImage(
            currentIndex + (distance < 0 ? 1 : -1),
        );
    }

    if (presentation === "mobile") {
        return (
            <div className={`${mobileStyles.figure} ${captionClassName}`} data-project-gallery-figure="">
                <div
                    className={`${mobileStyles.frame} ${className}`}
                    style={{ aspectRatio: currentMedia ? `${currentMedia.width} / ${currentMedia.height}` : "16 / 9" }}
                    role="group"
                    aria-label={t("{title} project gallery", { title: projectTitle })}
                    tabIndex={hasNavigation ? 0 : -1}
                    onKeyDown={handleKeyDown}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={() => {
                        touchStartX.current = null;
                        touchStartY.current = null;
                    }}
                    data-project-gallery=""
                    data-gallery-project={projectKey}
                    data-gallery-index={currentIndex}
                    data-gallery-count={media.length}
                    data-changing={isChanging || undefined}
                >
                    {currentMedia ? (
                        <Image
                            key={currentMedia.src}
                            src={currentMedia.src}
                            alt={localized(currentMedia.alt, locale)}
                            fill
                            loading="eager"
                            sizes="(max-width: 767px) 100vw, 768px"
                            draggable={false}
                            className={mobileStyles.image}
                        />
                    ) : <span className={mobileStyles.empty}>{projectTitle}</span>}
                </div>

                <div className={mobileStyles.navigation} role="group" aria-label={imageLabel}>
                    <div className={mobileStyles.controls}>
                        <button
                            type="button"
                            aria-label={t("Show previous project image")}
                            disabled={!hasNavigation}
                            onClick={() => selectImage(currentIndex - 1)}
                        >
                            <span aria-hidden="true">←</span>
                        </button>
                        <span className={mobileStyles.progress} aria-hidden="true">
                            <span style={{ width: `${media.length ? ((currentIndex + 1) / media.length) * 100 : 0}%` }} />
                        </span>
                        <span className={mobileStyles.counter} aria-live="polite" aria-atomic="true">
                            {String(media.length ? currentIndex + 1 : 0).padStart(2, "0")}
                            <span aria-hidden="true"> / </span>
                            {String(media.length).padStart(2, "0")}
                        </span>
                        <button
                            type="button"
                            aria-label={t("Show next project image")}
                            disabled={!hasNavigation}
                            onClick={() => selectImage(currentIndex + 1)}
                        >
                            <span aria-hidden="true">→</span>
                        </button>
                    </div>
                </div>

                {currentCaption ? (
                    <div className={mobileStyles.caption} aria-live="polite" aria-atomic="true" data-project-gallery-caption="" data-changing={isChanging || undefined}>
                        <span className={mobileStyles.captionIndex} aria-hidden="true">{String(currentIndex + 1).padStart(2, "0")}</span>
                        <p className={mobileStyles.captionTitle}>{currentCaption.title}</p>
                        <p className={mobileStyles.captionDescription}>{currentCaption.description}</p>
                    </div>
                ) : currentMedia?.caption ? (
                    <p className={mobileStyles.assetCaption} data-project-gallery-caption="">{localized(currentMedia.caption, locale)}</p>
                ) : null}
            </div>
        );
    }

    const frame = (
        <div
            className={`relative overflow-hidden border border-[#696A6D] bg-[#EFF0F3] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
            style={{
                ...frameStyle,
                outlineColor: accentColor,
            }}
            role="group"
            aria-label={t("{title} project gallery", { title: projectTitle })}
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
                    alt={localized(currentMedia.alt, locale)}
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
                    aria-label={t("{title} system preview", { title: projectTitle })}
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
                                aria-label={t("Show image {index} of {count}", { index: index + 1, count: media.length })}
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
                            aria-label={t("Show previous project image")}
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
                            aria-label={t("Show next project image")}
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

    if (!captions?.length) {
        return frame;
    }

    return (
        <div className={`min-w-0 ${captionClassName}`} data-project-gallery-figure="">
            {frame}

            {currentCaption ? (
                <div
                    className={`mt-3 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 transition-opacity duration-150 motion-reduce:transition-none ${
                        isChanging
                            ? "opacity-25"
                            : "opacity-100"
                    }`}
                    aria-live="polite"
                    data-project-gallery-caption=""
                >
                    <span className="font-mono text-[10px] font-black tracking-[0.05em] text-[#9A9BA0]">
                        {String(currentIndex + 1).padStart(2, "0")}
                    </span>

                    <p className="text-[11px] font-black uppercase leading-none tracking-[0.04em] text-[#1E1E1E]">
                        {currentCaption.title}
                    </p>

                    <p className="col-start-2 text-[12px] font-medium leading-[1.45] text-[#737377]">
                        {currentCaption.description}
                    </p>
                </div>
            ) : null}
        </div>
    );
}
