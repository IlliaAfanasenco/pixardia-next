import { publicPath } from "@/i18n/navigation";
import { localized } from "@/i18n/localized";
import type { SiteLocale } from "@/i18n/config";
import { translator } from "@/i18n/getDictionary";
import type {
    CSSProperties,
    ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";

import {
    projectClassificationLabels,
    projectStatusLabels,
    projectTypeLabels,
    projects,
} from "@/content/projects";
import type {
    Project,
    ProjectMediaAsset,
    ProjectQualitySignal,
} from "@/types/services";
import ProjectModalGallery from "@/features/projects/ProjectModalGallery";
import modalStyles from "@/features/projects/ProjectModalCaseStudy.module.css";

type ProjectCaseStudyProps = {
    locale: SiteLocale;
    project: Project;
    titleId: string;
    summaryId: string;
    variant: "page" | "modal";
};

type Evidence = ProjectQualitySignal["evidence"];

const evidenceLabels: Record<Evidence, string> = {
    verified: "Verified",
    target: "Target",
    not_measured: "Not measured",
};

/** Typed gallery slides take precedence; legacy records keep cover + images. */
function caseStudyMedia(project: Project): ProjectMediaAsset[] {
    if (project.caseStudy.gallery?.length) {
        return project.caseStudy.gallery.map(
            (slide) => slide.media,
        );
    }

    return [
        ...(project.coverImage
            ? [project.coverImage]
            : []),
        ...project.images,
    ];
}

function classificationLabel(project: Project) {
    const classification =
        project.caseStudy.classification;

    return classification
        ? projectClassificationLabels[classification]
        : undefined;
}

const evidenceStyles: Record<Evidence, string> = {
    verified:
        "border-[#79B991] bg-[#EFF8F2] text-[#4F7D60]",
    target:
        "border-[#A8A2E2] bg-[#F3F2FC] text-[#625CB4]",
    not_measured:
        "border-[#D0D0D3] bg-[#F3F3F3] text-[#77787D]",
};

export default function ProjectCaseStudy({ locale,
                                             project,
                                             titleId,
                                             summaryId,
                                             variant,
                                         }: ProjectCaseStudyProps) {
    const t = translator(locale);
    const typeLabel =
        localized(classificationLabel(project) ?? projectTypeLabels[project.type], locale);

    const statusLabel =
        localized(projectStatusLabels[project.status], locale);

    if (variant === "modal") {
        return (
            <ProjectModalCaseStudy locale={locale}
                                   project={project}
                                   titleId={titleId}
                                   summaryId={summaryId}
                                   statusLabel={statusLabel}
            />
        );
    }

    const media = caseStudyMedia(project);

    const clientName =
        project.caseStudy.clientProfile?.name ??
        project.caseStudy.client;

    const galleryCaptions =
        project.caseStudy.gallery;

    const currentIndex =
        projects.findIndex(
            (candidate) =>
                candidate.slug === project.slug,
        );

    const nextProject =
        currentIndex >= 0
            ? projects[
            (currentIndex + 1) %
            projects.length
                ]
            : undefined;

    return (
        <article
            className="container-custom py-10 sm:py-14"
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            data-project-case-study=""
            data-project-case-study-variant={variant}
        >
            <div
                className="overflow-hidden border border-[#CECED1] bg-[#F5F5F3]"
            >
                <header className="border-b border-[#D2D2D4] bg-[#ECECEA] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge dark>
                            {typeLabel}
                        </Badge>

                        <Badge>
                            {project.year}
                        </Badge>

                        <Badge success>
                            {statusLabel}
                        </Badge>

                        <span className="ml-auto hidden font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[#88898D] sm:block">
                            {
                                project
                                    .caseStudy
                                    .identifier
                            }
                        </span>
                    </div>

                    <h1
                        id={titleId}
                        className="mt-6 max-w-[900px] break-words text-[clamp(40px,7vw,82px)] font-black uppercase leading-[0.87] tracking-[-0.045em] text-[#1E1E1E] [overflow-wrap:anywhere]"
                    >
                        {project.title}
                    </h1>

                    <p
                        id={summaryId}
                        className="mt-7 max-w-[740px] text-[clamp(16px,2vw,20px)] font-semibold leading-[1.4] text-[#55565A]"
                    >
                        {
                            localized(project
                                .caseStudy
                                .subtitle, locale)
                        }
                    </p>

                    <div className="mt-8 grid gap-px border border-[#CECED0] bg-[#CECED0] sm:grid-cols-2">
                        {project.caseStudy.engagement ? <Meta locale={locale}
                              label={t("Engagement")}
                              value={
                                  localized(project
                                      .caseStudy
                                      .engagement, locale)
                              }
                        /> : null}

                        {project.caseStudy.role ? <Meta locale={locale}
                              label={t("Role")}
                              value={
                                  localized(project
                                      .caseStudy
                                      .role, locale)
                              }
                        /> : null}

                        {clientName ? (
                            <Meta locale={locale} label={t("Client")} value={clientName} />
                        ) : null}

                        {project.caseStudy.clientProfile?.industry ? (
                            <Meta locale={locale} label={t("Industry")} value={localized(project.caseStudy.clientProfile.industry, locale)} />
                        ) : null}

                        {project.caseStudy.clientProfile?.region ? (
                            <Meta locale={locale} label={t("Region")} value={localized(project.caseStudy.clientProfile.region, locale)} />
                        ) : null}

                        {project.caseStudy.category ? (
                            <Meta locale={locale} label={t("Category")} value={localized(project.caseStudy.category, locale)} />
                        ) : null}

                        <Meta locale={locale}
                              label={t("Status")}
                              value={statusLabel}
                        />

                        <Meta locale={locale}
                              label={t("Record")}
                              value={
                                  project
                                      .caseStudy
                                      .identifier
                              }
                        />
                    </div>
                </header>

                <div className="space-y-5 px-5 py-5 sm:px-8 sm:py-8 lg:px-10">
                    <section
                        className="grid gap-6 border border-[#D5D5D7] bg-white p-5 sm:p-7 lg:grid-cols-[0.75fr_1.25fr]"
                        aria-labelledby={`${titleId}-overview`}
                    >
                        <div>
                            <Eyebrow>
                                {t("01 / Context")}
                            </Eyebrow>

                            <Heading
                                id={`${titleId}-overview`}
                            >
                                {t("Project overview")}
                            </Heading>
                        </div>

                        <p className="max-w-[680px] text-[15px] font-medium leading-[1.65] text-[#57585C]">
                            {localized(project.description, locale)}
                        </p>
                    </section>

                    {(project.challenge || project.solution) ? <section
                        className="grid gap-px border border-[#D5D5D7] bg-[#D5D5D7] lg:grid-cols-2"
                        aria-label={t("Challenge and solution")}
                    >
                        {project.challenge ? <NarrativePanel locale={locale}
                                        eyebrow="02 / Challenge"
                                        title={t("Challenge")}
                        >
                            {
                                localized(project
                                    .challenge, locale)
                            }
                        </NarrativePanel> : null}

                        {project.solution ? <NarrativePanel locale={locale}
                                        eyebrow="03 / Solution"
                                        title={t("Solution")}
                        >
                            {
                                localized(project
                                    .solution, locale)
                            }
                        </NarrativePanel> : null}
                    </section> : null}

                    {project.caseStudy.capabilities?.length ? (
                        <section className="border border-[#D5D5D7] bg-white p-5 sm:p-7" aria-labelledby={`${titleId}-capabilities`}>
                            <SectionTitle locale={locale} id={`${titleId}-capabilities`} eyebrow={t(project.type === "concept" ? "Concept overview" : "Project overview")}>
                                {t("Product capabilities")}
                            </SectionTitle>
                            <Capabilities locale={locale} project={project} className="mt-6 grid gap-3 sm:grid-cols-2" />
                        </section>
                    ) : null}

                    {project.caseStudy.featureGroups?.length ? (
                        <section className="border border-[#D5D5D7] bg-white p-5 sm:p-7" aria-labelledby={`${titleId}-features`}>
                            <SectionTitle locale={locale} id={`${titleId}-features`} eyebrow={t(project.type === "concept" ? "Concept overview" : "Project overview")}>
                                {t("Product capabilities")}
                            </SectionTitle>
                            <FeatureGroups locale={locale} project={project} className="mt-6 grid gap-6 sm:grid-cols-2" />
                            {!project.caseStudy.capabilities?.length && project.caseStudy.capabilitiesNote ? (
                                <p className="mt-5 text-[11px] font-medium leading-[1.5] text-[#737377]">
                                    {localized(project.caseStudy.capabilitiesNote, locale)}
                                </p>
                            ) : null}
                        </section>
                    ) : null}

                    {project.caseStudy.scope?.length ? (
                        <section className="border border-[#D5D5D7] bg-white p-5 sm:p-7" aria-labelledby={`${titleId}-scope`}>
                            <SectionTitle locale={locale} id={`${titleId}-scope`} eyebrow={t("Deliverables")}>
                                {t("Project scope")}
                            </SectionTitle>
                            <ScopeList locale={locale} project={project} className="mt-6" />
                        </section>
                    ) : null}

                    {project.caseStudy.results?.length ? (
                        <section className="border border-[#D5D5D7] bg-white p-5 sm:p-7" aria-labelledby={`${titleId}-results`}>
                            <SectionTitle locale={locale} id={`${titleId}-results`} eyebrow={t("Evidence")}>
                                {t("Verified results")}
                            </SectionTitle>
                            <Results locale={locale} project={project} className="mt-6 grid gap-px border border-[#D8D8DA] bg-[#D8D8DA] sm:grid-cols-3" />
                        </section>
                    ) : null}

                    {project.caseStudy.architecture ? <section
                        className="grid gap-6 border border-[#D5D5D7] bg-[#1D1E21] p-5 text-white sm:p-7 lg:grid-cols-[0.7fr_1.3fr]"
                        aria-labelledby={`${titleId}-architecture`}
                    >
                        <div>
                            <Eyebrow dark>
                                {t("04 / Architecture")}
                            </Eyebrow>

                            <Heading
                                id={`${titleId}-architecture`}
                                dark
                            >
                                {t("System structure")}
                            </Heading>
                        </div>

                        <p className="max-w-[700px] text-[15px] font-medium leading-[1.65] text-white/70">
                            {
                                localized(project
                                    .caseStudy
                                    .architecture, locale)
                            }
                        </p>
                    </section> : null}

                    {project.caseStudy.facts?.length ? <section
                        className="border border-[#D5D5D7] bg-white p-5 sm:p-7"
                        aria-labelledby={`${titleId}-facts`}
                    >
                        <SectionTitle locale={locale}
                                      id={`${titleId}-facts`}
                                      eyebrow="05 / Facts"
                        >
                            {t("Project record")}
                        </SectionTitle>

                        <div className="mt-6 grid gap-px border border-[#D8D8DA] bg-[#D8D8DA] sm:grid-cols-3">
                            {project.caseStudy.facts.map(
                                (fact) => (
                                    <div
                                        key={
                                            localized(fact
                                                .label, locale)
                                        }
                                        className="min-w-0 bg-[#FAFAF9] p-5"
                                    >
                                        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#929398]">
                                            {
                                                localized(fact
                                                    .label, locale)
                                            }
                                        </span>

                                        <strong className="mt-3 block text-sm font-bold leading-[1.35] text-[#343437]">
                                            {
                                                localized(fact
                                                    .value, locale)
                                            }
                                        </strong>
                                    </div>
                                ),
                            )}
                        </div>
                    </section> : null}

                    {project.caseStudy.technologyGroups?.some((group) => group.items.length) ? <section
                        className="border border-[#D5D5D7] bg-white p-5 sm:p-7"
                        aria-labelledby={`${titleId}-technology`}
                    >
                        <SectionTitle locale={locale}
                                      id={`${titleId}-technology`}
                                      eyebrow="06 / Technology"
                        >
                            {t("Technology groups")}
                        </SectionTitle>

                        <div className="mt-6 grid gap-4 lg:grid-cols-2">
                            {project.caseStudy.technologyGroups.filter((group) => group.items.length).map(
                                (group) => (
                                    <div
                                        key={
                                            localized(group
                                                .label, locale)
                                        }
                                        className="border border-[#D8D8DA] bg-[#FAFAF9] p-5"
                                    >
                                        <h3 className="text-xs font-black uppercase tracking-[0.08em] text-[#55565A]">
                                            {
                                                localized(group
                                                    .label, locale)
                                            }
                                        </h3>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {group.items.map(
                                                (
                                                    technology,
                                                ) => (
                                                    <span
                                                        key={
                                                            technology
                                                        }
                                                        className="border border-[#CDCDD0] bg-white px-3 py-2 text-[11px] font-bold leading-none text-[#454549]"
                                                    >
                                                        {
                                                            technology
                                                        }
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </section> : null}

                    {project.caseStudy.qualitySignals?.length ? <section
                        className="border border-[#D5D5D7] bg-white p-5 sm:p-7"
                        aria-labelledby={`${titleId}-quality`}
                    >
                        <SectionTitle locale={locale}
                                      id={`${titleId}-quality`}
                                      eyebrow="07 / Evidence"
                        >
                            {t("Quality signals")}
                        </SectionTitle>

                        <div className="mt-6 grid gap-3 lg:grid-cols-3">
                            {project.caseStudy.qualitySignals.map(
                                (signal) => (
                                    <div
                                        key={
                                            localized(signal
                                                .label, locale)
                                        }
                                        className="flex min-h-[145px] flex-col border border-[#D8D8DA] bg-[#FAFAF9] p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#76777B]">
                                                {
                                                    localized(signal
                                                        .label, locale)
                                                }
                                            </span>

                                            <span
                                                className={`shrink-0 border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.07em] ${evidenceStyles[signal.evidence]}`}
                                            >
                                                {
                                                    t(evidenceLabels[
                                                        signal
                                                            .evidence
                                                        ])
                                                }
                                            </span>
                                        </div>

                                        <strong className="mt-auto pt-7 text-base font-black leading-[1.15] text-[#303033]">
                                            {
                                                localized(signal
                                                    .value, locale)
                                            }
                                        </strong>
                                    </div>
                                ),
                            )}
                        </div>
                    </section> : null}

                    <section
                        className="border border-[#D5D5D7] bg-[#202124] p-5 text-white sm:p-7"
                        aria-labelledby={`${titleId}-visual`}
                    >
                        <SectionTitle locale={locale}
                                      id={`${titleId}-visual`}
                                      eyebrow="08 / Visual system"
                                      dark
                        >
                            {t("Interface language")}
                        </SectionTitle>

                        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.75fr]">
                            <div className="grid gap-3 sm:grid-cols-3">
                                {project.caseStudy.visualSystem.colors.map(
                                    (color) => (
                                        <div
                                            key={
                                                color
                                                    .value
                                            }
                                            className="border border-white/15 bg-white/[0.035] p-3"
                                        >
                                            <div
                                                className="aspect-[1.6/1] border border-white/15"
                                                style={{
                                                    backgroundColor:
                                                    color.value,
                                                }}
                                            />

                                            <span className="mt-3 block text-[9px] font-bold uppercase tracking-[0.1em] text-white/45">
                                                {
                                                    localized(color
                                                        .label, locale)
                                                }
                                            </span>

                                            <strong className="mt-1 block font-mono text-xs text-white/80">
                                                {
                                                    color.value
                                                }
                                            </strong>
                                        </div>
                                    ),
                                )}
                            </div>

                            <div className="flex min-h-[150px] flex-col justify-between border border-white/15 bg-white/[0.035] p-5">
                                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/40">
                                    {t("Typeface")}
                                    </span>

                                <strong className="text-[clamp(21px,3vw,32px)] font-black leading-none tracking-[-0.03em]">
                                    {
                                        project
                                            .caseStudy
                                            .visualSystem
                                            .typeface
                                    }
                                </strong>
                            </div>
                        </div>
                    </section>

                    {media.length > 0 ? (
                        <section
                            className="border border-[#D5D5D7] bg-white p-5 sm:p-7"
                            aria-labelledby={`${titleId}-media`}
                        >
                            <SectionTitle locale={locale}
                                          id={`${titleId}-media`}
                                          eyebrow="09 / Media"
                            >
                                {t("Project views")}
                            </SectionTitle>

                            <div className="mt-6 grid gap-4">
                                {media.map(
                                    (
                                        asset,
                                        index,
                                    ) => (
                                        <figure
                                            key={`${asset.src}-${index}`}
                                            className="overflow-hidden border border-[#D5D5D7] bg-[#EFEFEC]"
                                        >
                                            <Image
                                                src={
                                                    asset.src
                                                }
                                                alt={
                                                    localized(asset
                                                        .alt, locale)
                                                }
                                                width={
                                                    asset.width
                                                }
                                                height={
                                                    asset.height
                                                }
                                                sizes="(max-width: 768px) 100vw, 1000px"
                                                className="h-auto w-full object-cover"
                                            />

                                            {galleryCaptions?.[index] ? (
                                                <figcaption className="border-t border-[#D5D5D7] bg-white px-5 py-4">
                                                    <span className="text-[11px] font-black uppercase tracking-[0.04em] text-[#1E1E1E]">
                                                        {String(index + 1).padStart(2, "0")} / {localized(galleryCaptions[index].title, locale)}
                                                    </span>
                                                    <span className="mt-2 block max-w-[760px] text-sm font-medium leading-[1.55] text-[#5B5C60]">
                                                        {localized(galleryCaptions[index].description, locale)}
                                                    </span>
                                                </figcaption>
                                            ) : null}
                                        </figure>
                                    ),
                                )}
                            </div>
                        </section>
                    ) : null}

                    <footer className="border border-[#D5D5D7] bg-white p-5 sm:p-7">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <Eyebrow>
                                    {t("Case study complete")}
                                </Eyebrow>

                                <h2 className="mt-3 max-w-[570px] text-[clamp(30px,5vw,52px)] font-black uppercase leading-[0.9] tracking-[-0.035em] text-[#202022]">
                                    {t("Continue through the archive")}
                                </h2>

                                {project.caseStudy.commercialCta ? (
                                    <CommercialCta locale={locale} project={project} className="mt-6" />
                                ) : null}

                                {(project.liveUrl ||
                                    project.repositoryUrl ||
                                    project.caseStudy.links?.length ||
                                    project.caseStudy.clientProfile?.website) ? (
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <ProjectLinks locale={locale} project={project} />
                                        {project.liveUrl ? (
                                            <ExternalLink locale={locale}
                                                          href={publicPath(locale, project.liveUrl)}
                                            >
                                                {t("Live project ↗")}
                                            </ExternalLink>
                                        ) : null}

                                        {project.repositoryUrl ? (
                                            <ExternalLink locale={locale}
                                                          href={publicPath(locale, project.repositoryUrl)}
                                            >
                                                {t("Repository ↗")}
                                            </ExternalLink>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>

                            {nextProject &&
                            nextProject.slug !==
                            project.slug ? (
                                <Link
                                    href={publicPath(locale, `/projects/${nextProject.slug}`)}
                                    scroll
                                    className="min-w-0 border border-[#1E1E1E] bg-[#1E1E1E] p-5 text-white no-underline transition-colors hover:bg-[#5E56E7] sm:min-w-[290px]"
                                >
                                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                                        {t("Next project")}
                                        </span>

                                    <strong className="mt-3 block break-words text-xl font-black uppercase leading-[0.95] tracking-[-0.025em]">
                                        {
                                            nextProject.title
                                        }
                                    </strong>

                                    <span className="mt-5 block text-xs font-bold uppercase tracking-[0.08em] text-white/70">
                                        {t("Explore case →")}
                                        </span>
                                </Link>
                            ) : null}
                        </div>
                    </footer>
                </div>
            </div>
        </article>
    );
}

type ProjectModalCaseStudyProps = {
    locale: SiteLocale;
    project: Project;
    titleId: string;
    summaryId: string;
    statusLabel: string;
};

function Capabilities({ locale, project, className }: {
    locale: SiteLocale;
    project: Project;
    className: string;
}) {
    return (
        <>
            <ul className={className} data-project-capabilities="">
                {project.caseStudy.capabilities?.map((capability) => (
                    <li key={capability.en} className="border-b border-black/[0.06] pb-2 text-sm font-semibold leading-[1.4] text-[#57585C]">
                        {localized(capability, locale)}
                    </li>
                ))}
            </ul>
            {project.caseStudy.capabilitiesNote ? (
                <p className="mt-4 text-[11px] font-medium leading-[1.5] text-[#737377]">
                    {localized(project.caseStudy.capabilitiesNote, locale)}
                </p>
            ) : null}
        </>
    );
}

function FeatureGroups({ locale, project, className, compact = false }: {
    locale: SiteLocale;
    project: Project;
    className: string;
    compact?: boolean;
}) {
    return (
        <div className={className} data-project-feature-groups="">
            {project.caseStudy.featureGroups?.map((group) => (
                <div key={group.label.en} className="min-w-0">
                    <h3 className={`${compact ? "text-[10px]" : "text-xs"} font-black uppercase tracking-[0.06em] text-[#363638]`}>
                        {localized(group.label, locale)}
                    </h3>
                    <ul className={`${compact ? "mt-1.5 space-y-0.5" : "mt-3 space-y-2"}`}>
                        {group.items.map((item) => (
                            <li key={item.en} className={`flex gap-2 border-b border-black/[0.06] ${compact ? "pb-0.5 text-[11.5px] leading-[1.3]" : "pb-2 text-sm leading-[1.35]"} font-semibold text-[#57585C]`}>
                                <span className="mt-[0.45em] size-1 shrink-0 bg-[var(--case-accent,#1E1E1E)]" aria-hidden="true" />
                                <span className="min-w-0">{localized(item, locale)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

function ScopeList({ locale, project, className = "" }: {
    locale: SiteLocale;
    project: Project;
    className?: string;
}) {
    return (
        <ul className={`flex flex-wrap gap-1.5 ${className}`} data-project-scope="">
            {project.caseStudy.scope?.map((item) => (
                <li key={item.en} className="border border-[#CDCDD0] px-2 py-1 text-[10px] font-bold uppercase leading-[1.2] tracking-[0.03em] text-[#454549]">
                    {localized(item, locale)}
                </li>
            ))}
        </ul>
    );
}

function Results({ locale, project, className }: {
    locale: SiteLocale;
    project: Project;
    className: string;
}) {
    const t = translator(locale);
    return (
        <div className={className} data-project-results="">
            {project.caseStudy.results?.map((result) => (
                <div key={result.label.en} className="min-w-0 bg-[#FAFAF9] p-4">
                    <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#76777B]">
                        {localized(result.label, locale)}
                    </span>
                    <strong className="mt-2 block text-base font-black leading-[1.15] text-[#303033]">
                        {localized(result.value, locale)}
                    </strong>
                    <span className={`mt-2 inline-block border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.07em] ${evidenceStyles.verified}`}>
                        {t("Verified")}
                    </span>
                    {result.source ? (
                        <span className="mt-2 block text-[10px] font-medium leading-[1.4] text-[#77787D]">
                            {localized(result.source, locale)}
                        </span>
                    ) : null}
                </div>
            ))}
        </div>
    );
}

/** Case-study links: client website and extra links. Live/repository links are rendered by each variant. */
function ProjectLinks({ locale, project }: {
    locale: SiteLocale;
    project: Project;
}) {
    const t = translator(locale);
    const website = project.caseStudy.clientProfile?.website;
    return (
        <>
            {website ? <ExternalLink locale={locale} href={website}>{t("Website")} ↗</ExternalLink> : null}
            {project.caseStudy.links?.map((link) => (
                <ExternalLink key={link.href} locale={locale} href={link.href}>
                    {localized(link.label, locale)}
                </ExternalLink>
            ))}
        </>
    );
}

function CommercialCta({ locale, project, className = "" }: {
    locale: SiteLocale;
    project: Project;
    className?: string;
}) {
    const cta = project.caseStudy.commercialCta;
    if (!cta) return null;
    const ctaLabel = localized(cta.label, locale);

    return (
        <a href={publicPath(locale, cta.href)}
           className={`inline-flex min-h-11 items-center justify-center border border-[#1E1E1E] bg-[#1E1E1E] px-5 py-3 text-center text-[11px] font-black uppercase leading-[1.3] tracking-[0.04em] text-white no-underline transition-colors hover:bg-[#343436] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
           data-project-commercial-cta=""
        >
            {ctaLabel.endsWith("↗") ? (
                <>
                    {ctaLabel.slice(0, -1)}
                    <span data-cta-arrow="" aria-hidden="true">↗</span>
                </>
            ) : ctaLabel}
        </a>
    );
}

const evidenceProgress: Record<Evidence, string> = {
    verified: "100%",
    target: "72%",
    not_measured: "34%",
};

function ProjectModalCaseStudy({ locale,
                                   project,
                                   titleId,
                                   summaryId,
                                   statusLabel,
                               }: ProjectModalCaseStudyProps) {
    const t = translator(locale);
    const media = caseStudyMedia(project);

    const primaryColor =
        project.caseStudy.visualSystem.colors[0]
            ?.value ?? "#1E1E1E";

    const accentColor =
        project.caseStudy.visualSystem.colors[1]
            ?.value ?? "#5E56E7";

    const surfaceColor =
        project.caseStudy.visualSystem.colors[2]
            ?.value ?? "#FCFCFC";

    const technologies = Array.from(
        new Set(
            (project.caseStudy.technologyGroups ?? []).flatMap(
                (group) => group.items,
            ),
        ),
    );

    const titleParts =
        project.title.trim().split(/\s+/u);

    const leadTitle = titleParts[0];
    const trailingTitle = titleParts
        .slice(1)
        .join(" ");

    const imageLabel = `${project.caseStudy.identifier.slice(0, 2)}IMG_${String(project.order).padStart(2, "0")}`;

    const clientName =
        project.caseStudy.clientProfile?.name ??
        project.caseStudy.client;

    const client =
        clientName ??
        (project.caseStudy.engagement ? localized(project.caseStudy.engagement, locale) : undefined);

    const classification = classificationLabel(project);

    // Incomplete technical records also use the flexible layout so omitted data leaves no empty rows.
    const hasProductContent = Boolean(
        project.type === "client" || project.caseStudy.category || project.caseStudy.classification ||
        project.caseStudy.capabilities?.length || project.caseStudy.commercialCta ||
        project.caseStudy.gallery?.length || project.caseStudy.featureGroups?.length || project.caseStudy.scope?.length ||
        !project.caseStudy.technologyGroups?.length || !project.caseStudy.qualitySignals?.length,
    );

    const gallerySlides = project.caseStudy.gallery;
    const galleryCaptions = gallerySlides?.map((slide) => ({
        title: localized(slide.title, locale),
        description: localized(slide.description, locale),
    }));

    // Typed galleries share one ratio (content contract). The full-width frame uses the assets'
    // exact proportions (NORDMARKT: 1672 × 941 ≈ 16:9), so images fill it without crop or stretch.
    const galleryFrameStyle: CSSProperties | undefined = gallerySlides?.length ? {
        aspectRatio: `${media[0].width} / ${media[0].height}`,
    } : undefined;

    const technologyLabel =
        project.caseStudy.classification === "studio_concept"
            ? t("Proposed stack")
            : t("Engine & Logic");

    const visualDna = (
        <>
            <ModalSystemLabel className={`${modalStyles.systemLabel} mt-[clamp(42px,7vh,78px)]`}>
                {t("Visual DNA")}
            </ModalSystemLabel>

            <div className={`${modalStyles.colorList} mt-5 space-y-4`}>
                {project.caseStudy.visualSystem.colors.map(
                    (color) => (
                        <div
                            key={color.value}
                            className="grid grid-cols-[minmax(0,1fr)_88px] items-center gap-5"
                        >
                            <p className="min-w-0 break-words text-[12px] font-bold text-[#737377]">
                                {localized(color.label, locale)}:
                                <span className="font-black uppercase">
                                    {color.value}
                                </span>
                            </p>

                            <span
                                className={`${modalStyles.colorSwatch} h-9 border border-[#77787B]`}
                                style={{
                                    backgroundColor:
                                    color.value,
                                }}
                                aria-label={`${localized(color.label, locale)} ${color.value}`}
                            />
                        </div>
                    ),
                )}
            </div>

            <div className={`${modalStyles.typefaceBlock} mt-[clamp(40px,7vh,76px)]`}>
                <p className="text-[10px] font-black uppercase tracking-[0.04em] text-[#363638]">
                    {t("Typeface")}
                </p>

                <p className="mt-4 break-words text-[clamp(20px,2vw,32px)] font-black uppercase leading-[0.95] tracking-[-0.025em] text-[#343436]">
                    {
                        project.caseStudy
                            .visualSystem.typeface
                    }
                </p>
            </div>
        </>
    );

    // Product layouts carry more narrative, so the visual system collapses into one row.
    const productVisualDna = (
        <div className={modalStyles.productDna}>
            <ModalSystemLabel className={modalStyles.systemLabel}>
                {t("Visual DNA")}
            </ModalSystemLabel>

            <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-4">
                {project.caseStudy.visualSystem.colors.map(
                    (color) => (
                        <div key={color.value} className="min-w-0">
                            <span
                                className={`${modalStyles.dnaBar} block h-4 border border-[#77787B]`}
                                style={{
                                    backgroundColor:
                                    color.value,
                                }}
                                aria-label={`${localized(color.label, locale)} ${color.value}`}
                            />
                            <p className="mt-1.5 text-[9px] font-bold uppercase leading-[1.25] tracking-[0.03em] text-[#737377]">
                                {localized(color.label, locale)}
                                <span className="block font-black text-[#363638]">
                                    {color.value}
                                </span>
                            </p>
                        </div>
                    ),
                )}

                <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.04em] text-[#363638]">
                        {t("Typeface")}
                    </p>
                    <p className="mt-1.5 text-[13px] font-black uppercase leading-[1.05] tracking-[-0.01em] text-[#343436]">
                        {project.caseStudy.visualSystem.typeface}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <article
            className="grid h-dvh w-full min-w-0 grid-cols-1 gap-y-2 overflow-y-auto px-0 py-0 md:grid-cols-[minmax(0,1fr)_clamp(132px,8.5vw,180px)_minmax(0,1fr)] md:gap-y-0 md:overflow-hidden"
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            data-project-case-study=""
            data-project-case-study-variant="modal"
            data-project-slug={project.slug}
            data-case-layout={gallerySlides?.length ? "gallery" : undefined}
        >
            <section
                className={`${modalStyles.leftPanel} ${hasProductContent ? modalStyles.productPanel : ""} min-w-0 border-[#B9B9BD] bg-[#FCFCFC] px-[clamp(20px,3.2vw,58px)] pb-[max(32px,env(safe-area-inset-bottom))] pt-[max(22px,env(safe-area-inset-top))] md:col-start-1 md:h-dvh md:overflow-y-auto md:border-r md:overscroll-contain lg:overflow-visible`}
                data-project-modal-panel="left"
            >
                <p className="text-[10px] font-black uppercase tracking-[0.055em] text-[#C1C2C5]">
                    {t("Visual_Storage//Unit_A")}
                </p>

                {(media.length > 0 || !hasProductContent) ? <ProjectModalGallery
                    key={project.slug}
                    projectKey={project.slug}
                    projectTitle={project.title}
                    media={media}
                    imageLabel={imageLabel}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                    surfaceColor={surfaceColor}
                    className={galleryFrameStyle
                        ? `${modalStyles.galleryFrame} ${modalStyles.ratioFrame}`
                        : `${modalStyles.galleryFrame} mt-[clamp(22px,3.2vh,38px)] aspect-[1.62/1]`}
                    frameStyle={galleryFrameStyle}
                    captions={galleryCaptions}
                    captionClassName={`${modalStyles.galleryFigure} mt-[clamp(22px,3.2vh,38px)]`}
                /> : null}

                <div className="mt-[clamp(24px,4vh,44px)] flex flex-wrap items-center gap-3">
                    <span
                        className="h-px w-9 shrink-0"
                        style={{
                            backgroundColor: accentColor,
                        }}
                        aria-hidden="true"
                    />

                    <p
                        className="min-w-0 break-words text-[11px] font-black uppercase tracking-[0.045em]"
                        style={{
                            color: accentColor,
                        }}
                    >
                        {t("Case_Identifier:")}{project.caseStudy.identifier}
                    </p>

                    {classification ? (
                        <span className="border border-[#CDCDD0] px-2 py-1 text-[9px] font-black uppercase tracking-[0.06em] text-[#656569]" data-project-classification="">
                            {localized(classification, locale)}
                        </span>
                    ) : null}
                </div>

                <h1
                    id={titleId}
                    className={`${modalStyles.modalTitle} mt-[clamp(24px,4vh,46px)] break-words text-[clamp(42px,5vw,76px)] font-black uppercase leading-[0.82] tracking-[-0.045em] text-black max-md:text-[clamp(42px,13vw,66px)] [overflow-wrap:anywhere]`}
                >
                    <span className="block">
                        {leadTitle}
                    </span>

                    {trailingTitle ? (
                        <span className="block text-[#CDCDD0]">
                            {trailingTitle}
                        </span>
                    ) : null}
                </h1>

                {hasProductContent ? (
                    <div className="mt-7">
                        {project.caseStudy.category ? (
                            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#737377]">
                                {localized(project.caseStudy.category, locale)}
                            </p>
                        ) : null}
                        <p id={summaryId} className="mt-3 text-[clamp(20px,2vw,28px)] font-black leading-[1.08] tracking-[-0.025em] text-[#343436]">
                            {localized(project.caseStudy.subtitle, locale)}
                        </p>
                        {project.caseStudy.featureGroups?.length ? null : (
                            <p className="mt-4 max-w-[620px] text-sm font-medium leading-[1.55] text-[#737377]">
                                {localized(project.summary, locale)}
                            </p>
                        )}
                    </div>
                ) : <p
                    id={summaryId}
                    className={`${modalStyles.summary} mt-[clamp(26px,4vh,46px)] max-w-[620px] text-[clamp(12px,1vw,16px)] font-black uppercase leading-[1.3] tracking-[-0.01em] text-[#C1C2C5]`}
                >
                    {localized(project.summary, locale)}
                </p>}

                {(project.caseStudy.role || client) ? <div className={`${modalStyles.metaGrid} mt-[clamp(30px,5vh,58px)] grid grid-cols-2 gap-6 border-t border-black/[0.04] pt-6`}>
                    {project.caseStudy.role ? <ModalMeta locale={locale}
                               label={t("Role")}
                               value={localized(project.caseStudy.role, locale)}
                    /> : null}

                    {client ? <ModalMeta locale={locale}
                               label={t(hasProductContent && !clientName ? "Engagement" : "Client")}
                               value={client}
                    /> : null}
                </div> : null}

                {project.caseStudy.commercialCta ? (
                    <CommercialCta locale={locale} project={project} className="mt-8" />
                ) : null}

                {hasProductContent && (project.liveUrl || project.repositoryUrl || project.caseStudy.links?.length || project.caseStudy.clientProfile?.website) ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                        <ProjectLinks locale={locale} project={project} />
                        {project.liveUrl ? <ExternalLink locale={locale} href={project.liveUrl}>{t("Live project ↗")}</ExternalLink> : null}
                        {project.repositoryUrl ? <ExternalLink locale={locale} href={project.repositoryUrl}>{t("Repository ↗")}</ExternalLink> : null}
                    </div>
                ) : null}
            </section>

            <section
                className={`${modalStyles.rightPanel} ${hasProductContent ? modalStyles.productPanel : ""} min-w-0 border-[#B9B9BD] bg-[#FCFCFC] px-[clamp(20px,3.2vw,58px)] pb-[max(32px,env(safe-area-inset-bottom))] pt-[max(22px,env(safe-area-inset-top))] md:col-start-3 md:h-dvh md:overflow-y-auto md:border-l md:overscroll-contain lg:overflow-visible`}
                style={{
                    "--case-accent": accentColor,
                } as CSSProperties}
                data-project-modal-panel="right"
            >
                <p className="text-right text-[10px] font-black uppercase tracking-[0.055em] text-[#C1C2C5]">
                    {t(hasProductContent ? "Project overview" : "Tech_Manifest//Unit_B")}
                </p>

                {hasProductContent && project.caseStudy.featureGroups?.length ? (
                    <p className={`${modalStyles.productOverview} mt-6 text-[13px] font-medium leading-[1.5] text-[#55565A]`} data-project-overview="">
                        {localized(project.description, locale)}
                    </p>
                ) : null}

                {hasProductContent && (project.challenge || project.solution) ? (
                    <div className={`${modalStyles.productNarrative} mt-8 grid gap-5`}>
                        {project.challenge ? (
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.06em] text-[#363638]">{t("Challenge")}</h2>
                                <p className="mt-2 text-[13px] font-medium leading-[1.5] text-[#737377]">{localized(project.challenge, locale)}</p>
                            </div>
                        ) : null}
                        {project.solution ? (
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.06em] text-[#363638]">{t("Solution")}</h2>
                                <p className="mt-2 text-[13px] font-medium leading-[1.5] text-[#737377]">{localized(project.solution, locale)}</p>
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {project.caseStudy.capabilities?.length ? (
                    <div className="mt-8">
                        <ModalSystemLabel className={modalStyles.systemLabel}>{t("Product capabilities")}</ModalSystemLabel>
                        <Capabilities locale={locale} project={project} className={`${modalStyles.capabilities} mt-4 grid gap-2`} />
                    </div>
                ) : null}

                {project.caseStudy.featureGroups?.length ? (
                    <div className="mt-8" data-project-capabilities-block="">
                        <ModalSystemLabel className={modalStyles.systemLabel}>{t("Product capabilities")}</ModalSystemLabel>
                        <FeatureGroups locale={locale} project={project} compact className={`${modalStyles.featureGroups} mt-3 grid gap-4 sm:grid-cols-2`} />
                        {!project.caseStudy.capabilities?.length && project.caseStudy.capabilitiesNote ? (
                            <p className={`${modalStyles.conceptNote} mt-3 text-[11px] font-medium leading-[1.45] text-[#737377]`}>
                                {localized(project.caseStudy.capabilitiesNote, locale)}
                            </p>
                        ) : null}
                    </div>
                ) : null}

                {project.caseStudy.scope?.length ? (
                    <div className={modalStyles.scopeBlock}>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.06em] text-[#363638]">{t("Project scope")}</h2>
                        <ScopeList locale={locale} project={project} className="mt-1.5" />
                    </div>
                ) : null}

                {technologies.length ? <><ModalSystemLabel className={`${modalStyles.systemLabel} mt-[clamp(28px,5vh,58px)]`}>
                    {technologyLabel}
                </ModalSystemLabel>

                <div className={`${modalStyles.technologyGrid} mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4`}>
                    {technologies.map(
                        (technology) => (
                            <span
                                key={technology}
                                className={`${modalStyles.technologyTag} flex min-h-11 items-center justify-center border border-[#2B2B2D] px-2 py-2 text-center text-[10px] font-black uppercase leading-[1.1] text-[#1E1E1E]`}
                                data-project-technology=""
                            >
                                {technology}
                            </span>
                        ),
                    )}
                </div></> : null}

                {hasProductContent ? productVisualDna : visualDna}

                {project.caseStudy.results?.length ? (
                    <div>
                        <ModalSystemLabel className={modalStyles.systemLabel}>{t("Verified results")}</ModalSystemLabel>
                        <Results locale={locale} project={project} className="mt-4 grid gap-px border border-[#D8D8DA] bg-[#D8D8DA] sm:grid-cols-3" />
                    </div>
                ) : null}

                {project.caseStudy.qualitySignals?.length ? <><ModalSystemLabel className={`${modalStyles.systemLabel} mt-[clamp(42px,7vh,78px)]`}>
                    {t("Performance Audit")}
                </ModalSystemLabel>

                <div className={`${modalStyles.signalList} mt-6 space-y-4`}>
                    {project.caseStudy.qualitySignals.map(
                        (signal) => (
                            <div
                                key={localized(signal.label, locale)}
                            >
                                <div className="flex items-end justify-between gap-4 text-[10px] font-black uppercase leading-none text-[#656569]">
                                    <span>
                                        {localized(signal.label, locale)}
                                    </span>

                                    <span className="shrink-0">
                                        {localized(signal.value, locale)}
                                    </span>
                                </div>

                                {hasProductContent ? (
                                    <span className={`mt-2 inline-block border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.07em] ${evidenceStyles[signal.evidence]}`}>
                                        {t(evidenceLabels[signal.evidence])}
                                    </span>
                                ) : <div className={`${modalStyles.signalBar} mt-2 h-1.5 bg-[#ECECEF]`}>
                                    <div
                                        className="h-full transition-[width] duration-500 motion-reduce:transition-none"
                                        style={{
                                            width: evidenceProgress[
                                                signal
                                                    .evidence
                                                ],
                                            backgroundColor:
                                            accentColor,
                                        }}
                                    />
                                </div>}
                            </div>
                        ),
                    )}
                </div></> : null}

                <div className={`${modalStyles.archiveFooter} mt-[clamp(34px,5vh,58px)] flex items-end justify-between gap-6 border-t border-black/[0.04] pt-5`}>
                    <p className="text-[10px] font-black uppercase leading-[1.2] tracking-[0.015em] text-[#C0C1C4]">
                        {t("Archive status:")}{statusLabel}
                        <br />
                        {t("Record:")}{project.caseStudy.identifier}
                    </p>

                    <span className="grid size-10 shrink-0 place-items-center bg-black text-lg font-black italic text-white">
                        P
                    </span>
                </div>
            </section>
        </article>
    );
}

type ModalMetaProps = {
    locale: SiteLocale;
    label: string;
    value: string;
};

function ModalMeta({ locale,
                       label,
                       value,
                   }: ModalMetaProps) {
    const t = translator(locale);
    return (
        <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.025em] text-[#303033]">
                {t(label)}
            </p>

            <p className="mt-2 break-words text-[10px] font-black uppercase leading-[1.25] text-[#C1C2C5]">
                {value}
            </p>
        </div>
    );
}

type ModalSystemLabelProps = {
    children: ReactNode;
    className?: string;
};

function ModalSystemLabel({
                              children,
                              className = "",
                          }: ModalSystemLabelProps) {
    return (
        <h2
            className={`inline-flex min-h-11 items-center bg-black px-4 py-3 text-[11px] font-black uppercase leading-none tracking-[0.025em] text-white ${className}`}
        >
            {children}
        </h2>
    );
}

type BadgeProps = {
    children: ReactNode;
    dark?: boolean;
    success?: boolean;
};

function Badge({
                   children,
                   dark = false,
                   success = false,
               }: BadgeProps) {
    let className =
        "border border-[#BEBEC1] px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-[#67686C]";

    if (dark) {
        className =
            "border border-[#1E1E1E] bg-[#1E1E1E] px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-white";
    }

    if (success) {
        className =
            "border border-[#8DC8A4] px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-[#567D66]";
    }

    return (
        <span className={className}>
            {children}
        </span>
    );
}

type MetaProps = {
    locale: SiteLocale;
    label: string;
    value: string;
};

function Meta({ locale,
                  label,
                  value,
              }: MetaProps) {
    const t = translator(locale);
    return (
        <div className="min-w-0 bg-[#F8F8F6] p-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#94959A]">
                {t(label)}
            </span>

            <strong className="mt-2 block break-words text-xs font-bold leading-[1.4] text-[#3D3E41]">
                {value}
            </strong>
        </div>
    );
}

type NarrativePanelProps = {
    locale: SiteLocale;
    eyebrow: string;
    title: string;
    children: ReactNode;
};

function NarrativePanel({
                            eyebrow,
                            title,
                            children,
                        }: NarrativePanelProps) {
    return (
        <div className="bg-white p-5 sm:p-7">
            <Eyebrow>
                {eyebrow}
            </Eyebrow>

            <Heading>
                {title}
            </Heading>

            <p className="mt-5 max-w-[620px] text-[15px] font-medium leading-[1.65] text-[#5B5C60]">
                {children}
            </p>
        </div>
    );
}

type SectionTitleProps = {
    locale: SiteLocale;
    id: string;
    eyebrow: string;
    children: ReactNode;
    dark?: boolean;
};

function SectionTitle({
                          id,
                          eyebrow,
                          children,
                          dark = false,
                      }: SectionTitleProps) {
    return (
        <div>
            <Eyebrow dark={dark}>
                {eyebrow}
            </Eyebrow>

            <Heading
                id={id}
                dark={dark}
            >
                {children}
            </Heading>
        </div>
    );
}

type HeadingProps = {
    id?: string;
    children: ReactNode;
    dark?: boolean;
};

function Heading({
                     id,
                     children,
                     dark = false,
                 }: HeadingProps) {
    return (
        <h2
            id={id}
            className={`mt-3 text-[clamp(28px,4vw,44px)] font-black uppercase leading-[0.92] tracking-[-0.03em] ${
                dark
                    ? "text-white"
                    : "text-[#252527]"
            }`}
        >
            {children}
        </h2>
    );
}

type EyebrowProps = {
    children: ReactNode;
    dark?: boolean;
};

function Eyebrow({
                     children,
                     dark = false,
                 }: EyebrowProps) {
    return (
        <p
            className={`text-[9px] font-bold uppercase tracking-[0.14em] ${
                dark
                    ? "text-white/40"
                    : "text-[#96979B]"
            }`}
        >
            {children}
        </p>
    );
}

type ExternalLinkProps = {
    locale: SiteLocale;
    href: string;
    children: ReactNode;
};

function ExternalLink({ locale,
                          href,
                          children,
                      }: ExternalLinkProps) {
    return (
        <a
            href={publicPath(locale, href)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center border border-[#1E1E1E] px-4 text-xs font-bold uppercase tracking-[0.06em] text-[#1E1E1E] no-underline transition-colors hover:bg-[#1E1E1E] hover:text-white"
        >
            {children}
        </a>
    );
}
