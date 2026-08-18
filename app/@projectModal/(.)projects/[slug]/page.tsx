import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ProjectCaseStudy from "@/features/projects/ProjectCaseStudy";
import ProjectModal from "@/features/projects/ProjectModal";
import { getProjectBySlug } from "@/content/projects";
import { createPageMetadata } from "@/lib/seo";

type ProjectModalPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
                                           params,
                                       }: ProjectModalPageProps): Promise<Metadata> {
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

export default async function ProjectModalPage({
                                                   params,
                                               }: ProjectModalPageProps) {
    const { slug } = await params;
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
            <ProjectCaseStudy
                project={project}
                titleId={titleId}
                summaryId={summaryId}
                variant="modal"
            />
        </ProjectModal>
    );
}
