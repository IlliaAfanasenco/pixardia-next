export const serviceCodes = [
    "BUSINESS_WEBSITE",
    "LANDING_PAGE",
    "WEB_APPLICATION",
    "ECOMMERCE",
    "WEBSITE_REDESIGN",
    "UI_UX_DESIGN",
    "AI_AUTOMATION",
    "MAINTENANCE_SUPPORT",
] as const;

export type ServiceCode = (typeof serviceCodes)[number];

export type LocalizedText = {
    en: string;
    de: string;
};

export type Service = {
    code: ServiceCode;
    slug: string;
    title: LocalizedText;
    shortDescription: LocalizedText;
    description: LocalizedText;
    deliverables: {
        en: string[];
        de: string[];
    };
    technologies: string[];
    timeline: LocalizedText;
    priceFrom: number | null;
    featured: boolean;
    order: number;
};

export const projectTypes = [
    "client",
    "internal",
    "concept",
    "educational",
] as const;

export type ProjectType = (typeof projectTypes)[number];

export const projectStatuses = [
    "planned",
    "in_progress",
    "completed",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export type Project = {
    slug: string;
    title: string;
    type: ProjectType;
    status: ProjectStatus;
    summary: LocalizedText;
    description: LocalizedText;
    challenge: LocalizedText;
    solution: LocalizedText;
    serviceCodes: ServiceCode[];
    technologies: string[];
    year: number;
    coverImage: string | null;
    images: string[];
    liveUrl: string | null;
    repositoryUrl: string | null;
    featured: boolean;
    order: number;
};

export type ServiceOption = {
    value: ServiceCode;
    label: string;
};