export const projects = [
    {
        slug: "pixardia-agency-website",

        title: "Pixardia Digital Agency Website",

        category: "web-development",

        shortDesc:
            "A modern digital agency website designed to showcase services, build credibility, and convert visitors into potential clients.",

        problems:
            "Many growing businesses struggle to establish a professional online presence that effectively communicates their expertise, services, and value proposition. Outdated websites often fail to build trust and generate qualified leads.",

        solution:
            "We designed and developed a high-performance website with a modern user interface, responsive layouts, clear service presentation, SEO foundations, and optimized user journeys focused on conversion and engagement.",

        result:
            "The project provides a scalable digital presence that strengthens brand perception, improves online visibility, and creates a reliable channel for attracting new business opportunities.",

        technologies: [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Node.js",
            "Responsive Design",
            "SEO"
        ],

        serviceSlug: [
            "web-development",
            "ui-ux-design",
            "seo-optimization"
        ],

        seoTitle:
            "Pixardia Digital Agency Website | Modern Web Development Solutions",

        seoDesc:
            "Discover Pixardia's modern agency website built with Next.js and TypeScript. Professional web development, responsive design, SEO optimization, and scalable digital solutions for businesses."
    }
]as const

export type Project = (typeof  projects)[number]
export type ProjectSlug = Project["slug"]


export  function projectBySlug(slug: string) {
    return projects.find((project) => project.slug === slug)
}