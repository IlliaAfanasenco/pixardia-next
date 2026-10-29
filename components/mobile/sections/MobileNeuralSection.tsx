"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n/LocaleProvider";
import type { Dictionary } from "@/i18n/messages/en";
import { publicPath } from "@/i18n/navigation";
import styles from "./MobileNeuralSection.module.css";

type NeuralCopy = Dictionary["mobileNeural"];
const serviceIcons = ["window", "database", "brain", "window"] as const;

export default function MobileNeuralSection() {
    const { locale, dictionary } = useI18n();
    const copy = dictionary.mobileNeural;
    const sectionId = useId();
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const contactHref = publicPath(locale, siteConfig.links.contact);

    return (
        <section
            id="neural" data-mobile-section="neural"
            aria-labelledby={`${sectionId}-title`}
            className={styles.section}
        >
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h2 id={`${sectionId}-title`} className={styles.title}>
                <span>{copy.titleLine1}</span>
                <span>{copy.titleLine2}</span>
            </h2>
            <p className={styles.description}>{copy.description}</p>

            <div className={styles.core}>
                <div className={styles.coreDisc}>
                    <div className={styles.coreCopy}>
                        <p className={styles.coreEyebrow}>{copy.coreEyebrow}</p>
                        <p className={styles.coreTitle}>{copy.coreTitle}</p>
                        <p className={styles.coreSubtitle}>{copy.coreSubtitle}</p>
                    </div>
                    <div className={styles.mascot}>
                        <Image
                            src="/images/alien-core.png"
                            alt=""
                            fill
                            sizes="140px"
                            className="object-contain object-bottom"
                        />
                    </div>
                </div>
                <p className={styles.coreStatus}>
                    <span aria-hidden="true" />
                    {copy.coreStatus}
                </p>
            </div>

            <div className={styles.services}>
                {copy.services.map((service, index) => (
                    <ServiceCard
                        key={service.id}
                        id={`${sectionId}-${service.id}`}
                        service={service}
                        icon={serviceIcons[index]}
                        copy={copy}
                        contactHref={contactHref}
                        expanded={expandedId === service.id}
                        onToggle={() => setExpandedId((current) => current === service.id ? null : service.id)}
                    />
                ))}
            </div>
        </section>
    );
}

function ServiceCard({ id, service, icon, copy, contactHref, expanded, onToggle }: {
    id: string;
    service: NeuralCopy["services"][number];
    icon: (typeof serviceIcons)[number];
    copy: NeuralCopy;
    contactHref: string;
    expanded: boolean;
    onToggle: () => void;
}) {
    return (
        <article className={styles.card} data-expanded={expanded}>
            <h3>
                <button
                    type="button"
                    id={`${id}-trigger`}
                    aria-labelledby={`${id}-title`}
                    aria-expanded={expanded}
                    aria-controls={`${id}-panel`}
                    onClick={onToggle}
                    className={styles.trigger}
                >
                    <span className={styles.identifier}>{service.identifier}</span>
                    <span className={styles.serviceHeading}>
                        <ModuleIcon type={icon} />
                        <span id={`${id}-title`} className={styles.serviceTitle}>{service.title}</span>
                        <span className={styles.arrow} aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </span>
                    </span>
                    <span className={styles.serviceDescription}>{service.description}</span>
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
                        <h4 className={styles.introduction}>{service.introduction}</h4>
                        <p className={styles.expandedDescription}>{service.expandedDescription}</p>
                        <h5 className={styles.label}>{copy.whatWeBuild}</h5>
                        <ul className={styles.builds}>
                            {service.builds.map((build) => (
                                <li key={build}>
                                    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                                        <path d="m3 8 3 3 7-7" />
                                    </svg>
                                    <span>{build}</span>
                                </li>
                            ))}
                        </ul>
                        {service.technologies && (
                            <>
                                <h5 className={styles.label}>{copy.technologies}</h5>
                                <ul className={styles.technologies}>
                                    {service.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                                </ul>
                            </>
                        )}
                        <div className={styles.contact}>
                            <h5>{copy.ctaHeading}</h5>
                            <p>{copy.ctaDescription}</p>
                            <Link href={contactHref} className={styles.contactButton}>{copy.ctaButton}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

function ModuleIcon({
                        type,
                    }: {
    type: "window" | "database" | "brain" | "shield";
}) {
    if (type === "window") {
        return (
            <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className={styles.serviceIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <rect x="8" y="14" width="24" height="25" rx="2"/>
                <rect x="15" y="8" width="24" height="25" rx="2"/>
                <path d="M20 17h1"/>
            </svg>
        );
    }

    if (type === "database") {
        return (
            <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className={styles.serviceIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <ellipse cx="24" cy="12" rx="14" ry="6"/>
                <path d="M10 12v10c0 3 6 6 14 6s14-3 14-6V12"/>
                <path d="M10 22v10c0 3 6 6 14 6s14-3 14-6V22"/>
            </svg>
        );
    }

    if (type === "brain") {
        return (
            <svg
                aria-hidden="true"
                viewBox="0 0 48 48"
                className={styles.serviceIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M20 8c-4 0-7 3-7 7-3 1-5 4-5 7s2 6 5 7c0 5 3 8 7 8 2 0 4-1 5-3V11c-1-2-3-3-5-3Z"/>
                <path d="M28 8c4 0 7 3 7 7 3 1 5 4 5 7s-2 6-5 7c0 5-3 8-7 8-2 0-4-1-5-3V11c1-2 3-3 5-3Z"/>
            </svg>
        );
    }

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 48 48"
            className={styles.serviceIcon}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M24 7 38 12v10c0 10-6 16-14 20-8-4-14-10-14-20V12l14-5Z"/>
            <path d="M24 16v16M18 24h12"/>
        </svg>
    );
}
