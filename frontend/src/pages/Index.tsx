import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedCollections from "@/components/FeaturedCollections";
import BrandStory from "@/components/BrandStory";
import WhatDefinesUs from "@/components/WhatDefinesUs";
import ProductGrid from "@/components/ProductGrid";
import Testimonials from "@/components/Testimonials";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />
        <section id="collections">
          <FeaturedCollections />
        </section>
        <section id="story">
          <BrandStory />
        </section>
        <WhatDefinesUs />
        <section id="new">
          <ProductGrid />
        </section>
        <Testimonials />
        <section id="contact">
          <CtaSection />
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Index;
