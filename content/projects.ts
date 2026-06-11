export const projects = [
    {
        slug: "project1",
        title: "first",
        category: "web-app",
        shortDesc: "dewd",
        problems: "cdcsd",
        solution: "iericejij",
        result: "jfvndvd",
        technologies: [],
        serviceSlug: [],
        seoTitle: "jjj",
        seoDesc: "ijfrej"
    }
]as const

export type Project = (typeof  projects)[number]
export type ProjectSlug = Project["slug"]


export  function projectBySlug(slug: string) {
    return projects.find((project) => project.slug === slug)
}