import type { Metadata } from "next";
import Link from "next/link";

import { services } from "@/content/services";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: "Services",
    description:
        "Explore Pixardia services for business websites, landing pages, web applications, e-commerce, UI and UX design, AI automation and ongoing support.",
    path: "/services",
});

export default function ServicesPage() {
    return (
        <section
            className="container-custom py-12 sm:py-16"
            aria-labelledby="services-page-title"
        >
            <h1
                id="services-page-title"
                className="text-4xl font-black uppercase tracking-tight text-[#1E1E1E]"
            >
                Services
            </h1>

            <div className="mt-10 space-y-10">
                {services.map((service) => (
                    <article
                        key={service.code}
                        className="border-t border-[#1E1E1E] pt-6"
                    >
                        <h2 className="text-2xl font-bold text-[#1E1E1E]">
                            {service.title.en}
                        </h2>

                        <p className="mt-3 max-w-3xl">
                            {service.description.en}
                        </p>

                        <Link
                            href={`/services/${service.slug}`}
                            className="mt-4 inline-flex font-bold underline underline-offset-4"
                        >
                            View service
                        </Link>
                    </article>
                ))}
            </div>
        </section>
    );
}
