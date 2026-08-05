"use client";

import { useEffect } from "react";

const motionSelector = "[data-motion]";
const storySelector = "[data-story-section]";
const runtimeAttribute = "data-motion-runtime";
const sceneRuntimeAttribute = "data-scene-runtime";

function reveal(element: HTMLElement): void {
    element.dataset.motionState = "visible";
}

export default function MotionRuntime(): null {
    useEffect(() => {
        const root = document.documentElement;
        const elements = Array.from(
            document.querySelectorAll<HTMLElement>(
                motionSelector,
            ),
        );
        const scenes = Array.from(
            document.querySelectorAll<HTMLElement>(
                storySelector,
            ),
        );

        if (
            elements.length === 0 &&
            scenes.length === 0
        ) {
            return;
        }

        elements.forEach(reveal);
        root.setAttribute(runtimeAttribute, "ready");

        if (
            scenes.length === 0 ||
            !("IntersectionObserver" in window)
        ) {
            return () => {
                root.removeAttribute(runtimeAttribute);
            };
        }

        let activeSceneIndex = -1;

        const setActiveScene = (nextIndex: number) => {
            if (
                nextIndex === activeSceneIndex ||
                !scenes[nextIndex]
            ) {
                return;
            }

            activeSceneIndex = nextIndex;

            scenes.forEach((scene, index) => {
                scene.dataset.sceneState =
                    index < nextIndex
                        ? "past"
                        : index === nextIndex
                          ? "active"
                          : "future";
            });

            const activeStory =
                scenes[nextIndex].dataset.storySection ??
                String(nextIndex + 1);
            const progress =
                scenes.length > 1
                    ? nextIndex / (scenes.length - 1)
                    : 1;

            root.dataset.activeStory = activeStory;
            root.style.setProperty(
                "--story-index",
                String(nextIndex),
            );
            root.style.setProperty(
                "--story-progress",
                String(progress),
            );
        };

        const hashTarget = window.location.hash
            ? document.getElementById(
                  decodeURIComponent(
                      window.location.hash.slice(1),
                  ),
              )
            : null;
        const hashScene = hashTarget?.matches(
            storySelector,
        )
            ? hashTarget
            : hashTarget?.closest<HTMLElement>(
                  storySelector,
              );
        const hashSceneIndex = hashScene
            ? scenes.indexOf(hashScene)
            : -1;

        setActiveScene(
            hashSceneIndex >= 0 ? hashSceneIndex : 0,
        );

        const sceneObserver = new IntersectionObserver(
            (entries) => {
                const viewportCenter =
                    window.innerHeight / 2;
                let nextIndex = -1;
                let closestDistance =
                    Number.POSITIVE_INFINITY;

                for (const entry of entries) {
                    if (!entry.isIntersecting) {
                        continue;
                    }

                    const bounds = entry.boundingClientRect;
                    const sceneCenter =
                        bounds.top + bounds.height / 2;
                    const centerDistance = Math.abs(
                        sceneCenter - viewportCenter,
                    );

                    if (
                        centerDistance >= closestDistance
                    ) {
                        continue;
                    }

                    closestDistance = centerDistance;
                    nextIndex = scenes.indexOf(
                        entry.target as HTMLElement,
                    );
                }

                if (nextIndex >= 0) {
                    setActiveScene(nextIndex);
                }
            },
            {
                rootMargin: "-49% 0px -49% 0px",
                threshold: 0,
            },
        );

        scenes.forEach((scene) => {
            sceneObserver.observe(scene);
        });

        root.setAttribute(sceneRuntimeAttribute, "ready");

        return () => {
            sceneObserver.disconnect();

            scenes.forEach((scene) => {
                delete scene.dataset.sceneState;
            });

            root.removeAttribute(runtimeAttribute);
            root.removeAttribute(sceneRuntimeAttribute);
            delete root.dataset.activeStory;
            root.style.removeProperty("--story-index");
            root.style.removeProperty("--story-progress");
        };
    }, []);

    return null;
}
