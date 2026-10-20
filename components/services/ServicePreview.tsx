import type { ServiceCode } from "@/types/services";
import styles from "./ServicePreview.module.css";

function Browser({ children }: { children: React.ReactNode }) {
    return (
        <>
            <rect className={styles.panel} x="34" y="27" width="252" height="152" rx="9" />
            <path className={styles.line} d="M34 51h252" />
            <g className={styles.muted}>
                <circle cx="47" cy="39" r="2.5" />
                <circle cx="57" cy="39" r="2.5" />
                <circle cx="67" cy="39" r="2.5" />
            </g>
            <rect className={styles.line} x="122" y="35" width="94" height="8" rx="4" />
            {children}
        </>
    );
}

function Website() {
    return (
        <Browser>
            <path className={styles.paleLine} d="M51 73h67m-67 8h44" strokeWidth="4" />
            <path className={styles.line} d="M51 99h90m-90 7h78" />
            <rect className={styles.purple} x="51" y="122" width="49" height="12" rx="3" />
            <rect className={styles.inset} x="162" y="65" width="108" height="69" rx="5" />
            <path className={styles.purpleLine} d="m179 116 25-30 19 18 14-14 18 26" strokeWidth="2" />
            <circle className={styles.purple} cx="243" cy="80" r="5" />
            {[51, 126, 201].map((x) => (
                <g key={x}>
                    <rect className={styles.inset} x={x} y="147" width="67" height="18" rx="3" />
                    <path className={styles.line} d={`M${x + 9} 156h35`} />
                </g>
            ))}
            <path className={styles.cursor} d="m253 126 1 22 6-7 8-2Z" />
        </Browser>
    );
}

function Landing() {
    return (
        <>
            <rect className={styles.panel} x="69" y="20" width="155" height="164" rx="8" />
            <path className={styles.line} d="M69 43h155" />
            <circle className={styles.purple} cx="83" cy="32" r="3" />
            <path className={styles.line} d="M172 32h35" />
            <path className={styles.paleLine} d="M90 63h111m-97 10h81" strokeWidth="4" />
            <path className={styles.line} d="M94 87h104m-95 7h87" />
            <rect className={styles.purple} x="112" y="107" width="69" height="17" rx="4" />
            <path className={styles.purpleLine} d="M146 127v15m-4-4 4 4 4-4" />
            <rect className={styles.inset} x="89" y="151" width="115" height="19" rx="4" />
            <rect className={styles.panel} x="210" y="79" width="65" height="67" rx="8" />
            <path className={styles.line} d="M223 95h39l-14 16v13l-11 5v-18Z" />
            <path className={styles.purpleLine} d="M230 95h25l-12 14Z" />
            <circle className={styles.pulse} cx="46" cy="112" r="6" />
            <path className={styles.line} d="M52 112h17m155 50h34" strokeDasharray="3 4" />
        </>
    );
}

function Application() {
    return (
        <Browser>
            <path className={styles.line} d="M90 51v128" />
            {[70, 91, 112, 133].map((y, i) => (
                <g key={y}>
                    <rect className={i === 0 ? styles.purple : styles.muted} x="47" y={y} width="9" height="9" rx="2" />
                    <path className={styles.line} d={`M62 ${y + 4}h15`} />
                </g>
            ))}
            {[103, 160, 217].map((x) => <rect key={x} className={styles.inset} x={x} y="64" width="48" height="29" rx="4" />)}
            <path className={styles.paleLine} d="M112 75h22m35 0h22m35 0h22" strokeWidth="3" />
            <path className={styles.line} d="M113 85h13m44 0h13m44 0h13" />
            <rect className={styles.inset} x="103" y="105" width="162" height="60" rx="4" />
            <path className={styles.line} d="M113 122h142m-142 16h142m-142 16h142" />
            <path className={styles.purpleLine} d="m113 149 20-12 19 5 25-18 21 8 24-16 32 3" strokeWidth="2" />
            <circle className={styles.pulse} cx="222" cy="116" r="3" />
        </Browser>
    );
}

function Commerce() {
    return (
        <>
            <Browser>
                {[51, 118, 185].map((x, i) => (
                    <g key={x}>
                        <rect className={styles.inset} x={x} y="66" width="57" height="84" rx="5" />
                        {i === 0 ? <path className={styles.purpleLine} d={`m${x + 15} 87 13-8 14 8v20l-14 8-13-8Zm0 0 13 8 14-8m-14 8v20`} />
                            : i === 1 ? <><rect className={styles.purpleLine} x={x + 16} y="87" width="25" height="28" rx="3" /><path className={styles.purpleLine} d={`M${x + 22} 88v-5a6 6 0 0 1 12 0v5`} /></>
                                : <><circle className={styles.purpleLine} cx={x + 28} cy="98" r="13" /><path className={styles.purpleLine} d={`M${x + 22} 98h12m-6-6v12`} /></>}
                        <path className={styles.line} d={`M${x + 10} 129h35m-35 8h20`} />
                    </g>
                ))}
                <path className={styles.line} d="M52 162h89" />
            </Browser>
            <rect className={styles.badge} x="241" y="125" width="53" height="53" rx="10" />
            <path className={styles.paleLine} d="M252 138h5l4 19h17l4-14h-24m5 21h1m11 0h1" strokeWidth="2" />
        </>
    );
}

function Redesign() {
    return (
        <>
            <g opacity="0.6">
                <rect className={styles.panel} x="29" y="48" width="115" height="112" rx="6" />
                <path className={styles.line} d="M29 66h115m-102 16h88m-88 8h57m-57 10h88m-88 8h88m-88 8h60" />
                <rect className={styles.inset} x="42" y="129" width="24" height="18" rx="2" />
                <rect className={styles.inset} x="72" y="129" width="58" height="18" rx="2" />
            </g>
            <path className={styles.purpleLine} d="M147 105h25m-7-7 7 7-7 7" strokeWidth="2" />
            <rect className={styles.panel} x="183" y="32" width="108" height="144" rx="8" />
            <path className={styles.line} d="M183 52h108" />
            <circle className={styles.purple} cx="195" cy="42" r="3" />
            <path className={styles.line} d="M257 42h22" />
            <rect className={styles.inset} x="195" y="65" width="84" height="42" rx="4" />
            <path className={styles.paleLine} d="M207 78h57m-57 8h38" strokeWidth="3" />
            <rect className={styles.purple} x="207" y="93" width="28" height="6" rx="2" />
            <rect className={styles.inset} x="195" y="117" width="37" height="44" rx="4" />
            <rect className={styles.inset} x="242" y="117" width="37" height="44" rx="4" />
            <path className={styles.purpleLine} d="m203 142 7 7 13-17m27 10 7 7 13-17" />
        </>
    );
}

function Design() {
    return (
        <>
            <path className={styles.line} d="M48 26v154m224-154v154M29 45h262M29 163h262" strokeDasharray="3 5" />
            <rect className={styles.panel} x="63" y="45" width="134" height="118" rx="7" />
            <rect className={styles.inset} x="77" y="59" width="106" height="39" rx="4" />
            <circle className={styles.purpleLine} cx="96" cy="79" r="9" />
            <path className={styles.line} d="M115 74h55m-55 9h33M77 112h106m-106 9h76" />
            <rect className={styles.purple} x="77" y="136" width="49" height="13" rx="4" />
            <rect className={styles.badge} x="216" y="64" width="62" height="83" rx="6" />
            <circle className={styles.purple} cx="233" cy="83" r="7" />
            <circle fill="#d2c8f5" cx="259" cy="83" r="7" />
            <circle fill="#34323e" cx="233" cy="105" r="7" />
            <circle fill="#f1eef9" cx="259" cy="105" r="7" />
            <path className={styles.paleLine} d="M228 130h37" strokeWidth="3" />
            <path className={styles.purpleLine} d="M61 43h138v122H61Z" />
            {[43, 165].flatMap((y) => [61, 199].map((x) => <rect key={`${x}-${y}`} className={styles.handle} x={x - 3} y={y - 3} width="6" height="6" />))}
            <path className={styles.cursor} d="m173 125 3 28 7-9 11-3Z" />
        </>
    );
}

function Automation() {
    return (
        <>
            <path className={styles.line} d="M72 60h37v40h28m-65 40h37v-40m74 0h28V60h37m-37 40v40h37" />
            <path className={styles.purpleLine} d="M109 81v19h28m46 0h28v20" strokeDasharray="4 4" />
            {[[52, 40], [52, 120], [248, 40], [248, 120]].map(([x, y], i) => (
                <g key={x + y}>
                    <rect className={styles.panel} x={x - 20} y={y} width="40" height="40" rx="9" />
                    {i % 2 === 0 ? <path className={styles.paleLine} d={`m${x - 9} ${y + 20} 9-7 9 7-9 7Z`} />
                        : <><path className={styles.paleLine} d={`M${x - 8} ${y + 14}h16v13h-16Z`} /><path className={styles.line} d={`M${x - 4} ${y + 32}h8`} /></>}
                </g>
            ))}
            <rect className={styles.badge} x="129" y="69" width="62" height="62" rx="15" />
            <path className={styles.paleLine} d="m160 81 5 13 13 6-13 5-5 14-5-14-13-5 13-6Z" strokeWidth="1.5" />
            <circle className={styles.pulse} cx="109" cy="100" r="3" />
            <circle className={styles.pulse} cx="211" cy="100" r="3" />
            <path className={styles.line} d="M126 155h68m-53 9h38" />
        </>
    );
}

function Support() {
    return (
        <>
            <rect className={styles.panel} x="40" y="48" width="149" height="116" rx="8" />
            <path className={styles.line} d="M40 70h149" />
            <circle className={styles.pulse} cx="54" cy="59" r="3" />
            <path className={styles.line} d="M66 59h48m-60 29h54m-54 55h119" />
            <path className={styles.purpleLine} d="M54 119h19l7-18 10 33 11-26 8 11h65" strokeWidth="2" />
            <path className={styles.badge} d="m228 36 50 18v40c0 36-50 64-50 64s-50-28-50-64V54Z" />
            <path className={styles.purpleLine} d="m228 49 37 13v32c0 24-37 49-37 49s-37-25-37-49V62Z" />
            <path className={styles.paleLine} d="m211 96 12 12 24-27" strokeWidth="4" />
            <rect className={styles.panel} x="210" y="151" width="71" height="24" rx="12" />
            <circle className={styles.pulse} cx="224" cy="163" r="3" />
            <path className={styles.line} d="M234 163h32" />
        </>
    );
}

const previews = {
    BUSINESS_WEBSITE: Website,
    LANDING_PAGE: Landing,
    WEB_APPLICATION: Application,
    ECOMMERCE: Commerce,
    WEBSITE_REDESIGN: Redesign,
    UI_UX_DESIGN: Design,
    AI_AUTOMATION: Automation,
    MAINTENANCE_SUPPORT: Support,
} satisfies Record<ServiceCode, React.ComponentType>;

export default function ServicePreview({ code }: { code: ServiceCode }) {
    const Preview = previews[code];

    return (
        <div className={styles.preview} data-service-preview={code} aria-hidden="true">
            <svg viewBox="0 0 320 200" fill="none" focusable="false">
                <g className={styles.drawing}>
                    <Preview />
                </g>
            </svg>
        </div>
    );
}
