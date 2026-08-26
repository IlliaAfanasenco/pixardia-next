import type { Metadata } from "next";
import Link from "next/link";

import {
    projects,
} from "@/content/projects";
import {
    createPageMetadata,
} from "@/lib/seo";

export const metadata: Metadata =
    createPageMetadata({
        title: "Projects",
        description:
            "Explore selected Pixardia digital products, platforms and web experiences.",
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

            <div className="mt-10">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1E1E1E]">
                    Selected work
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    {projects.map((project) => (
                        <article
                            key={project.slug}
                            className="border-t border-[#1E1E1E] pt-5"
                        >
                            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#777777]">
                                {project.type}
                            </p>

                            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight text-[#1E1E1E]">
                                {project.title}
                            </h3>

                            <p className="mt-3 max-w-xl">
                                {project.summary.en}
                            </p>

                            <Link
                                href={`/projects/${project.slug}`}
                                className="mt-4 inline-flex font-bold underline underline-offset-4"
                            >
                                View project
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
