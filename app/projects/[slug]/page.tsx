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
    const project = getProjectBySlug(slug);

    if (!project) {
        return {
            title: "Project not found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    return createPageMetadata({
        title: project.title,
        description: project.summary.en,
        path: `/projects/${project.slug}`,
    });
}

export default async function ProjectPage({
                                              params,
                                          }: ProjectPageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    return (
        <ProjectCaseStudy
            project={project}
            titleId="project-page-title"
            summaryId="project-page-summary"
            variant="page"
        />
    );
}
