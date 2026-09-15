import { routeLocale } from "@/i18n/server";
import type { Metadata } from "next";

import ArchiveSection from "@/components/ArchiveSection";
import ContactSection from "@/components/ContactSection";
import CraftingStructureSection from "@/components/CraftingStructureSection";
import HeroSection from "@/components/HeroSection";
import NeuralSystemSection from "@/components/NeuralSection";
import CinematicRuntime from "@/components/presentation/CinematicRuntime";
import ProductSection from "@/components/ProductSection";
import { getDictionary } from "@/i18n/getDictionary";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const locale = await routeLocale(params);
    return createPageMetadata({
    title: getDictionary(locale).seo.title,
    description: getDictionary(locale).seo.description,
    path: "/",
    absoluteTitle: true,
    socialTitle: getDictionary(locale).seo.socialTitle,
    socialDescription: getDictionary(locale).seo.socialDescription,

        locale,
    });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
    const locale = await routeLocale(params);
    return (
        <>
            <div data-cinematic-pin-shell="">
                <div
                    className="cinematic-stage"
                    data-cinematic-stage=""
                >
                    <HeroSection />
                    <CraftingStructureSection />
                    <NeuralSystemSection />
                    <ProductSection locale={locale} />
                </div>
            </div>
            <CinematicRuntime />
            <ArchiveSection locale={locale} />
            <ContactSection />
        </>
    );
}
