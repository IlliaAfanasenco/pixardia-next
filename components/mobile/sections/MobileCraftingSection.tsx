"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// PNG used while the hands approach each other.
const separateImageSize = {
    width: 1086,
    height: 1448,
    sizes: "(max-width: 640px) 100vw, 540px",
};

// Exact connected grip from the original reference (transparent, no text).
const gripImageSize = {
    width: 429,
    height: 700,
    sizes: "(max-width: 640px) 100vw, 540px",
};

// These values only affect the SEPARATED hands, not the final grip.
const approachSettings = {
    greenLeft: -25,       // % of the section width
    astronautLeft: 32,   // % of the section width
    top: 38,             // % of the section height
    greenStart: -55,     // xPercent: initial offset
    astronautStart: 55,  // xPercent: initial offset
    scrub: 0.7,
};

// Timeline percentages: contact is reached before transition.
const timing = {
    approach: 0.69,
    transitionAt: 0.69,
    transitionLength: 0.012,
    hold: 0.298,
};

export default function MobileCraftingSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const greenRef = useRef<HTMLDivElement>(null);
    const astronautRef = useRef<HTMLDivElement>(null);
    const approachRef = useRef<HTMLDivElement>(null);
    const finalGripRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const green = greenRef.current;
        const astronaut = astronautRef.current;
        const approach = approachRef.current;
        const finalGrip = finalGripRef.current;

        if (!section || !green || !astronaut || !approach || !finalGrip) return;

        const ctx = gsap.context(() => {
            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;

            if (reducedMotion) {
                gsap.set(approach, { autoAlpha: 0 });
                gsap.set(finalGrip, { autoAlpha: 1 });
                return;
            }

            gsap.set(approach, { autoAlpha: 1 });
            gsap.set(finalGrip, { autoAlpha: 0 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: approachSettings.scrub,
                    invalidateOnRefresh: true,
                },
            });

            tl.fromTo(
                green,
                { xPercent: approachSettings.greenStart },
                { xPercent: 0, duration: timing.approach, ease: "power2.out" },
                0,
            )
                .fromTo(
                    astronaut,
                    { xPercent: approachSettings.astronautStart },
                    { xPercent: 0, duration: timing.approach, ease: "power2.out" },
                    0,
                )
                // Do not try to bend fingers using CSS. Swap to an actual CLOSED grip.
                .to(
                    approach,
                    { autoAlpha: 0, duration: timing.transitionLength, ease: "sine.inOut" },
                    timing.transitionAt,
                )
                .to(
                    finalGrip,
                    { autoAlpha: 1, duration: timing.transitionLength, ease: "sine.inOut" },
                    timing.transitionAt,
                )
                // Keep the correct grip fully visible at the end of the section.
                .to(finalGrip, {
                    autoAlpha: 1,
                    duration: timing.hold,
                    ease: "none",
                });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            data-mobile-section="crafting"
            className="relative h-[165svh] w-full"
        >
            <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#f7f9fa]">
                {/* Text stays above the animation. */}
                <div className="pointer-events-none relative z-20 px-5 pt-5 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#c6c6c8]">
                        Deploymentprotocol02
                    </p>
                    <h2 className="mt-2 uppercase leading-[0.9] tracking-[-0.055em]">
            <span className="block text-[clamp(29px,10vw,43px)] font-black text-[#5848ff]">
              A PARTNER
            </span>
                        <span className="block text-[clamp(25px,8.65vw,37px)] font-black text-[#c4c4c6]">
              YOU CAN TRUST
            </span>
                    </h2>
                    <p className="mx-auto mt-4 max-w-[310px] text-[15px] font-semibold uppercase leading-[1.15] text-[#c4c4c6]">
                        We create websites that<br />
                        don&apos;t just look good — they<br />
                        work, convert and grow<br />
                        your business
                    </p>
                </div>

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 isolate select-none"
                >
                    {/* Two independent open hands for the approach only. */}
                    <div ref={approachRef} className="absolute inset-0">
                        <div
                            className="absolute w-full"
                            style={{
                                left: `${approachSettings.astronautLeft}%`,
                                top: `${approachSettings.top}%`,
                                transform: "translateY(-50%)",
                            }}
                        >
                            <div ref={astronautRef} className="will-change-transform">
                                <Image
                                    src="/images/handshake/hand-astronaut.png"
                                    alt=""
                                    {...separateImageSize}
                                    className="block h-auto w-full max-w-none"
                                    draggable={false}
                                />
                            </div>
                        </div>
                        <div
                            className="absolute w-full"
                            style={{
                                left: `${approachSettings.greenLeft}%`,
                                top: `${approachSettings.top}%`,
                                transform: "translateY(-50%)",
                            }}
                        >
                            <div ref={greenRef} className="will-change-transform">
                                <Image
                                    src="/images/handshake/green-hand.png"
                                    alt=""
                                    {...separateImageSize}
                                    className="block h-auto w-full max-w-none"
                                    draggable={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Final grip comes from ONE image: thumb and lower fingers are connected. */}
                    <div
                        ref={finalGripRef}
                        className="absolute left-0 top-1/2 w-full -translate-y-1/2 opacity-0"
                    >
                        <Image
                            src="/images/handshake/final-grip.png"
                            alt=""
                            {...gripImageSize}
                            className="block h-auto w-full max-w-none"
                            draggable={false}
                            priority
                        />
                    </div>
                </div>

                {/* Stats stay above the animation. */}
                <div className="absolute bottom-7 left-0 z-30 grid w-full grid-cols-4 px-5">
                    <Stat value="50+" label="Projects" />
                    <Stat value="99.9%" label="Uptime" />
                    <Stat value="30+" label="Clients" />
                    <Stat value="3+" label="Years" />
                </div>
            </div>
        </section>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-[23px] font-black leading-none text-[#5848ff]">
                {value}
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase text-[#414141]">
                {label}
            </div>
        </div>
    );
}
