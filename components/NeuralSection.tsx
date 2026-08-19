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
            "Реактивные интерфейсы",
            "с плавной анимацией и логикой",
        ],
        indicatorClassName: "bg-black",
        shadowClassName: "bg-black",
        layoutClassName:
            "aspect-[400/286] xl:absolute xl:left-[60.95%] xl:top-[11.6%] xl:w-[20.35%]",
    },
    {
        id: "backend",
        code: "02 // DATA_CORE",
        title: ["Scalable", "Backend"],
        description: [
            "Архитектура выдерживает",
            "миллионы запросов в секунду.",
        ],
        indicatorClassName: "bg-black",
        layoutClassName:
            "aspect-[350/244] xl:absolute xl:left-[18.25%] xl:top-[67.1%] xl:w-[17.6%]",
    },
    {
        id: "integration",
        code: "03 // INTEL_LAYER",
        title: ["AIINTEGRATION"],
        description: [
            "Нейронные сети Gemini для",
            "анализа и генерации контента",
        ],
        indicatorClassName: "border border-[#1853b4] bg-[#276ce0]",
        layoutClassName:
            "aspect-[355/205] xl:absolute xl:left-[10.9%] xl:top-[43.25%] xl:w-[17.85%]",
    },
    {
        id: "security",
        code: "04 // SEC_SHIELD",
        title: ["Security", "Protocol"],
        description: [
            "Шифрование данных и защита",
            "от угроз любого уровня.",
        ],
        indicatorClassName: "border border-[#b81919] bg-[#f21e1e]",
        layoutClassName:
            "aspect-[306/242] xl:absolute xl:left-[60.45%] xl:top-[67.65%] xl:w-[15.4%]",
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
            className={cx(
                "relative mx-auto w-full max-w-[430px] xl:mx-0 xl:max-w-none",
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
                aria-pressed={active}
                onClick={onSelect}
                className={cx(
                    "group flex w-full flex-col border border-[#494949] bg-white p-5 text-left sm:p-7 xl:p-[clamp(18px,calc(3vw_-_20px),34px)]",
                    "transition-transform duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#246ae5]",
                    hasShadow
                        ? "absolute bottom-[10.5%] right-[7.5%] top-0 w-[92.5%]"
                        : "h-full",
                )}
            >
                <span className="flex w-full items-center justify-between gap-5">
                    <span className="text-sm font-bold uppercase leading-none tracking-[-0.02em] text-[#909090] sm:text-base xl:text-[clamp(12px,calc(1.12vw_-_2px),18px)]">
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

                <span className="mt-6 flex flex-col text-[clamp(24px,5vw,34px)] font-black uppercase leading-[0.96] tracking-[-0.035em] text-[#3f3f3f] xl:mt-[clamp(14px,calc(2.43vw_-_17px),27px)] xl:text-[clamp(22px,calc(2.25vw_-_7px),34px)]">
                    {node.title.map((line) => (
                        <span key={line}>{line}</span>
                    ))}
                </span>

                <span className="mt-auto max-w-[95%] pt-4 text-sm font-bold leading-[1.25] text-[#c3c3c3] sm:text-[15px] xl:pt-[clamp(10px,1.1vw,20px)] xl:text-[clamp(11px,calc(1.12vw_-_3px),17px)]">
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
                                                alienImageSrc = "/images/alien-core.png",
                                                onDeepAnalysis,
                                            }: NeuralSystemSectionProps) {
    const [activeNode, setActiveNode] =
        useState<NeuralNodeId>("frontend");

    return (
        <section
            id="neural-system"
            aria-labelledby="neural-system-title"
            data-story-section="neural"
            data-cinematic-scene="neural"
            className={cx(
                "overflow-hidden bg-[#f5f8fa] [font-family:var(--font-archivo)]",
                className,
            )}
        >
            <div className="relative mx-auto w-full max-w-[1814px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10 xl:aspect-[1814/1252] xl:px-0 xl:py-0">
                <header className="xl:absolute xl:left-[1.55%] xl:top-[1.55%] xl:w-[53%]">
                    <p className="text-xs font-bold uppercase leading-none text-[#c5c6c8] xl:text-[clamp(12px,0.78vw,15px)]">
                        DeploymentProtocol03
                    </p>

                    <h2
                        id="neural-system-title"
                        className="mt-5 flex flex-col text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.98] tracking-[-0.045em] xl:mt-[1.2vw] xl:text-[clamp(5rem,7.1vw,8rem)]"
                    >
                        <span className="whitespace-nowrap text-[#1e1e1e]">
                            The Neural
                        </span>
                        <span className="whitespace-nowrap text-[#c5c6c8]">
                            System
                        </span>
                    </h2>
                </header>

                <div className="relative mx-auto mt-14 aspect-square w-full max-w-[484px] rounded-full border-[1.5px] border-[#2472ef] p-[clamp(10px,1vw,18px)] xl:absolute xl:left-[38.25%] xl:top-[29.9%] xl:mt-0 xl:w-[24.4%]">
                    <div className="flex size-full items-center justify-center rounded-full border-[1.5px] border-[#2472ef] bg-white p-[clamp(8px,0.75vw,14px)]">
                        <div className="relative size-full overflow-hidden rounded-full bg-[#181818]">
                            <p className="absolute left-1/2 top-[11%] z-10 -translate-x-1/2 whitespace-nowrap text-[clamp(11px,0.82vw,15px)] font-extrabold uppercase tracking-[-0.02em] text-[#5f5f5f]">
                                Core_Status
                            </p>
                            <p className="absolute left-1/2 top-[20%] z-10 -translate-x-1/2 whitespace-nowrap text-[clamp(30px,2.55vw,46px)] font-black uppercase leading-none tracking-[0.02em] text-[#f4f4f4]">
                                Pixardia
                            </p>
                            <Image
                                src={alienImageSrc}
                                alt="Инопланетянин Pixardia"
                                width={500}
                                height={500}
                                sizes="(min-width: 1280px) 25vw, 484px"
                                className="absolute bottom-[-1%] left-1/2 h-auto w-[58%] -translate-x-1/2 object-contain"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-14 grid gap-7 sm:grid-cols-2 xl:contents">
                    {nodes.map((node) => (
                        <NodeCard
                            key={node.id}
                            node={node}
                            active={activeNode === node.id}
                            onSelect={() => setActiveNode(node.id)}
                        />
                    ))}
                </div>

                <aside className="relative mx-auto mt-10 aspect-[468/366] w-full max-w-[468px] xl:absolute xl:left-[68.1%] xl:top-[37.45%] xl:mt-0 xl:w-[23.1%] xl:max-w-none">
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
                            Кликните на любой узел системы, чтобы Gemini
                            проанализировал его роль в вашем будущем проекте
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

                <div className="mt-14 flex items-start gap-8 sm:gap-10 xl:absolute xl:bottom-[3.7%] xl:left-[1.35%] xl:mt-0">
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