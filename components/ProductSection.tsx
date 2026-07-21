import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

const cards = [
    {
        label: "DISCOVERY",
        code: "PX101",
        title: "CLEAR",
        titleSecond: "DIRECTION",
        text: "We define the business goal, audience, product scope and technical requirements before development begins.",
        bottom: "SCOPE FIRST",
    },
    {
        label: "DESIGN",
        code: "PX202",
        title: "USEFUL",
        titleSecond: "INTERFACE",
        text: "Every screen and interaction is designed around real user actions, accessibility and conversion goals.",
        bottom: "USER FOCUSED",
    },
    {
        label: "ENGINEERING",
        code: "PX303",
        title: "CLEAN",
        titleSecond: "SYSTEM",
        text: "The product is built with a maintainable architecture, typed code and room for future functionality.",
        bottom: "SCALABLE CORE",
        withAstronaut: true,
    },
    {
        label: "DELIVERY",
        code: "PX404",
        title: "LONG",
        titleSecond: "TERM",
        text: "Testing, deployment and ongoing support turn the initial release into a foundation for future growth.",
        bottom: "READY TO GROW",
    },
] as const;

const systemChecks = [
    {
        icon: "/icons/arrowGreenProd.svg",
        text: "Product scope and business goals aligned.",
        className: "text-[#5E9D72]",
    },
    {
        icon: "/icons/arrowBlueProd.svg",
        text: "Architecture and technology route prepared.",
        className: "text-[#7770D8]",
    },
    {
        icon: "/icons/arrowGreyProd.svg",
        text: "Delivery, testing and support path available.",
        className: "text-[#9A9A9A]",
    },
] as const;

type ProductCardProps = {
    label: string;
    code: string;
    title: string;
    titleSecond: string;
    text: string;
    bottom: string;
    withAstronaut?: boolean;
};

function ProductCard({
                         label,
                         code,
                         title,
                         titleSecond,
                         text,
                         bottom,
                         withAstronaut = false,
                     }: ProductCardProps) {
    return (
        <article className="relative min-w-0 border border-[#808181] p-5 md:p-6">
            {withAstronaut && (
                <Image
                    src="/images/astronautProd.png"
                    alt=""
                    aria-hidden="true"
                    width={150}
                    height={150}
                    className="pointer-events-none absolute -left-12 -top-20 hidden h-auto w-[120px] object-contain 2xl:block"
                />
            )}

            <div className="flex items-center justify-between gap-3">
                <p className="border-2 border-[#E1DED6] px-1.5 py-[3px] text-xs font-bold leading-none text-[#878787]">
                    {label}
                </p>

                <p className="text-xs font-bold leading-none text-[#CFCFCF]">
                    {code}
                </p>
            </div>

            <h3 className="pt-6 text-2xl font-black uppercase leading-[1.05] text-[#1E1E1E]">
                {title}
                <br />
                {titleSecond}
            </h3>

            <p className="pt-5 text-xs font-bold uppercase leading-[1.35] text-[#A7A7AA]">
                {text}
            </p>

            <div className="flex items-center justify-between gap-4 pt-11">
                <p className="text-xs font-bold leading-none text-[#777779]">
                    {bottom}
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

function ProductSystemPanel() {
    return (
        <div className="border-b-[5px] border-r-[10px] border-[#4F46E5] bg-[#101111] md:col-span-2 xl:col-span-3">
            <div className="flex h-full flex-col px-5 py-6 md:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                        <p className="font-mono text-xs font-bold uppercase tracking-[0.08em] text-white">
                            Product delivery system
                        </p>

                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-white/35">
                            PX lifecycle / operational route
                        </p>
                    </div>

                    <span className="border border-[#5E9D72] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-[#78B58C]">
                        system ready
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

                            <p>{check.text}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-auto grid gap-3 pt-8 sm:grid-cols-2">
                    <Link
                        href={siteConfig.links.services}
                        className="border border-white/25 px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:border-white"
                    >
                        explore services →
                    </Link>

                    <Link
                        href={siteConfig.links.contact}
                        className="bg-[#F7F9FA] px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.08em] text-[#1E1E1E] transition hover:bg-[#4F46E5] hover:text-white"
                    >
                        start a project →
                    </Link>
                </div>
            </div>
        </div>
    );
}

function ProductStatus() {
    return (
        <div className="flex min-h-[220px] flex-col items-center justify-center border-2 border-[#E1DED6] p-6 text-center md:col-span-2 xl:col-span-1">
            <Image
                src="/icons/statisticsProd.svg"
                alt=""
                aria-hidden="true"
                width={160}
                height={120}
                className="h-auto max-w-full"
            />

            <h3 className="mt-3 text-xs font-bold uppercase leading-none text-[#1E1E1E]">
                Delivery ready
            </h3>

            <p className="mt-3 max-w-[210px] text-[9px] font-bold uppercase leading-[1.4] tracking-[0.08em] text-[#B8B8BA]">
                One structured process from discovery to release and support
            </p>
        </div>
    );
}

export default function ProductSection() {
    return (
        <section
            id="process"
            className="w-full overflow-visible py-16 md:py-24"
            aria-labelledby="product-lifecycle-title"
        >
            <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">
                <p className="text-xs font-bold uppercase tracking-[0.03em] text-[#C5C6C8]">
                    DEPLOYMENTPROTOCOL04
                </p>

                <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                    <h2
                        id="product-lifecycle-title"
                        className="flex flex-col text-[clamp(44px,7vw,94px)] font-black uppercase leading-[0.9] tracking-[-0.03em]"
                    >
                        <span className="text-[#1E1E1E]">
                            Product
                        </span>

                        <span className="text-[#C5C6C8]">
                            Lifecycle
                        </span>
                    </h2>

                    <p className="max-w-[500px] text-sm font-bold uppercase leading-[1.3] text-[#A7A7AA]">
                        We build more than interfaces. Each product moves through a clear process covering strategy, design, engineering, delivery and continued development.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:mt-16 xl:grid-cols-4">
                    {cards.map((card) => (
                        <ProductCard
                            key={card.code}
                            {...card}
                        />
                    ))}

                    <ProductSystemPanel />
                    <ProductStatus />
                </div>

                <div className="mt-10 flex flex-col gap-4 md:mt-16 md:flex-row md:justify-between">
                    <div className="flex gap-2 text-xs font-bold uppercase leading-none text-[#C1C2C4]">
                        <p>End</p>
                        <p>of phase 04</p>
                    </div>

                    <p className="text-xs font-bold uppercase leading-none text-[#C1C2C4]">
                        Pixardia product ecosystem
                    </p>
                </div>
            </div>
        </section>
    );
}