import Image from "next/image";

const HeaderSection = () => {
    return (
        <header
            className="mx-auto flex w-full max-w-[var(--container)] flex-col items-start justify-between gap-6 px-5 py-5 sm:flex-row sm:items-center sm:gap-4 sm:px-8 lg:gap-6 lg:px-10"
        >
            <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                <div
                    className="font-['REM',sans-serif] text-[clamp(24px,3vw,32px)] font-bold leading-none tracking-[-0.03em]">
                    PIXARDIA
                </div>

                <div
                    className="font-['REM',sans-serif] text-[clamp(12px,1.5vw,16px)] font-bold uppercase leading-none text-[#C0BEBE]">
                    web-product
                </div>
            </div>

            <div
                className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-start sm:gap-4 lg:gap-6">
                <Image
                    src="/icons/star.svg"
                    alt=""
                    width={36}
                    height={36}
                    aria-hidden="true"
                    className="size-7 shrink-0 sm:size-9"
                    priority
                />

                <Image
                    src="/icons/line.svg"
                    alt=""
                    width={70}
                    height={1}
                    aria-hidden="true"
                    className="w-10 shrink-0 sm:w-[50px] lg:w-[70px]"
                />

                <button
                    type="button"
                    className="whitespace-nowrap font-['REM',sans-serif] text-[clamp(12px,1.5vw,16px)] font-bold uppercase leading-none tracking-[0.03em] text-[#1E1E1E] transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1E1E1E]"
                >
                    start project
                </button>
            </div>
        </header>
    );
};

export default HeaderSection;
