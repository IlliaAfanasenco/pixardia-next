"use client";
import { useI18n } from "@/i18n/LocaleProvider";
export default function EvidenceInterlude() {
    const { t } = useI18n();
    return (
        <div
            className="cinematic-evidence-interlude"
            aria-hidden="true"
            data-cinematic-evidence-interlude=""
        >
            <div
                className="cinematic-evidence-interlude__frame"
                data-cinematic-evidence-frame=""
            >
                <div className="cinematic-evidence-interlude__meta">
                    <span>{t("05 / SELECTED WORK")}</span>
                    <span>{t("PIXARDIA / PROJECT RECORD")}</span>
                </div>

                <div
                    className="cinematic-evidence-interlude__line"
                    data-cinematic-evidence-line=""
                />

                <p className="cinematic-evidence-interlude__title">
                    {t("From strategy")}<span>{t("to delivery")}

                    </span>
                </p>

                <p className="cinematic-evidence-interlude__copy">
                    {t("Selected digital products shaped through strategy, design and reliable engineering.")}

                </p>
            </div>
        </div>
    );
}
