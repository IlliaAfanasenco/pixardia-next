import type { Project } from "@/types/services";

type ProjectCaseStudyProps = {
    project: Project;
    titleId: string;
    summaryId: string;
    variant: "page" | "modal";
};

export default function ProjectCaseStudy({
    project,
    titleId,
    summaryId,
    variant,
}: ProjectCaseStudyProps) {
    const articleClassName =
        variant === "modal"
            ? "min-w-0 px-5 pb-12 pt-6 sm:px-8 sm:pb-16 sm:pt-8 lg:px-12"
            : "container-custom py-12 sm:py-16";

    return (
        <article
            className={articleClassName}
            aria-labelledby={titleId}
            aria-describedby={summaryId}
        >
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#777777]">
                {project.type}
            </p>

            <h1
                id={titleId}
                className="mt-3 break-words text-4xl font-black uppercase tracking-tight text-[#1E1E1E] [overflow-wrap:anywhere] sm:text-5xl"
            >
                {project.title}
            </h1>

            <p
                id={summaryId}
                className="mt-6 max-w-3xl break-words [overflow-wrap:anywhere]"
            >
                {project.summary.en}
            </p>
        </article>
    );
}
