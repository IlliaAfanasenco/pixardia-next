import React from 'react';
import {projects} from "@/content/projects";

const Projects = () => {
    return (
        <div>
            {projects.map((project)=>(
                <div key={project.slug}>
                    <h2>{project.title}</h2>
                    <p>{project.category}</p>
                    <p>{project.result}</p>
                </div>
            ))}
        </div>
    );
};

export default Projects;