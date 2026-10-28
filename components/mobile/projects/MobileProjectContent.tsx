"use client";

import type { CSSProperties, ReactNode } from "react";
import { getArchiveProjects } from "@/components/archive/archive-projects";
import { projectClassificationLabels, projectStatusLabels, projectTypeLabels } from "@/content/projects";
import ProjectModalGallery from "@/features/projects/ProjectModalGallery";
import { useI18n } from "@/i18n/LocaleProvider";
import { localized } from "@/i18n/localized";
import { publicPath } from "@/i18n/navigation";
import type { Project, ProjectQualitySignal } from "@/types/services";
import styles from "./MobileProjectContent.module.css";

type MobileProjectContentProps = {
    project: Project;
    titleId: string;
    summaryId: string;
};

const evidenceLabels: Record<ProjectQualitySignal["evidence"], string> = {
    verified: "Verified",
    target: "Target",
    not_measured: "Not measured",
};

function ContentSection({ title, children, id }: { title: string; children: ReactNode; id: string }) {
    return (
        <section className={styles.section} aria-labelledby={id}>
            <h2 id={id} className={styles.sectionTitle}>{title}</h2>
            {children}
        </section>
    );
}

export default function MobileProjectContent({ project, titleId, summaryId }: MobileProjectContentProps) {
    const { locale, t } = useI18n();
    const record = project.caseStudy;
    const archive = getArchiveProjects();
    const ordinal = archive.findIndex((entry) => entry.project.slug === project.slug) + 1;
    const titleMeasure = Math.max(...project.title.split(/\s+/).map((word) => word.length)) * 0.72;
    const media = record.gallery?.length
        ? record.gallery.map((slide) => slide.media)
        : [...(project.coverImage ? [project.coverImage] : []), ...project.images];
    const captions = record.gallery?.map((slide) => ({
        title: localized(slide.title, locale),
        description: localized(slide.description, locale),
    }));
    const category = record.category ?? projectTypeLabels[project.type];
    const status = localized(projectStatusLabels[project.status], locale);
    const client = record.clientProfile?.name ?? record.client;
    const classification = record.classification ? localized(projectClassificationLabels[record.classification], locale) : null;
    const links = [
        ...(record.clientProfile?.website ? [{ href: record.clientProfile.website, label: `${t("Website")} ↗` }] : []),
        ...(project.liveUrl ? [{ href: project.liveUrl, label: t("Live project ↗") }] : []),
        ...(project.repositoryUrl ? [{ href: project.repositoryUrl, label: t("Repository ↗") }] : []),
        ...(record.links?.map((link) => ({ href: link.href, label: localized(link.label, locale) })) ?? []),
    ];

    return (
        <article className={styles.content} data-mobile-project-content="" data-project-slug={project.slug}>
            <div className={styles.identifier}>
                <p><span aria-hidden="true" />{t("Case_Identifier:")} {record.identifier}</p>
                <span>{String(ordinal).padStart(2, "0")} / {String(archive.length).padStart(2, "0")}</span>
            </div>

            <div className={styles.gallery}>
                <ProjectModalGallery
                    key={project.slug}
                    projectKey={project.slug}
                    projectTitle={project.title}
                    media={media}
                    captions={captions}
                    imageLabel={t("Project views")}
                    primaryColor="#111111"
                    accentColor="#5E56E7"
                    surfaceColor="#111111"
                    presentation="mobile"
                />
            </div>

            <div className={styles.editorial}>
                <header className={styles.introduction}>
                    <span className={styles.accentRule} aria-hidden="true" />
                    <h1 id={titleId} className={styles.title} style={{ "--title-measure": titleMeasure } as CSSProperties}>{project.title}</h1>
                    <p className={styles.category}>{localized(category, locale)}</p>
                    <p id={summaryId} className={styles.tagline}>{localized(record.subtitle, locale)}</p>

                    {(record.role || record.engagement) && (
                        <dl className={styles.introMeta}>
                            {record.role && <div><dt>{t("Role")}</dt><dd>{localized(record.role, locale)}</dd></div>}
                            {record.engagement && <div><dt>{t("Engagement")}</dt><dd>{localized(record.engagement, locale)}</dd></div>}
                        </dl>
                    )}

                    {record.commercialCta && (
                        <a className={styles.cta} href={publicPath(locale, record.commercialCta.href)} data-project-commercial-cta="">
                            {localized(record.commercialCta.label, locale)}
                        </a>
                    )}
                    {links.length > 0 && <div className={styles.links}>{links.map((link) => (
                        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
                    ))}</div>}
                </header>

                <div className={styles.sections}>
                    <ContentSection id={`${titleId}-overview`} title={t("Project overview")}>
                        <p className={styles.copy} data-project-overview="">{localized(project.description, locale)}</p>
                        {(project.challenge || project.solution) && <div className={styles.narrative}>
                            {project.challenge && <div><h3>{t("Challenge")}</h3><p className={styles.copy}>{localized(project.challenge, locale)}</p></div>}
                            {project.solution && <div><h3>{t("Solution")}</h3><p className={styles.copy}>{localized(project.solution, locale)}</p></div>}
                        </div>}
                    </ContentSection>

                    {(record.capabilities?.length || record.featureGroups?.length) ? (
                        <ContentSection id={`${titleId}-capabilities`} title={t("Product capabilities")}>
                            {record.capabilities?.length ? <ul className={styles.featureList} data-project-capabilities="">
                                {record.capabilities.map((capability) => <li key={capability.en}>{localized(capability, locale)}</li>)}
                            </ul> : null}
                            {record.featureGroups?.length ? <div className={styles.featureGroups} data-project-feature-groups="">
                                {record.featureGroups.map((group) => <div key={group.label.en}>
                                    <h3>{localized(group.label, locale)}</h3>
                                    <ul className={styles.featureList}>{group.items.map((item) => <li key={item.en}>{localized(item, locale)}</li>)}</ul>
                                </div>)}
                            </div> : null}
                            {record.capabilitiesNote && <p className={styles.note}>{localized(record.capabilitiesNote, locale)}</p>}
                        </ContentSection>
                    ) : null}

                    {record.scope?.length ? <ContentSection id={`${titleId}-scope`} title={t("Project scope")}>
                        <ul className={styles.tags} data-project-scope="">{record.scope.map((item) => <li key={item.en}>{localized(item, locale)}</li>)}</ul>
                    </ContentSection> : null}

                    {record.architecture && <ContentSection id={`${titleId}-architecture`} title={t("Engine & Logic")}>
                        <p className={styles.copy}>{localized(record.architecture, locale)}</p>
                    </ContentSection>}

                    {(record.technologyGroups?.some((group) => group.items.length) || project.technologies.length > 0) && (
                        <ContentSection id={`${titleId}-technology`} title={t(record.classification === "studio_concept" ? "Proposed stack" : "Technology groups")}>
                            {record.technologyGroups?.some((group) => group.items.length) ? (
                                <div className={styles.technologyGroups}>{record.technologyGroups.filter((group) => group.items.length).map((group) => (
                                    <div key={group.label.en}><h3>{localized(group.label, locale)}</h3><ul className={styles.tags}>{group.items.map((item) => <li key={item} data-project-technology="">{item}</li>)}</ul></div>
                                ))}</div>
                            ) : <ul className={styles.tags}>{project.technologies.map((technology) => <li key={technology} data-project-technology="">{technology}</li>)}</ul>}
                        </ContentSection>
                    )}

                    {(record.visualSystem.colors.length > 0 || record.visualSystem.typeface) && <ContentSection id={`${titleId}-dna`} title={t("Visual DNA")}>
                        <div className={styles.colors}>{record.visualSystem.colors.map((color) => <div key={color.value}>
                            <span className={styles.swatch} style={{ backgroundColor: color.value }} aria-label={`${localized(color.label, locale)} ${color.value}`} />
                            <p>{localized(color.label, locale)}<strong>{color.value}</strong></p>
                        </div>)}</div>
                        {record.visualSystem.typeface && <div className={styles.typeface}><p>{t("Typeface")}</p><strong>{record.visualSystem.typeface}</strong></div>}
                    </ContentSection>}

                    {record.results?.length ? <ContentSection id={`${titleId}-results`} title={t("Verified results")}>
                        <dl className={styles.facts} data-project-results="">{record.results.map((result) => <div key={result.label.en}>
                            <dt>{localized(result.label, locale)}</dt><dd>{localized(result.value, locale)}<span className={styles.evidence}>{t("Verified")}</span>{result.source && <small>{localized(result.source, locale)}</small>}</dd>
                        </div>)}</dl>
                    </ContentSection> : null}

                    {record.qualitySignals?.length ? <ContentSection id={`${titleId}-quality`} title={t("Quality signals")}>
                        <dl className={styles.facts}>{record.qualitySignals.map((signal) => <div key={signal.label.en}>
                            <dt>{localized(signal.label, locale)}</dt><dd>{localized(signal.value, locale)}<span className={styles.evidence}>{t(evidenceLabels[signal.evidence])}</span></dd>
                        </div>)}</dl>
                    </ContentSection> : null}

                    {(record.facts?.length || client || classification || record.clientProfile?.industry || record.clientProfile?.region) ? <ContentSection id={`${titleId}-record`} title={t("Project record")}>
                        <dl className={styles.facts}>
                            {classification && <div><dt>{t("Category")}</dt><dd>{classification}</dd></div>}
                            {client && <div><dt>{t("Client")}</dt><dd>{client}</dd></div>}
                            {record.clientProfile?.industry && <div><dt>{t("Industry")}</dt><dd>{localized(record.clientProfile.industry, locale)}</dd></div>}
                            {record.clientProfile?.region && <div><dt>{t("Region")}</dt><dd>{localized(record.clientProfile.region, locale)}</dd></div>}
                            {record.facts?.map((fact) => <div key={fact.label.en}><dt>{localized(fact.label, locale)}</dt><dd>{localized(fact.value, locale)}</dd></div>)}
                        </dl>
                    </ContentSection> : null}
                </div>

                <footer className={styles.footer}>
                    <p>{t("Archive status:")} {status}<br />{t("Record:")} {record.identifier}<br />{project.year}</p>
                    <span aria-hidden="true">P</span>
                </footer>
            </div>
        </article>
    );
}
