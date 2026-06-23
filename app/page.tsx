import React from 'react';
import Header from "@/components/layout/Header";
import HeroSection from "@/components/HeroSection";
import CraftingStructureSection from "@/components/CraftingStructureSection";

const Home = () => {
    return (
        <div>
            <Header/>
            <HeroSection/>
            <CraftingStructureSection/>
        </div>
    );
};

export default Home;