import Link from "next/link";

import { projects } from "@/content/projects";

export default function ProjectsPage() {
    return (
        <div>
            {projects.map((project) => (
                <div key={project.slug}>
                    <h2>{project.title}</h2>
                    <p>{project.type}</p>
                    <p>{project.summary.en}</p>

                    <Link href={`/projects/${project.slug}`}>
                        link
                    </Link>
                </div>
            ))}
        </div>
    );
}