import { siteConfig } from "@/config/site";
import { projects } from "@/content/projects";
import { services } from "@/content/services";

type UnknownRecord = Record<string, unknown>;

const MAX_CONTEXT_LENGTH = 4_500;
const MAX_SERVICES = 10;
const MAX_PROJECTS = 6;
const MAX_FIELD_LENGTH = 420;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeText(value: string) {
    return value.replace(/\s+/g, " ").trim();
}

function truncateText(value: string, maxLength = MAX_FIELD_LENGTH) {
    const normalizedValue = normalizeText(value);

    if (normalizedValue.length <= maxLength) {
        return normalizedValue;
    }

    return `${normalizedValue.slice(0, maxLength).trim()}...`;
}

function getStringField(record: UnknownRecord, keys: string[]) {
    for (const key of keys) {
        const value = record[key];

        if (typeof value === "string" && value.trim().length > 0) {
            return truncateText(value);
        }

        if (typeof value === "number") {
            return String(value);
        }
    }

    return undefined;
}

function getStringListField(record: UnknownRecord, keys: string[], maxItems = 6) {
    for (const key of keys) {
        const value = record[key];

        if (Array.isArray(value)) {
            const items = value
                .filter((item): item is string => typeof item === "string")
                .map((item) => truncateText(item, 120))
                .filter(Boolean)
                .slice(0, maxItems);

            if (items.length > 0) {
                return items;
            }
        }
    }

    return [];
}

function compactService(service: unknown, index: number) {
    if (!isRecord(service)) {
        return `service_${index + 1}: unavailable`;
    }

    const slug = getStringField(service, ["slug"]) ?? `service-${index + 1}`;
    const title = getStringField(service, ["title", "name"]) ?? slug;

    const summary =
        getStringField(service, [
            "short",
            "shortDesc",
            "summary",
            "description",
            "seoDesc",
        ]) ?? "No short description provided.";

    const timeline = getStringField(service, ["timeline", "duration"]);
    const priceFrom = getStringField(service, ["priceFrom", "price", "startingPrice"]);

    const includes = getStringListField(service, [
        "includes",
        "features",
        "deliverables",
    ]);

    const lines = [
        `- slug: ${slug}`,
        `  title: ${title}`,
        `  summary: ${summary}`,
    ];

    if (timeline) {
        lines.push(`  timeline_note: ${timeline}`);
    }

    if (priceFrom) {
        lines.push(
            `  price_note: ${priceFrom} is indicative only; exact pricing requires project details.`,
        );
    }

    if (includes.length > 0) {
        lines.push(`  includes: ${includes.join("; ")}`);
    }

    return lines.join("\n");
}

function compactProject(project: unknown, index: number) {
    if (!isRecord(project)) {
        return `project_${index + 1}: unavailable`;
    }

    const slug = getStringField(project, ["slug"]) ?? `project-${index + 1}`;
    const title = getStringField(project, ["title", "name"]) ?? slug;
    const category = getStringField(project, ["category", "type"]);

    const summary =
        getStringField(project, [
            "short",
            "shortDesc",
            "summary",
            "description",
            "seoDesc",
            "problem",
            "solution",
            "result",
        ]) ?? "No short project summary provided.";

    const technologies = getStringListField(project, [
        "technologies",
        "stack",
        "tools",
    ]);

    const lines = [
        `- slug: ${slug}`,
        `  title: ${title}`,
        `  summary: ${summary}`,
    ];

    if (category) {
        lines.push(`  category: ${category}`);
    }

    if (technologies.length > 0) {
        lines.push(`  technologies: ${technologies.join("; ")}`);
    }

    return lines.join("\n");
}

function limitFinalContext(context: string) {
    const normalizedContext = context.trim();

    if (normalizedContext.length <= MAX_CONTEXT_LENGTH) {
        return normalizedContext;
    }

    return `${normalizedContext.slice(0, MAX_CONTEXT_LENGTH).trim()}\n<context_truncated>true</context_truncated>`;
}

export function buildPixardiaAiContext() {
    const servicesContext = services
        .slice(0, MAX_SERVICES)
        .map((service, index) => compactService(service, index))
        .join("\n");

    const projectsContext = projects
        .slice(0, MAX_PROJECTS)
        .map((project, index) => compactProject(project, index))
        .join("\n");

    return limitFinalContext(`
<pixardia_context>
<brand>
name: ${siteConfig.name}
description: ${truncateText(siteConfig.description, 600)}
</brand>

<routes>
home: ${siteConfig.links.home}
services: ${siteConfig.links.services}
projects: ${siteConfig.links.projects}
contact_form: ${siteConfig.links.contact}
</routes>

<business_rules>
exact_price_available_in_terminal: false
exact_deadline_available_in_terminal: false
contact_details_allowed_in_terminal: false
contact_details_destination: contact_form
manager_review_required_for_exact_estimate: true
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