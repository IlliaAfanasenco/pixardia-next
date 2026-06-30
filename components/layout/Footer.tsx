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
        <footer className="mt-10 w-full overflow-visible py-16 md:py-20">
            <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">
                <div className="grid grid-cols-1 justify-items-center gap-10 text-center md:grid-cols-2 md:gap-x-8 md:gap-y-12 xl:grid-cols-[1.5fr_0.8fr_0.8fr_1.2fr] xl:justify-items-stretch xl:gap-20 xl:text-left">
                    <div className="flex w-full max-w-[430px] flex-col items-center xl:max-w-none xl:min-h-[230px] xl:items-start">
                        <Link href="/" aria-label="Pixardia home">
                            <Image
                                src="/images/pixardia-logo-footer.png"
                                alt="Pixardia logo"
                                width={101}
                                height={29}
                                className="h-auto w-[101px]"
                            />
                        </Link>

                        <p className="mt-6 max-w-[430px] text-sm font-medium uppercase leading-[1.3] tracking-[0.03em] text-[#DBDADA] md:text-base md:leading-[1.2]">
                            Engineering studio of a full cycle we design, develop, and scale
                            digital artifacts for the global market
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

                    <div className="w-full max-w-[520px] md:col-span-2 xl:col-span-1 xl:max-w-none">
                        <h3 className="text-base font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA]">
                            Communication Nodes
                        </h3>

                        <div className="mt-[34px] grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                            {contacts.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex h-[58px] min-w-0 flex-col gap-1 border border-[#1E1E1E] px-2 py-[7px] text-left"
                                >
                  <span className="text-sm font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA]">
                    {item.label}
                  </span>

                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="truncate text-sm font-bold leading-[1.2] tracking-[0.03em] text-black no-underline"
                                        >
                                            {item.value}
                                        </a>
                                    ) : (
                                        <strong
                                            className={`truncate text-sm font-bold leading-[1.2] tracking-[0.03em] ${
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
                        className="
    pointer-events-none
    absolute
    hidden
    h-auto
    object-contain

    xl:block
    xl:left-1/2
    xl:top-[9%]
    xl:-translate-x-[440px]
    xl:w-[clamp(38px,5vw,70px)]
  "
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
                        className="pointer-events-none absolute right-[-35px] top-[35%] -z-10 h-auto w-[120px] object-contain md:right-[-30px] md:top-[25%] md:w-[clamp(120px,16vw,190px)] xl:right-0 xl:top-[20%] xl:w-[clamp(100px,16vw,230px)]"
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
        <nav className="flex flex-col items-center gap-[34px] xl:items-start">
            <h3 className="text-base font-medium uppercase leading-[1.2] tracking-[0.03em] text-[#DBDADA]">
                {title}
            </h3>

            <ul className="flex flex-col gap-[17px] text-base font-bold uppercase leading-[1.2] tracking-[0.03em] text-[#1E1E1E]">
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