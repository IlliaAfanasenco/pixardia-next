"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/i18n/LocaleProvider";
import type { Project } from "@/types/services";
import MobileProjectContent from "./MobileProjectContent";
import styles from "./MobileProjectModal.module.css";

type MobileProjectModalProps = {
    project: Project;
    trigger: HTMLElement;
    onClose: () => void;
};

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The browser's modal top layer makes the mounted page inert, including its header. */
export default function MobileProjectModal({ project, trigger, onClose }: MobileProjectModalProps) {
    const { t } = useI18n();
    const id = useId();
    const titleId = `${id}-title`;
    const summaryId = `${id}-summary`;
    const dialogRef = useRef<HTMLDialogElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closingRef = useRef(false);
    const [phase, setPhase] = useState<"opening" | "open" | "closing">("opening");

    const close = useCallback(() => {
        if (closingRef.current) return;
        closingRef.current = true;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            onClose();
            return;
        }
        setPhase("closing");
        closeTimer.current = setTimeout(onClose, 360);
    }, [onClose]);

    useLayoutEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const root = document.documentElement;
        const body = document.body;
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;
        const scrollbarWidth = window.innerWidth - root.clientWidth;
        // Restore only the inline properties we own, including their priorities.
        const lock = (element: HTMLElement, properties: Record<string, string>) => {
            const previous = Object.keys(properties).map((property) => ({
                property,
                value: element.style.getPropertyValue(property),
                priority: element.style.getPropertyPriority(property),
            }));
            for (const [property, value] of Object.entries(properties)) element.style.setProperty(property, value);
            return () => {
                for (const { property, value, priority } of previous) {
                    if (value) element.style.setProperty(property, value, priority);
                    else element.style.removeProperty(property);
                }
            };
        };
        const releaseRoot = lock(root, { overflow: "hidden", "overscroll-behavior": "none" });
        // Fixed positioning also locks Safari when the address bar changes height.
        const releaseBody = lock(body, {
            position: "fixed", top: `-${scrollY}px`, left: `-${scrollX}px`, right: "0",
            width: "100%", overflow: "hidden", "overscroll-behavior": "none",
            ...(scrollbarWidth > 0 ? { "padding-right": `${scrollbarWidth}px` } : {}),
        });

        dialog.showModal();
        closeRef.current?.focus({ preventScroll: true });

        return () => {
            dialog.close();
            releaseBody();
            releaseRoot();
            window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
            if (trigger.isConnected) trigger.focus({ preventScroll: true });
        };
    }, [trigger]);

    useEffect(() => {
        const timer = setTimeout(() => setPhase((current) => current === "opening" ? "open" : current), 520);
        return () => {
            clearTimeout(timer);
            if (closeTimer.current) clearTimeout(closeTimer.current);
        };
    }, []);

    function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
        if (event.key !== "Tab") return;
        const dialog = dialogRef.current;
        if (!dialog) return;
        const controls = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
            .filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
            event.preventDefault();
            first?.focus();
        }
    }

    return createPortal(
        <dialog
            ref={dialogRef}
            className={styles.dialog}
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            onCancel={(event) => { event.preventDefault(); close(); }}
            onKeyDown={trapFocus}
            data-mobile-project-modal=""
            data-state={phase}
        >
            <div className={styles.scroll} data-mobile-project-scroll="" data-lenis-prevent="">
                <header className={styles.header} data-mobile-project-header="">
                    <span className={styles.label}><strong>PX</strong><span aria-hidden="true">/</span>{t("Project Archive")}</span>
                    <button ref={closeRef} type="button" className={styles.close} aria-label={t("Close project dialog")} onClick={close}>
                        <span>[ {t("Close")} ]</span><span className={styles.cross} aria-hidden="true">×</span>
                    </button>
                </header>
                <MobileProjectContent project={project} titleId={titleId} summaryId={summaryId} />
            </div>
        </dialog>,
        document.body,
    );
}
