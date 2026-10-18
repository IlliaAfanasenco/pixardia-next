import Link from "next/link";
import type { SiteLocale } from "@/i18n/config";
import { publicPath } from "@/i18n/navigation";
import { translator } from "@/i18n/getDictionary";
import type { ArchiveProject } from "./archive-projects";
import ArchiveSystemPreview from "./ArchiveSystemPreview";
import ArchiveProjectInfo from "./ArchiveProjectInfo";
import styles from "./archive.module.css";

export default function ArchiveCard({ project, variant, locale, index, animatedPreview = false }: ArchiveProject & { locale: SiteLocale; index: number; animatedPreview?: boolean }) {
    const t = translator(locale);
    return (
        <article className={styles.card} data-archive-card="" data-archive-card-index={index}>
            <Link
                id={`project-modal-trigger-${project.slug}`}
                href={publicPath(locale, `/projects/${project.slug}`)}
                scroll={false}
                aria-haspopup="dialog"
                aria-label={t("Open {title} case study", { title: project.title })}
                className={styles.cardLink}
            >
                <ArchiveSystemPreview projectId={project.caseStudy.identifier} variant={variant} technologies={project.technologies} locale={locale} coverImage={animatedPreview ? undefined : project.coverImage} />
                <ArchiveProjectInfo project={project} locale={locale} />
            </Link>
        </article>
    );
}
