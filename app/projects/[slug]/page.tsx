import React from 'react';
import {projectBySlug, projects} from "@/content/projects";
import {notFound} from "next/navigation";

type ProjectSlugProps = {
    params: Promise<{
        slug:string
    }>
}

export function generateStaticParams(){
    return projects.map((project)=>({
        slug: project.slug
    }))
}

async function ProjectSlug({params}: ProjectSlugProps) {
    const{slug} = await params
    const project = projectBySlug(slug)

    if (!project){
        notFound()
    }
    return (
        <div>
            <p>{project.title}</p>
            <p>{project.category}</p>
        </div>
    );
};

export default ProjectSlug;