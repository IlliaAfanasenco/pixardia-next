import type { Metadata } from "next";

import MobileFooter from "@/components/mobile/MobileFooter";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileHome from "@/components/mobile/MobileHome";

export const metadata: Metadata = {
    title: "Pixardia mobile",
    robots: {
        index: false,
        follow: false,
    },
};

export default function MobilePreviewPage() {
    return (
        <>
            <MobileHeader />

            <main id="mobile-main">
                <MobileHome />
            </main>

            <MobileFooter />
        </>
    );
}
