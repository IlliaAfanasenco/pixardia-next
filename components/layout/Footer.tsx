import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";

type FooterLink = {
    label: string;
    href: string;
};

type ContactItem = {
    label: string;
    value: string;
    href?: string;
    isExternal?: boolean;
    isStatus?: boolean;
};

const sections: FooterLink[] = [
    {
        label: "Home",
        href: siteConfig.links.home,
    },
    {
        label: "Services",
        href: siteConfig.links.services,
    },
    {
        label: "Projects",
        href: siteConfig.links.projects,
    },
    {
        label: "Contact",
        href: siteConfig.links.contact,
    },
];

const exploreLinks: FooterLink[] = [
    {
        label: "Process",
        href: "/#process",
    },
    {
        label: "Archive",
        href: "/#projects",
    },
    {
        label: "Privacy",
        href: siteConfig.links.privacy,
    },
    {
        label: "Imprint",
        href: siteConfig.links.imprint,
    },
];

const primarySocial = siteConfig.socialLinks[0];

const websiteHost = new URL(siteConfig.url).hostname.replace(
    /^www\./,
    "",
);

const contacts: ContactItem[] = [
    {
        label: "E-mail",
        value:
            siteConfig.contact.email ||
            "Open contact form",
        href:
            siteConfig.contact.email
                ? `mailto:${siteConfig.contact.email}`
                : siteConfig.links.contact,
    },
    primarySocial
        ? {
            label: primarySocial.label,
            value: "Open channel",
            href: primarySocial.href,
            isExternal: true,
        }
        : {
            label: "Website",
            value: websiteHost,
            href: siteConfig.url,
            isExternal: true,
        },
    {
        label: "Location",
        value: "Europe / Remote",
    },
    {
        label: "Status",
        value: "Open for projects",
        isStatus: true,
    },
];

const legalLinks: FooterLink[] = [
    {
        label: "Privacy",
        href: siteConfig.links.privacy,
    },
    {
        label: "Imprint",
        href: siteConfig.links.imprint,
    },
    {
        label: "Contact",
        href: siteConfig.links.contact,
    },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full overflow-visible py-5 md:py-5">
            <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">
                <div className="grid grid-cols-1 justify-items-center gap-10 text-center md:grid-cols-2 md:items-start md:gap-x-8 md:gap-y-12 xl:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr] xl:justify-items-stretch xl:gap-20 xl:text-left">
                    <div className="flex w-full max-w-[280px] flex-col items-center md:max-w-[300px] xl:min-h-[230px] xl:max-w-none xl:items-start">
                        <Link
                            href={siteConfig.links.home}
                            aria-label="Pixardia home"
                            className="transition duration-300 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7]"
                        >
                            <Image
                                src="/images/pixardia-logo-footer.png"
                                alt="Pixardia logo"
                                width={202}
                                height={58}
                                className="h-auto w-[101px] sm:w-[202px] md:w-[101px]"
                            />
                        </Link>

                        <p className="mt-6 max-w-[430px] text-sm font-medium uppercase leading-[1.3] tracking-[0.03em] text-[#DBDADA] md:text-base md:leading-[1.2]">
                            Full-cycle digital product studio.
                            We design, develop and support
                            websites, applications and
                            AI-powered business solutions.
                        </p>

                        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row xl:mt-auto xl:gap-10">
                            <Link
                                href="#top"
                                aria-label="Back to top"
                                className="flex h-11 w-full items-center justify-center border border-[#1E1E1E] text-xl leading-none text-[#1E1E1E] no-underline transition duration-300 hover:bg-[#1E1E1E] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7] active:translate-y-px sm:w-[50px]"
                            >
                                ↑
                            </Link>

                            <Link
                                href={siteConfig.links.contact}
                                className="flex h-11 flex-1 items-center justify-center border border-[#1E1E1E] px-3 text-sm font-bold uppercase text-[#1E1E1E] no-underline transition duration-300 hover:border-[#5E56E7] hover:bg-[#5E56E7] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7] active:translate-y-px md:text-base"
                            >
                                Project intake open
                            </Link>
                        </div>
                    </div>

                    <FooterNav
                        title="Sections"
                        items={sections}
                    />

                    <FooterNav
                        title="Explore"
                        items={exploreLinks}
                    />

                    <div className="w-full max-w-[280px] md:col-span-1 md:max-w-[300px] xl:col-span-1 xl:max-w-none">
                        <h3 className="text-base font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA]">
                            Communication Nodes
                        </h3>

                        <div className="mt-6 grid grid-cols-1 gap-2 sm:mt-7 sm:gap-2 md:mt-8 lg:gap-3 xl:mt-[34px] xl:grid-cols-2">
                            {contacts.map((item) => (
                                <div
                                    key={item.label}
                                    className="group flex h-[46px] min-w-0 flex-col justify-center gap-0.5 border border-[#1E1E1E] px-1.5 py-1 text-center transition duration-300 hover:border-[#5E56E7] sm:h-[48px] md:h-[50px] lg:h-[52px] xl:h-[58px] xl:gap-1 xl:px-2 xl:py-[7px]"
                                >
                                    <span className="text-[11px] font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA] transition-colors duration-300 group-hover:text-[#8E89E8] sm:text-xs xl:text-sm">
                                        {item.label}
                                    </span>

                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            target={
                                                item.isExternal
                                                    ? "_blank"
                                                    : undefined
                                            }
                                            rel={
                                                item.isExternal
                                                    ? "noreferrer"
                                                    : undefined
                                            }
                                            className="truncate text-[11px] font-bold leading-[1.2] tracking-[0.03em] text-black no-underline transition duration-300 hover:text-[#5E56E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5E56E7] sm:text-xs xl:text-sm"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <strong
                                            className={`truncate text-[11px] font-bold leading-[1.2] tracking-[0.03em] sm:text-xs xl:text-sm ${
                                                item.isStatus
                                                    ? "text-[#49B934]"
                                                    : "text-black"
                                            }`}
                                        >
                                            {item.value}
                                        </strong>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-b border-black md:mt-[68px]" />

                <div className="mt-6 flex flex-col items-center gap-6 text-center xl:flex-row xl:items-start xl:justify-between xl:gap-10 xl:text-left">
                    <p className="text-sm font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA] md:text-base">
                        Secure project communication
                        {" // "}
                        Privacy-first workflow
                    </p>

                    <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10 xl:justify-end xl:gap-[43px]">
                        <nav
                            className="flex flex-wrap justify-center gap-5 text-sm font-bold uppercase leading-[1.2] tracking-[0.03em] text-black md:gap-[45px] md:text-base"
                            aria-label="Legal links"
                        >
                            {legalLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-inherit no-underline transition duration-300 hover:text-[#5E56E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7]"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        <p className="text-sm font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA] md:text-base">
                            © {currentYear} {siteConfig.name}
                        </p>
                    </div>
                </div>

                <div className="relative mt-10 flex min-h-[140px] items-center justify-center overflow-visible md:mt-12 xl:min-h-[240px]">
                    <Image
                        src="/images/alienFooter.png"
                        alt=""
                        aria-hidden="true"
                        width={70}
                        height={70}
                        className="pointer-events-none absolute hidden h-auto object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.12)] xl:left-1/2 xl:top-[9%] xl:block xl:w-[clamp(38px,5vw,70px)] xl:-translate-x-[440px]"
                    />

                    <Link
                        href={siteConfig.links.home}
                        aria-label="Pixardia home"
                        className="text-[clamp(52px,17vw,200px)] font-black uppercase leading-[1.2] tracking-[-0.03em] text-[#1E1E1E] no-underline transition duration-500 hover:tracking-[-0.015em]"
                    >
                        Pixardia
                    </Link>

                    <Image
                        src="/images/astronautFooter.png"
                        alt=""
                        aria-hidden="true"
                        width={230}
                        height={230}
                        className="pointer-events-none absolute -z-10 hidden h-auto object-contain min-[1261px]:right-0 min-[1261px]:top-[20%] min-[1261px]:block min-[1261px]:w-[clamp(100px,16vw,230px)]"
                    />
                </div>

                <div className="flex flex-col gap-2.5 text-center text-sm font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA] md:flex-row md:justify-between md:gap-6 md:text-base">
                    <p>Service area: Europe / Remote</p>
                    <p>System status: Online</p>
                </div>
            </div>
        </footer>
    );
}

type FooterNavProps = {
    title: string;
    items: FooterLink[];
};

function FooterNav({
                       title,
                       items,
                   }: FooterNavProps) {
    return (
        <nav
            className="flex w-full max-w-[280px] flex-col items-center gap-8 md:max-w-[300px] xl:max-w-none xl:items-start xl:gap-[34px]"
            aria-label={title}
        >
            <h3 className="text-base font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA]">
                {title}
            </h3>

            <ul className="flex flex-col gap-4 text-base font-bold uppercase leading-[1.2] tracking-[0.03em] text-[#1E1E1E]">
                {items.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className="inline-flex text-inherit no-underline transition duration-300 hover:translate-x-1 hover:text-[#5E56E7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7]"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}