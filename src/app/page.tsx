import Header from "@/components/sections/header";
import HeroSection from "@/components/sections/hero";
import GallerySlider from "@/components/sections/gallery-slider";
import WhatYouNeed from "@/components/sections/what-you-need";
import ReviewsSection from "@/components/sections/reviews";
import NotForSection from "@/components/sections/not-for";
import FAQSection from "@/components/sections/faq";
import CorporateWorkshopSection from "@/components/sections/corporate";
import FinalCTA from "@/components/sections/final-cta";
import Footer from "@/components/sections/footer";
import ContactUs from "@/components/sections/contact-us";
import CodeKarAIChat from "@/components/codekar-ai-chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <GallerySlider />
      <WhatYouNeed />
      <ReviewsSection />
      <NotForSection />
      <FAQSection />
      <CorporateWorkshopSection />
      <FinalCTA />
      <Footer />
      <ContactUs />
      <CodeKarAIChat />
    </main>
  );
}
