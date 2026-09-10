export const motionTokens = {
    duration: {
        backdropIn: 0.22,
        curtainIn: 0.64,
        curtainOut: 0.5,
        contentIn: 0.42,
        contentOut: 0.16,
        railIn: 0.24,
        railOut: 0.14,
    },
    ease: {
        enter: "power4.out",
        curtain: "power4.inOut",
        exit: "power4.inOut",
        reveal: "power3.out",
    },
    stagger: {
        content: 0.045,
        exit: 0.01,
    },
} as const;
