import type { Metadata } from "next";

import ArchiveSection from "@/components/ArchiveSection";
import ContactSection from "@/components/ContactSection";
import CraftingStructureSection from "@/components/CraftingStructureSection";
import HeroSection from "@/components/HeroSection";
import CinematicRuntime from "@/components/presentation/CinematicRuntime";
import ProductSection from "@/components/ProductSection";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
    title: siteConfig.title,
    description: siteConfig.description,
    path: "/",
    absoluteTitle: true,
});

export default function HomePage() {
    return (
        <>
            <div
                className="cinematic-stage"
                data-cinematic-stage=""
            >
                <HeroSection />
                <CraftingStructureSection />
                <ProductSection />
            </div>
            <CinematicRuntime />
            <ArchiveSection />
            <ContactSection />
        </>
    );
}
