import type { SiteLocale } from "@/i18n/config";
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

export type LocalizedText = Record<SiteLocale, string>;

export type Service = {
    code: ServiceCode;
    slug: string;
    title: LocalizedText;
    shortDescription: LocalizedText;
    description: LocalizedText;
    deliverables: Record<SiteLocale, string[]>;
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

export const projectClassifications = [
    "real_project",
    "studio_concept",
] as const;

/** Real Project = delivered for an identifiable client; Studio Concept = proposed product, nothing deployed or measured. */
export type ProjectClassification =
    (typeof projectClassifications)[number];

/** One gallery view with the context shown beside it while it is active. */
export type ProjectGallerySlide = {
    media: ProjectMediaAsset;
    title: LocalizedText;
    description: LocalizedText;
};

/** A titled list of features for one audience, e.g. customers or store administrators. */
export type ProjectFeatureGroup = {
    label: LocalizedText;
    items: readonly LocalizedText[];
};

export type ProjectClientProfile = {
    name: string;
    industry?: LocalizedText;
    region?: LocalizedText;
    website?: string;
};

/** A measured outcome. Only for real projects; the content contract rejects results on concepts. */
export type ProjectResult = {
    label: LocalizedText;
    value: LocalizedText;
    source?: LocalizedText;
};

export type ProjectLink = {
    label: LocalizedText;
    href: string;
};

export type ProjectCaseStudy = {
    identifier: string;
    subtitle: LocalizedText;
    category?: LocalizedText;
    classification?: ProjectClassification;
    role?: LocalizedText;
    client?: string | null;
    clientProfile?: ProjectClientProfile;
    engagement?: LocalizedText;
    architecture?: LocalizedText;
    facts?: readonly ProjectFact[];
    technologyGroups?: readonly ProjectTechnologyGroup[];
    /** Modal/page gallery with per-view descriptions. Takes precedence over coverImage + images. */
    gallery?: readonly ProjectGallerySlide[];
    capabilities?: readonly LocalizedText[];
    capabilitiesNote?: LocalizedText;
    featureGroups?: readonly ProjectFeatureGroup[];
    scope?: readonly LocalizedText[];
    results?: readonly ProjectResult[];
    links?: readonly ProjectLink[];
    commercialCta?: {
        label: LocalizedText;
        href: string;
    };
    visualSystem: {
        colors: readonly ProjectColorToken[];
        typeface: string;
    };
    qualitySignals?: readonly ProjectQualitySignal[];
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
    challenge?: LocalizedText;
    solution?: LocalizedText;
    serviceCodes: readonly ServiceCode[];
    technologies: readonly string[];
    year: number;
    coverImage: ProjectMediaAsset | null;
    images: readonly ProjectMediaAsset[];
    /**
     * Homepage archive card. The card renders its designed system diagram unless an image is
     * set here explicitly; gallery and cover changes never reach the archive thumbnail.
     */
    archivePreview?: {
        image?: ProjectMediaAsset;
    };
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
