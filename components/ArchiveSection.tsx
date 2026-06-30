import Image from "next/image";

const caseStudies = [
    {
        tag: "Fintech / Web App",
        title: "NexusPaySystem",
        description:
            "Разработка масштабируемой платежной экосистемы с интеграцией для прогнозирования рисков.",
        stats: [
            { label: "Impact", value: "140% Growth" },
            { label: "Time", value: "4 Months" },
            { label: "Status", value: "Operational", isStatus: true },
        ],
    },
    {
        tag: "Fintech / Web App",
        title: "NexusPaySystem",
        description:
            "Разработка масштабируемой платежной экосистемы с интеграцией для прогнозирования рисков.",
        stats: [
            { label: "Impact", value: "140% Growth" },
            { label: "Time", value: "4 Months" },
            { label: "Status", value: "Operational", isStatus: true },
        ],
    },
];

const ArchiveSection = () => {
    return (
        <section
            className="mt-10 w-full overflow-visible py-16 md:py-24"
            aria-labelledby="archive-title"
        >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[clamp(28px,4vw,40px)] px-5 md:px-8">
                <div className="flex flex-col gap-2">
                    <p className="text-xs font-bold uppercase leading-none text-[#C5C6C8]">
                        DEPLOYMENTPROTOCOL05
                    </p>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
                        <h2
                            id="archive-title"
                            className="max-w-[620px] text-[clamp(40px,7vw,94px)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#1E1E1E]"
                        >
                            Digital Archive
                        </h2>

                        <p className="max-w-[430px] text-left text-xs font-bold leading-[1.15] text-[#C4C5C7] lg:text-right">
                            Каждый проект — это уникальный артефакт инженерной мысли,
                            прошедший все стадии синтеза Pixardia.
                        </p>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {caseStudies.map((item, index) => (
                        <CaseCard key={`${item.title}-${index}`} {...item} />
                    ))}

                    <Image
                        src="/images/alienAr.png"
                        alt=""
                        aria-hidden="true"
                        width={239}
                        height={239}
                        className="
                                   pointer-events-none
                                   absolute
                                   hidden
                                   h-auto
                                   object-contain

                                   min-[1344px]:block
                                   left-[60%]
                                   top-[-254px]
                                   -translate-x-1/2

                                   w-[239px]
                                 "
                    />
                </div>

                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        className="w-full border border-[#767576] px-9 py-4 text-sm font-bold uppercase leading-none text-[#767576] transition hover:border-[#1E1E1E] hover:text-[#1E1E1E] sm:w-auto"
                    >
                        Explore full archive
                    </button>
                </div>
            </div>
        </section>
    );
};

type CaseStudy = {
    tag: string;
    title: string;
    description: string;
    stats: {
        label: string;
        value: string;
        isStatus?: boolean;
    }[];
};

const CaseCard = ({ tag, title, description, stats }: CaseStudy) => {
    return (
        <article className="w-full border border-[#A2A3AA] bg-[#FEFEFE] transition duration-300  hover:border-[#5E56E7]">
            <div className="flex aspect-[1.4/1] items-center justify-center bg-[#5E56E7] sm:aspect-[640/318]">
                <a
                    href="#"
                    className="border border-[#837FED] px-3 py-2 text-xs uppercase text-[#B4B0F0] no-underline transition hover:border-white hover:text-white"
                >
                    Open case study
                </a>
            </div>

            <div className="flex flex-col items-start gap-[15px] p-[clamp(16px,2vw,19px)]">
        <span className="bg-black px-2.5 py-1.5 text-xs font-bold uppercase leading-none text-[#7E8180]">
          {tag}
        </span>

                <h3 className="text-[clamp(20px,2vw,24px)] font-black uppercase leading-none text-[#303031]">
                    {title}
                </h3>

                <p className="max-w-[520px] text-xs font-bold leading-[1.2] text-[#C9C9C9]">
                    {description}
                </p>

                <div className="flex w-full flex-col gap-4 border-t border-[#DDDDDD] pt-[18px] min-[361px]:flex-row min-[361px]:flex-wrap min-[361px]:gap-[clamp(18px,3vw,35px)]">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col gap-2">
              <span className="text-xs font-normal uppercase leading-none text-[#CFCFCF]">
                {stat.label}
              </span>

                            {stat.isStatus ? (
                                <strong className="inline-flex w-fit border border-[#7BC198] px-3 py-[7px] text-xs font-bold uppercase leading-none text-[#9FC8B0]">
                                    {stat.value}
                                </strong>
                            ) : (
                                <strong className="text-sm font-bold leading-none text-[#4A4A4A]">
                                    {stat.value}
                                </strong>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
};

export default ArchiveSection;