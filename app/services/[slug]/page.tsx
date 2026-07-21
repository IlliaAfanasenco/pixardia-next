import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
    getServiceBySlug,
    services,
} from "@/content/services";

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
            title: "Service not found | Pixardia",
        };
    }

    return {
        title: `${service.title.en} | Pixardia`,
        description: service.shortDescription.en,
    };
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
        <div>
            <p>{service.code}</p>
            <p>{service.title.en}</p>
            <p>{service.description.en}</p>
        </div>
    );
}