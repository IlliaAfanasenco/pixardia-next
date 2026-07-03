import Image from "next/image";
import Link from "next/link";

const sections = ["Concept", "Architecture", "Synthesis", "Ecosystem"];
const archives = ["Artifacts", "Tech Stack", "Case Studies", "Manifesto"];

const contacts = [
    {
        label: "Telegram",
        value: "@pixardia_core",
        href: "https://t.me/pixardia_core",
    },
    {
        label: "E-mail",
        value: "hello@pixardia.io",
        href: "mailto:hello@pixardia.io",
    },
    {
        label: "Location",
        value: "Digital Space",
    },
    {
        label: "Status",
        value: "Active",
        isStatus: true,
    },
];

const Footer = () => {
    return (
        <footer className="w-full overflow-visible py-5 md:py-5">
            <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">
                <div className="grid grid-cols-1 justify-items-center gap-10 text-center md:grid-cols-2 md:items-start md:gap-x-8 md:gap-y-12 xl:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr] xl:justify-items-stretch xl:gap-20 xl:text-left">
                    <div className="flex w-full max-w-[280px] flex-col items-center md:max-w-[300px] xl:max-w-none xl:min-h-[230px] xl:items-start">
                        <Link href="/" aria-label="Pixardia home">
                            <Image
                                src="/images/pixardia-logo-footer.png"
                                alt="Pixardia logo"
                                width={202}
                                height={58}
                                className="h-auto w-[101px] sm:w-[202px] md:w-[101px]"
                            />
                        </Link>

                        <p className="mt-6 max-w-[430px] text-sm font-medium uppercase leading-[1.3] tracking-[0.03em] text-[#DBDADA] md:text-base md:leading-[1.2]">
                            Engineering studio of a full cycle we design, develop, and scale digital
                            artifacts for the global market
                        </p>

                        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row xl:mt-auto xl:gap-10">
                            <Link
                                href="#top"
                                aria-label="Back to top"
                                className="flex h-11 w-full items-center justify-center border border-[#1E1E1E] text-xl leading-none text-[#1E1E1E] no-underline sm:w-[50px]"
                            >
                                ↑
                            </Link>

                            <div className="flex h-11 flex-1 items-center justify-center border border-[#1E1E1E] text-sm font-bold uppercase text-[#1E1E1E] md:text-base">
                                System uptime 100%
                            </div>
                        </div>
                    </div>

                    <FooterNav title="Sections" items={sections} />

                    <FooterNav title="Archives" items={archives} />

                    <div className="w-full max-w-[280px] md:col-span-1 md:max-w-[300px] xl:col-span-1 xl:max-w-none">
                        <h3 className="text-base font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA]">
                            Communication Nodes
                        </h3>

                        <div className="mt-6 grid grid-cols-1 gap-2 sm:mt-7 sm:gap-2 md:mt-8 lg:gap-3 xl:mt-[34px] xl:grid-cols-2">
                            {contacts.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex h-[46px] min-w-0 flex-col justify-center gap-0.5 border border-[#1E1E1E] px-1.5 py-1 text-center sm:h-[48px] md:h-[50px] lg:h-[52px] xl:h-[58px] xl:gap-1 xl:px-2 xl:py-[7px]"
                                >
            <span className="text-[11px] font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA] sm:text-xs xl:text-sm">
                {item.label}
            </span>

                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="truncate text-[11px] font-bold leading-[1.2] tracking-[0.03em] text-black no-underline sm:text-xs xl:text-sm"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <strong
                                            className={`truncate text-[11px] font-bold leading-[1.2] tracking-[0.03em] sm:text-xs xl:text-sm ${
                                                item.isStatus ? "capitalize text-[#49DF23]" : "text-black"
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
                        All operations are secure and encrypted // CRC: 0X9F2B
                    </p>

                    <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-10 xl:justify-end xl:gap-[43px]">
                        <nav
                            className="flex flex-wrap justify-center gap-5 text-sm font-bold uppercase leading-[1.2] tracking-[0.03em] text-black md:gap-[45px] md:text-base"
                            aria-label="Legal links"
                        >
                            <Link href="#" className="text-inherit no-underline">
                                Privacy
                            </Link>

                            <Link href="#" className="text-inherit no-underline">
                                Cookies
                            </Link>

                            <Link href="#" className="text-inherit no-underline">
                                Legal
                            </Link>
                        </nav>

                        <p className="text-sm font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA] md:text-base">
                            © 2026 Pixardia
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
                        className="pointer-events-none absolute hidden h-auto object-contain xl:block xl:left-1/2 xl:top-[9%] xl:-translate-x-[440px] xl:w-[clamp(38px,5vw,70px)]"
                    />

                    <h2 className="text-[clamp(52px,17vw,200px)] font-black uppercase leading-[1.2] tracking-[-0.03em] text-[#1E1E1E]">
                        Pixardia
                    </h2>

                    <Image
                        src="/images/astronautFooter.png"
                        alt=""
                        aria-hidden="true"
                        width={230}
                        height={230}
                        className="pointer-events-none absolute hidden h-auto object-contain -z-10 min-[1261px]:block min-[1261px]:right-0 min-[1261px]:top-[20%] min-[1261px]:w-[clamp(100px,16vw,230px)]"
                    />
                </div>

                <div className="flex flex-col gap-2.5 text-center text-sm font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA] md:flex-row md:justify-between md:gap-6 md:text-base">
                    <p>Local time: 17:46:32</p>
                    <p>Build version: v1.3.8-stable</p>
                </div>
            </div>
        </footer>
    );
};

type FooterNavProps = {
    title: string;
    items: string[];
};

const FooterNav = ({ title, items }: FooterNavProps) => {
    return (
        <nav className="flex w-full max-w-[280px] flex-col items-center gap-8 md:max-w-[300px] xl:max-w-none xl:items-start xl:gap-[34px]">
            <h3 className="text-base font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA]">
                {title}
            </h3>

            <ul className="flex flex-col gap-4 text-base font-bold uppercase leading-[1.2] tracking-[0.03em] text-[#1E1E1E]">
                {items.map((item) => (
                    <li key={item}>
                        <Link href="#" className="text-inherit no-underline">
                            {item}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Footer;