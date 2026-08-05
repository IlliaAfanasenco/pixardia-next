export default function SignalRoute() {
    return (
        <svg
            className="cinematic-signal-route"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            data-cinematic-signal=""
        >
            <path
                d="M112 522 C318 356 522 602 770 430 S1210 254 1488 392"
                data-cinematic-signal-path="primary"
            />
            <path
                d="M250 646 C488 502 704 564 922 364 S1274 224 1452 298"
                data-cinematic-signal-path="secondary"
            />
            <path
                d="M188 250 C492 262 612 446 800 446 C988 446 1108 262 1412 250"
                data-cinematic-signal-path="convergence"
            />
        </svg>
    );
}
