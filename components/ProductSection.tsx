import Image from "next/image";

const cards = [
    {
        label: "EFFICIENCY",
        code: "Gx801",
        title: "ULTRA",
        titleSecond: "SPEED",
        text: "ОПТИМИЗАЦИЯ CORE VITALS ДЛЯ МГНОВЕННОЙ ЗАГРУЗКИ В ЛЮБОЙ ТОЧКЕ МИРА.",
        bottom: "LCP<1.2s",
    },
    {
        label: "SCALING",
        code: "Nx404",
        title: "SMART",
        titleSecond: "GROWTH",
        text: "ГИБКАЯ АРХИТЕКТУРА, КОТОРАЯ ГОТОВА РАСТИ ВМЕСТЕ С ВАШИМ ПРОДУКТОМ.",
        bottom: "AUTO SCALE",
    },
    {
        label: "SYSTEM",
        code: "Px209",
        title: "CLEAN",
        titleSecond: "CODE",
        text: "ПРОДУМАННАЯ СТРУКТУРА, ЧИСТЫЙ КОД И ПОЛНЫЙ КОНТРОЛЬ НАД ПРОЕКТОМ.",
        bottom: "NO BUILDER",
        withAstronaut: true,
    },
    {
        label: "SUPPORT",
        code: "Rx117",
        title: "LONG",
        titleSecond: "TERM",
        text: "МЫ СОЗДАЕМ НЕ РАЗОВУЮ СТРАНИЦУ, А ОСНОВУ ДЛЯ ДАЛЬНЕЙШЕГО РАЗВИТИЯ.",
        bottom: "STABLE CORE",
    },
];

const logs = [
    {
        icon: "/icons/arrowGreenProd.svg",
        text: "Проверка систем экосистемы...",
        className: "text-[#2C6842]",
    },
    {
        icon: "/icons/arrowBlueProd.svg",
        text: "Нодули оптимизации подключены.",
        className: "text-[#2D4773]",
    },
    {
        icon: "/icons/arrowGreyProd.svg",
        text: "Ожидание запроса на анализ стратегии...",
        className: "text-[#414141]",
    },
];

const ProductSection = () => {
    return (
        <section className="w-full overflow-visible py-16 md:py-24">
            <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">
                <p className="text-xs font-bold uppercase tracking-[0.03em] text-[#C5C6C8]">
                    DEPLOYMENTPROTOCOL04
                </p>

                <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
                    <h2 className="flex flex-col text-[clamp(44px,7vw,94px)] font-black uppercase leading-[0.9] tracking-[-0.03em]">
                        <span className="text-[#1E1E1E]">PRODUCT</span>
                        <span className="text-[#C5C6C8]">LIFECYCLE</span>
                    </h2>

                    <p className="max-w-[470px] text-sm font-bold uppercase leading-[1.25] text-[#C5C6C8]">
                        МЫ СОЗДАЕМ НЕ ПРОСТО ИНТЕРФЕЙС, А МОЩНУЮ ЭКОСИСТЕМУ, КОТОРАЯ РАСТЕТ
                        ВМЕСТЕ С ВАШИМ БИЗНЕСОМ, ОБЕСПЕЧИВАЯ СКОРОСТЬ И СТАБИЛЬНОСТЬ.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:mt-16 xl:grid-cols-4">
                    {cards.map((card) => (
                        <ProductCard key={`${card.code}-${card.title}`} {...card} />
                    ))}

                    <ProductTerminal />

                    <ProductStats />
                </div>

                <div className="mt-10 flex flex-col gap-4 md:mt-16 md:flex-row md:justify-between">
                    <div className="flex gap-2 text-xs font-bold uppercase leading-none text-[#C1C2C4]">
                        <p>END</p>
                        <p>OFPHASE04</p>
                    </div>

                    <p className="text-xs font-bold uppercase leading-none text-[#C1C2C4]">
                        PIXARDIA ECOSYSTEM
                    </p>
                </div>
            </div>
        </section>
    );
};

type ProductCardProps = {
    label: string;
    code: string;
    title: string;
    titleSecond: string;
    text: string;
    bottom: string;
    withAstronaut?: boolean;
};

const ProductCard = ({
                         label,
                         code,
                         title,
                         titleSecond,
                         text,
                         bottom,
                         withAstronaut = false,
                     }: ProductCardProps) => {
    return (
        <div className="relative min-w-0 border border-[#808181] p-5 md:p-6">
            {withAstronaut && (
                <Image
                    src="/images/astronautProd.png"
                    alt=""
                    width={150}
                    height={150}
                    className="
                               pointer-events-none
                               absolute
                               hidden
                               h-auto
                               object-contain

                               xl:block
                               xl:left-[calc(0%-12%)]
                               xl:top-[calc(0%-43%)]
                               xl:w-[52%]
                               xl:max-w-[150px]
                             "
                />
            )}

            <div className="flex items-center justify-between gap-3">
                <p className="border-2 border-[#E1DED6] px-1.5 py-[3px] text-xs font-bold leading-none text-[#878787]">
                    {label}
                </p>

                <p className="text-xs font-bold leading-none text-[#DDDDDD]">{code}</p>
            </div>

            <h5 className="pt-6 text-2xl font-black uppercase leading-[1.05] text-[#1E1E1E]">
                {title}
                <br />
                {titleSecond}
            </h5>

            <p className="pt-5 text-xs font-bold uppercase leading-[1.2] text-[#C5C6C8]">
                {text}
            </p>

            <div className="flex items-center justify-between gap-4 pt-11">
                <p className="text-xs font-bold leading-none text-[#969696]">
                    {bottom}
                </p>

                <Image
                    src="/icons/lineProd.svg"
                    alt=""
                    width={72}
                    height={8}
                    className="h-auto max-w-[40%]"
                />
            </div>
        </div>
    );
};

const ProductTerminal = () => {
    return (
        <div className="border-r-[10px] border-b-[5px] border-[#4F46E5] bg-black md:col-span-2 xl:col-span-3">
            <div className="flex flex-col gap-[15px] px-5 py-6 md:px-8">
                {logs.map((log) => (
                    <div
                        key={log.text}
                        className={`flex items-center gap-2 text-xs font-bold leading-[1.3] md:text-sm ${log.className}`}
                    >
                        <Image src={log.icon} alt="" width={14} height={14} />
                        <p>{log.text}</p>
                    </div>
                ))}

                <form className="flex flex-col gap-4 py-5 sm:flex-row sm:items-end">
                    <input
                        type="text"
                        placeholder="Напишите сферу вашего бизнеса..."
                        className="w-full border-0 border-b-2 border-[#58537B] bg-transparent px-0 py-2.5 text-xs font-bold leading-none text-[#EDEDED] outline-none placeholder:text-[#58537B] sm:px-5"
                    />

                    <button
                        type="button"
                        className="bg-[#F7F9FA] px-8 py-2 text-xs font-bold uppercase text-[#1E1E1E] transition hover:bg-[#EDEDED]"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

const ProductStats = () => {
    return (
        <div className="flex min-h-[220px] flex-col items-center justify-center border-2 border-[#E1DED6] p-6 text-center md:col-span-2 xl:col-span-1">
            <Image
                src="/icons/statisticsProd.svg"
                alt=""
                width={160}
                height={120}
                className="h-auto max-w-full"
            />

            <h6 className="mt-2 text-xs font-bold uppercase leading-none text-[#1E1E1E]">
                MARKET READY
            </h6>

            <p className="mt-2 text-[8px] font-bold uppercase leading-none text-[#DEDEDE]">
                BALJNPOEKT TOTOR K MACSITAGNIPOSANSO
            </p>
        </div>
    );
};

export default ProductSection;