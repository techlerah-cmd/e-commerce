import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";
import { ShoppingBag, Handshake, Star } from "lucide-react";

const items = [
  {
    id: 1,
    title: "Where Every Woman Belongs",
    body: "At Lèrah, beauty knows no limits. Our sarees range from ₹1,000 to ₹5 lakhs, so every woman can find her perfect piece.",
    icon: "shopping",
  },
  {
    id: 2,
    title: "A Bridge of Trust",
    body: "We connect artisans with women who value their craft, ensuring each saree reaches its rightful owner.",
    icon: "handshake",
  },
  {
    id: 3,
    title: "A Promise of Quality",
    body: "By handpicking sarees from master weavers, we guarantee heritage, authenticity, and timeless elegance.",
    icon: "star",
  },
];

const IconMap = ({ name }: { name: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const commonProps = { width: 18, height: 18, "aria-hidden": true } as any;
  if (name === "shopping") return <ShoppingBag {...commonProps} />;
  if (name === "handshake") return <Handshake {...commonProps} />;
  return <Star {...commonProps} />;
};

const WhatDefinesUs = () => {
  const [sectionRef, isSectionVisible] = useScrollAnimation(0.2);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [pillarsVisible, setPillarsVisible] = useState<boolean[]>(() =>
    Array(items.length).fill(false)
  );
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    if (isSectionVisible) {
      const headerTimer = setTimeout(() => setHeaderVisible(true), 200);
      const lineTimer = setTimeout(() => setLineVisible(true), 400);

      const pillarTimers = items.map((_, index) =>
        setTimeout(() => {
          setPillarsVisible((prev) => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, 600 + index * 200)
      );

      return () => {
        clearTimeout(headerTimer);
        clearTimeout(lineTimer);
        pillarTimers.forEach(clearTimeout);
      };
    }
  }, [isSectionVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-6 bg-background overflow-hidden"
    >
      {/* Ambient aesthetics */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-64 w-[42rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-primary/10 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Main grid: header in first column, three pillars in the next three columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left header column (stays on top for mobile) */}
          <div
            className={`lg:pr-8 ${
              headerVisible ? "animate-fade-up visible" : "opacity-0"
            }`}
          >
            <h2 className="font-serif-elegant text-xl md:text-2xl lg:text-3xl font-bold text-secondary mb-4">
              Why{" "}
              <span className="text-gradient-gold text-secondary">
                choose us
              </span>
            </h2>
            <div
              className={`h-0.5 w-16 bg-accent mt-4 ${
                lineVisible ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500`}
            />
            <p className="mt-6 text-secondary max-w-sm">
              Our values are stitched into every piece — authenticity, care, and
              a promise that each saree finds its rightful home.
            </p>
          </div>

          {/* Pillars - on mobile they stack under header; on lg they sit side-by-side */}
          {items.map((item, idx) => (
            <div
              key={item.id}
              className={`p-6 lg:p-0 ${
                pillarsVisible[idx]
                  ? "animate-pillar-slide visible"
                  : "opacity-0"
              } bg-transparent`}
            >
              <div className="flex gap-4 items-start md:items-start">
                {/* Fixed-size icon container so text wrapping won't distort it */}
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-secondary from-accent to-primary text-white flex items-center justify-center">
                  <IconMap name={item.icon} />
                  <span className="sr-only">{item.title} icon</span>
                </div>

                {/* Text content */}
                <div>
                  <h3 className="font-serif-elegant text-xl lg:text-2xl text-secondary font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatDefinesUs;
