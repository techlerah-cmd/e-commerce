import React from "react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useNavigate, useLocation } from "react-router-dom";

const HeroSection = () => {
  const [heroRef, isHeroVisible] = useScrollAnimation(0.1);
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoToCollections = () => navigate("/collections");
  const handleGoToStory = async () => {
    if (location.pathname === "/" || location.pathname === "") {
      const ok = document
        .getElementById("story")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (ok) return;
      setTimeout(
        () =>
          document
            .getElementById("story")
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        150
      );
      return;
    }
    navigate("/");
    setTimeout(
      () =>
        document
          .getElementById("story")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      200
    );
  };

  return (
    <>
      {/* FIXED BACKGROUND IMAGE */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-center bg-cover bg-no-repeat pointer-events-none"
        style={{
          backgroundImage:
            "url('https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5652-scaled.jpeg?fit=600%2C899&ssl=1')",
        }}
      >
        {/* Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--primary))/60] via-[hsl(var(--primary))/30] to-transparent mix-blend-multiply" />
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -inset-x-40 top-0 h-1/2 bg-gradient-to-r from-transparent via-[hsl(var(--foreground))/20] to-transparent animate-gradient-pan" />
        </div>
      </div>

      {/* HERO CONTENT */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="relative z-10 text-left px-4 sm:px-6 lg:px-8 w-full max-w-screen-xl mx-auto flex flex-col items-start">
          <h1
            className={`font-serif-elegant font-bold text-[hsl(var(--foreground))] mb-4 leading-tight animate-fade-up ${
              isHeroVisible ? "visible" : ""
            }`}
            style={{ fontSize: "clamp(1.75rem, 5vw, 3.5rem)" }}
          >
            <span className="block text-[1.05em] sm:text-[0.95em] md:text-[1em] mb-1 text-secondary">
              With every drape
            </span>
            <span className="block text-[1.15em] sm:text-[1.2em] md:text-[1.6em] text-gradient-gold">
              walk with the majesty of a lioness.
            </span>
          </h1>

          <p
            className={`font-sans-clean text-[hsl(var(--foreground))/90] mb-6 max-w-2xl leading-relaxed animate-fade-up animation-delay-200 ${
              isHeroVisible ? "visible" : ""
            }`}
            style={{ fontSize: "clamp(0.95rem, 2.2vw, 1.125rem)" }}
          >
            Discover the perfect blend of tradition and modern sophistication.
            Each saree tells a story of heritage, crafted with love and
            attention to detail.
          </p>

          <div
            className={`flex flex-col md:flex-row gap-4 justify-start items-start animate-fade-up animation-delay-400 ${
              isHeroVisible ? "visible" : ""
            }`}
          >
            <Button
              onClick={handleGoToCollections}
              className="btn-luxury text-base md:text-lg px-6 py-3 w-full md:w-auto"
            >
              Explore Collection
            </Button>
            <Button
              variant="outline"
              onClick={handleGoToStory}
              className="btn-outline-luxury text-base md:text-lg px-6 py-3 w-full md:w-auto border-[hsl(var(--primary))] bg-secondary text-[hsl(var(--primary))] border-none"
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
              className="absolute w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))/60]"
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
    </>
  );
};

export default HeroSection;
