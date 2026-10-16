import ProjectSystemPreview from "../ProjectSystemPreview";

export default function MobileArchiveSection() {
    const projects = [
        {
            title: "NEXUSPAYSYSTEM",
            tags: ["OPERATIONAL", "WEB"],
        },
        {
            title: "NEXUSPAYSYSTEM",
            tags: ["OPERATIONAL", "WEB"],
        },
    ];

    return (
        <section
            data-mobile-section="archive"
            className="relative w-full px-5 pb-7 pt-5"
        >
            {/* EYEBROW */}
            <p className="text-[9px] font-medium uppercase">
                Deploymentprotocol05
            </p>

            {/* TITLE */}
            <h2 className="mt-1 uppercase leading-[0.88] tracking-[-0.05em]">
                <span className="block text-[46px] font-black text-[#5848ff]">
                    DIGITAL
                </span>

                <span className="block text-[46px] font-black text-[#bfc0c2]">
                    ARCHIV
                </span>
            </h2>

            {/* PROJECTS */}
            <div className="mt-6 space-y-4">
                {projects.map((project, index) => (
                    <article
                        key={`${project.title}-${index}`}
                        className="
                            overflow-hidden
                            rounded-[12px]
                            border
                            border-[#ededed]
                            bg-white
                        "
                    >
                        {/* PREVIEW */}
                        <div className="relative h-[185px] w-full overflow-hidden">
                            <ProjectSystemPreview />
                        </div>

                        {/* CONTENT */}
                        <div className="flex min-h-[88px] items-center px-3 py-3">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-[18px] font-black uppercase leading-none text-[#373737]">
                                    {project.title}
                                </h3>

                                <div className="mt-3 flex gap-2">
                                    <span
                                        className="
                                            border
                                            border-[#8fceb1]
                                            px-2
                                            py-[5px]
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            text-[#8fceb1]
                                        "
                                    >
                                        {project.tags[0]}
                                    </span>

                                    <span
                                        className="
                                            border
                                            border-[#5848ff]
                                            px-2
                                            py-[5px]
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            text-[#5848ff]
                                        "
                                    >
                                        {project.tags[1]}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                aria-label={`Open ${project.title}`}
                                className="
                                    ml-3
                                    flex
                                    h-[35px]
                                    w-[35px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#444]
                                    text-[20px]
                                    font-light
                                    text-[#444]
                                "
                            >
                                →
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {/* VIEW ALL */}
            <button
                type="button"
                className="
                    mt-4
                    flex
                    min-h-[88px]
                    w-full
                    items-center
                    rounded-[10px]
                    bg-[#151515]
                    px-3
                    text-white
                "
            >
                <span className="text-[22px] font-black uppercase">
                    View all cases
                </span>

                <span className="ml-auto text-[38px] font-light leading-none">
                    →
                </span>
            </button>
        </section>
    );
}