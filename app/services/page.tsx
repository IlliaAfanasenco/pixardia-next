import Link from "next/link";

import { services } from "@/content/services";

export default function ServicesPage() {
    return (
        <div>
            {services.map((service) => (
                <div key={service.code}>
                    <h2>{service.title.en}</h2>
                    <p>{service.description.en}</p>

                    <Link href={`/services/${service.slug}`}>
                        link
                    </Link>
                </div>
            ))}
        </div>
    );
}