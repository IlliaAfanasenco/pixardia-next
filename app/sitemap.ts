import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { siteLocales } from "@/i18n/config";
import { localePath } from "@/i18n/navigation";

type SitemapRoute = Readonly<{
    path: string;
    priority: number;
    changeFrequency:
        MetadataRoute.Sitemap[number]["changeFrequency"];
}>;

const staticRoutes: readonly SitemapRoute[] = [
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
    const serviceRoutes: SitemapRoute[] = services.map(
        (service) => ({
            path: `/services/${service.slug}`,
            priority: 0.85,
            changeFrequency: "monthly",
        }),
    );

    const projectRoutes: SitemapRoute[] = projects.map(
        (project) => ({
            path: `/projects/${project.slug}`,
            priority: 0.75,
            changeFrequency: "monthly",
        }),
    );

    const routes = [
        ...staticRoutes,
        ...serviceRoutes,
        ...projectRoutes,
    ];

    return routes.flatMap((route) => siteLocales.map((locale) => ({
        url: new URL(
            localePath(locale, route.path),
            siteConfig.url,
        ).toString(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: Object.fromEntries(siteLocales.map(language => [
            language, new URL(localePath(language, route.path), siteConfig.url).toString(),
        ])) },
    })));
}
