import ArchiveSection from "@/components/ArchiveSection";
import ContactSection from "@/components/ContactSection";
import CraftingStructureSection from "@/components/CraftingStructureSection";
import HeroSection from "@/components/HeroSection";
import ProductSection from "@/components/ProductSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function HomePage() {
    return (
        <div id="top">
            <Header />

            <main>
                <HeroSection />
                <CraftingStructureSection />
                <ProductSection />
                <ArchiveSection />
                <ContactSection />
            </main>

            <Footer />
        </div>
    );
}