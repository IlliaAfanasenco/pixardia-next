import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
    getServiceBySlug,
    services,
} from "@/content/services";
import { createPageMetadata } from "@/lib/seo";

type ServicePageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
    return services.map((service) => ({
        slug: service.slug,
    }));
}

export async function generateMetadata({
                                           params,
                                       }: ServicePageProps): Promise<Metadata> {
    const { slug } = await params;
    const service = getServiceBySlug(slug);

    if (!service) {
        return {
            title: "Service not found",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    return createPageMetadata({
        title: service.title.en,
        description: service.shortDescription.en,
        path: `/services/${service.slug}`,
    });
}

export default async function ServicePage({
                                              params,
                                          }: ServicePageProps) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);

    if (!service) {
        notFound();
    }

    return (
        <article
            className="container-custom py-12 sm:py-16"
            aria-labelledby="service-page-title"
        >
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#777777]">
                {service.code}
            </p>

            <h1
                id="service-page-title"
                className="mt-3 text-4xl font-black uppercase tracking-tight text-[#1E1E1E]"
            >
                {service.title.en}
            </h1>

            <p className="mt-6 max-w-3xl">
                {service.description.en}
            </p>
        </article>
    );
}
