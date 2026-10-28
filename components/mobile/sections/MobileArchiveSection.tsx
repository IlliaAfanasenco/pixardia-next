"use client";

import { useCallback, useId, useState, useSyncExternalStore } from "react";
import ArchiveCard from "@/components/archive/ArchiveCard";
import { getArchiveProjects } from "@/components/archive/archive-projects";
import { useI18n } from "@/i18n/LocaleProvider";
import styles from "@/components/archive/archive.module.css";
import MobileProjectModal from "@/components/mobile/projects/MobileProjectModal";
import type { Project } from "@/types/services";

const projects = getArchiveProjects();
const wideLayoutQuery = "(min-width: 768px)";

function subscribeToWideLayout(onChange: () => void) {
    const query = window.matchMedia(wideLayoutQuery);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
}

function getWideLayoutSnapshot() {
    return window.matchMedia(wideLayoutQuery).matches;
}

function getServerSnapshot() {
    return false;
}

export default function MobileArchiveSection() {
    const { locale, t } = useI18n();
    const [visibleCount, setVisibleCount] = useState(1);
    const [activeCase, setActiveCase] = useState<{ project: Project; trigger: HTMLElement } | null>(null);
    const closeCase = useCallback(() => setActiveCase(null), []);
    const isWideLayout = useSyncExternalStore(subscribeToWideLayout, getWideLayoutSnapshot, getServerSnapshot);
    const listId = useId();
    const shownCount = isWideLayout ? projects.length : visibleCount;

    return (
        <section
            data-mobile-section="archive"
            className={`${styles.mobileArchive} relative w-full px-5 pb-7 pt-5`}
        >
            <p className="text-[9px] font-medium uppercase">
                {t("05 / SELECTED DIGITAL WORK")}
            </p>

            <h2 className="mt-1 uppercase leading-[0.88] tracking-[-0.05em]">
                <span className="block text-[46px] font-black text-[#5848ff]">
                    {t("Digital")}
                </span>
                <span className="block text-[46px] font-black text-[#bfc0c2]">
                    {t("Archive")}
                </span>
            </h2>

            <div id={listId} className="mt-6 grid min-w-0 gap-4">
                {projects.slice(0, shownCount).map((entry, index) => (
                    <ArchiveCard
                        key={entry.project.slug}
                        {...entry}
                        locale={locale}
                        index={index}
                        animatedPreview
                        onOpen={(trigger) => setActiveCase({ project: entry.project, trigger })}
                    />
                ))}
            </div>

            {!isWideLayout && visibleCount < projects.length && (
                <button
                    type="button"
                    aria-controls={listId}
                    onClick={() => setVisibleCount((count) => Math.min(count + 1, projects.length))}
                    className="mt-4 flex min-h-[88px] w-full items-center gap-3 rounded-[10px] bg-[#151515] px-3 text-white transition-transform duration-150 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5848ff] motion-reduce:transition-none"
                >
                    <span className="min-w-0 flex-1 text-left text-[clamp(16px,4.7vw,22px)] font-black uppercase">
                        {t("Show more")}
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-[32px] font-light leading-none text-[#9488ff]">→</span>
                </button>
            )}
            {activeCase && <MobileProjectModal key={activeCase.project.slug} {...activeCase} onClose={closeCase} />}
        </section>
    );
}
