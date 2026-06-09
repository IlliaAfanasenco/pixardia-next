import React from 'react';
import {serviceBySlug} from "@/content/services";

type ServiceSlugProps = {
    params: Promise<{
        slug: string
    }>
}

const ServiceSlug = async ({params}: ServiceSlugProps) => {
    const {slug} = await params
    console.log(slug)
    const service = serviceBySlug(slug)
    return (
        <div>
        <p>{service?.serviceType}</p>
            <p>{service?.title}</p>
        </div>
    );
};

export default ServiceSlug;