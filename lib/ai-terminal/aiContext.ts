import { siteConfig } from "@/config/site";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import {
    type LocalizedText,
    type Project,
    type Service,
} from "@/types/services";

import { type TerminalLanguage } from "./terminalContract";

const MAX_CONTEXT_LENGTH = 7_000;
const MAX_FIELD_LENGTH = 500;

function normalizeText(value: string): string {
    return value.replace(/\s+/g, " ").trim();
}

function truncateText(
    value: string,
    maxLength = MAX_FIELD_LENGTH,
): string {
    const normalizedValue = normalizeText(value);

    if (normalizedValue.length <= maxLength) {
        return normalizedValue;
    }

    return `${normalizedValue.slice(0, maxLength).trim()}...`;
}

function localize(
    value: LocalizedText,
    language: TerminalLanguage,
): string {
    return truncateText(value[language]);
}

function compactService(
    service: Service,
    language: TerminalLanguage,
): string {
    const deliverables = service.deliverables[language]
        .slice(0, 6)
        .map((item) => truncateText(item, 120))
        .join("; ");

    const technologies = service.technologies
        .slice(0, 8)
        .join("; ");

    const priceNote =
        service.priceFrom === null
            ? "custom estimate after project review"
            : `from ${service.priceFrom} EUR, indicative only`;

    return [
        `- code: ${service.code}`,
        `  slug: ${service.slug}`,
        `  title: ${localize(service.title, language)}`,
        `  summary: ${localize(service.shortDescription, language)}`,
        `  description: ${localize(service.description, language)}`,
        `  timeline: ${localize(service.timeline, language)}`,
        `  price: ${priceNote}`,
        `  deliverables: ${deliverables}`,
        `  technologies: ${technologies}`,
    ].join("\n");
}

function compactProject(
    project: Project,
    language: TerminalLanguage,
): string {
    return [
        `- slug: ${project.slug}`,
        `  title: ${project.title}`,
        `  type: ${project.type}`,
        `  status: ${project.status}`,
        `  summary: ${localize(project.summary, language)}`,
        `  services: ${project.serviceCodes.join("; ")}`,
        `  technologies: ${project.technologies.slice(0, 8).join("; ")}`,
    ].join("\n");
}

function limitContext(value: string): string {
    const normalizedValue = value.trim();

    if (normalizedValue.length <= MAX_CONTEXT_LENGTH) {
        return normalizedValue;
    }

    return `${normalizedValue
        .slice(0, MAX_CONTEXT_LENGTH)
        .trim()}\n<context_truncated>true</context_truncated>`;
}

export function buildPixardiaAiContext(
    language: TerminalLanguage,
): string {
    const servicesContext = services
        .map((service) => compactService(service, language))
        .join("\n");

    const projectsContext = projects
        .map((project) => compactProject(project, language))
        .join("\n");

    return limitContext(`
<pixardia_context>
<brand>
name: ${siteConfig.name}
description: ${truncateText(siteConfig.description, 600)}
service_areas: ${siteConfig.serviceAreas.join("; ")}
</brand>

<routes>
home: ${siteConfig.links.home}
services: ${siteConfig.links.services}
projects: ${siteConfig.links.projects}
contact: ${siteConfig.links.contact}
privacy: ${siteConfig.links.privacy}
imprint: ${siteConfig.links.imprint}
</routes>

<business_rules>
exact_price_in_terminal: false
exact_deadline_in_terminal: false
contact_details_in_terminal: false
manager_review_for_estimate: true
contact_destination: ${siteConfig.links.contact}
</business_rules>

<services>
${servicesContext}
</services>

<projects>
${projectsContext}
</projects>
</pixardia_context>
`);
}