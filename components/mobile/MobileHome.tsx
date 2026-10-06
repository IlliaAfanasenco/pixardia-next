import MobileArchiveSection from "./sections/MobileArchiveSection";
import MobileContactSection from "./sections/MobileContactSection";
import MobileCraftingSection from "./sections/MobileCraftingSection";
import MobileHeroSection from "./sections/MobileHeroSection";
import MobileNeuralSection from "./sections/MobileNeuralSection";
import MobileProductSection from "./sections/MobileProductSection";

export default function MobileHome() {
    return (
        <div data-mobile-home="">
            <MobileHeroSection />
            <MobileCraftingSection />
            <MobileNeuralSection />
            <MobileProductSection />
            <MobileArchiveSection />
            <MobileContactSection />
        </div>
    );
}
