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
        code: "01 // STRATEGY",
        title: ["Product", "Strategy"],
        description: [
            "Clear priorities and technical direction",
            "aligned with business goals.",
        ],
        indicatorClassName: "bg-black",
        shadowClassName: "bg-black",
        layoutClassName: "sm:aspect-[400/330]",
    },
    {
        id: "backend",
        code: "02 // EXPERIENCE",
        title: ["UX & UI", "Systems"],
        description: [
            "Intuitive interfaces and design systems",
            "built for real users and tasks.",
        ],
        indicatorClassName: "bg-black",
        layoutClassName: "sm:aspect-[350/300]",
    },
    {
        id: "integration",
        code: "03 // ENGINEERING",
        title: ["Product", "Engineering"],
        description: [
            "Scalable frontend and backend systems",
            "built for performance and growth.",
        ],
        indicatorClassName: "border border-[#1853b4] bg-[#276ce0]",
        layoutClassName: "sm:aspect-[355/245]",
    },
    {
        id: "security",
        code: "04 // SECURITY",
        title: ["Security", "Protocol"],
        description: [
            "Secure architecture and protected data flows",
            "for dependable production delivery.",
        ],
        indicatorClassName: "border border-[#b81919] bg-[#f21e1e]",
        layoutClassName: "sm:aspect-[306/318]",
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
                "relative z-10 mx-auto min-w-0 w-full max-w-[430px]",
                node.layoutClassName,
            )}
        >
            {hasShadow && (
                <span
                    aria-hidden="true"
                    className={cx(
                        "absolute inset-y-0 left-0 w-[92.5%] translate-x-[3%] translate-y-[4%]",
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
                    "group flex min-h-[220px] w-full min-w-0 flex-col border border-[#494949] bg-white p-5 text-left sm:min-h-0 sm:p-7",
                    "transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1",
                    active &&
                    "border-[#246ae5] shadow-[0_18px_50px_rgba(36,106,229,0.12)]",
                    hasShadow
                        ? "relative z-10 w-full sm:absolute sm:inset-y-0 sm:left-0 sm:w-[92.5%]"
                        : "h-full",
                )}
            >
                <span className="flex w-full min-w-0 items-center justify-between gap-3 sm:gap-5">
                    <span className="min-w-0 text-sm font-bold uppercase leading-none tracking-[-0.02em] text-[#909090] sm:text-base">
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

                <span className="mt-6 flex min-w-0 flex-col text-[clamp(24px,5vw,34px)] font-black uppercase leading-[0.96] tracking-[-0.035em] text-[#3f3f3f]">
                    {node.title.map((line) => (
                        <span key={line} className="break-words">{line}</span>
                    ))}
                </span>

                <span className="mt-auto min-w-0 max-w-[96%] pt-3 text-[13px] font-bold leading-[1.2] text-[#c3c3c3] sm:text-[15px]">
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
                "overflow-x-clip bg-white [font-family:var(--font-archivo)]",
                className,
            )}
        >
            <div
                className="site-container"
                data-cinematic-layer=""
            >
                <div
                    className="relative w-full py-12 sm:py-16"
                    data-neural-layer=""
                >
                <svg
                    className="pointer-events-none absolute inset-0 z-0 hidden size-full overflow-visible min-[1280px]:block"
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
                    className="relative z-10 min-w-0"
                    data-neural-header=""
                    data-cinematic-element="neural-header"
                >
                    <p
                        className="text-xs font-bold uppercase leading-none text-[#c5c6c8] min-[1280px]:text-[clamp(12px,0.78vw,15px)]"
                        data-neural-kicker=""
                    >
                        03 / CONNECTED DIGITAL CAPABILITIES
                    </p>

                    <h2
                        id="neural-system-title"
                        className="mt-5 flex min-w-0 flex-col text-[clamp(2.75rem,10vw,8rem)] font-black uppercase leading-[0.98] tracking-[-0.045em]"
                    >
                        <span
                            className="whitespace-nowrap text-[#1e1e1e]"
                            data-neural-title-line=""
                        >
                            Neural
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
                    className="neural-core relative z-10 mx-auto mt-10 aspect-square w-full max-w-[340px] rounded-full border-[1.5px] border-[#2472ef] p-[clamp(10px,1vw,18px)] md:mt-12 md:max-w-[520px]"
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
                                Connected_System
                            </p>
                            <p className="absolute left-1/2 top-[20%] z-10 -translate-x-1/2 whitespace-nowrap text-[clamp(30px,2.55vw,46px)] font-black uppercase leading-none tracking-[0.02em] text-[#f4f4f4]">
                                Pixardia
                            </p>
                            <Image
                                src={alienImageSrc}
                                alt="Pixardia system core"
                                width={500}
                                height={500}
                                sizes="(min-width: 1280px) 440px, (min-width: 768px) 520px, 340px"
                                className="absolute inset-0 size-full object-cover opacity-90"
                                data-neural-character=""
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 grid items-stretch gap-6 md:mt-12 md:grid-cols-2 md:gap-8" data-neural-nodes="">
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
                    className="relative z-10 mx-auto mt-10 min-h-[320px] w-full max-w-[468px] md:mt-12 md:min-h-[330px]"
                    data-neural-insight=""
                    data-cinematic-element="neural-insight"
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 translate-x-[1%] translate-y-[2%] bg-[#4a83dd]"
                    />
                    <div className="absolute bottom-[4%] right-[3%] top-0 flex w-[97%] min-w-0 flex-col border-2 border-[#5274a7] bg-white p-[clamp(22px,1.8vw,32px)]" data-neural-insight-card="">
                        <div className="flex items-center gap-3">
                            <span className="size-[clamp(8px,0.62vw,11px)] shrink-0 border border-[#1853b4] bg-[#246ae5]" />
                            <h3 className="text-[clamp(15px,1.1vw,20px)] font-extrabold uppercase leading-none text-[#686868]">
                                System Insight
                            </h3>
                        </div>

                        <p className="mt-[clamp(22px,2vw,36px)] text-[clamp(14px,1vw,18px)] font-bold leading-[1.5] text-[#969696]">
                            Strategy, design and engineering work as one
                            connected system around your product goals.
                        </p>

                        <button
                            type="button"
                            onClick={() => onDeepAnalysis?.(activeNode)}
                            className="mt-auto flex min-h-[clamp(46px,3vw,54px)] w-full items-center justify-center bg-black px-5 py-3 text-[clamp(14px,1vw,18px)] font-extrabold uppercase leading-none text-white transition-colors hover:bg-[#246ae5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#246ae5]"
                        >
                            Explore Capability
                        </button>
                    </div>
                </aside>

                <div
                    className="relative z-10 mt-10 grid grid-cols-2 items-start gap-8 md:mt-12 md:flex md:flex-wrap md:gap-10"
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
            </div>
        </section>
    );
}
