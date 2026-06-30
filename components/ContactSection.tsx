import Image from "next/image";

const socialLinks = ["Telegram", "WhatsApp", "LinkedIn", "GitHub"];

const inputFieldClass =
    "w-full border-0 bg-transparent p-0 text-xs font-bold leading-none text-black outline-none placeholder:text-[#CFCFD3]";

const fieldWrapperClass =
    "flex flex-col gap-3.5 border-b-2 border-black pb-2";

const ContactSection = () => {
    return (
        <section className="w-full py-16 md:py-24" aria-labelledby="contact-title">
            <div className="mx-auto w-full max-w-[1440px] px-5 md:px-8">
                <div className="flex justify-center gap-3 xl:justify-start">
                    <div className="h-2 w-2 bg-[#5149DA]" aria-hidden="true" />

                    <p className="text-xs font-bold uppercase leading-none text-[#C5C6C8]">
                        DEPLOYMENTPROTOCOL05
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-center gap-6 text-center xl:flex-row xl:items-start xl:justify-between xl:text-left">
                    <h2
                        id="contact-title"
                        className="max-w-[720px] text-[clamp(40px,7vw,94px)] font-black uppercase leading-[0.86] tracking-[-0.03em] text-[#202021]"
                    >
                        Ready for Archive
                    </h2>

                    <Image
                        src="/images/stampCon.svg"
                        alt=""
                        aria-hidden="true"
                        width={160}
                        height={160}
                        className="hidden h-auto w-[clamp(90px,12vw,160px)] object-contain xl:block"
                    />
                </div>

                <div className="mt-[34px] h-0.5 w-full bg-[#353638]" />

                <div className="grid grid-cols-1 justify-items-center gap-10 text-center xl:grid-cols-[minmax(280px,1fr)_minmax(420px,620px)] xl:items-center xl:justify-items-stretch xl:gap-[clamp(32px,6vw,80px)] xl:text-left">
                    <div className="flex w-full max-w-[620px] flex-col items-center xl:max-w-none xl:items-start">
                        <p className="mt-6 max-w-[440px] text-sm font-bold leading-[1.3] text-[#C5C6C8]">
                            Ваш проект заслуживает безупречного исполнения. Давайте обсудим,
                            как сделать его следующим эталоном в вашей нише.
                        </p>

                        <div className="mt-[18px] flex flex-col gap-3">
                            <p className="text-xs font-bold leading-none text-[#C5C6C8]">
                                Location: Digital Space
                            </p>
                            <p className="text-xs font-bold leading-none text-[#C5C6C8]">
                                Response Time: &lt; 24 Hours
                            </p>
                            <p className="text-xs font-bold leading-none text-[#C5C6C8]">
                                Availability: Q2 2024 / Q3 2024
                            </p>
                        </div>

                        <p className="mt-[30px] text-sm font-bold uppercase leading-none text-[#C7C8CA]">
                            Connect via channels
                        </p>

                        <div className="mt-[21px] flex flex-wrap justify-center gap-3 sm:gap-5 xl:justify-start">
                            {socialLinks.map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className="border border-[#1E1E1E] px-4 py-[15px] text-xs font-bold leading-none transition hover:bg-[#1E1E1E] hover:text-white"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="mt-[34px] flex items-center justify-center gap-[15px] xl:justify-start">
                            <Image
                                src="/images/pixardiaLogoCon.svg"
                                alt="Pixardia Studio"
                                width={48}
                                height={48}
                                className="h-auto w-auto"
                            />

                            <div>
                                <p className="text-sm font-bold uppercase leading-none text-[#6A6A6B]">
                                    Pixardia Studio
                                </p>

                                <p className="mt-1 text-xs font-bold leading-none text-[#D4D5D7]">
                                    build_with_passion.exe
                                </p>
                            </div>
                        </div>

                        <Image
                            src="/images/astronautAlienContacts.png"
                            alt=""
                            aria-hidden="true"
                            width={247}
                            height={247}
                            className="mt-2.5 h-auto w-full max-w-[247px] object-contain"
                        />

                        <p className="mt-2.5 text-xs font-bold leading-none text-[#D7D8DA] min-[361px]:text-sm">
                            2024 Pixardia // All rights reserved
                        </p>
                    </div>

                    <div className="relative w-full max-w-[620px] xl:max-w-none">
                        <Image
                            src="/images/astronautCon.png"
                            alt=""
                            aria-hidden="true"
                            width={161}
                            height={161}
                            className="pointer-events-none absolute hidden h-auto object-contain xl:block xl:left-[calc(0%-19.5%)] xl:top-[28%] xl:w-[26%] xl:max-w-[161px]"
                        />

                        <form className="mt-6 w-full border-[3px] border-black px-5 py-6 shadow-[7px_7px_0_-2px_#000] min-[361px]:shadow-[11px_11px_0_-3px_#000] md:px-[clamp(20px,5vw,58px)] md:py-[clamp(24px,4vw,39px)]">
                            <div className="mb-[38px] flex flex-col gap-[38px] sm:mb-[54px] sm:flex-row sm:gap-[23px]">
                                <div className={`${fieldWrapperClass} sm:w-1/2`}>
                                    <label
                                        className="text-sm font-bold uppercase leading-none text-[#C1C1C1]"
                                        htmlFor="client-name"
                                    >
                                        Client name
                                    </label>

                                    <input
                                        className={inputFieldClass}
                                        id="client-name"
                                        name="clientName"
                                        type="text"
                                        placeholder="Иван Иванов"
                                        autoComplete="name"
                                        required
                                    />
                                </div>

                                <div className={`${fieldWrapperClass} sm:w-1/2`}>
                                    <label
                                        className="text-sm font-bold uppercase leading-none text-[#C1C1C1]"
                                        htmlFor="contact-email"
                                    >
                                        Contact email
                                    </label>

                                    <input
                                        className={inputFieldClass}
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        placeholder="example@mail.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={`${fieldWrapperClass} mb-[38px]`}>
                                <label
                                    className="text-sm font-bold uppercase leading-none text-[#C1C1C1]"
                                    htmlFor="project-objective"
                                >
                                    Project objective
                                </label>

                                <input
                                    className={inputFieldClass}
                                    id="project-objective"
                                    name="projectObjective"
                                    type="text"
                                    placeholder="Разработка E-commerce платформы..."
                                />
                            </div>

                            <div className={`${fieldWrapperClass} mb-[38px]`}>
                                <label
                                    className="text-sm font-bold uppercase leading-none text-[#C1C1C1]"
                                    htmlFor="additional-briefing"
                                >
                                    Additional briefing
                                </label>

                                <textarea
                                    className={`${inputFieldClass} min-h-[60px] resize-y leading-[1.2]`}
                                    id="additional-briefing"
                                    name="briefing"
                                    placeholder="Опишите ваши пожелания..."
                                />
                            </div>

                            <button
                                className="min-h-16 w-full bg-[#1F1F1F] text-base font-bold uppercase text-white transition hover:bg-black"
                                type="submit"
                            >
                                Initialize dialogue
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;