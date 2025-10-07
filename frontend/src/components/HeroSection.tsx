import React from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const HeroSection = () => {
  const [heroRef, isHeroVisible] = useScrollAnimation(0.1);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5652-scaled.jpeg?fit=600%2C899&ssl=1"
          alt="Beige & Blush saree"
          className="w-full h-full object-cover object-center animate-hero-zoom"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-primary/30 to-transparent mix-blend-multiply"></div>
        {/* Sheen */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -inset-x-40 top-0 h-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-gradient-pan"></div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 sm:px-8 max-w-xl sm:max-w-2xl md:max-w-4xl mx-auto">
        <h1
          className={`font-serif-elegant font-bold text-primary-foreground mb-4 leading-tight animate-fade-up ${
            isHeroVisible ? "visible" : ""
          }`}
          style={{
            // fluid clamp fallback for browsers that support inline styles
            fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
          }}
        >
          {/* make first part slightly smaller on mobile */}
          <span className="block text-[1.05em] sm:text-[0.9em] md:text-[1em] mb-1">
            With every drape
          </span>
          <span className="block text-[1.15em] sm:text-[1.4em] md:text-[1.6em] text-gradient-gold">
            walk with the majesty of a lioness.
          </span>
        </h1>

        <p
          className={`font-sans-clean text-primary-foreground/90 mb-6 max-w-lg mx-auto leading-relaxed animate-fade-up animation-delay-200 ${
            isHeroVisible ? "visible" : ""
          }`}
          style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.125rem)" }}
        >
          Discover the perfect blend of tradition and modern sophistication.
          Each saree tells a story of heritage, crafted with love and attention
          to detail.
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up animation-delay-400 ${
            isHeroVisible ? "visible" : ""
          }`}
        >
          <Button className="btn-luxury text-base sm:text-lg px-6 py-3 w-full sm:w-auto">
            Explore Collection
          </Button>
          <Button
            variant="outline"
            className="btn-outline-luxury text-base sm:text-lg px-6 py-3 w-full sm:w-auto border-primary-foreground bg-primary-foreground text-primary"
          >
            Our Story
          </Button>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent/60"
            style={{
              left: `${(i * 13) % 100}%`,
              top: `${(i * 19) % 100}%`,
              animation: `float ${6 + (i % 4)}s ease-in-out ${
                i * 0.8
              }s infinite`,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
