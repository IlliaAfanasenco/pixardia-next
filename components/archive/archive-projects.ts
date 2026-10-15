import { getFeaturedProjects } from "@/content/projects";
import type { Project } from "@/types/services";

export type ArchivePreviewVariant = "pixardia" | "nexus" | "nordmarkt" | "coreflow";
export type ArchiveProject = { project: Project; variant: ArchivePreviewVariant };

const previewBySlug: Readonly<Record<string, ArchivePreviewVariant | undefined>> = {
    "pixardia-digital-studio": "pixardia",
    "nexus-finance": "nexus",
    "nordmarkt-commerce": "nordmarkt",
    "coreflow-ai-workspace": "coreflow",
};

export function getArchiveProjects(): ArchiveProject[] {
    return getFeaturedProjects().map((project) => {
        const variant = previewBySlug[project.slug];
        if (!variant) throw new Error(`Missing archive preview for ${project.slug}`);
        return { project, variant };
    });
}
