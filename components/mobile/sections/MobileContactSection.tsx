export default function MobileContactSection() {
    return (
        <section
            data-mobile-section="contact"
            className="relative w-full px-5 pb-7 pt-5"
        >
            {/* TITLE */}
            <h2 className="uppercase leading-[0.9] tracking-[-0.055em]">
                <span className="block text-[46px] font-black text-[#c2c2c4]">
                    LET&apos;S
                </span>

                <span className="block text-[46px] font-black text-[#c2c2c4]">
                    BUILD
                </span>

                <span className="block text-[46px] font-black text-[#5848ff]">
                    TOGETHER
                </span>
            </h2>

            {/* FORM */}
            <form className="mt-7">
                <div className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        className="
                            h-[54px]
                            w-full
                            rounded-[11px]
                            border
                            border-[#ededed]
                            bg-white
                            px-3
                            text-[12px]
                            text-[#333]
                            outline-none
                            placeholder:text-[#c8c8c8]
                            focus:border-[#5848ff]
                        "
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="
                            h-[54px]
                            w-full
                            rounded-[11px]
                            border
                            border-[#ededed]
                            bg-white
                            px-3
                            text-[12px]
                            text-[#333]
                            outline-none
                            placeholder:text-[#c8c8c8]
                            focus:border-[#5848ff]
                        "
                    />

                    <input
                        type="text"
                        name="objective"
                        placeholder="Project objective"
                        className="
                            h-[54px]
                            w-full
                            rounded-[11px]
                            border
                            border-[#ededed]
                            bg-white
                            px-3
                            text-[12px]
                            text-[#333]
                            outline-none
                            placeholder:text-[#c8c8c8]
                            focus:border-[#5848ff]
                        "
                    />

                    <textarea
                        name="description"
                        placeholder="Project description"
                        className="
                            h-[98px]
                            w-full
                            resize-none
                            rounded-[11px]
                            border
                            border-[#ededed]
                            bg-white
                            px-3
                            py-3
                            text-[12px]
                            text-[#333]
                            outline-none
                            placeholder:text-[#c8c8c8]
                            focus:border-[#5848ff]
                        "
                    />
                </div>

                {/* SEND */}
                <button
                    type="submit"
                    className="
                        mt-[84px]
                        flex
                        min-h-[90px]
                        w-full
                        items-center
                        rounded-[10px]
                        bg-[#151515]
                        px-3
                        text-white
                    "
                >
                    <span className="text-[22px] font-black uppercase">
                        Send message
                    </span>

                    <span className="ml-auto text-[38px] font-light leading-none">
                        →
                    </span>
                </button>
            </form>
        </section>
    );
}