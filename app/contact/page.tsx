import type { Metadata } from "next";

import ContactSection from "@/components/ContactSection";
import { getProjectBySlug } from "@/content/projects";
import { getServiceBySlug } from "@/content/services";
import { createPageMetadata } from "@/lib/seo";
import { type ServiceCode } from "@/types/services";

type ContactPageProps = {
    searchParams: Promise<{
        service?: string;
        project?: string;
    }>;
};

export const metadata: Metadata = createPageMetadata({
    title: "Start a Project",
    description:
        "Describe your website, web application, e-commerce or AI automation project and request a review from Pixardia.",
    path: "/contact",
});

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
                                              searchParams,
                                          }: ContactPageProps) {
    const { service, project } = await searchParams;

    return (
        <>
            <h1 className="sr-only">
                Start a project with Pixardia
            </h1>

            <ContactSection
                defaultServiceCode={getDefaultServiceCode(
                    service,
                    project,
                )}
            />
        </>
    );
}
