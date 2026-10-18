"use client";

import Footer from "@/components/layout/Footer";
import { useI18n } from "@/i18n/LocaleProvider";

export default function MobileFooter() {
    const { locale } = useI18n();
    return <div data-mobile-footer=""><Footer locale={locale} backToTopHref="#mobile-main" variant="mobile" /></div>;
}
