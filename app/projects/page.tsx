import type { Metadata } from "next";
import Link from "next/link";

import { projects } from "@/content/projects";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "Projects",
    description:
        "Explore selected Pixardia case studies across websites, web applications, e-commerce and AI-powered digital products.",
    path: "/projects",
});

export default function ProjectsPage() {
    return (
        <section
            className="container-custom py-12 sm:py-16"
            aria-labelledby="projects-page-title"
        >
            <h1
                id="projects-page-title"
                className="text-4xl font-black uppercase tracking-tight text-[#1E1E1E]"
            >
                Projects
            </h1>

            <div className="mt-10 space-y-10">
                {projects.map((project) => (
                    <article
                        key={project.slug}
                        className="border-t border-[#1E1E1E] pt-6"
                    >
                        <h2 className="text-2xl font-bold text-[#1E1E1E]">
                            {project.title}
                        </h2>

                        <p className="mt-2 text-sm font-bold uppercase tracking-[0.08em] text-[#777777]">
                            {project.type}
                        </p>

                        <p className="mt-3 max-w-3xl">
                            {project.summary.en}
                        </p>

                        <Link
                            id={`project-modal-trigger-${project.slug}`}
                            href={`/projects/${project.slug}`}
                            scroll={false}
                            aria-haspopup="dialog"
                            className="mt-4 inline-flex font-bold underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7]"
                        >
                            View project
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}
