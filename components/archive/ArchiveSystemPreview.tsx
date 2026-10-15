import Image from "next/image";
import type { SiteLocale } from "@/i18n/config";
import { localized } from "@/i18n/localized";
import { translator } from "@/i18n/getDictionary";
import type { ProjectMediaAsset } from "@/types/services";
import type { ArchivePreviewVariant } from "./archive-projects";
import { archiveDiagrams } from "./ArchiveDiagrams";
import ArchivePreviewMotion from "./ArchivePreviewMotion";
import TechnologyIcon from "./TechnologyIcon";
import styles from "./archive.module.css";

type Props = {
    projectId: string;
    variant: ArchivePreviewVariant;
    technologies: readonly string[];
    locale: SiteLocale;
    coverImage?: ProjectMediaAsset | null;
};

export default function ArchiveSystemPreview({ projectId, variant, technologies, locale, coverImage }: Props) {
    const t = translator(locale);
    const Diagram = archiveDiagrams[variant];
    return (
        <ArchivePreviewMotion className={styles.preview}>
            <div className={styles.frame} aria-hidden="true">
                <span className={styles.frameLabel}>{projectId}</span>
                <span className={styles.frameLine} />
                <span className={styles.frameLabel}>{t("System preview")}</span>
            </div>
            <div className={styles.diagram} data-project-visual-scene={variant}>
                {coverImage ? (
                    <Image src={coverImage.src} alt={localized(coverImage.alt, locale)} fill sizes="(min-width: 1280px) 50vw, 100vw" className={styles.cover} />
                ) : <Diagram locale={locale} />}
            </div>
            <ul className={styles.technologyBadges} aria-label={t("Stack")}>
                {technologies.map((technology) => (
                    <li className={styles.technologyBadge} key={technology}>
                        <TechnologyIcon name={technology} dark />
                        <span>{technology}</span>
                    </li>
                ))}
            </ul>
            <div className={styles.frame} aria-hidden="true">
                <span className={styles.frameLabel}>{projectId}</span>
                <span className={styles.frameLine} />
                <span className={styles.explore}>{t("Explore case →")}</span>
            </div>
        </ArchivePreviewMotion>
    );
}
