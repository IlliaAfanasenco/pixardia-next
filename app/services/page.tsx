import React from 'react';
import {serviceBySlug, services} from "@/content/services";
import Link from "next/link";

const Services = () => {
    return (
        <div>
            {services.map((service)=> (
                <div key={service.slug}>
                    <h2>{service.title}</h2>
                    <p>{service.desc}</p>

                    <Link href={`/services/${service.slug}`}>linl</Link>
                </div>
            ))}
        </div>
    );
};

export default Services;