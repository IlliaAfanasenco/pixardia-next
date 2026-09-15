import { routeLocale } from "@/i18n/server";
import { translator } from "@/i18n/getDictionary";
import { localized } from "@/i18n/localized";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectCaseStudy from "@/features/projects/ProjectCaseStudy";
import ProjectModal from "@/features/projects/ProjectModal";
import { getProjectBySlug } from "@/content/projects";
import { createPageMetadata } from "@/lib/seo";

type ProjectModalPageProps = {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
};

export async function generateMetadata({
                                           params,
                                       }: ProjectModalPageProps): Promise<Metadata> {
    const { slug } = await params;
    const locale = await routeLocale(params);
    const t = translator(locale);
    const project = getProjectBySlug(slug);

    if (!project) {
        return {
            title: t("Project not found"),
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    return createPageMetadata({
        locale,
        title: t("{title} Case Study", { title: project.title }),
        description: localized(project.summary, locale),
        path: `/projects/${project.slug}`,
    });
}

export default async function ProjectModalPage({
                                                   params,
                                               }: ProjectModalPageProps) {
    const { slug } = await params;
    const locale = await routeLocale(params);
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const titleId =
        `project-modal-title-${project.slug}`;

    const summaryId =
        `project-modal-summary-${project.slug}`;

    const triggerId =
        `project-modal-trigger-${project.slug}`;

    return (
        <ProjectModal
            titleId={titleId}
            summaryId={summaryId}
            triggerId={triggerId}
        >
            <ProjectCaseStudy locale={locale}
                project={project}
                titleId={titleId}
                summaryId={summaryId}
                variant="modal"
            />
        </ProjectModal>
    );
}
