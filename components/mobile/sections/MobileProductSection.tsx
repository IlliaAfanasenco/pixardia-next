"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/LocaleProvider";
import type { Dictionary } from "@/i18n/messages/en";
import { publicPath } from "@/i18n/navigation";
import styles from "./MobileProductSection.module.css";

type ProductCopy = Dictionary["mobileProduct"];
const stageIcons = ["lightbulb", "pen", "code", "rocket"] as const;

export default function MobileProductSection() {
    const { locale, dictionary } = useI18n();
    const copy = dictionary.mobileProduct;
    const sectionId = useId();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <section
            data-mobile-section="product"
            aria-labelledby={`${sectionId}-title`}
            className={styles.section}
        >
            <div aria-hidden="true" className={styles.astronaut} />
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id={`${sectionId}-title`} className={styles.title}>
                <span>{copy.titleLine1}</span>
                <span>{copy.titleLine2}</span>
            </h2>
            <p className={styles.description}>{copy.description}</p>

            <ol className={styles.timeline}>
                {copy.stages.map((stage, index) => (
                    <TimelineCard
                        key={stage.id}
                        id={`${sectionId}-${stage.id}`}
                        number={String(index + 1).padStart(2, "0")}
                        icon={stageIcons[index]}
                        stage={stage}
                        copy={copy}
                        expanded={expandedId === stage.id}
                        onToggle={() => setExpandedId((current) => current === stage.id ? null : stage.id)}
                    />
                ))}
            </ol>

            <div className={styles.cta}>
                <p className={styles.ctaLabel}>{copy.ctaLabel}</p>
                <h3 className={styles.ctaTitle}>
                    <span>{copy.ctaTitleLine1}</span>
                    <span>{copy.ctaTitleLine2}</span>
                </h3>
                <Link
                    href={publicPath(locale, siteConfig.links.contact)}
                    aria-label={copy.ctaButton}
                    className={styles.ctaButton}
                >
                    <span>{copy.ctaButton.replace(/\s*→$/, "")}</span>
                    <span className={styles.ctaArrow} aria-hidden="true">→</span>
                </Link>
            </div>
        </section>
    );
}

function TimelineCard({ id, number, icon, stage, copy, expanded, onToggle }: {
    id: string;
    number: string;
    icon: (typeof stageIcons)[number];
    stage: ProductCopy["stages"][number];
    copy: ProductCopy;
    expanded: boolean;
    onToggle: () => void;
}) {
    return (
        <li className={styles.stage} data-expanded={expanded}>
            <span className={styles.number} aria-hidden="true">{number}</span>
            <article className={styles.card}>
                <h3>
                    <button
                        id={`${id}-trigger`}
                        type="button"
                        aria-labelledby={`${id}-title`}
                        aria-expanded={expanded}
                        aria-controls={`${id}-panel`}
                        onClick={onToggle}
                        className={styles.trigger}
                    >
                        <span className={styles.identifier}>{stage.identifier}</span>
                        <span className={styles.cardHeading}>
                            <StageIcon type={icon} />
                            <span id={`${id}-title`} className={styles.cardTitle}>{stage.title}</span>
                            <span className={styles.arrow} aria-hidden="true">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </span>
                        </span>
                        <span className={styles.cardDescription}>{stage.description}</span>
                    </button>
                </h3>
                <div
                    id={`${id}-panel`}
                    role="region"
                    aria-labelledby={`${id}-trigger`}
                    aria-hidden={!expanded}
                    inert={!expanded}
                    className={styles.panel}
                >
                    <div className={styles.panelClip}>
                        <div className={styles.panelContent}>
                            <h4 className={styles.introduction}>{stage.introduction}</h4>
                            <p className={styles.expandedDescription}>{stage.expandedDescription}</p>
                            <h5 className={styles.label}>{copy.whatYouGet}</h5>
                            <ul className={styles.features}>
                                {stage.features.map((feature) => (
                                    <li key={feature}>
                                        <CheckIcon />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.deliverableDivider}>
                                <div className={styles.deliverable}>
                                    <CheckIcon />
                                    <div>
                                        <h5 className={styles.deliverableLabel}>{copy.deliverable}</h5>
                                        <p>{stage.deliverable}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </li>
    );
}

function CheckIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="m3 8 3 3 7-7" />
        </svg>
    );
}

function StageIcon({ type }: { type: (typeof stageIcons)[number] }) {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.stageIcon}>
            {type === "lightbulb" && <><path d="M8 15a6 6 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z" /><path d="M9 21h6M10 18v3m4-3v3" /></>}
            {type === "pen" && <><path d="m12 3 8 8-5 9-6-5-5-6 8-6Z" /><path d="m12 3-1 6m9 2-6 1m-5 3-6 6" /><circle cx="12" cy="12" r="2" /></>}
            {type === "code" && <><path d="m7 7-5 5 5 5m10-10 5 5-5 5M14 4l-4 16" /></>}
            {type === "rocket" && <><path d="M9 15 7 9c4-6 10-7 14-6 1 4 0 10-6 14l-6-2Z" /><path d="M7 9 3 10l-1 5 7-1m6 3-1 5-5 1 1-7M5 18l-2 3" /><circle cx="16" cy="8" r="2" /></>}
        </svg>
    );
}
