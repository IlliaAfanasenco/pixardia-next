import { routeLocale } from "@/i18n/server";
import { getDictionary, translator } from "@/i18n/getDictionary";
import { publicPath } from "@/i18n/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Archivo } from "next/font/google";

import { services } from "@/content/services";
import { siteConfig } from "@/config/site";
import ServicePreview from "@/components/services/ServicePreview";
import servicesAstronaut from "@/public/images/astronautNewFooter.png";
import { createPageMetadata } from "@/lib/seo";
import styles from "./services.module.css";

const archivo = Archivo({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
    variable: "--font-archivo",
});

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
    const copy = getDictionary(locale).servicesPage;
    const contactHref = publicPath(locale, siteConfig.links.contact);

    return (
        <div className={`${archivo.variable} ${styles.page}`} data-services-page="">
            <section className={`site-container ${styles.hero}`} aria-labelledby="services-page-title">
                <div className={styles.heroCopy}>
                    <p className={styles.eyebrow}>{copy.eyebrow}</p>
                    <h1 id="services-page-title" className={styles.heroTitle}>
                        <span>{copy.titleLine1}</span>
                        <span>{copy.titleLine2}</span>
                    </h1>
                    <p className={styles.description}>{copy.description}</p>
                    <Link href={contactHref} className={styles.button}>{copy.startProject}</Link>
                </div>

                <div className={styles.heroVisual} aria-hidden="true">
                    <div className={styles.orbit} />
                    <div className={styles.browser}>
                        <div className={styles.browserBar}><i /><i /><i /><span /></div>
                        <div className={styles.browserBody}>
                            <div className={styles.mockHeading}><i /><i /></div>
                            <div className={styles.mockCopy}><i /><i /><i /></div>
                            <div className={styles.mockButton} />
                            <div className={styles.mockCards}><i /><i /><i /></div>
                        </div>
                    </div>
                    <Image src="/images/alienAr.png" alt="" width={390} height={417} sizes="(max-width: 767px) 140px, 200px" className={styles.heroAlien} />
                    <Image src={servicesAstronaut} alt="" sizes="(max-width: 767px) 180px, 300px" className={styles.heroAstronaut} loading="eager" />
                    <div className={styles.visualAccent}><span /><span /><span /></div>
                </div>
            </section>

            <section className={`site-container ${styles.capabilities}`} aria-labelledby="services-grid-title">
                <div className={styles.gridIntro}>
                    <h2 id="services-grid-title">{copy.gridHeading}</h2>
                    <p>{copy.gridDescription}</p>
                </div>
                <div className={styles.grid}>
                    {services.map((service, index) => {
                        const text = copy.services[service.code];
                        return (
                            <article key={service.code} className={styles.card} data-service-code={service.code}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                                    <h3 id={`service-title-${service.code}`}>{text.title}</h3>
                                </div>
                                <ServicePreview code={service.code} />
                                <p className={styles.cardDescription}>{text.description}</p>
                                <Link className={styles.cardLink} href={publicPath(locale, `/services/${service.slug}`)} aria-labelledby={`service-action-${service.code} service-title-${service.code}`}>
                                    <span id={`service-action-${service.code}`}>{copy.exploreService}</span>
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className={`site-container ${styles.closing}`} aria-labelledby="services-closing-title">
                <div className={styles.closingPanel}>
                    <div className={styles.closingCopy}>
                        <p className={styles.eyebrow}>{copy.closingEyebrow}</p>
                        <h2 id="services-closing-title"><span>{copy.closingTitleLine1}</span><span>{copy.closingTitleLine2}</span></h2>
                        <p className={styles.description}>{copy.closingDescription}</p>
                        <Link href={contactHref} className={styles.button}>{copy.getInTouch}</Link>
                    </div>
                    <Image src="/images/astronautAlienContacts.png" alt="" width={494} height={318} sizes="(max-width: 767px) 280px, 420px" className={styles.closingArt} />
                </div>
            </section>
        </div>
    );
}
