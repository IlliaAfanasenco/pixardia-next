import Image from "next/image";

export default function MobileNeuralSection() {
    return (
        <section
            data-mobile-section="neural"
            className="relative w-full px-5 pb-8 pt-5"
        >
            {/* eyebrow */}
            <p className="text-[9px] font-black uppercase tracking-[0.26em] text-[#c6c6c8]">
                Deploymentprotocol03
            </p>

            {/* title */}
            <h2 className="mt-2 uppercase leading-[0.88] tracking-[-0.055em]">
                <span className="block text-[46px] font-black text-[#bfc0c2]">
                    THE NEURAL
                </span>

                <span className="block text-[46px] font-black text-[#5848ff]">
                    SYSTEM
                </span>
            </h2>

            {/* description */}
            <p className="mt-4 max-w-[370px] text-[16px] font-medium leading-[1.12] text-[#c5c5c7]">
                A connected ecosystem that turns ideas
                <br/>
                into powerful digital products. Each module
                <br/>
                works together to deliver real results
            </p>

            {/* core */}
            <div className="mt-7 flex flex-col items-center">
                <div
                    className="
                        relative
                        flex
                        h-[165px]
                        w-[165px]
                        flex-col
                        items-center
                        overflow-hidden
                        rounded-full
                        border
                        border-[#d5d5d5]
                        bg-[#181818]
                    "
                >
                    <div className="relative z-10 mt-7 text-center">
                        <p className="text-[10px] font-medium uppercase text-[#737373]">
                            Core_status
                        </p>

                        <p className="text-[16px] font-black uppercase text-white">
                            Pixardia
                        </p>
                    </div>

                    <div className="absolute bottom-[-4px] h-[88px] w-[100px]">
                        <Image
                            src="/images/alien-core.png"
                            alt=""
                            fill
                            className="object-contain object-bottom"
                        />
                    </div>
                </div>

                {/* system badge */}
                <div
                    className="
                        relative
                        z-20
                        mt-[-7px]
                        flex
                        min-w-[132px]
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-white
                        px-4
                        py-2
                        shadow-[0_1px_6px_rgba(0,0,0,0.06)]
                    "
                >
                    <span className="h-2 w-2 rounded-full bg-[#65ef76]"/>

                    <span className="text-[10px] font-bold uppercase text-[#222]">
                        System online
                    </span>
                </div>

                <p className="mt-1 text-[6px] uppercase text-[#b8b8b8]">
                    14 ms / Verified
                </p>
            </div>

            {/* modules */}
            <div className="mt-5 space-y-3">
                <ModuleCard
                    number="01"
                    code="UI_ENGINE"
                    title="Frontend manifest"
                    description="Reactive interfaces featuring smooth animation and logic."
                    icon="window"
                />

                <ModuleCard
                    number="02"
                    code="DATA_CORE"
                    title="Scalable backend"
                    description="Architecture capable of handling millions of requests per second."
                    icon="database"
                />

                <ModuleCard
                    number="03"
                    code="INTEL_LAYER"
                    title="AI integration"
                    description="Gemini neural networks for content analysis and generation."
                    icon="brain"
                />

                <ModuleCard
                    number="04"
                    code="SEC_SHIELD"
                    title="Security protocol"
                    description="Data encryption and protection against threats of any level."
                    icon="shield"
                />
            </div>
        </section>
    );
}

function ModuleCard({
                        number,
                        code,
                        title,
                        description,
                        icon,
                    }: {
    number: string;
    code: string;
    title: string;
    description: string;
    icon: "window" | "database" | "brain" | "shield";
}) {
    return (
        <div
            className="
                flex
                min-h-[78px]
                items-center
                rounded-[12px]
                border
                border-[#ededed]
                bg-white
                px-3
                py-3
            "
        >
            <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center">
                <ModuleIcon type={icon}/>
            </div>

            <div className="ml-3 min-w-0 flex-1">
                <p className="text-[8px] uppercase text-[#c5c5c5]">
                    {number}{" // "}{code}
                </p>

                <h3 className="mt-[1px] text-[13px] font-black uppercase leading-none text-[#333]">
                    {title}
                </h3>

                <p className="mt-1 max-w-[210px] text-[8px] leading-[1.15] text-[#c4c4c4]">
                    {description}
                </p>
            </div>

            <button
                type="button"
                aria-label={title}
                className="
                    ml-2
                    flex
                    h-[34px]
                    w-[34px]
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
    );
}

function ModuleIcon({
                        type,
                    }: {
    type: "window" | "database" | "brain" | "shield";
}) {
    if (type === "window") {
        return (
            <svg
                viewBox="0 0 48 48"
                className="h-[38px] w-[38px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <rect x="8" y="14" width="24" height="25" rx="2"/>
                <rect x="15" y="8" width="24" height="25" rx="2"/>
                <path d="M20 17h1"/>
            </svg>
        );
    }

    if (type === "database") {
        return (
            <svg
                viewBox="0 0 48 48"
                className="h-[38px] w-[38px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <ellipse cx="24" cy="12" rx="14" ry="6"/>
                <path d="M10 12v10c0 3 6 6 14 6s14-3 14-6V12"/>
                <path d="M10 22v10c0 3 6 6 14 6s14-3 14-6V22"/>
            </svg>
        );
    }

    if (type === "brain") {
        return (
            <svg
                viewBox="0 0 48 48"
                className="h-[38px] w-[38px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M20 8c-4 0-7 3-7 7-3 1-5 4-5 7s2 6 5 7c0 5 3 8 7 8 2 0 4-1 5-3V11c-1-2-3-3-5-3Z"/>
                <path d="M28 8c4 0 7 3 7 7 3 1 5 4 5 7s-2 6-5 7c0 5-3 8-7 8-2 0-4-1-5-3V11c1-2 3-3 5-3Z"/>
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 48 48"
            className="h-[38px] w-[38px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M24 7 38 12v10c0 10-6 16-14 20-8-4-14-10-14-20V12l14-5Z"/>
            <path d="M24 16v16M18 24h12"/>
        </svg>
    );
}
