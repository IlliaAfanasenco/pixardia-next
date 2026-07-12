import Image from "next/image";

const tags = [
    { top: "security", bottom: "End-To-End" },
    { top: "speed", bottom: "Optimized" },
    { top: "stack", bottom: "Scalable" },
];

const CraftingStructureSection = () => {
    return (
        <section className="relative overflow-hidden y-4 sm:py-6 lg:py-8">
            <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-10 px-5 text-center md:px-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:text-center">
                <div className="flex w-full flex-col items-start gap-5 md:gap-6 lg:items-start">
                    <p className="text-xs font-bold uppercase tracking-[0.03em] text-[#C5C6C8]">
                        DEPLOYMENTPROTOCOL02
                    </p>

                    <h2 className="flex flex-col items-start text-center text-[clamp(44px,8vw,104px)] font-black uppercase leading-[0.88] tracking-[-0.03em] md:leading-[0.85]">
                        <span className="text-[#1E1E1E]">crafting</span>
                        <span className="text-[#C5C6C8]">structure</span>
                    </h2>

                    <p className="items-start text-center max-w-[620px] text-lg font-bold uppercase leading-[1.2] tracking-[-0.03em] text-[#1E1E1E] md:text-[clamp(18px,2vw,24px)]">
                        We create websites that don’t just look good — they work, convert
                        and grow your business.
                    </p>

                    <div className="flex text-center items-center gap-5 md:flex-row  sm: flex-row sm: items-center md:gap-10 lg:items-start">
                        <div>
                            <p className="text-[32px] font-black uppercase leading-none tracking-[0.03em] md:text-4xl">
                                99.9%
                            </p>
                            <p className="mt-1 text-sm font-bold uppercase leading-[1.2] tracking-[0.1em] text-[#C5C6C8] md:text-base">
                                uptime core
                            </p>
                        </div>

                        <div className="h-px w-full bg-[#C5C6C8] md:h-auto md:w-px" />

                        <div>
                            <p className="text-[32px] font-black uppercase leading-none tracking-[0.03em] md:text-4xl">
                                clean
                            </p>
                            <p className="mt-1 text-sm font-bold uppercase leading-[1.2] tracking-[0.1em] text-[#C5C6C8] md:text-base">
                                architecture
                            </p>
                        </div>
                    </div>

                    <div className="w-full max-w-[464px] border-r-4 border-b-4 border-[#1B1B1B] text-left">
                        <div className="p-[15px_18px_18px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Image src="/icons/starCS.svg" alt="" width={21} height={21} />

                                    <p className="text-sm font-bold uppercase leading-[1.2] tracking-[0.01em] text-[#3D5FB5]">
                                        ai architect
                                    </p>
                                </div>

                                <Image src="/icons/dotCS.svg" alt="" width={30} height={30} />
                            </div>

                            <div className="mt-6 flex flex-col">
                                <p className="text-sm font-bold leading-[1.2] tracking-[0.01em] text-[#C5C6C8]">
                                    We don’t use templates or website builders — only clean code,
                                    flexibility, and full control over every project.
                                </p>

                                <form className="mt-3.5 h-11 w-full bg-[#F3F4F6] md:h-10">
                                    <input
                                        type="text"
                                        placeholder="Are you ready to take your project to the next level?"
                                        className="h-full w-full bg-transparent px-4 text-sm font-bold leading-[1.2] tracking-[0.01em] text-[#1E1E1E] outline-none placeholder:text-[#C5C6C8] focus:ring-2 focus:ring-[#3D5FB5]"
                                    />
                                </form>

                                <button
                                    type="button"
                                    className="mt-[15px] flex h-11 w-full items-center justify-center bg-[#1E1E1E] transition hover:bg-[#2A2A2A] md:h-10"
                                >
                  <span className="text-sm font-bold uppercase leading-[1.2] tracking-[0.03em] text-[#EDEDED]">
                    generate stack →
                  </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-center lg:justify-end">
                    <div className="w-full max-w-[560px]">
                        <div className="relative w-full">
                            <Image
                                src="/images/terminal.png"
                                alt="Terminal interface"
                                width={560}
                                height={420}
                                className="h-auto w-full"
                            />

                            <div className="absolute left-[calc(0%-clamp(32px,8vw,96px))] top-[75%] z-20 -translate-y-1/2">
                                <Image
                                    src="/images/alienCS.png"
                                    alt="3D alien illustration"
                                    width={119}
                                    height={119}
                                    className="h-auto w-[clamp(90px,10vw,119px)] object-contain"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 lg:justify-start lg:gap-[26px]">
                            {tags.map((tag) => (
                                <button
                                    key={`${tag.top}-${tag.bottom}`}
                                    type="button"
                                    className="flex min-h-16 w-full flex-col items-center border-r-2 border-b-2 border-[#BDBDBD] pt-2 transition hover:border-[#1E1E1E] sm:w-[169px]"
                                >
                  <span className="text-sm font-bold uppercase leading-[1.2] tracking-[0.03em] text-[#C5C6C8]">
                    {tag.top}
                  </span>

                                    <span className="mt-[7px] text-base font-bold leading-[1.2] tracking-[0.03em] text-[#1E1E1E]">
                    {tag.bottom}
                  </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CraftingStructureSection;