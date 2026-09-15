import { routeLocale } from "@/i18n/server";
import { translator } from "@/i18n/getDictionary";
import { localized } from "@/i18n/localized";
import { publicPath } from "@/i18n/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { services } from "@/content/services";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = await routeLocale(params);
    const t = translator(locale);
    return createPageMetadata({
    title: t("Services"),
    description:
        t("Explore full-cycle digital services covering strategy, UX and UI, development, AI automation, launch and ongoing support."),
    path: "/services",

        locale,
    });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await routeLocale(params);
    const t = translator(locale);
    return (
        <section
            className="container-custom py-12 sm:py-16"
            aria-labelledby="services-page-title"
        >
            <h1
                id="services-page-title"
                className="text-4xl font-black uppercase tracking-tight text-[#1E1E1E]"
            >
                {t("Digital Capabilities")}</h1>

            <div className="mt-10 space-y-10">
                {services.map((service) => (
                    <article
                        key={service.code}
                        className="border-t border-[#1E1E1E] pt-6"
                    >
                        <h2 className="text-2xl font-bold text-[#1E1E1E]">
                            {localized(service.title, locale)}
                        </h2>

                        <p className="mt-3 max-w-3xl">
                            {localized(service.description, locale)}
                        </p>

                        <Link
                            href={publicPath(locale, `/services/${service.slug}`)}
                            className="mt-4 inline-flex font-bold underline underline-offset-4"
                        >
                            {t("View capability")}</Link>
                    </article>
                ))}
            </div>
        </section>
    );
}
