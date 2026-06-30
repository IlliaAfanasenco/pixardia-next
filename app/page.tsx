import React from 'react';
import Header from "@/components/layout/Header";
import HeroSection from "@/components/HeroSection";
import CraftingStructureSection from "@/components/CraftingStructureSection";
import ProductSection from "@/components/ProductSection";

const Home = () => {
    return (
        <div>
            <Header/>
            <HeroSection/>
            <CraftingStructureSection/>
            <ProductSection/>
        </div>
    );
};

export default Home;