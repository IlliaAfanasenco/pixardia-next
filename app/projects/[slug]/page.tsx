import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
    getProjectBySlug,
    projects,
} from "@/content/projects";

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
            title: "Project not found | Pixardia",
        };
    }

    return {
        title: `${project.title} | Pixardia`,
        description: project.summary.en,
    };
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
        <div>
            <h1>{project.title}</h1>
            <p>{project.type}</p>
            <p>{project.summary.en}</p>
        </div>
    );
}