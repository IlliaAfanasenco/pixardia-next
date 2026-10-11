import MobileHeader from "./MobileHeader";
import MobileFooter from "./MobileFooter";

import MobileHeroSection from "./sections/MobileHeroSection";
import MobileCraftingSection from "./sections/MobileCraftingSection";
import MobileNeuralSection from "./sections/MobileNeuralSection";
import MobileProductSection from "./sections/MobileProductSection";
import MobileArchiveSection from "./sections/MobileArchiveSection";
import MobileContactSection from "./sections/MobileContactSection";


export default function MobileHome() {
    return (
        <div
            data-mobile-home
            className="mx-auto w-full max-w-[430px] overflow-x-clip"
        >
            <div
            >
                <MobileHeader />
                <MobileHeroSection />
            </div>

            <MobileCraftingSection />
            <MobileNeuralSection />
            <MobileProductSection />
            <MobileArchiveSection />
            <MobileContactSection />

            <MobileFooter />
        </div>
    );
}