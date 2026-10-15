import type { CSSProperties, ReactNode } from "react";
import type { SiteLocale } from "@/i18n/config";
import { translator } from "@/i18n/getDictionary";
import type { ArchivePreviewVariant } from "./archive-projects";
import styles from "./archive.module.css";

type DiagramProps = { locale: SiteLocale };
type Point = readonly [number, number];
type Icon = "data" | "application" | "integration" | "experience" | "analytics" | "delivery";

const iconPaths: Record<Icon, ReactNode> = {
    data: <><ellipse cx="16" cy="7" rx="11" ry="5" /><path d="M5 7v18c0 7 22 7 22 0V7M5 16c0 7 22 7 22 0M5 24c0 7 22 7 22 0" /></>,
    application: <><path d="m13 3 6 0 1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2z" /><circle cx="16" cy="18" r="5" /></>,
    integration: <><circle cx="16" cy="9" r="5" /><path d="M7 29v-5a9 9 0 0 1 18 0v5zM3 6a4 4 0 0 0 0 8M29 6a4 4 0 0 1 0 8M1 27v-6h4M31 27v-6h-4" /></>,
    experience: <><path d="M2 3h28v20H2zM16 23v6M9 29h14" /><path d="M5 6h22" /></>,
    analytics: <><path d="M2 29h29M6 29V19M16 29V9M26 29V2" /><path d="m4 14 10-8 7 3 8-8" /></>,
    delivery: <><path d="m3 9 13-7 13 7v16l-13 7-13-7zM3 9l13 7 13-7M16 16v16" /></>,
};

function SystemIcon({ kind, x, y }: { kind: Icon; x: number; y: number }) {
    return <g transform={`translate(${x} ${y})`} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">{iconPaths[kind]}</g>;
}

function Port({ x, y }: { x: number; y: number }) {
    return <rect x={x - 3.5} y={y - 3.5} width="7" height="7" className={styles.port} />;
}

function SystemConnector({ from, to, order = 0 }: { from: Point; to: Point; order?: number }) {
    const middle = (from[0] + to[0]) / 2;
    const path = `M${from[0]} ${from[1]} C${middle} ${from[1]},${middle} ${to[1]},${to[0]} ${to[1]}`;
    return (
        <g style={{ "--order": order } as CSSProperties}>
            <path d={path} className={styles.connector} vectorEffect="non-scaling-stroke" />
            <path d={path} pathLength="100" className={styles.signal} vectorEffect="non-scaling-stroke" />
            <Port x={from[0]} y={from[1]} /><Port x={to[0]} y={to[1]} />
        </g>
    );
}

function SystemNode({ x, y, width, height = 64, title, subtitle, icon, compact = false, order = 0 }: {
    x: number; y: number; width: number; height?: number; title: string; subtitle?: string; icon?: Icon; compact?: boolean; order?: number;
}) {
    const lines = compact && title.length > 14 ? title.split(" ") : [title];
    return (
        <g className={styles.node} style={{ "--order": order } as CSSProperties}>
            <rect x={x} y={y} width={width} height={height} className={styles.nodeSurface} vectorEffect="non-scaling-stroke" />
            {!compact && icon && <SystemIcon kind={icon} x={x + 16} y={y + (height - 32) / 2} />}
            <text x={compact ? x + width / 2 : x + (icon ? 60 : 18)} y={y + (subtitle && !compact ? 27 : height / 2 + 6) - (lines.length - 1) * 11} textAnchor={compact ? "middle" : "start"} fontSize={compact ? 20 : 17} className={styles.nodeTitle}>
                {lines.map((line, index) => <tspan key={`${line}-${index}`} x={compact ? x + width / 2 : undefined} dy={index ? 23 : 0}>{line}</tspan>)}
            </text>
            {subtitle && !compact && <text x={x + (icon ? 60 : 18)} y={y + 46} fontSize="11" className={styles.nodeSubtitle}>{subtitle}</text>}
        </g>
    );
}

function DiagramVersions({ children }: { children: (compact: boolean) => ReactNode }) {
    return [false, true].map((compact) => (
        <svg key={String(compact)} viewBox={`0 0 ${compact ? 600 : 960} 300`} className={compact ? styles.compactDiagram : styles.desktopDiagram} aria-hidden="true" focusable="false">
            {children(compact)}
        </svg>
    ));
}

function LayeredCore({ x, y }: { x: number; y: number }) {
    return (
        <g transform={`translate(${x} ${y})`} className={styles.coreGlyph}>
            {[36, 18, 0].map((offset, index) => (
                <g key={offset} transform={`translate(0 ${offset})`}>
                    <path d="m-58-16 58 28 58-28v13L0 25-58-3z" fill={["#36227c", "#5232c9", "#7650ed"][index]} stroke="#9f87ff" strokeWidth="1" />
                    <path d="m-58-16 58-28 58 28L0 12z" fill={["#5130ae", "#7348e5", "#a186ff"][index]} stroke="#c8b7ff" strokeWidth="1.3" />
                </g>
            ))}
        </g>
    );
}

function PixardiaPreview({ locale }: DiagramProps) {
    const t = translator(locale);
    const left = [["Data layer", "Data", "Content & services", "data"], ["Application layer", "Application", "Business logic", "application"], ["Integration layer", "Integration", "External systems", "integration"]] as const;
    const right = [["Experience layer", "Experience", "Web & interfaces", "experience"], ["Analytics layer", "Analytics", "Insights & metrics", "analytics"], ["Delivery layer", "Delivery", "Projects & enquiry", "delivery"]] as const;
    return <DiagramVersions>{(compact) => {
        const width = compact ? 172 : 255;
        const coreX = compact ? 204 : 365;
        const coreWidth = compact ? 192 : 230;
        const rightX = compact ? 428 : 700;
        return <>
            {[0, 1, 2].map((index) => <SystemConnector key={`left-${index}`} from={[width, 60 + index * 90]} to={[coreX, 150]} order={index} />)}
            {[0, 1, 2].map((index) => <SystemConnector key={`right-${index}`} from={[coreX + coreWidth, 150]} to={[rightX, 60 + index * 90]} order={index + 3} />)}
            {left.map(([title, short, subtitle, icon], index) => <SystemNode key={title} x={0} y={28 + index * 90} width={width} title={t(compact ? short : title)} subtitle={t(subtitle)} icon={icon} compact={compact} order={index} />)}
            {right.map(([title, short, subtitle, icon], index) => <SystemNode key={title} x={rightX} y={28 + index * 90} width={width} title={t(compact ? short : title)} subtitle={t(subtitle)} icon={icon} compact={compact} order={index + 3} />)}
            <g className={styles.core}>
                <rect x={coreX} y="38" width={coreWidth} height="224" className={styles.coreSurface} vectorEffect="non-scaling-stroke" />
                <text x={coreX + coreWidth / 2} y="73" textAnchor="middle" fontSize={compact ? 20 : 23} className={styles.coreTitle}>{t("Pixardia core")}</text>
                <text x={coreX + coreWidth / 2} y="96" textAnchor="middle" fontSize="12" className={styles.nodeSubtitle}>{t("Digital experience")}</text>
                <LayeredCore x={coreX + coreWidth / 2} y={165} />
            </g>
            <Port x={coreX} y={150} /><Port x={coreX + coreWidth} y={150} />
        </>;
    }}</DiagramVersions>;
}

function NexusFinancePreview({ locale }: DiagramProps) {
    const t = translator(locale);
    return <DiagramVersions>{(compact) => {
        const graphWidth = compact ? 355 : 610;
        const statsX = compact ? 380 : 650;
        const statsWidth = compact ? 220 : 310;
        const bars = [62, 96, 77, 153, 118, 198, 142];
        const barWidth = (graphWidth - 72) / bars.length;
        return <>
            <rect x="0" y="8" width={graphWidth} height="284" className={styles.nodeSurface} vectorEffect="non-scaling-stroke" />
            <text x="20" y="43" fontSize={compact ? 22 : 18} className={styles.nodeTitle}>{t("Account activity")}</text>
            <rect x={graphWidth - 49} y="28" width="28" height="7" fill="#748ce5" />
            {[100, 155, 210, 270].map((y) => <path key={y} d={`M20 ${y}H${graphWidth - 20}`} className={styles.chartGrid} />)}
            {bars.map((height, index) => <rect key={index} x={24 + index * (barWidth + 4)} y={270 - height} width={barWidth - 4} height={height} className={`${styles.chartBar} ${index === 5 ? styles.highlightBar : ""}`} style={{ "--order": index } as CSSProperties} />)}
            {["Accounts", "Transactions", "Budgets"].map((label, index) => <g key={label} className={styles.node} style={{ "--order": index + 2 } as CSSProperties}>
                <rect x={statsX} y={8 + index * 102} width={statsWidth} height="80" className={styles.nodeSurface} vectorEffect="non-scaling-stroke" />
                <text x={statsX + 18} y={39 + index * 102} fontSize={compact ? 20 : 18} className={styles.nodeTitle}>{t(label)}</text>
                <path d={`M${statsX + 18} ${65 + index * 102}h${statsWidth - 36}`} className={styles.chartGrid} />
                <path d={`M${statsX + 18} ${65 + index * 102}h${(statsWidth - 36) * [0.56, 0.76, 0.64][index]}`} stroke={index === 0 ? "#748ce5" : "#abb3c6"} strokeWidth="6" className={styles.indicator} style={{ "--order": index } as CSSProperties} />
            </g>)}
        </>;
    }}</DiagramVersions>;
}

function NordmarktPreview({ locale }: DiagramProps) {
    const t = translator(locale);
    return <DiagramVersions>{(compact) => {
        const productWidth = compact ? 162 : 276;
        const flowX = compact ? 355 : 600;
        const flowWidth = compact ? 245 : 360;
        return <>
            {[0, 1, 2, 3].map((index) => {
                const x = index % 2 * (productWidth + 14);
                const y = Math.floor(index / 2) * 154 + 4;
                return <g key={index} className={styles.node} style={{ "--order": index } as CSSProperties}>
                    <rect x={x} y={y} width={productWidth} height="138" className={styles.nodeSurface} vectorEffect="non-scaling-stroke" />
                    <rect x={x + 12} y={y + 12} width={productWidth - 24} height="84" fill={index === 0 ? "#182723" : "#22272d"} stroke="#3c424b" />
                    <SystemIcon kind="delivery" x={x + productWidth / 2 - 16} y={y + 37} />
                    <text x={x + 12} y={y + 121} fontSize={compact ? 19 : 17} className={styles.nodeSubtitle}>{t("Item")} {String(index + 1).padStart(2, "0")}</text>
                    <rect x={x + productWidth - 21} y={y + 110} width="7" height="7" fill={index === 0 ? "#82b99c" : "#9097a2"} />
                </g>;
            })}
            <rect x={flowX} y="4" width={flowWidth} height="292" className={styles.nodeSurface} vectorEffect="non-scaling-stroke" />
            <text x={flowX + 18} y="36" fontSize={compact ? 20 : 18} className={styles.nodeTitle}>{t("Purchase flow")}</text>
            {["Catalogue", "Product", "Checkout"].map((label, index) => <g key={label} className={styles.node} style={{ "--order": index + 3 } as CSSProperties}>
                {index > 0 && <path d={`M${flowX + flowWidth / 2} ${38 + index * 81}v22m-4-4 4 4 4-4`} className={styles.commerceConnector} />}
                <rect x={flowX + 18} y={60 + index * 81} width={flowWidth - 36} height="59" fill="#161e1d" stroke="#3c4944" />
                <rect x={flowX + 33} y={86 + index * 81} width="7" height="7" fill="#82b99c" className={styles.indicator} style={{ "--order": index } as CSSProperties} />
                <text x={flowX + 54} y={95 + index * 81} fontSize={compact ? 19 : 18} className={styles.nodeTitle}>{t(label)}</text>
            </g>)}
        </>;
    }}</DiagramVersions>;
}

function CoreflowPreview({ locale }: DiagramProps) {
    const t = translator(locale);
    return <DiagramVersions>{(compact) => {
        const width = compact ? 170 : 245;
        const rightX = compact ? 430 : 715;
        const coreX = compact ? 210 : 375;
        const coreWidth = compact ? 180 : 210;
        const nodes = [
            { title: "Requests", x: 0, y: 26, from: [width, 64], to: [coreX, 112] },
            { title: "Knowledge", x: rightX, y: 26, from: [rightX, 64], to: [coreX + coreWidth, 112] },
            { title: "Validation", x: 0, y: 194, from: [width, 232], to: [coreX, 190] },
            { title: "Human review", x: rightX, y: 194, from: [rightX, 232], to: [coreX + coreWidth, 190] },
        ] satisfies { title: string; x: number; y: number; from: Point; to: Point }[];
        return <>
            {nodes.map((node, index) => <SystemConnector key={node.title} from={node.from} to={node.to} order={index} />)}
            {nodes.map((node, index) => <SystemNode key={node.title} x={node.x} y={node.y} width={width} height={76} title={t(node.title)} compact order={index} />)}
            <g className={styles.core}>
                <rect x={coreX} y="66" width={coreWidth} height="169" className={styles.aiCoreSurface} vectorEffect="non-scaling-stroke" />
                <text x={coreX + coreWidth / 2} y="107" textAnchor="middle" fontSize="26" className={styles.coreTitle}>{t("AI Core")}</text>
                <g transform={`translate(${coreX + coreWidth / 2 - 25} 137)`} className={styles.coreGlyph}>
                    <rect x="-10" y="-10" width="70" height="70" fill="none" stroke="#748ce5" />
                    {[0, 1, 2, 3].map((index) => <rect key={index} x={index % 2 * 30} y={Math.floor(index / 2) * 30} width="20" height="20" fill={index === 3 ? "#8d77ee" : "#7389ce"} />)}
                </g>
            </g>
            <path d={`M${coreX + 10} 285h${coreWidth - 20}`} stroke="#344354" strokeWidth="5" />
            <path d={`M${coreX + 10} 285h${coreWidth - 58}`} stroke="#8b9fcd" strokeWidth="5" className={styles.indicator} />
        </>;
    }}</DiagramVersions>;
}

export const archiveDiagrams = {
    pixardia: PixardiaPreview,
    nexus: NexusFinancePreview,
    nordmarkt: NordmarktPreview,
    coreflow: CoreflowPreview,
} satisfies Record<ArchivePreviewVariant, (props: DiagramProps) => ReactNode>;
