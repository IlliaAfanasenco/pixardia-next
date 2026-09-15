import { routeLocale } from "@/i18n/server";
import { translator } from "@/i18n/getDictionary";
import type { Metadata } from "next";

import ContactSection from "@/components/ContactSection";
import { getProjectBySlug } from "@/content/projects";
import { getServiceBySlug } from "@/content/services";
import { createPageMetadata } from "@/lib/seo";
import { type ServiceCode } from "@/types/services";

type ContactPageProps = {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{
        service?: string;
        project?: string;
    }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = await routeLocale(params);
    const t = translator(locale);
    return createPageMetadata({
    title: t("Start a Project"),
    description:
        t("Tell Pixardia about your business, project goals and required digital product to receive a clear next-step review."),
    path: "/contact",

        locale,
    });
}

function getDefaultServiceCode(
    serviceSlug?: string,
    projectSlug?: string,
): ServiceCode {
    if (serviceSlug) {
        const service = getServiceBySlug(serviceSlug);

        if (service) {
            return service.code;
        }
    }

    if (projectSlug) {
        const project = getProjectBySlug(projectSlug);

        if (project?.serviceCodes[0]) {
            return project.serviceCodes[0];
        }
    }

    return "BUSINESS_WEBSITE";
}

export default async function ContactPage({
                                              params,
                                              searchParams,
                                          }: ContactPageProps) {
    const locale = await routeLocale(params);
    const t = translator(locale);
    const { service, project } = await searchParams;

    return (
        <>
            <h1 className="sr-only">
                {t("Start a project with Pixardia")}</h1>

            <ContactSection
                defaultServiceCode={getDefaultServiceCode(
                    service,
                    project,
                )}
            />
        </>
    );
}
