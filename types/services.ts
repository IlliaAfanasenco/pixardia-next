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

export type ProjectStatus =
    (typeof projectStatuses)[number];

export const projectEvidenceStates = [
    "verified",
    "target",
    "not_measured",
] as const;

export type ProjectEvidenceState =
    (typeof projectEvidenceStates)[number];

export const projectPanelDirections = [
    "left",
    "right",
] as const;

export type ProjectPanelDirection =
    (typeof projectPanelDirections)[number];

export type ProjectFact = {
    label: LocalizedText;
    value: LocalizedText;
};

export type ProjectTechnologyGroup = {
    label: LocalizedText;
    items: readonly string[];
};

export type ProjectColorToken = {
    label: LocalizedText;
    value: `#${string}`;
};

export type ProjectQualitySignal = {
    label: LocalizedText;
    value: LocalizedText;
    evidence: ProjectEvidenceState;
};

export type ProjectMediaAsset = {
    src: string;
    alt: LocalizedText;
    width: number;
    height: number;
    caption?: LocalizedText;
};

export type ProjectCaseStudy = {
    identifier: string;
    subtitle: LocalizedText;
    role: LocalizedText;
    client: string | null;
    engagement: LocalizedText;
    architecture: LocalizedText;
    facts: readonly ProjectFact[];
    technologyGroups: readonly ProjectTechnologyGroup[];
    visualSystem: {
        colors: readonly ProjectColorToken[];
        typeface: string;
    };
    qualitySignals: readonly ProjectQualitySignal[];
    presentation: {
        desktopDirection: ProjectPanelDirection;
        centerLabel: LocalizedText;
    };
};

export type Project = {
    slug: string;
    title: string;
    type: ProjectType;
    status: ProjectStatus;
    summary: LocalizedText;
    description: LocalizedText;
    challenge: LocalizedText;
    solution: LocalizedText;
    serviceCodes: readonly ServiceCode[];
    technologies: readonly string[];
    year: number;
    coverImage: ProjectMediaAsset | null;
    images: readonly ProjectMediaAsset[];
    liveUrl: string | null;
    repositoryUrl: string | null;
    featured: boolean;
    order: number;
    caseStudy: ProjectCaseStudy;
};

export type ServiceOption = {
    value: ServiceCode;
    label: string;
};
