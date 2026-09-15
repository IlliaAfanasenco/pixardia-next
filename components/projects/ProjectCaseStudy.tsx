import { publicPath } from "@/i18n/navigation";
import { localized } from "@/i18n/localized";
import type { SiteLocale } from "@/i18n/config";
import { translator } from "@/i18n/getDictionary";
import type {
    ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";

import {
    projectStatusLabels,
    projectTypeLabels,
    projects,
} from "@/content/projects";
import type {
    Project,
} from "@/types/services";

type ProjectCaseStudyProps = {
    locale: SiteLocale;
    project: Project;
    titleId: string;
    summaryId: string;
    variant: "page" | "modal";
};

type Evidence =
    Project["caseStudy"]["qualitySignals"][number]["evidence"];

const evidenceLabels: Record<Evidence, string> = {
    verified: "Verified",
    target: "Target",
    not_measured: "Not measured",
};

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
        localized(projectTypeLabels[project.type], locale);

    const statusLabel =
        localized(projectStatusLabels[project.status], locale);

    const media = [
        ...(project.coverImage
            ? [project.coverImage]
            : []),
        ...project.images,
    ];

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
            className={
                variant === "modal"
                    ? "min-w-0 bg-[#F5F5F3]"
                    : "container-custom py-10 sm:py-14"
            }
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            data-project-case-study=""
            data-project-case-study-variant={variant}
        >
            <div
                className={
                    variant === "page"
                        ? "overflow-hidden border border-[#CECED1] bg-[#F5F5F3]"
                        : ""
                }
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
                        <Meta locale={locale}
                              label={t("Engagement")}
                              value={
                                  localized(project
                                      .caseStudy
                                      .engagement, locale)
                              }
                        />

                        <Meta locale={locale}
                              label={t("Role")}
                              value={
                                  localized(project
                                      .caseStudy
                                      .role, locale)
                              }
                        />

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

                    <section
                        className="grid gap-px border border-[#D5D5D7] bg-[#D5D5D7] lg:grid-cols-2"
                        aria-label={t("Challenge and solution")}
                    >
                        <NarrativePanel locale={locale}
                                        eyebrow="02 / Challenge"
                                        title={t("Challenge")}
                        >
                            {
                                localized(project
                                    .challenge, locale)
                            }
                        </NarrativePanel>

                        <NarrativePanel locale={locale}
                                        eyebrow="03 / Solution"
                                        title={t("Solution")}
                        >
                            {
                                localized(project
                                    .solution, locale)
                            }
                        </NarrativePanel>
                    </section>

                    <section
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
                    </section>

                    <section
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
                    </section>

                    <section
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
                            {project.caseStudy.technologyGroups.map(
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
                    </section>

                    <section
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
                    </section>

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

                                {(project.liveUrl ||
                                    project.repositoryUrl) ? (
                                    <div className="mt-6 flex flex-wrap gap-3">
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
                                    scroll={
                                        variant ===
                                        "page"
                                    }
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

function NarrativePanel({ locale,
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

function SectionTitle({ locale,
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
