import Image from "next/image";
import Link from "next/link";

import {
    getFeaturedProjects,
    projectStatusLabels,
    projectTypeLabels,
} from "@/content/projects";
import type {
    Project,
} from "@/types/services";

const featuredProjects =
    getFeaturedProjects();

export default function ArchiveSection() {
    return (
        <section
            id="projects"
            className="mt-10 w-full overflow-visible py-16 md:py-24"
            aria-labelledby="archive-title"
            data-story-section="archive"
            data-story-step="4"
            data-motion="fade-up"
            data-motion-state="pending"
        >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[clamp(28px,4vw,40px)] px-5 md:px-8">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase leading-none text-[#C5C6C8]">
                        04 / EVIDENCE
                    </p>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
                        <h2
                            id="archive-title"
                            className="max-w-[620px] text-[clamp(40px,7vw,94px)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#1E1E1E]"
                        >
                            Digital Archive
                        </h2>

                        <p className="max-w-[470px] text-left text-xs font-bold leading-[1.35] text-[#A9AAAE] lg:text-right">
                            Selected systems, interfaces and digital products
                            built through the Pixardia delivery process.
                        </p>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {featuredProjects.map(
                        (project) => (
                            <ProjectArchiveCard
                                key={project.slug}
                                project={project}
                            />
                        ),
                    )}

                    <Image
                        src="/images/alienAr.png"
                        alt=""
                        aria-hidden="true"
                        width={239}
                        height={239}
                        className="
                            pointer-events-none
                            absolute
                            hidden
                            h-auto
                            object-contain
                            min-[1344px]:block
                            left-[60%]
                            top-[-254px]
                            -translate-x-1/2
                            w-[239px]
                        "
                    />
                </div>

                <div className="flex items-center justify-center pt-2">
                    <Link
                        href="/projects"
                        className="inline-flex w-full items-center justify-center border border-[#767576] px-9 py-4 text-sm font-bold uppercase leading-none text-[#767576] no-underline transition duration-200 hover:border-[#1E1E1E] hover:text-[#1E1E1E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7] sm:w-auto"
                    >
                        Explore full archive
                    </Link>
                </div>
            </div>
        </section>
    );
}

type ProjectArchiveCardProps = {
    project: Project;
};

function ProjectArchiveCard({
                                project,
                            }: ProjectArchiveCardProps) {
    const colors =
        project.caseStudy.visualSystem.colors;

    const primary =
        colors[0]?.value ?? "#5E56E7";

    const secondary =
        colors[1]?.value ?? "#1E1E1E";

    const accent =
        colors[2]?.value ?? "#F1F1F3";

    const typeLabel =
        projectTypeLabels[
            project.type
            ].en;

    const statusLabel =
        projectStatusLabels[
            project.status
            ].en;

    return (
        <article className="group relative w-full border border-[#A2A3AA] bg-[#FEFEFE] transition duration-300 hover:border-[#5E56E7] focus-within:border-[#5E56E7]">
            <Link
                id={`project-modal-trigger-${project.slug}`}
                href={`/projects/${project.slug}`}
                scroll={false}
                aria-haspopup="dialog"
                aria-label={`Open ${project.title} case study`}
                className="block h-full text-inherit no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7]"
            >
                <div className="relative aspect-[1.4/1] overflow-hidden sm:aspect-[640/318]">
                    {project.coverImage ? (
                        <Image
                            src={
                                project
                                    .coverImage
                                    .src
                            }
                            alt={
                                project
                                    .coverImage
                                    .alt.en
                            }
                            width={
                                project
                                    .coverImage
                                    .width
                            }
                            height={
                                project
                                    .coverImage
                                    .height
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]"
                        />
                    ) : (
                        <ProjectVisualFallback
                            project={project}
                            primary={primary}
                            secondary={secondary}
                            accent={accent}
                        />
                    )}

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/20 bg-black/15 px-4 py-3 backdrop-blur-[2px]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">
                            {
                                project
                                    .caseStudy
                                    .identifier
                            }
                        </span>

                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                            Open case study →
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-start gap-[15px] p-[clamp(16px,2vw,22px)]">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-[#1E1E1E] px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.06em] text-[#BFC0C3]">
                            {typeLabel}
                        </span>

                        <span className="border border-[#D7D7DA] px-2.5 py-1.5 text-[10px] font-bold uppercase leading-none tracking-[0.06em] text-[#8A8B90]">
                            {project.year}
                        </span>
                    </div>

                    <h3 className="text-[clamp(22px,2.4vw,30px)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[#303031]">
                        {project.title}
                    </h3>

                    <p className="max-w-[560px] text-xs font-bold leading-[1.4] text-[#A8A9AD]">
                        {
                            project
                                .summary
                                .en
                        }
                    </p>

                    <div className="grid w-full grid-cols-2 gap-4 border-t border-[#DDDDDD] pt-[18px] sm:grid-cols-3">
                        <ProjectStat
                            label="Status"
                            value={statusLabel}
                            status
                        />

                        <ProjectStat
                            label="System"
                            value={
                                project
                                    .caseStudy
                                    .presentation
                                    .centerLabel
                                    .en
                            }
                        />

                        <ProjectStat
                            label="Stack"
                            value={`${project.technologies.length} technologies`}
                        />
                    </div>
                </div>
            </Link>
        </article>
    );
}

type ProjectVisualFallbackProps = {
    project: Project;
    primary: string;
    secondary: string;
    accent: string;
};

function ProjectVisualFallback({
                                   project,
                                   primary,
                                   secondary,
                                   accent,
                               }: ProjectVisualFallbackProps) {
    return (
        <div
            className="relative h-full w-full overflow-hidden bg-[#151619]"
            aria-hidden="true"
            data-project-visual={project.slug}
        >
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: `radial-gradient(circle at 12% 8%, ${primary} 0%, transparent 34%), radial-gradient(circle at 92% 88%, ${secondary} 0%, transparent 30%)`,
                }}
            />

            <div className="absolute inset-[clamp(14px,3vw,28px)] flex flex-col overflow-hidden border border-white/25 bg-[#17181B]/90">
                <div className="flex items-center justify-between border-b border-white/15 px-4 py-3 sm:px-5">
                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">
                        {
                            project
                                .caseStudy
                                .identifier
                        }
                    </span>

                    <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/75">
                        System view
                    </span>
                </div>

                <div className="relative min-h-0 flex-1">
                    {project.slug ===
                    "pixardia-digital-studio" ? (
                        <PixardiaProjectVisual
                            primary={primary}
                            accent={accent}
                        />
                    ) : project.slug ===
                    "nexus-finance" ? (
                        <NexusProjectVisual
                            primary={primary}
                            accent={accent}
                        />
                    ) : project.slug ===
                    "nordmarkt-commerce" ? (
                        <NordmarktProjectVisual
                            primary={primary}
                            accent={accent}
                        />
                    ) : (
                        <CoreFlowProjectVisual
                            primary={primary}
                            accent={accent}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

type ProjectVisualSceneProps = {
    primary: string;
    accent: string;
};

function PixardiaProjectVisual({
                                   primary,
                                   accent,
                               }: ProjectVisualSceneProps) {
    return (
        <div
            className="grid h-full grid-cols-[0.8fr_1.2fr] gap-3 p-4 sm:gap-4 sm:p-5"
            data-project-visual-scene="pixardia"
        >
            <div className="flex min-w-0 flex-col justify-between border border-white/15 bg-white/[0.035] p-3 sm:p-4">
                <div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
                        Studio platform
                    </span>

                    <p className="mt-2 max-w-[180px] text-[clamp(16px,2.2vw,28px)] font-black uppercase leading-[0.92] tracking-[-0.03em] text-white">
                        Signal to delivery
                    </p>
                </div>

                <div className="space-y-2">
                    {[
                        "Services",
                        "Projects",
                        "Contact",
                    ].map(
                        (label, index) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 border-t border-white/10 pt-2"
                            >
                                <span
                                    className="h-1.5 w-1.5 shrink-0"
                                    style={{
                                        backgroundColor:
                                            index === 0
                                                ? primary
                                                : accent,
                                    }}
                                />

                                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/55">
                                    {label}
                                </span>
                            </div>
                        ),
                    )}
                </div>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-2">
                <div
                    className="col-span-2 border border-white/15 p-3"
                    style={{
                        backgroundColor:
                            `${primary}22`,
                    }}
                >
                    <div className="flex h-full items-end justify-between gap-3">
                        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/50">
                            Experience layer
                        </span>

                        <span
                            className="h-10 w-10 border border-white/25"
                            style={{
                                backgroundColor:
                                primary,
                            }}
                        />
                    </div>
                </div>

                <div className="border border-white/15 bg-white/[0.035] p-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">
                        Content
                    </span>
                </div>

                <div className="border border-white/15 bg-white/[0.035] p-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">
                        Platform
                    </span>
                </div>
            </div>
        </div>
    );
}

function NexusProjectVisual({
                                primary,
                                accent,
                            }: ProjectVisualSceneProps) {
    return (
        <div
            className="grid h-full grid-cols-[1.25fr_0.75fr] gap-3 p-4 sm:gap-4 sm:p-5"
            data-project-visual-scene="nexus"
        >
            <div className="flex min-w-0 flex-col border border-white/15 bg-white/[0.035] p-3 sm:p-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
                        Account activity
                    </span>

                    <span
                        className="h-2 w-8"
                        style={{
                            backgroundColor:
                            primary,
                        }}
                    />
                </div>

                <div className="mt-auto flex h-[55%] items-end gap-1.5">
                    {[
                        38,
                        58,
                        44,
                        72,
                        62,
                        86,
                        68,
                    ].map(
                        (height, index) => (
                            <span
                                key={height + index}
                                className="flex-1 border border-white/10"
                                style={{
                                    height:
                                        `${height}%`,
                                    backgroundColor:
                                        index === 5
                                            ? primary
                                            : `${accent}28`,
                                }}
                            />
                        ),
                    )}
                </div>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
                {[
                    "Accounts",
                    "Transactions",
                    "Budgets",
                ].map(
                    (label, index) => (
                        <div
                            key={label}
                            className="flex flex-1 flex-col justify-between border border-white/15 bg-white/[0.035] p-3"
                        >
                            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/45">
                                {label}
                            </span>

                            <span
                                className="h-1.5"
                                style={{
                                    width:
                                        `${52 + index * 15}%`,
                                    backgroundColor:
                                        index === 0
                                            ? primary
                                            : accent,
                                }}
                            />
                        </div>
                    ),
                )}
            </div>
        </div>
    );
}

function NordmarktProjectVisual({
                                    primary,
                                    accent,
                                }: ProjectVisualSceneProps) {
    return (
        <div
            className="grid h-full grid-cols-[1.25fr_0.75fr] gap-3 p-4 sm:gap-4 sm:p-5"
            data-project-visual-scene="nordmarkt"
        >
            <div className="grid min-w-0 grid-cols-2 gap-2">
                {[
                    "01",
                    "02",
                    "03",
                    "04",
                ].map(
                    (item, index) => (
                        <div
                            key={item}
                            className="flex min-h-0 flex-col border border-white/15 bg-white/[0.035] p-2.5"
                        >
                            <div
                                className="min-h-0 flex-1 border border-white/10"
                                style={{
                                    backgroundColor:
                                        index === 0
                                            ? `${primary}66`
                                            : `${accent}22`,
                                }}
                            />

                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/40">
                                    Item {item}
                                </span>

                                <span
                                    className="h-1.5 w-1.5"
                                    style={{
                                        backgroundColor:
                                            index === 0
                                                ? primary
                                                : accent,
                                    }}
                                />
                            </div>
                        </div>
                    ),
                )}
            </div>

            <div className="flex min-w-0 flex-col border border-white/15 bg-white/[0.035] p-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
                    Purchase flow
                </span>

                <div className="mt-4 space-y-2">
                    {[
                        "Catalogue",
                        "Product",
                        "Checkout",
                    ].map(
                        (label, index) => (
                            <div
                                key={label}
                                className="border border-white/10 p-2"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="h-1.5 w-1.5"
                                        style={{
                                            backgroundColor:
                                                index === 2
                                                    ? primary
                                                    : accent,
                                        }}
                                    />

                                    <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/50">
                                        {label}
                                    </span>
                                </div>
                            </div>
                        ),
                    )}
                </div>

                <div
                    className="mt-auto h-1.5 w-full"
                    style={{
                        backgroundColor:
                        primary,
                    }}
                />
            </div>
        </div>
    );
}

function CoreFlowProjectVisual({
                                   primary,
                                   accent,
                               }: ProjectVisualSceneProps) {
    return (
        <div
            className="relative h-full p-4 sm:p-5"
            data-project-visual-scene="coreflow"
        >
            <div className="absolute left-1/2 top-1/2 h-px w-[54%] -translate-x-1/2 -translate-y-1/2 bg-white/15" />

            <div className="absolute left-1/2 top-[22%] h-[56%] w-px -translate-x-1/2 bg-white/15" />

            <div
                className="absolute left-1/2 top-1/2 z-10 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/30 sm:h-[92px] sm:w-[92px]"
                style={{
                    backgroundColor:
                    primary,
                }}
            >
                <span className="text-[11px] font-black uppercase tracking-[0.08em] text-white">
                    AI Core
                </span>
            </div>

            <div className="absolute left-[6%] top-[18%] border border-white/15 bg-[#1C1D21] px-3 py-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/50">
                    Requests
                </span>
            </div>

            <div className="absolute right-[6%] top-[18%] border border-white/15 bg-[#1C1D21] px-3 py-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/50">
                    Knowledge
                </span>
            </div>

            <div className="absolute bottom-[18%] left-[6%] border border-white/15 bg-[#1C1D21] px-3 py-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/50">
                    Validation
                </span>
            </div>

            <div className="absolute bottom-[18%] right-[6%] border border-white/15 bg-[#1C1D21] px-3 py-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/50">
                    Human review
                </span>
            </div>

            <span
                className="absolute bottom-[10%] left-1/2 h-1.5 w-[24%] -translate-x-1/2"
                style={{
                    backgroundColor:
                    accent,
                }}
            />
        </div>
    );
}

type ProjectStatProps = {
    label: string;
    value: string;
    status?: boolean;
};

function ProjectStat({
                         label,
                         value,
                         status = false,
                     }: ProjectStatProps) {
    return (
        <div className="min-w-0">
            <span className="block text-[10px] font-normal uppercase leading-none tracking-[0.08em] text-[#BFC0C3]">
                {label}
            </span>

            {status ? (
                <strong className="mt-2 inline-flex max-w-full border border-[#7BC198] px-2.5 py-[7px] text-[10px] font-bold uppercase leading-none text-[#78A98B]">
                    {value}
                </strong>
            ) : (
                <strong className="mt-2 block truncate text-xs font-bold leading-none text-[#4A4A4A]">
                    {value}
                </strong>
            )}
        </div>
    );
}
