import React from 'react';
import {serviceBySlug, services} from "@/content/services";
import {Metadata} from "next";
import {notFound} from "next/navigation";

type ServiceSlugProps = {
    params: Promise<{
        slug: string
    }>
}

export function generateStaticParams() {
    return services.map((service) => ({
        slug: service.slug
    }))
}

export async function generateMetadata({params}: ServiceSlugProps): Promise<Metadata> {
    const {slug} = await params
    const service = serviceBySlug(slug)

    if(!service) {
        return {
            title: 'services not found'
        }
    }

    return {
        title: service.seoTitle,
        description: service.seoDescription
    }
}

const ServiceSlug = async ({params}: ServiceSlugProps) => {
    const {slug} = await params
    console.log(slug)
    const service = serviceBySlug(slug)

    if(!service) {
        notFound()
    }
    return (
        <div>
        <p>{service.serviceType}</p>
            <p>{service.title}</p>
        </div>
    );
};

export default ServiceSlug;