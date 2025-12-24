import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";

const BrandStory = () => {
  const [storyRef, isStoryVisible] = useScrollAnimation(0.2);
  const [textVisible, setTextVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    if (isStoryVisible) {
      const textTimer = setTimeout(() => setTextVisible(true), 200);
      const imageTimer = setTimeout(() => setImageVisible(true), 600);
      const cardTimer = setTimeout(() => setCardVisible(true), 1000);

      return () => {
        clearTimeout(textTimer);
        clearTimeout(imageTimer);
        clearTimeout(cardTimer);
      };
    }
  }, [isStoryVisible]);

  return (
    <section
      ref={storyRef}
      className="relative py-20 px-6 overflow-hidden"
      id="story"
    >
      {/* 🌄 FIXED BACKGROUND IMAGE (same as HeroSection) */}

      {/* ✨ Background decorative floating lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* 🖋️ Main Story Content */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT TEXT */}
          <div className="space-y-8">
            <div
              className={`animate-story-reveal ${
                isStoryVisible ? "visible" : ""
              }`}
            >
              <h2 className="font-serif-elegant text-4xl md:text-5xl font-bold text-white mb-6">
                How <span className="text-gradient-gold">Lerah</span> Found Its
                Soul?
              </h2>
              <div className="space-y-4 text-gray-200">
                {[
                  "Like every great love story, ours too began with a wedding — our own.",
                  "In the search for the perfect saree, we discovered a world of artisans who weave not just fabric, but heritage and soul into every thread.",
                  "It was then we realized — a saree isn't chosen by us, it chooses us.",
                  "From that belief, Lerah was born, a space where every saree is personally handpicked by either one of our founders or our designers, ensuring that each piece carries a story worth treasuring for a lifetime.",
                ].map((text, idx) => (
                  <p
                    key={idx}
                    className={`font-sans-clean text-lg text-gray-200 leading-relaxed animate-text-reveal ${
                      textVisible ? "visible" : ""
                    }`}
                    style={{ transitionDelay: `${idx * 200}ms` }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE + FLOATING CARD */}
          <div
            className={`relative animate-story-image ${
              imageVisible ? "visible" : ""
            }`}
          >
            <div className="aspect-square rounded-2xl overflow-hidden relative shadow-xl">
              <img
                src="assets/images/main_page.webp"
                alt="Beige & Blush detail"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Floating mini card */}
            {/* <div
              className={`absolute -bottom-6 -left-6 bg-card/90 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-luxury max-w-xs animate-story-card ${
                cardVisible ? "visible" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-secondary animate-glow"></div>
                <div>
                  <div className="font-serif-elegant text-lg font-semibold text-secondary">
                    Handcrafted
                  </div>
                  <div className="font-sans-clean text-sm text-muted-foreground">
                    With Love & Tradition
                  </div>
                </div>
              </div>
            </div> */}

            {/* Floating decor */}
            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-accent/20 animate-float"></div>
            <div
              className="absolute top-1/2 -left-8 w-6 h-6 rounded-full bg-primary/20 animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
