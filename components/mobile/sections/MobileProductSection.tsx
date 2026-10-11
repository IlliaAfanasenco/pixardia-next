export default function MobileProductSection() {
    const stages = [
        {
            tag: "EFFICIENCY",
            title: "ULTRA SPEED",
            description:
                "Optimization of core web vitals for instant loading anywhere in the world.",
        },
        {
            tag: "EFFICIENCY",
            title: "ULTRA SPEED",
            description:
                "Optimization of core web vitals for instant loading anywhere in the world.",
        },
        {
            tag: "EFFICIENCY",
            title: "ULTRA SPEED",
            description:
                "Optimization of core web vitals for instant loading anywhere in the world.",
        },
        {
            tag: "EFFICIENCY",
            title: "ULTRA SPEED",
            description:
                "Optimization of core web vitals for instant loading anywhere in the world.",
        },
    ];

    return (
        <section
            data-mobile-section="product"
            className="relative w-full px-5 pb-7 pt-5"
        >
            {/* eyebrow */}
            <p className="text-[9px] font-black uppercase tracking-[0.26em] text-[#c6c6c8]">
                Deploymentprotocol03
            </p>

            {/* title */}
            <h2 className="mt-2 uppercase leading-[0.9] tracking-[-0.055em]">
                <span className="block text-[46px] font-black text-[#5848ff]">
                    PRODUCT
                </span>

                <span className="block text-[46px] font-black text-[#bfc0c2]">
                    LIFECYCLE
                </span>
            </h2>

            {/* description */}
            <p className="mt-3 max-w-[360px] text-[16px] font-medium leading-[1.12] text-[#c5c5c7]">
                A streamlined process from idea to a stable,
                <br />
                scalable product
            </p>

            {/* cards */}
            <div className="mt-7 space-y-3">
                {stages.map((stage, index) => (
                    <article
                        key={index}
                        className="
                            flex
                            min-h-[89px]
                            items-center
                            rounded-[12px]
                            border
                            border-[#ededed]
                            bg-white
                            px-2
                            py-2
                        "
                    >
                        <div className="min-w-0 flex-1">
                            <div
                                className="
                                    inline-flex
                                    border
                                    border-[#d7d7d7]
                                    px-[5px]
                                    py-[2px]
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    leading-none
                                    text-[#8b8b8b]
                                "
                            >
                                {stage.tag}
                            </div>

                            <h3 className="mt-2 text-[13px] font-black uppercase leading-none text-[#222]">
                                {stage.title}
                            </h3>

                            <p className="mt-2 max-w-[250px] text-[9px] leading-[1.12] text-[#c4c4c4]">
                                {stage.description}
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label={`Open ${stage.title}`}
                            className="
                                ml-3
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
                    </article>
                ))}
            </div>

            {/* Market ready */}
            <div
                className="
                    mt-3
                    flex
                    min-h-[90px]
                    items-center
                    rounded-[10px]
                    bg-[#151515]
                    px-3
                    text-white
                "
            >
                {/* Progress circle */}
                <div
                    className="
                        relative
                        flex
                        h-[65px]
                        w-[65px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[conic-gradient(#5848ff_0deg,#5848ff_288deg,#ffffff_288deg,#ffffff_360deg)]
                    "
                >
                    <div
                        className="
                            flex
                            h-[52px]
                            w-[52px]
                            items-center
                            justify-center
                            rounded-full
                            bg-[#151515]
                        "
                    >
                        <span className="text-[16px] font-black">
                            80%
                        </span>
                    </div>
                </div>

                {/* text */}
                <div className="ml-5">
                    <h3 className="text-[16px] font-black uppercase leading-none">
                        Market ready
                    </h3>

                    <p className="mt-2 text-[11px] leading-[1.05] text-white">
                        Your product is one
                        <br />
                        step closer
                    </p>
                </div>

                {/* bars */}
                <div className="ml-auto flex h-[52px] items-end gap-[4px] pr-1">
                    <span className="h-[24px] w-[6px] bg-[#454545]" />
                    <span className="h-[34px] w-[6px] bg-[#555]" />
                    <span className="h-[43px] w-[6px] bg-[#666]" />
                    <span className="h-[51px] w-[6px] bg-[#777]" />
                </div>
            </div>
        </section>
    );
}