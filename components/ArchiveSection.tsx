import Image from "next/image";
import Link from "next/link";

import {
    getFeaturedProjects,
    projectStatusLabels,
    projectTypeLabels,
    projects,
} from "@/content/projects";
import { type Project } from "@/types/services";

type CaseStat = {
    label: string;
    value: string;
    isStatus?: boolean;
};

type CaseStudy = {
    slug: string;
    tag: string;
    title: string;
    description: string;
    status: Project["status"];
    stats: CaseStat[];
};

const featuredProjects = getFeaturedProjects();

const archiveProjects = [
    ...featuredProjects,
    ...projects.filter(
        (project) =>
            !featuredProjects.some(
                (featuredProject) =>
                    featuredProject.slug === project.slug,
            ),
    ),
].slice(0, 2);

const caseStudies: CaseStudy[] = archiveProjects.map(
    (project) => {
        const typeLabel =
            projectTypeLabels[project.type].en;

        const statusLabel =
            projectStatusLabels[project.status].en;

        return {
            slug: project.slug,
            tag: typeLabel,
            title: project.title,
            description: project.summary.en,
            status: project.status,
            stats: [
                {
                    label: "Type",
                    value: typeLabel,
                },
                {
                    label: "Year",
                    value: String(project.year),
                },
                {
                    label: "Status",
                    value: statusLabel,
                    isStatus: true,
                },
            ],
        };
    },
);

function getStatusClass(
    status: Project["status"],
): string {
    switch (status) {
        case "completed":
            return "border-[#7BC198] text-[#85B99A]";

        case "in_progress":
            return "border-[#8D86E8] text-[#817AE0]";

        case "planned":
            return "border-[#BABABD] text-[#99999C]";
    }
}

const ArchiveSection = () => {
    return (
        <section
            id="projects"
            className="mt-10 w-full overflow-visible py-16 md:py-24"
            aria-labelledby="archive-title"
        >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[clamp(28px,4vw,40px)] px-5 md:px-8">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase leading-none text-[#C5C6C8]">
                        DEPLOYMENTPROTOCOL05
                    </p>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
                        <h2
                            id="archive-title"
                            className="max-w-[620px] text-[clamp(40px,7vw,94px)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#1E1E1E]"
                        >
                            Digital Archive
                        </h2>

                        <p className="max-w-[430px] text-left text-xs font-bold leading-[1.15] text-[#C4C5C7] lg:text-right">
                            Every project is a unique digital
                            artifact shaped through strategy,
                            design and reliable engineering.
                        </p>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {caseStudies.map((item) => (
                        <CaseCard
                            key={item.slug}
                            {...item}
                        />
                    ))}

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
                            drop-shadow-[0_18px_24px_rgba(0,0,0,0.12)]

                            min-[1344px]:block
                            left-[60%]
                            top-[-254px]
                            -translate-x-1/2

                            w-[239px]
                        "
                    />
                </div>

                <div className="flex items-center justify-center">
                    <Link
                        href="/projects"
                        className="w-full border border-[#767576] px-9 py-4 text-center text-sm font-bold uppercase leading-none text-[#767576] no-underline transition duration-300 hover:border-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7] active:translate-y-px sm:w-auto"
                    >
                        Explore full archive
                    </Link>
                </div>
            </div>
        </section>
    );
};

const CaseCard = ({
                      slug,
                      tag,
                      title,
                      description,
                      status,
                      stats,
                  }: CaseStudy) => {
    return (
        <article className="group w-full border border-[#A2A3AA] bg-[#FEFEFE] transition duration-300 hover:-translate-y-1 hover:border-[#5E56E7] hover:shadow-[0_16px_35px_rgba(79,70,229,0.1)]">
            <div className="relative flex aspect-[1.4/1] items-center justify-center overflow-hidden bg-[#5E56E7] sm:aspect-[640/318]">
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                >
                    <span className="absolute left-6 top-6 h-px w-16 bg-white/20" />
                    <span className="absolute left-6 top-6 h-16 w-px bg-white/20" />

                    <span className="absolute bottom-6 right-6 h-px w-16 bg-white/20" />
                    <span className="absolute bottom-6 right-6 h-16 w-px bg-white/20" />

                    <span className="absolute inset-x-0 top-1/2 h-px bg-white/[0.04]" />
                    <span className="absolute inset-y-0 left-1/2 w-px bg-white/[0.04]" />
                </div>

                <Link
                    href={`/projects/${slug}`}
                    aria-label={`Open ${title} case study`}
                    className="relative z-10 border border-[#837FED] px-3 py-2 text-xs font-bold uppercase text-[#B4B0F0] no-underline transition duration-300 hover:scale-[1.03] hover:border-white hover:bg-white hover:text-[#5E56E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-95"
                >
                    Open case study
                </Link>
            </div>

            <div className="flex flex-col items-start gap-[15px] p-[clamp(16px,2vw,19px)]">
                <span className="bg-black px-2.5 py-1.5 text-xs font-bold uppercase leading-none text-[#9A9C9B] transition-colors duration-300 group-hover:bg-[#5E56E7] group-hover:text-white">
                    {tag}
                </span>

                <h3 className="text-[clamp(20px,2vw,24px)] font-black uppercase leading-none text-[#303031] transition-colors duration-300 group-hover:text-[#5E56E7]">
                    {title}
                </h3>

                <p className="max-w-[520px] text-xs font-bold leading-[1.2] text-[#C0C0C2]">
                    {description}
                </p>

                <div className="flex w-full flex-col gap-4 border-t border-[#DDDDDD] pt-[18px] min-[361px]:flex-row min-[361px]:flex-wrap min-[361px]:gap-[clamp(18px,3vw,35px)]">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="flex flex-col gap-2"
                        >
                            <span className="text-xs font-normal uppercase leading-none text-[#CFCFCF]">
                                {stat.label}
                            </span>

                            {stat.isStatus ? (
                                <strong
                                    className={`inline-flex w-fit border px-3 py-[7px] text-xs font-bold uppercase leading-none transition-colors duration-300 ${getStatusClass(
                                        status,
                                    )}`}
                                >
                                    {stat.value}
                                </strong>
                            ) : (
                                <strong className="text-sm font-bold leading-none text-[#4A4A4A]">
                                    {stat.value}
                                </strong>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default ArchiveSection;