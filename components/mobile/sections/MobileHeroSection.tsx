import Image from "next/image";

export default function MobileHeroSection() {
    return (
        <section
            data-mobile-section="hero"
            className="relative w-full overflow-hidden px-5"
        >

            {/* content */}
            <div className="relative z-20">
                <p className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.27em] text-[#c8c8ca]">
                    Creative digital studio / AI augmented
                </p>

                <h1 className="mt-[20px] font-black uppercase leading-[0.82] tracking-[-0.065em]">
                    <span className="block text-[64px] text-[#b9b9bb]">
                        DIGITAL
                    </span>

                    <span className="ml-[38px] mt-[14px] block text-[64px] text-[#5848ff]">
                        AGENCY
                    </span>
                </h1>

                <p className="mt-[38px] w-[190px] text-[18px] font-medium leading-[1.18] text-[#c8c8ca]">
                    Your journey into the
                    <br />
                    world of development
                    <br />
                    starts here
                </p>

                <div className="mt-[30px] flex items-center gap-[16px]">
                    <button
                        type="button"
                        aria-label="Explore space"
                        className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-full border-[2px] border-[#414141]"
                    >
                        <span className="translate-y-[-2px] text-[40px] font-light text-[#414141]">
                            →
                        </span>
                    </button>

                    <span className="text-[17px] font-black uppercase tracking-[-0.04em] text-[#414141]">
                        Explore space
                    </span>
                </div>

                <div className="mt-[38px] flex gap-[45px]">
                    <div>
                        <div className="text-[29px] font-black leading-none text-[#5848ff]">
                            50+
                        </div>
                        <div className="mt-[8px] text-[14px] font-bold uppercase text-[#414141]">
                            Projects
                        </div>
                    </div>

                    <div>
                        <div className="text-[29px] font-black leading-none text-[#5848ff]">
                            99.9%
                        </div>
                        <div className="mt-[8px] text-[14px] font-bold uppercase text-[#414141]">
                            Uptime
                        </div>
                    </div>
                </div>
            </div>

            {/* characters */}
            <div className="pointer-events-none absolute left-0 top-[255px] z-10 w-full">
                <Image
                    src="/images/alienAstronautMobileVersion.png"
                    alt=""
                    width={430}
                    height={470}
                    priority
                    className="h-auto w-full"
                />
            </div>

            {/* CTA */}
            <div className="relative z-30 mt-[95px] flex min-h-[82px] w-full items-center rounded-[11px] bg-[#181818] px-[11px]">
                <div className="relative h-[44px] w-[39px] shrink-0 overflow-hidden rounded-[6px] bg-[#5848ff]">
                    <Image
                        src="/images/mobile-alien.png"
                        alt=""
                        fill
                        className="object-cover"
                    />
                </div>

                <p className="ml-[28px] text-[16px] font-medium uppercase leading-[1.15] tracking-[0.04em] text-white">
                    Let&apos;s build
                    <br />
                    something gret
                </p>

                <div className="ml-auto flex h-[51px] w-[51px] items-center justify-center rounded-full border-2 border-white">
                    <span className="text-[31px] font-light text-white">→</span>
                </div>
            </div>

            <p className="relative z-30 pb-[18px] pt-[36px] text-[16px] font-medium uppercase tracking-[0.02em] text-[#c9c9cb]">
                Scroll to explore
            </p>
        </section>
    );
}