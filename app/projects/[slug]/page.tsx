import React from 'react';
import {projectBySlug, projects} from "@/content/projects";
import {notFound} from "next/navigation";
import {Metadata} from "next";
import {serviceBySlug} from "@/content/services";

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

export async function generateMetadata({params}: ProjectSlugProps): Promise<Metadata> {
    const {slug} = await params
    const project = projectBySlug(slug)

    if(!project) {
        return {
            title: 'projects not found'
        }
    }

    return {
        title: project.seoTitle,
        description: project.seoDesc
    }
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