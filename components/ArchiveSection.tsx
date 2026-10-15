import { publicPath } from "@/i18n/navigation";
import type { SiteLocale } from "@/i18n/config";
import { translator } from "@/i18n/getDictionary";
import Image from "next/image";
import Link from "next/link";

import ArchiveCard from "./archive/ArchiveCard";
import { getArchiveProjects } from "./archive/archive-projects";

const featuredProjects = getArchiveProjects();

export default function ArchiveSection({ locale }: { locale: SiteLocale }) {
    const t = translator(locale);
    return (
        <section
            id="projects"
            className="mt-10 w-full overflow-visible py-16 md:py-24"
            aria-labelledby="archive-title"
            data-story-section="archive"
            data-story-step="5"
            data-motion="fade-up"
            data-motion-state="pending"
        >
            <div
                className="site-container flex flex-col gap-[clamp(28px,4vw,40px)]"
                data-archive-shell=""
            >
                <div
                    className="flex flex-col gap-2"
                    data-archive-heading=""
                >
                    <p
                        className="text-xs font-bold uppercase leading-none text-[#C5C6C8]"
                        data-archive-kicker=""
                    >
                        {t("05 / SELECTED DIGITAL WORK")}
                    </p>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
                        <h2
                            id="archive-title"
                            data-archive-title=""
                            className="max-w-[620px] text-[clamp(40px,7vw,94px)] font-black uppercase leading-[0.9] tracking-[-0.03em] text-[#1E1E1E]"
                        >
                            {t("Project Archive")}
                        </h2>

                        <p
                            className="max-w-[470px] text-left text-xs font-bold leading-[1.35] text-[#A9AAAE] lg:text-right"
                            data-archive-intro=""
                        >
                            {t("A selection of digital products shaped through strategy, design and engineering.")}
                        </p>
                    </div>
                </div>

                <div
                    className="relative grid grid-cols-1 gap-6 xl:grid-cols-2"
                    data-archive-grid=""
                >
                    {featuredProjects.map(({ project, variant }, index) => (
                        <ArchiveCard
                            key={project.slug}
                            project={project}
                            variant={variant}
                            locale={locale}
                            index={index}
                        />
                    ))}

                    <Image
                        src="/images/alienAr.png"
                        alt=""
                        aria-hidden="true"
                        width={239}
                        height={239}
                        data-archive-alien=""
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

                <div
                    className="flex items-center justify-center pt-2"
                    data-archive-cta=""
                >
                    <Link
                        href={publicPath(locale, "/projects")}
                        className="inline-flex w-full items-center justify-center border border-[#767576] px-9 py-4 text-sm font-bold uppercase leading-none text-[#767576] no-underline transition duration-200 hover:border-[#1E1E1E] hover:text-[#1E1E1E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5E56E7] sm:w-auto"
                    >
                        {t("View all work")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
