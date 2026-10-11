export default function ProjectSystemPreview() {
    return (
        <div
            className="relative h-full w-full overflow-hidden bg-[#0b0e18] text-white"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(120,100,255,.07) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(120,100,255,.07) 1px, transparent 1px)
                `,
                backgroundSize: "14px 14px",
            }}
        >
            {/* top */}
            <div className="absolute left-3 top-2 text-[6px] tracking-[0.22em] text-[#b6b6c6]">
                □ PX-2026-001
            </div>

            <div className="absolute right-3 top-2 text-[6px] tracking-[0.18em] text-[#b6b6c6]">
                □ SYSTEM PREVIEW
            </div>

            {/* LEFT */}
            <div className="absolute left-[4%] top-[34px] flex w-[27%] flex-col gap-[7px]">
                <SmallBlock title="DATA LAYER" subtitle="CONTENT & SERVICES" />
                <SmallBlock title="APPLICATION LAYER" subtitle="BUSINESS LOGIC" />
                <SmallBlock title="INTEGRATION LAYER" subtitle="EXTERNAL SYSTEMS" />
            </div>

            {/* RIGHT */}
            <div className="absolute right-[4%] top-[34px] flex w-[27%] flex-col gap-[7px]">
                <SmallBlock title="EXPERIENCE LAYER" subtitle="WEB & INTERFACES" />
                <SmallBlock title="ANALYTICS LAYER" subtitle="INSIGHTS & METRICS" />
                <SmallBlock title="DELIVERY LAYER" subtitle="PROJECTS & ENQUIRY" />
            </div>

            {/* connection lines */}
            <div className="absolute left-[31%] top-[58px] h-px w-[11%] bg-[#8b78ff]" />
            <div className="absolute left-[31%] top-[93px] h-px w-[11%] bg-[#8b78ff]" />
            <div className="absolute left-[31%] top-[128px] h-px w-[11%] bg-[#8b78ff]" />

            <div className="absolute right-[31%] top-[58px] h-px w-[11%] bg-[#8b78ff]" />
            <div className="absolute right-[31%] top-[93px] h-px w-[11%] bg-[#8b78ff]" />
            <div className="absolute right-[31%] top-[128px] h-px w-[11%] bg-[#8b78ff]" />

            {/* CORE */}
            <div
                className="
                    absolute
                    left-1/2
                    top-[39px]
                    flex
                    h-[91px]
                    w-[32%]
                    -translate-x-1/2
                    flex-col
                    items-center
                    border
                    border-[#6954ff]
                    bg-[#12101f]/90
                    pt-2
                    shadow-[0_0_20px_rgba(91,72,255,.25)]
                "
            >
                <div className="text-[8px] font-bold tracking-[0.18em]">
                    PIXARDIA CORE
                </div>

                <div className="mt-[2px] text-[5px] tracking-[0.14em] text-[#aaa7ba]">
                    DIGITAL EXPERIENCE
                </div>

                {/* core cube */}
                <div className="relative mt-2 h-[39px] w-[39px]">
                    <div className="absolute left-[8px] top-[2px] h-[22px] w-[22px] rotate-45 border border-[#9b8cff] bg-[#5848ff]/60" />
                    <div className="absolute left-[8px] top-[9px] h-[22px] w-[22px] rotate-45 border border-[#806cff] bg-[#4939d5]/60" />
                    <div className="absolute left-[8px] top-[16px] h-[22px] w-[22px] rotate-45 border border-[#715cff] bg-[#32268e]/60" />
                </div>
            </div>

            {/* tech */}
            <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-1">
                <Tech label="NEXT.JS" />
                <Tech label="TS" />
                <Tech label="REACT" />
                <Tech label="TAILWIND" />
                <Tech label="POSTGRES" />
                <Tech label="GSAP" />
            </div>

            {/* frame */}
            <div className="pointer-events-none absolute inset-[4px] border border-[#5848ff]/40" />
        </div>
    );
}

function SmallBlock({
                        title,
                        subtitle,
                    }: {
    title: string;
    subtitle: string;
}) {
    return (
        <div
            className="
                flex
                h-[28px]
                flex-col
                justify-center
                border
                border-[#75758b]
                bg-[#10131d]/90
                px-2
            "
        >
            <div className="text-[6px] font-bold tracking-[0.08em]">
                {title}
            </div>

            <div className="mt-[1px] text-[4px] tracking-[0.08em] text-[#888898]">
                {subtitle}
            </div>
        </div>
    );
}

function Tech({ label }: { label: string }) {
    return (
        <div
            className="
                flex
                h-[18px]
                flex-1
                items-center
                justify-center
                border
                border-[#575767]
                bg-[#11141d]
                px-1
                text-[4px]
                font-medium
                tracking-[0.06em]
                text-[#d6d6df]
            "
        >
            {label}
        </div>
    );
}