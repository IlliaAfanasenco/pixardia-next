import React from 'react';
import Header from "@/components/layout/Header";
import HeroSection from "@/components/HeroSection";
import CraftingStructureSection from "@/components/CraftingStructureSection";
import ProductSection from "@/components/ProductSection";
import ArchiveSection from "@/components/ArchiveSection";
import ContactSection from "@/components/ContactSection";

const Home = () => {
    return (
        <div>
            <Header/>
            <HeroSection/>
            <CraftingStructureSection/>
            <ProductSection/>
            <ArchiveSection/>
            <ContactSection/>
        </div>
    );
};

export default Home;