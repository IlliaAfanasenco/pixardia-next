import type {MetadataRoute} from "next";

import {siteConfig} from "@/config/site";
import {projects} from "@/content/projects";
import {services} from "@/content/services";

type SitemapRoute = {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const staticRoutes: SitemapRoute[] = [
    {
        path: siteConfig.links.home,
        priority: 1,
        changeFrequency: "weekly",
    },
    {
        path: siteConfig.links.services,
        priority: 0.9,
        changeFrequency: "monthly",
    },
    {
        path: siteConfig.links.projects,
        priority: 0.8,
        changeFrequency: "monthly",
    },
    {
        path: siteConfig.links.contact,
        priority: 0.7,
        changeFrequency: "yearly",
    },
];

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    const serviceRoutes: SitemapRoute[] = services.map((service) => ({
        path: `/services/${service.slug}`,
        priority: 0.85,
        changeFrequency: "monthly",
    }));

    const projectRoutes: SitemapRoute[] = projects.map((project) => ({
        path: `/projects/${project.slug}`,
        priority: 0.75,
        changeFrequency: "monthly",
    }));

    const routes = [...staticRoutes, ...serviceRoutes, ...projectRoutes];

    return routes.map((route) => ({
        url: new URL(route.path, siteConfig.url).toString(),
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}