const items = [
  {
    id: 1,
    title: "Where Every Woman Belongs",
    body:
      "At Lèrah, we believe beauty should never be limited. From everyday elegance to heirloom treasures, our sarees range from ₹1,000 to ₹5 lakhs — so every woman can find the piece she was meant to own. We are not a brand for a select few; we are for every soul a saree chooses.",
  },
  {
    id: 2,
    title: "A Bridge of Trust",
    body:
      "We are not just sellers — we are the bridge between artisans and women who value their craft. Every saree carries the soul of its weaver, and we believe it is destined for one rightful owner. Our role is simply to connect the two.",
  },
  {
    id: 3,
    title: "A Promise of Quality",
    body:
      "Our commitment goes beyond fashion — it is about heritage, authenticity, and timeless elegance. By handpicking sarees from master weavers, we ensure that every piece reflects unmatched craftsmanship and lasting value.",
  },
];

import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";

const WhatDefinesUs = () => {
  const [sectionRef, isSectionVisible] = useScrollAnimation(0.2);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [pillarsVisible, setPillarsVisible] = useState<boolean[]>([]);
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    if (isSectionVisible) {
      const headerTimer = setTimeout(() => setHeaderVisible(true), 200);
      const lineTimer = setTimeout(() => setLineVisible(true), 400);
      
      // Stagger pillar animations
      const pillarTimers = items.map((_, index) => 
        setTimeout(() => {
          setPillarsVisible(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, 600 + (index * 400))
      );
      
      return () => {
        clearTimeout(headerTimer);
        clearTimeout(lineTimer);
        pillarTimers.forEach(clearTimeout);
      };
    }
  }, [isSectionVisible]);

  return (
    <section ref={sectionRef} className="relative py-24 px-6 bg-background">
      {/* Ambient aesthetics */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-64 w-[42rem] rounded-full bg-accent/10 blur-3xl"></div>
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-primary/10 blur-2xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className={`text-center mb-14 animate-fade-up ${headerVisible ? 'visible' : ''}`}>
          <h2 className="font-serif-elegant text-4xl md:text-5xl font-bold text-primary mb-4">
            What <span className="text-gradient-gold">defines</span> us?
          </h2>
          <p className="font-sans-clean text-lg text-muted-foreground max-w-2xl mx-auto">
            Our ethos, woven in three timeless promises
          </p>
        </div>

        {/* Pillars (non-card, flowing lines) */}
        <div className="relative">
          {/* Vertical ornamental line */}
          <div className={`hidden md:block absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border to-transparent animate-ornamental-line ${lineVisible ? 'visible' : ''}`}></div>

          <div className="flex flex-col gap-12">
            {items.map((item, idx) => (
              <div key={item.id} className={`grid items-start gap-8 md:grid-cols-[1fr_auto_1fr] ${idx % 2 === 0 ? "md:text-right" : ""} animate-pillar-slide ${pillarsVisible[idx] ? 'visible' : ''}`}>
                {/* Text block left/right alternating */}
                <div className={`${idx % 2 === 0 ? "order-1" : "order-3"}`}>
                  <div className="inline-flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-primary text-white flex items-center justify-center font-serif-elegant text-base transition-all duration-300 hover:scale-110">
                      {String(item.id).padStart(1, "0")}
                    </div>
                    <span className="hidden md:inline h-px w-12 bg-border"></span>
                  </div>
                  <h3 className={`font-serif-elegant text-2xl md:text-3xl text-primary mb-3 animate-pillar-title ${pillarsVisible[idx] ? 'visible' : ''}`}>
                    {item.title}
                  </h3>
                  <p className={`font-sans-clean text-muted-foreground text-base md:text-lg leading-relaxed animate-pillar-text ${pillarsVisible[idx] ? 'visible' : ''}`}>
                    {item.body}
                  </p>
                </div>

                {/* Center jewel */}
                <div className="order-2 flex items-center justify-center">
                  <div className="relative">
                    <div className={`h-14 w-14 rounded-full bg-background border border-border flex items-center justify-center animate-jewel-pulse ${pillarsVisible[idx] ? 'visible' : ''}`}>
                      <div className="h-2.5 w-2.5 rounded-full bg-accent animate-glow"></div>
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-accent/20"></div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className={`${idx % 2 === 0 ? "order-3" : "order-1"}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatDefinesUs;


