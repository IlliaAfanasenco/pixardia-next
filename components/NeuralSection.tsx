"use client";

import Image from "next/image";
import { useState } from "react";

export type NeuralNodeId =
    | "frontend"
    | "backend"
    | "integration"
    | "security";

type NeuralNode = {
    id: NeuralNodeId;
    code: string;
    title: string[];
    description: string[];
    indicatorClassName: string;
    layoutClassName: string;
    shadowClassName?: string;
};

type NeuralSystemSectionProps = {
    className?: string;
    alienImageSrc?: string;
    onDeepAnalysis?: (node: NeuralNodeId) => void;
};

const nodes: NeuralNode[] = [
    {
        id: "frontend",
        code: "01 // UI_ENGINE",
        title: ["Frontend", "Manifest"],
        description: [
            "Fluid interfaces",
            "built for interaction.",
        ],
        indicatorClassName: "bg-black",
        shadowClassName: "bg-black",
        layoutClassName:
            "aspect-[400/330] min-[1200px]:absolute min-[1200px]:left-[60.95%] min-[1200px]:top-[11.6%] min-[1200px]:w-[20.35%]",
    },
    {
        id: "backend",
        code: "02 // DATA_CORE",
        title: ["Scalable", "Backend"],
        description: [
            "Scalable services",
            "built for resilience.",
        ],
        indicatorClassName: "bg-black",
        layoutClassName:
            "aspect-[350/300] min-[1200px]:absolute min-[1200px]:left-[18.25%] min-[1200px]:top-[67.1%] min-[1200px]:w-[17.6%]",
    },
    {
        id: "integration",
        code: "03 // INTEL_LAYER",
        title: ["AI INTEGRATION"],
        description: [
            "Applied AI for analysis",
            "and generation.",
        ],
        indicatorClassName: "border border-[#1853b4] bg-[#276ce0]",
        layoutClassName:
            "aspect-[355/245] min-[1200px]:absolute min-[1200px]:left-[10.9%] min-[1200px]:top-[43.25%] min-[1200px]:w-[17.85%]",
    },
    {
        id: "security",
        code: "04 // SEC_SHIELD",
        title: ["Security", "Protocol"],
        description: [
            "Encrypted data",
            "layered threat protection.",
        ],
        indicatorClassName: "border border-[#b81919] bg-[#f21e1e]",
        layoutClassName:
            "aspect-[306/318] min-[1200px]:absolute min-[1200px]:left-[60.45%] min-[1200px]:top-[67.65%] min-[1200px]:w-[15.4%]",
    },
];

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function NodeCard({
                      node,
                      active,
                      onSelect,
                  }: {
    node: NeuralNode;
    active: boolean;
    onSelect: () => void;
}) {
    const hasShadow = Boolean(node.shadowClassName);

    return (
        <div
            data-neural-node={node.id}
            className={cx(
                "relative z-10 mx-auto w-full max-w-[430px] min-[1200px]:mx-0 min-[1200px]:max-w-none",
                node.layoutClassName,
            )}
        >
            {hasShadow && (
                <span
                    aria-hidden="true"
                    className={cx(
                        "absolute inset-0 translate-x-[7.5%] translate-y-[10.5%]",
                        node.shadowClassName,
                    )}
                />
            )}

            <button
                type="button"
                data-neural-node-card=""
                aria-pressed={active}
                onClick={onSelect}
                className={cx(
                    "group flex w-full flex-col border border-[#494949] bg-white p-5 text-left sm:p-7 min-[1200px]:p-[clamp(18px,calc(3vw_-_20px),34px)]",
                    "transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#246ae5]",
                    active &&
                    "border-[#246ae5] shadow-[0_18px_50px_rgba(36,106,229,0.12)]",
                    hasShadow
                        ? "relative z-10 h-full w-[92.5%]"
                        : "h-full",
                )}
            >
                <span className="flex w-full items-center justify-between gap-5">
                    <span className="whitespace-nowrap text-sm font-bold uppercase leading-none tracking-[-0.02em] text-[#909090] sm:text-base min-[1200px]:text-[clamp(12px,calc(1.12vw_-_2px),18px)]">
                        {node.code}
                    </span>
                    <span
                        aria-hidden="true"
                        className={cx(
                            "size-[clamp(8px,0.62vw,11px)] shrink-0",
                            node.indicatorClassName,
                            active &&
                            "ring-2 ring-[#246ae5]/30 ring-offset-2 ring-offset-white",
                        )}
                    />
                </span>

                <span className="mt-6 flex flex-col text-[clamp(24px,5vw,34px)] font-black uppercase leading-[0.96] tracking-[-0.035em] text-[#3f3f3f] min-[1200px]:mt-[clamp(14px,calc(2.43vw_-_17px),27px)] min-[1200px]:text-[clamp(22px,calc(2.25vw_-_7px),34px)]">
                    {node.title.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </span>

                <span className="mt-auto max-w-[96%] pt-3 text-[13px] font-bold leading-[1.18] text-[#c3c3c3] sm:text-[15px] min-[1200px]:pt-[clamp(8px,0.8vw,14px)] min-[1200px]:text-[clamp(10px,0.82vw,15px)]">
                    {node.description.map((line) => (
                        <span key={line} className="block">
                            {line}
                        </span>
                    ))}
                </span>
            </button>
        </div>
    );
}

export default function NeuralSystemSection({
                                                className,
                                                alienImageSrc = "/images/AlienExtraterrestrial.png",
                                                onDeepAnalysis,
                                            }: NeuralSystemSectionProps) {
    const [activeNode, setActiveNode] =
        useState<NeuralNodeId>("frontend");

    return (
        <section
            id="neural-system"
            aria-labelledby="neural-system-title"
            data-story-section="neural"
            data-story-step="3"
            data-cinematic-scene="neural"
            data-motion="fade-up"
            data-motion-state="pending"
            className={cx(
                "overflow-hidden bg-[#f5f8fa] [font-family:var(--font-archivo)]",
                className,
            )}
        >
            <div
                className="relative mx-auto w-full max-w-[1814px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 min-[1200px]:aspect-[1814/1252] min-[1200px]:px-0 min-[1200px]:py-0"
                data-cinematic-layer=""
                data-neural-layer=""
            >
                <svg
                    className="pointer-events-none absolute inset-0 z-0 hidden size-full overflow-visible min-[1200px]:block"
                    viewBox="0 0 1814 1252"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    data-neural-network=""
                    data-cinematic-element="neural-network"
                >
                    <path
                        d="M915 625 C1040 520 1132 356 1280 290"
                        data-neural-network-path=""
                        pathLength="1"
                    />
                    <path
                        d="M888 656 C700 690 600 870 465 968"
                        data-neural-network-path=""
                        pathLength="1"
                    />
                    <path
                        d="M865 620 C676 575 560 588 370 650"
                        data-neural-network-path=""
                        pathLength="1"
                    />
                    <path
                        d="M930 672 C1080 756 1168 914 1270 990"
                        data-neural-network-path=""
                        pathLength="1"
                    />
                    <path
                        d="M960 622 C1160 600 1340 610 1480 682"
                        data-neural-network-path=""
                        pathLength="1"
                    />
                </svg>
                <header
                    className="relative z-10 min-[1200px]:absolute min-[1200px]:left-[1.55%] min-[1200px]:top-[1.55%] min-[1200px]:w-[53%]"
                    data-neural-header=""
                    data-cinematic-element="neural-header"
                >
                    <p
                        className="text-xs font-bold uppercase leading-none text-[#c5c6c8] min-[1200px]:text-[clamp(12px,0.78vw,15px)]"
                        data-neural-kicker=""
                    >
                        03 / INTELLIGENCE
                    </p>

                    <h2
                        id="neural-system-title"
                        className="mt-5 flex flex-col text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.98] tracking-[-0.045em] min-[1200px]:mt-[1.2vw] min-[1200px]:text-[clamp(5rem,7.1vw,8rem)]"
                    >
                        <span
                            className="whitespace-nowrap text-[#1e1e1e]"
                            data-neural-title-line=""
                        >
                            The Neural
                        </span>

                        <span
                            className="whitespace-nowrap text-[#c5c6c8]"
                            data-neural-title-line=""
                        >
                            System
                        </span>
                    </h2>
                </header>

                <div
                    className="neural-core relative z-10 mx-auto mt-14 aspect-square w-full max-w-[484px] rounded-full border-[1.5px] border-[#2472ef] p-[clamp(10px,1vw,18px)] min-[1200px]:absolute min-[1200px]:left-[38.25%] min-[1200px]:top-[29.9%] min-[1200px]:mt-0 min-[1200px]:w-[24.4%]"
                    data-neural-core=""
                    data-cinematic-element="neural-core"
                >
                    <span
                        className="neural-core__orbit neural-core__orbit--outer"
                        aria-hidden="true"
                    />

                    <span
                        className="neural-core__orbit neural-core__orbit--inner"
                        aria-hidden="true"
                    />

                    <div
                        className="flex size-full items-center justify-center rounded-full border-[1.5px] border-[#2472ef] bg-white p-[clamp(8px,0.75vw,14px)]"
                        data-neural-core-disc=""
                    >
                        <div className="relative size-full overflow-hidden rounded-full bg-[#181818]">
                            <p className="absolute left-1/2 top-[11%] z-10 -translate-x-1/2 whitespace-nowrap text-[clamp(11px,0.82vw,15px)] font-extrabold uppercase tracking-[-0.02em] text-[#5f5f5f]">
                                Core_Status
                            </p>
                            <p className="absolute left-1/2 top-[20%] z-10 -translate-x-1/2 whitespace-nowrap text-[clamp(30px,2.55vw,46px)] font-black uppercase leading-none tracking-[0.02em] text-[#f4f4f4]">
                                Pixardia
                            </p>
                            <Image
                                src={alienImageSrc}
                                alt="Pixardia system core"
                                width={500}
                                height={500}
                                sizes="(min-width: 1200px) 440px, (min-width: 768px) 484px, 90vw"
                                className="absolute inset-0 size-full object-cover opacity-90"
                                data-neural-character=""
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-14 grid gap-7 sm:grid-cols-2 min-[1200px]:contents">
                    {nodes.map((node) => (
                        <NodeCard
                            key={node.id}
                            node={node}
                            active={activeNode === node.id}
                            onSelect={() => setActiveNode(node.id)}
                        />
                    ))}
                </div>

                <aside
                    className="relative z-10 mx-auto mt-10 aspect-[468/366] w-full max-w-[468px] min-[1200px]:absolute min-[1200px]:left-[66.5%] min-[1200px]:top-[37.45%] min-[1200px]:mt-0 min-[1200px]:w-[21.8%] min-[1200px]:max-w-none"
                    data-neural-insight=""
                    data-cinematic-element="neural-insight"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 translate-x-[3%] translate-y-[4%] bg-[#4a83dd]"
                    />
                    <div className="absolute bottom-[4%] right-[3%] top-0 flex w-[97%] flex-col border-2 border-[#5274a7] bg-white p-[clamp(22px,1.8vw,32px)]">
                        <div className="flex items-center gap-3">
                            <span className="size-[clamp(8px,0.62vw,11px)] shrink-0 border border-[#1853b4] bg-[#246ae5]" />
                            <h3 className="text-[clamp(15px,1.1vw,20px)] font-extrabold uppercase leading-none text-[#686868]">
                                System Insight
                            </h3>
                        </div>

                        <p className="mt-[clamp(22px,2vw,36px)] text-[clamp(14px,1vw,18px)] font-bold leading-[1.5] text-[#969696]">
                            Select any system node to explore how it
                            contributes to your future digital product.
                        </p>

                        <button
                            type="button"
                            onClick={() => onDeepAnalysis?.(activeNode)}
                            className="mt-auto flex min-h-[clamp(46px,3vw,54px)] w-full items-center justify-center bg-black px-5 py-3 text-[clamp(14px,1vw,18px)] font-extrabold uppercase leading-none text-white transition-colors hover:bg-[#246ae5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#246ae5]"
                        >
                            Deep Analysis
                        </button>
                    </div>
                </aside>

                <div
                    className="relative z-10 mt-14 flex items-start gap-8 sm:gap-10 min-[1200px]:absolute min-[1200px]:bottom-[3.7%] min-[1200px]:left-[1.35%] min-[1200px]:mt-0"
                    data-neural-stats=""
                    data-cinematic-element="neural-stats"
                >
                    <div>
                        <p className="text-[clamp(12px,0.82vw,15px)] font-bold uppercase leading-none text-[#b7b7b7]">
                            System_Lat
                        </p>
                        <p className="mt-2 text-[clamp(28px,1.9vw,34px)] font-extrabold leading-none tracking-[-0.03em] text-[#3f3f42]">
                            1.2ms
                        </p>
                    </div>
                    <div>
                        <p className="text-[clamp(12px,0.82vw,15px)] font-bold uppercase leading-none text-[#b7b7b7]">
                            Build_Status
                        </p>
                        <p className="mt-2 text-[clamp(28px,1.9vw,34px)] font-extrabold leading-none tracking-[-0.03em] text-[#527bdc]">
                            Verified
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}