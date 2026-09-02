import type {
    CSSProperties,
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
import ProjectModalGallery from "@/features/projects/ProjectModalGallery";
import modalStyles from "@/features/projects/ProjectModalCaseStudy.module.css";

type ProjectCaseStudyProps = {
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

export default function ProjectCaseStudy({
                                             project,
                                             titleId,
                                             summaryId,
                                             variant,
                                         }: ProjectCaseStudyProps) {
    const typeLabel =
        projectTypeLabels[project.type].en;

    const statusLabel =
        projectStatusLabels[project.status].en;

    if (variant === "modal") {
        return (
            <ProjectModalCaseStudy
                project={project}
                titleId={titleId}
                summaryId={summaryId}
                statusLabel={statusLabel}
            />
        );
    }

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
                            project
                                .caseStudy
                                .subtitle
                                .en
                        }
                    </p>

                    <div className="mt-8 grid gap-px border border-[#CECED0] bg-[#CECED0] sm:grid-cols-2">
                        <Meta
                            label="Engagement"
                            value={
                                project
                                    .caseStudy
                                    .engagement
                                    .en
                            }
                        />

                        <Meta
                            label="Role"
                            value={
                                project
                                    .caseStudy
                                    .role
                                    .en
                            }
                        />

                        <Meta
                            label="Status"
                            value={statusLabel}
                        />

                        <Meta
                            label="Record"
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
                                01 / Context
                            </Eyebrow>

                            <Heading
                                id={`${titleId}-overview`}
                            >
                                Project overview
                            </Heading>
                        </div>

                        <p className="max-w-[680px] text-[15px] font-medium leading-[1.65] text-[#57585C]">
                            {project.description.en}
                        </p>
                    </section>

                    <section
                        className="grid gap-px border border-[#D5D5D7] bg-[#D5D5D7] lg:grid-cols-2"
                        aria-label="Challenge and solution"
                    >
                        <NarrativePanel
                            eyebrow="02 / Challenge"
                            title="Challenge"
                        >
                            {
                                project
                                    .challenge
                                    .en
                            }
                        </NarrativePanel>

                        <NarrativePanel
                            eyebrow="03 / Solution"
                            title="Solution"
                        >
                            {
                                project
                                    .solution
                                    .en
                            }
                        </NarrativePanel>
                    </section>

                    <section
                        className="grid gap-6 border border-[#D5D5D7] bg-[#1D1E21] p-5 text-white sm:p-7 lg:grid-cols-[0.7fr_1.3fr]"
                        aria-labelledby={`${titleId}-architecture`}
                    >
                        <div>
                            <Eyebrow dark>
                                04 / Architecture
                            </Eyebrow>

                            <Heading
                                id={`${titleId}-architecture`}
                                dark
                            >
                                System structure
                            </Heading>
                        </div>

                        <p className="max-w-[700px] text-[15px] font-medium leading-[1.65] text-white/70">
                            {
                                project
                                    .caseStudy
                                    .architecture
                                    .en
                            }
                        </p>
                    </section>

                    <section
                        className="border border-[#D5D5D7] bg-white p-5 sm:p-7"
                        aria-labelledby={`${titleId}-facts`}
                    >
                        <SectionTitle
                            id={`${titleId}-facts`}
                            eyebrow="05 / Facts"
                        >
                            Project record
                        </SectionTitle>

                        <div className="mt-6 grid gap-px border border-[#D8D8DA] bg-[#D8D8DA] sm:grid-cols-3">
                            {project.caseStudy.facts.map(
                                (fact) => (
                                    <div
                                        key={
                                            fact
                                                .label
                                                .en
                                        }
                                        className="min-w-0 bg-[#FAFAF9] p-5"
                                    >
                                        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#929398]">
                                            {
                                                fact
                                                    .label
                                                    .en
                                            }
                                        </span>

                                        <strong className="mt-3 block text-sm font-bold leading-[1.35] text-[#343437]">
                                            {
                                                fact
                                                    .value
                                                    .en
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
                        <SectionTitle
                            id={`${titleId}-technology`}
                            eyebrow="06 / Technology"
                        >
                            Technology groups
                        </SectionTitle>

                        <div className="mt-6 grid gap-4 lg:grid-cols-2">
                            {project.caseStudy.technologyGroups.map(
                                (group) => (
                                    <div
                                        key={
                                            group
                                                .label
                                                .en
                                        }
                                        className="border border-[#D8D8DA] bg-[#FAFAF9] p-5"
                                    >
                                        <h3 className="text-xs font-black uppercase tracking-[0.08em] text-[#55565A]">
                                            {
                                                group
                                                    .label
                                                    .en
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
                        <SectionTitle
                            id={`${titleId}-quality`}
                            eyebrow="07 / Evidence"
                        >
                            Quality signals
                        </SectionTitle>

                        <div className="mt-6 grid gap-3 lg:grid-cols-3">
                            {project.caseStudy.qualitySignals.map(
                                (signal) => (
                                    <div
                                        key={
                                            signal
                                                .label
                                                .en
                                        }
                                        className="flex min-h-[145px] flex-col border border-[#D8D8DA] bg-[#FAFAF9] p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#76777B]">
                                                {
                                                    signal
                                                        .label
                                                        .en
                                                }
                                            </span>

                                            <span
                                                className={`shrink-0 border px-2 py-1 text-[9px] font-bold uppercase tracking-[0.07em] ${evidenceStyles[signal.evidence]}`}
                                            >
                                                {
                                                    evidenceLabels[
                                                        signal
                                                            .evidence
                                                        ]
                                                }
                                            </span>
                                        </div>

                                        <strong className="mt-auto pt-7 text-base font-black leading-[1.15] text-[#303033]">
                                            {
                                                signal
                                                    .value
                                                    .en
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
                        <SectionTitle
                            id={`${titleId}-visual`}
                            eyebrow="08 / Visual system"
                            dark
                        >
                            Interface language
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
                                                    color
                                                        .label
                                                        .en
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
                                    Typeface
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
                            <SectionTitle
                                id={`${titleId}-media`}
                                eyebrow="09 / Media"
                            >
                                Project views
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
                                                    asset
                                                        .alt
                                                        .en
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
                                    Case study complete
                                </Eyebrow>

                                <h2 className="mt-3 max-w-[570px] text-[clamp(30px,5vw,52px)] font-black uppercase leading-[0.9] tracking-[-0.035em] text-[#202022]">
                                    Continue through
                                    the archive
                                </h2>

                                {(project.liveUrl ||
                                    project.repositoryUrl) ? (
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        {project.liveUrl ? (
                                            <ExternalLink
                                                href={
                                                    project.liveUrl
                                                }
                                            >
                                                Live project ↗
                                            </ExternalLink>
                                        ) : null}

                                        {project.repositoryUrl ? (
                                            <ExternalLink
                                                href={
                                                    project.repositoryUrl
                                                }
                                            >
                                                Repository ↗
                                            </ExternalLink>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>

                            {nextProject &&
                            nextProject.slug !==
                            project.slug ? (
                                <Link
                                    href={`/projects/${nextProject.slug}`}
                                    scroll
                                    className="min-w-0 border border-[#1E1E1E] bg-[#1E1E1E] p-5 text-white no-underline transition-colors hover:bg-[#5E56E7] sm:min-w-[290px]"
                                >
                                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                                        Next project
                                    </span>

                                    <strong className="mt-3 block break-words text-xl font-black uppercase leading-[0.95] tracking-[-0.025em]">
                                        {
                                            nextProject.title
                                        }
                                    </strong>

                                    <span className="mt-5 block text-xs font-bold uppercase tracking-[0.08em] text-white/70">
                                        Explore case →
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
    project: Project;
    titleId: string;
    summaryId: string;
    statusLabel: string;
};

const evidenceProgress: Record<Evidence, string> = {
    verified: "100%",
    target: "72%",
    not_measured: "34%",
};

function ProjectModalCaseStudy({
                                   project,
                                   titleId,
                                   summaryId,
                                   statusLabel,
                               }: ProjectModalCaseStudyProps) {
    const media = [
        ...(project.coverImage
            ? [project.coverImage]
            : []),
        ...project.images,
    ];

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
            project.caseStudy.technologyGroups.flatMap(
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

    const client =
        project.caseStudy.client ??
        project.caseStudy.engagement.en;

    return (
        <article
            className="grid h-dvh w-full min-w-0 grid-cols-1 gap-y-2 overflow-y-auto px-0 py-0 md:grid-cols-[minmax(0,1fr)_clamp(132px,8.5vw,180px)_minmax(0,1fr)] md:gap-y-0 md:overflow-hidden"
            aria-labelledby={titleId}
            aria-describedby={summaryId}
            data-project-case-study=""
            data-project-case-study-variant="modal"
        >
            <section
                className={`${modalStyles.leftPanel} min-w-0 border-[#B9B9BD] bg-[#FCFCFC] px-[clamp(20px,3.2vw,58px)] pb-[max(32px,env(safe-area-inset-bottom))] pt-[max(22px,env(safe-area-inset-top))] md:col-start-1 md:h-dvh md:overflow-y-auto md:border-r md:overscroll-contain lg:overflow-visible`}
                data-project-modal-panel="left"
            >
                <p className="text-[10px] font-black uppercase tracking-[0.055em] text-[#C1C2C5]">
                    Visual_Storage//Unit_A
                </p>

                <ProjectModalGallery
                    key={project.slug}
                    projectKey={project.slug}
                    projectTitle={project.title}
                    media={media}
                    imageLabel={imageLabel}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                    surfaceColor={surfaceColor}
                    className={`${modalStyles.galleryFrame} mt-[clamp(22px,3.2vh,38px)] aspect-[1.62/1]`}
                />

                <div className="mt-[clamp(24px,4vh,44px)] flex items-center gap-3">
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
                        Case_Identifier:{project.caseStudy.identifier}
                    </p>
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

                <p
                    id={summaryId}
                    className={`${modalStyles.summary} mt-[clamp(26px,4vh,46px)] max-w-[620px] text-[clamp(12px,1vw,16px)] font-black uppercase leading-[1.3] tracking-[-0.01em] text-[#C1C2C5]`}
                >
                    {project.summary.en}
                </p>

                <div className={`${modalStyles.metaGrid} mt-[clamp(30px,5vh,58px)] grid grid-cols-2 gap-6 border-t border-black/[0.04] pt-6`}>
                    <ModalMeta
                        label="Role"
                        value={project.caseStudy.role.en}
                    />

                    <ModalMeta
                        label="Client"
                        value={client}
                    />
                </div>
            </section>

            <section
                className={`${modalStyles.rightPanel} min-w-0 border-[#B9B9BD] bg-[#FCFCFC] px-[clamp(20px,3.2vw,58px)] pb-[max(32px,env(safe-area-inset-bottom))] pt-[max(22px,env(safe-area-inset-top))] md:col-start-3 md:h-dvh md:overflow-y-auto md:border-l md:overscroll-contain lg:overflow-visible`}
                style={{
                    "--case-accent": accentColor,
                } as CSSProperties}
                data-project-modal-panel="right"
            >
                <p className="text-right text-[10px] font-black uppercase tracking-[0.055em] text-[#C1C2C5]">
                    Tech_Manifest//Unit_B
                </p>

                <ModalSystemLabel className={`${modalStyles.systemLabel} mt-[clamp(28px,5vh,58px)]`}>
                    Engine &amp; Logic
                </ModalSystemLabel>

                <div className={`${modalStyles.technologyGrid} mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4`}>
                    {technologies.map(
                        (technology) => (
                            <span
                                key={technology}
                                tabIndex={0}
                                className={`${modalStyles.technologyTag} flex min-h-11 items-center justify-center border border-[#2B2B2D] px-2 py-2 text-center text-[10px] font-black uppercase leading-[1.1] text-[#1E1E1E] transition-colors duration-150 hover:border-[var(--case-accent)] hover:bg-black/[0.02] hover:text-[var(--case-accent)] focus-visible:border-[var(--case-accent)] focus-visible:text-[var(--case-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--case-accent)]`}
                                data-project-technology=""
                            >
                                {technology}
                            </span>
                        ),
                    )}
                </div>

                <ModalSystemLabel className={`${modalStyles.systemLabel} mt-[clamp(42px,7vh,78px)]`}>
                    Visual DNA
                </ModalSystemLabel>

                <div className={`${modalStyles.colorList} mt-5 space-y-4`}>
                    {project.caseStudy.visualSystem.colors.map(
                        (color) => (
                            <div
                                key={color.value}
                                className="grid grid-cols-[minmax(0,1fr)_88px] items-center gap-5"
                            >
                                <p className="min-w-0 break-words text-[12px] font-bold text-[#737377]">
                                    {color.label.en}:
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
                                    aria-label={`${color.label.en} ${color.value}`}
                                />
                            </div>
                        ),
                    )}
                </div>

                <div className={`${modalStyles.typefaceBlock} mt-[clamp(40px,7vh,76px)]`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.04em] text-[#363638]">
                        Typeface
                    </p>

                    <p className="mt-4 break-words text-[clamp(20px,2vw,32px)] font-black uppercase leading-[0.95] tracking-[-0.025em] text-[#343436]">
                        {
                            project.caseStudy
                                .visualSystem.typeface
                        }
                    </p>
                </div>

                <ModalSystemLabel className={`${modalStyles.systemLabel} mt-[clamp(42px,7vh,78px)]`}>
                    Performance Audit
                </ModalSystemLabel>

                <div className={`${modalStyles.signalList} mt-6 space-y-4`}>
                    {project.caseStudy.qualitySignals.map(
                        (signal) => (
                            <div
                                key={signal.label.en}
                            >
                                <div className="flex items-end justify-between gap-4 text-[10px] font-black uppercase leading-none text-[#656569]">
                                    <span>
                                        {signal.label.en}
                                    </span>

                                    <span className="shrink-0">
                                        {signal.value.en}
                                    </span>
                                </div>

                                <div className={`${modalStyles.signalBar} mt-2 h-1.5 bg-[#ECECEF]`}>
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
                                </div>
                            </div>
                        ),
                    )}
                </div>

                <div className={`${modalStyles.archiveFooter} mt-[clamp(34px,5vh,58px)] flex items-end justify-between gap-6 border-t border-black/[0.04] pt-5`}>
                    <p className="text-[10px] font-black uppercase leading-[1.2] tracking-[0.015em] text-[#C0C1C4]">
                        Archive status: {statusLabel}
                        <br />
                        Record: {project.caseStudy.identifier}
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
    label: string;
    value: string;
};

function ModalMeta({
                       label,
                       value,
                   }: ModalMetaProps) {
    return (
        <div className="min-w-0">
            <p className="text-[11px] font-black uppercase tracking-[0.025em] text-[#303033]">
                {label}
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
    label: string;
    value: string;
};

function Meta({
                  label,
                  value,
              }: MetaProps) {
    return (
        <div className="min-w-0 bg-[#F8F8F6] p-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#94959A]">
                {label}
            </span>

            <strong className="mt-2 block break-words text-xs font-bold leading-[1.4] text-[#3D3E41]">
                {value}
            </strong>
        </div>
    );
}

type NarrativePanelProps = {
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
    href: string;
    children: ReactNode;
};

function ExternalLink({
                          href,
                          children,
                      }: ExternalLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center border border-[#1E1E1E] px-4 text-xs font-bold uppercase tracking-[0.06em] text-[#1E1E1E] no-underline transition-colors hover:bg-[#1E1E1E] hover:text-white"
        >
            {children}
        </a>
    );
}
