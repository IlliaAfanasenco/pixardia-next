import Image from 'next/image';
import {Archivo} from 'next/font/google';

const archivo = Archivo({
    subsets: ['latin'],
    weight: ['400', '700', '900'],
    variable: '--font-archivo',
});

const HeroSection = () => {
    return (
        <section
            className={`${archivo.variable} relative overflow-hidden py-4 sm:py-6 lg:py-8`}
        >
            <div className="relative z-10 mx-auto w-full max-w-[var(--container)]  px-5 sm:px-8 lg:px-10">
                <p className="max-w-[280px] font-[var(--font-archivo)] text-[11px] font-black uppercase leading-[1.2] tracking-[0.2em] text-[#C5C6C8] sm:max-w-[500px] sm:text-[clamp(12px,1.2vw,16px)] sm:leading-none">
                    creative digital studio / ai augmented
                </p>

                <h1 className="relative z-20 mt-6 font-[var(--font-archivo)] font-black uppercase leading-[0.85] text-[#C5C6C8] sm:mt-0">
                <span
                className="block whitespace-normal text-[clamp(58px,18vw,90px)] tracking-[-0.03em] sm:whitespace-nowrap sm:text-[clamp(70px,15vw,150px)] lg:text-[clamp(80px,16vw,212px)]">
                <span className="-ml-[0.05em] inline-block">Digital</span>
                </span>
                    <span
                        className="block whitespace-normal text-[clamp(58px,18vw,90px)] tracking-[-0.04em] sm:ml-[0.35em] sm:whitespace-nowrap sm:text-[clamp(70px,14vw,140px)] lg:ml-[0.55em] lg:text-[clamp(80px,15vw,205px)]">
            Agency
          </span>
                </h1>

                <p className="mt-7 max-w-[280px] font-[var(--font-archivo)] text-lg font-bold uppercase leading-none tracking-[0.03em] text-[#1E1E1E] sm:mt-[clamp(30px,6vw,90px)] sm:max-w-[300px] sm:text-[clamp(18px,2vw,24px)] lg:max-w-[342px]">
                    Your journey into the world of development starts here
                </p>

                <div className="flex items-center gap-5 py-6 sm:py-[30px]">
                    <Image
                        src="/icons/arrow.svg"
                        alt=""
                        width={96}
                        height={96}
                        aria-hidden="true"
                        className="size-16 sm:size-20 lg:size-24 shrink-0"                    />

                    <p className="font-[var(--font-archivo)] text-lg font-black uppercase leading-none tracking-[0.03em] text-[#1E1E1E] sm:text-[clamp(18px,2vw,24px)]">
                        explore space
                    </p>
                </div>

                <div
                    className="mt-5 flex flex-col items-start gap-6 sm:mt-[2%] sm:flex-row sm:justify-between sm:gap-[30px]">
                    <div>
                        <p className="font-[var(--font-archivo)] text-xs uppercase leading-none tracking-[0.03em] text-[#C5C6C8] sm:text-base">
                            scroll to begin
                        </p>

                        <div className="mt-3 h-2 w-[121px] overflow-hidden rounded-[10px] bg-[#C5C6C8]">
                            <div className="h-2 w-[45px] bg-[#2A2A2A]"/>
                        </div>
                    </div>

                    <div className="text-left sm:text-right">
                        <p className="font-[var(--font-archivo)] text-xs uppercase leading-none tracking-[0.03em] text-[#C5C6C8] sm:text-base">
                            ai status: active
                        </p>

                        <p className="font-[var(--font-archivo)] text-xs uppercase leading-none tracking-[0.03em] text-[#C5C6C8] sm:text-base">
                            loc: 55.7558 N, 37.6173 E
                        </p>
                    </div>
                </div>

                <div
                    className="relative mt-5 flex justify-center sm:absolute sm:left-1/2 sm:bottom-0 sm:z-20 sm:mt-0 sm:-translate-x-1/2 lg:bottom-0">
                    <Image
                        src="/images/AlienExtraterrestrial.png"
                        alt="Alien extraterrestrial character"
                        width={697}
                        height={694}
                        priority
                        className="h-auto w-[min(90vw,360px)] object-contain sm:w-[clamp(300px,45vw,520px)] lg:w-[clamp(320px,42vw,697px)]"
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
