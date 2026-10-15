import { projectStatusLabels, projectTypeLabels } from "@/content/projects";
import type { SiteLocale } from "@/i18n/config";
import { translator } from "@/i18n/getDictionary";
import { localized } from "@/i18n/localized";
import type { Project } from "@/types/services";
import TechnologyIcon from "./TechnologyIcon";
import styles from "./archive.module.css";

export default function ArchiveProjectInfo({ project, locale }: { project: Project; locale: SiteLocale }) {
    const t = translator(locale);
    return (
        <div className={styles.info} data-archive-card-copy="">
            <div className={styles.metadata}>
                <span className={styles.category}>{localized(projectTypeLabels[project.type], locale)}</span>
                <span className={styles.year}>{project.year}</span>
            </div>
            <h3>{project.title}</h3>
            <p className={styles.description}>{localized(project.summary, locale)}</p>
            <div className={styles.footer}>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>{t("Status")}</span>
                    <strong className={styles.status}>{localized(projectStatusLabels[project.status], locale)}</strong>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>{t("System")}</span>
                    <span className={styles.systemAction}>{localized(project.caseStudy.presentation.centerLabel, locale)} <span aria-hidden="true">→</span></span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>{t("Stack")}</span>
                    <ul className={styles.stackIcons} aria-label={t("Stack")}>
                        {project.technologies.map((technology) => <li key={technology}><TechnologyIcon name={technology} /></li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}
