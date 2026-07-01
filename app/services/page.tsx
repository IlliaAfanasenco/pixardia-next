import React from 'react';
import {serviceBySlug, services} from "@/content/services";
import Link from "next/link";

const Services = () => {
    return (
        <div>
            {services.map((service)=> (
                <div key={service.slug}>
                    <h2>{service.title}</h2>
                    <p>{service.description}</p>

                    <Link href={`/services/${service.slug}`}>link</Link>
                </div>
            ))}
        </div>
    );
};

export default Services;