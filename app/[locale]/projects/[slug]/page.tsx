import { routeLocale } from "@/i18n/server";
import { translator } from "@/i18n/getDictionary";
import { localized } from "@/i18n/localized";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectCaseStudy from "@/components/projects/ProjectCaseStudy";
import {
    getProjectBySlug,
    projects,
} from "@/content/projects";
import { createPageMetadata } from "@/lib/seo";

type ProjectPageProps = {
    params: Promise<{
        slug: string;
        locale: string;
    }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
    return projects.map((project) => ({
        slug: project.slug,
    }));
}

export async function generateMetadata({
                                           params,
                                       }: ProjectPageProps): Promise<Metadata> {
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

export default async function ProjectPage({
                                              params,
                                          }: ProjectPageProps) {
    const { slug } = await params;
    const locale = await routeLocale(params);
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <ProjectCaseStudy locale={locale}
            project={project}
            titleId="project-page-title"
            summaryId="project-page-summary"
            variant="page"
        />
    );
}
