import { getServiceByCode } from "@/content/services";
import { localized } from "@/i18n/localized";
import { publicPath } from "@/i18n/navigation";
import type { SiteLocale } from "@/i18n/config";
import { translator } from "@/i18n/getDictionary";
import Image from "next/image";
import Link from "next/link";

import ProductProgress from "@/components/ProductProgress";
import { siteConfig } from "@/config/site";

const cards = [
    {
        label: "WEBSITES",
        code: "PX101",
        title: "BUSINESS",
        titleSecond: "WEBSITES",
        serviceCode: "BUSINESS_WEBSITE",
        bottom: "TRUST & ENQUIRIES",
    },
    {
        label: "PLATFORMS",
        code: "PX202",
        title: "WEB",
        titleSecond: "APPLICATIONS",
        serviceCode: "WEB_APPLICATION",
        bottom: "WORKFLOW READY",
    },
    {
        label: "SYSTEMS",
        code: "PX303",
        title: "AI &",
        titleSecond: "AUTOMATION",
        serviceCode: "AI_AUTOMATION",
        bottom: "EFFICIENCY BUILT",
        withAstronaut: true,
    },
    {
        label: "CONTINUITY",
        code: "PX404",
        title: "SUPPORT &",
        titleSecond: "DEVELOPMENT",
        serviceCode: "MAINTENANCE_SUPPORT",
        bottom: "LONG-TERM VALUE",
    },
] as const;

const systemChecks = [
    {
        icon: "/icons/arrowGreenProd.svg",
        text: "Strategy, scope and business goals aligned.",
        className: "text-[#5E9D72]",
    },
    {
        icon: "/icons/arrowBlueProd.svg",
        text: "UX, interface and engineering systems prepared.",
        className: "text-[#7770D8]",
    },
    {
        icon: "/icons/arrowGreyProd.svg",
        text: "Launch and ongoing support included in the route.",
        className: "text-[#9A9A9A]",
    },
] as const;

type ProductCardProps = {
    locale: SiteLocale;
    label: string;
    code: string;
    title: string;
    titleSecond: string;
    text: string;
    bottom: string;
    withAstronaut?: boolean;
};

function ProductCard({ locale,
                         label,
                         code,
                         title,
                         titleSecond,
                         text,
                         bottom,
                         withAstronaut = false,
                     }: ProductCardProps) {
    const t = translator(locale);
    return (
        <article
            className="relative min-w-0 border border-[#808181] p-5 md:p-6"
            data-cinematic-product-card=""
        >
            {withAstronaut && (
                <Image
                    src="/images/astronautProd.png"
                    alt=""
                    aria-hidden="true"
                    width={150}
                    height={150}
                    className="pointer-events-none absolute -left-6 -top-23 hidden h-auto w-[120px] object-contain 2xl:block"
                />
            )}

            <div className="flex items-center justify-between gap-3">
                <p className="inline-flex items-center justify-center border-2 border-[#E1DED6] p-1.5 text-center text-xs font-bold leading-none text-[#878787]">
                    {t(label)}
                </p>

                <p className="text-xs font-bold leading-none text-[#CFCFCF]">
                    {code}
                </p>
            </div>

            <h3 className="pt-6 text-2xl font-black uppercase leading-[1.05] text-[#1E1E1E]">
                {t(title)}
                <br />
                {t(titleSecond)}
            </h3>

            <p className="pt-5 text-xs font-bold uppercase leading-[1.35] text-[#A7A7AA]">
                {text}
            </p>

            <div className="flex items-center justify-between gap-4 pt-11">
                <p className="text-xs font-bold leading-none text-[#777779]">
                    {t(bottom)}
                </p>

                <Image
                    src="/icons/lineProd.svg"
                    alt=""
                    aria-hidden="true"
                    width={72}
                    height={8}
                    className="h-auto max-w-[40%]"
                />
            </div>
        </article>
    );
}

function ProductSystemPanel({ locale }: { locale: SiteLocale }) {
    const t = translator(locale);
    return (
        <div
            className="border-b-[5px] border-r-[10px] border-[#4F46E5] bg-[#101111] md:col-span-2 xl:col-span-3"
            data-cinematic-element="product-system"
        >
            <div className="flex h-full flex-col px-5 py-6 md:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-white">
                            {t("Full-cycle delivery system")}
                        </p>

                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white/35">
                            {t("Strategy / UX & UI / development / launch / support")}
                        </p>
                    </div>

                    <span className="border border-[#5E9D72] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-[#78B58C]">
                        {t("production ready")}
                        </span>
                </div>

                <div className="mt-5 grid gap-4">
                    {systemChecks.map((check) => (
                        <div
                            key={check.text}
                            className={`flex items-start gap-3 font-mono text-xs font-bold leading-5 md:text-sm ${check.className}`}
                        >
                            <Image
                                src={check.icon}
                                alt=""
                                aria-hidden="true"
                                width={14}
                                height={14}
                                className="mt-0.5 shrink-0"
                            />

                            <p>{t(check.text)}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
                    <Link
                        href={publicPath(locale, siteConfig.links.services)}
                        className="border border-white/25 px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:border-white"
                    >
                        {t("view capabilities →")}
                    </Link>

                    <Link
                        href={publicPath(locale, siteConfig.links.contact)}
                        className="bg-[#F7F9FA] px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-[#1E1E1E] transition hover:bg-[#4F46E5] hover:text-white"
                    >
                        {t("discuss your project →")}
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ProductStatus({ locale }: { locale: SiteLocale }) {
    const t = translator(locale);
    return (
        <div
            className="flex min-h-[220px] flex-col items-center justify-center border-2 border-[#E1DED6] p-6 text-center md:col-span-2 xl:col-span-1"
            data-cinematic-element="product-status"
        >
            <ProductProgress />

            <h3 className="mt-3 text-xs font-bold uppercase leading-none text-[#1E1E1E]">
                {t("Production ready")}
            </h3>

            <p className="mt-3 max-w-[210px] text-[9px] font-bold uppercase leading-[1.4] tracking-[0.08em] text-[#B8B8BA]">
                {t("Clear scope. Controlled delivery. Production-ready results.")}
            </p>
        </div>
    );
}

export default function ProductSection({ locale }: { locale: SiteLocale }) {
    const t = translator(locale);
    return (
        <section
            id="process"
            className="w-full overflow-visible py-16 md:py-24"
            aria-labelledby="product-lifecycle-title"
            data-story-section="product-process"
            data-story-step="4"
            data-cinematic-scene="product"
            data-motion="fade-up"
            data-motion-state="pending"
        >
            <div className="product-wide-decor" aria-hidden="true">
                <div className="product-orbital-window">
                    <svg className="product-orbital-field" viewBox="0 0 1000 1000" fill="none" focusable="false">
                        <g className="product-orbit product-orbit--outer">
                            <circle cx="500" cy="500" r="480" />
                            <path d="M500 12v16M972 500h16M500 972v16M12 500h16" />
                            <circle className="product-decor__lime" cx="20" cy="500" r="3.5" />
                            <circle className="product-decor__violet" cx="980" cy="500" r="3" />
                        </g>
                        <g className="product-orbit product-orbit--inner">
                            <circle cx="500" cy="500" r="404" />
                            <circle className="product-decor__satellite" cx="904" cy="500" r="2" />
                            <circle className="product-decor__satellite" cx="96" cy="500" r="2" />
                        </g>
                        <g className="product-orbit product-orbit--dotted">
                            <circle cx="500" cy="500" r="450" strokeDasharray="1 9" strokeLinecap="round" />
                            <circle className="product-decor__lime" cx="950" cy="500" r="2.5" />
                        </g>
                        <g className="product-registration">
                            <path d="M76 492h16M84 484v16M864 214h12M870 208v12" />
                            <text x="98" y="480">X / 004</text>
                        </g>
                    </svg>
                </div>

                <div className="product-editorial-rail">
                    <span>04 / 06</span>
                    <span className="product-editorial-rail__line" />
                    <span className="product-editorial-rail__vertical">CREATIVITY × TECHNOLOGY</span>
                    <span className="product-editorial-rail__indicator" />
                    <span className="product-editorial-rail__coordinate">+ &nbsp; Y / 004</span>
                </div>

                <div className="product-technical-notes">
                    <span className="product-technical-notes__index">ORBIT / 04</span>
                    <span>PRODUCTS</span>
                    <span>STRATEGY</span>
                    <span>TECHNOLOGY</span>
                    <span>DESIGN</span>
                </div>

                <svg className="product-edge-geometry" viewBox="0 0 160 160" fill="none" focusable="false">
                    <path d="M12 20h40l68 68v60M46 14v12M114 142h12M12 148h16M20 140v16" />
                    <path d="M8 112a104 104 0 0 1 104-104" strokeDasharray="1 8" />
                    <circle cx="120" cy="88" r="2" />
                </svg>
            </div>
            <div
                className="site-container"
                data-cinematic-layer=""
            >
                <p
                    className="text-xs font-bold uppercase tracking-[0.03em] text-[#C5C6C8]"
                    data-cinematic-element="product-kicker"
                >
                    {t("04 / WHAT WE BUILD")}
                </p>

                <div
                    className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10"
                    data-cinematic-element="product-heading"
                >
                    <h2
                        id="product-lifecycle-title"
                        className="flex flex-col text-[clamp(44px,7vw,94px)] font-black uppercase leading-[0.9] tracking-[-0.03em]"
                    >
                        <span className="text-[#1E1E1E]">
                            {t("Digital")}
                            </span>

                        <span className="text-[#C5C6C8]">
                            {t("Products")}
                            </span>
                    </h2>

                    <p className="max-w-[500px] text-sm font-bold uppercase leading-[1.3] text-[#A7A7AA]">
                        {t("Custom digital solutions designed to solve specific business problems and support long-term growth.")}
                    </p>
                </div>

                <div
                    className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:mt-16 xl:grid-cols-4"
                    data-cinematic-element="product-grid"
                >
                    {cards.map((card) => (
                        <ProductCard locale={locale}
                                     key={card.code}
                                     {...card}
                                     text={localized(getServiceByCode(card.serviceCode)!.shortDescription, locale)}
                        />
                    ))}

                    <ProductSystemPanel locale={locale} />
                    <ProductStatus locale={locale} />
                </div>

                <div
                    className="mt-10 flex flex-col gap-4 md:mt-16 md:flex-row md:justify-between"
                    data-cinematic-element="product-footer"
                >
                    <div className="flex gap-2 text-xs font-bold uppercase leading-none text-[#C1C2C4]">
                        <p>{t("End")}</p>
                        <p>{t("of section 04")}</p>
                    </div>

                    <p className="text-xs font-bold uppercase leading-none text-[#C1C2C4]">
                        {t("Pixardia delivery ecosystem")}
                    </p>
                </div>
            </div>
        </section>
    );
}
