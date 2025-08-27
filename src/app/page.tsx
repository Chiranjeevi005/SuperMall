import React from "react";
import HeroSection from "@/components/page-components/HeroSection";
import StatsSection from "@/components/page-components/StatsSection";
import Featured from "@/components/page-components/Featured";
import FreeShippingBanner from "@/components/page-components/FreeShippingBanner";
import OurStory from "@/components/page-components/OurStory";
import TestimonialsSection from "@/components/page-components/TestimonialsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <Featured />
      <FreeShippingBanner />
      <OurStory />
      <TestimonialsSection />
    </main>
  );
}