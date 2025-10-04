import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";

const collections = [
  {
    id: 1,
    name: "Everyday Elegance",
    description: "Light, graceful sarees for daily wear and small celebrations.",
    priceRange: "₹1,000 – ₹5,000",
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5691-scaled.jpeg?fit=600%2C899&ssl=1"
  },
  {
    id: 2,
    name: "Occasion Charm",
    description: "Perfect for festive gatherings, office events, or gifting.",
    priceRange: "₹5,000 – ₹10,000",
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5656-scaled.jpeg?fit=600%2C899&ssl=1"
  },
  {
    id: 3,
    name: "The Bridal Edit",
    description: "Curated for brides and weddings — luxurious, heirloom-worthy sarees.",
    priceRange: "₹10,000 – ₹2,00,000",
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5639-scaled.jpeg?fit=600%2C899&ssl=1"
  },
  {
    id: 4,
    name: "Designer’s Choice",
    description: "Rare weaves, exclusive crafts, and premium masterpieces.",
    priceRange: "Premium Selection",
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5686-scaled.jpeg?fit=600%2C899&ssl=1"
  }
];

const FeaturedCollections = () => {
  const [headerRef, isHeaderVisible] = useScrollAnimation(0.2);
  const [bannerVisible, setBannerVisible] = useState<boolean[]>([]);

  useEffect(() => {
    const observers = collections.map((_, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setBannerVisible(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className={`text-center mb-16 animate-fade-up ${isHeaderVisible ? 'visible' : ''}`}>
          <h2 className="font-serif-elegant text-4xl md:text-5xl font-bold text-primary mb-4">
            Featured <span className="text-gradient-gold">Collections</span>
          </h2>
          <p className="font-sans-clean text-lg text-muted-foreground max-w-2xl mx-auto">
            Curated selections that celebrate the artistry of traditional craftsmanship
          </p>
        </div>

        {/* Alternating full-width banners */}
        <div className="flex flex-col gap-10 md:gap-14">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              ref={(el) => {
                if (el && !bannerVisible[index]) {
                  const observer = new IntersectionObserver(
                    ([entry]) => {
                      if (entry.isIntersecting) {
                        setBannerVisible(prev => {
                          const newState = [...prev];
                          newState[index] = true;
                          return newState;
                        });
                        observer.disconnect();
                      }
                    },
                    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
                  );
                  observer.observe(el);
                }
              }}
              className={`overflow-hidden rounded-3xl bg-gradient-to-br from-secondary/30 to-background border animate-banner-slide animate-banner-hover ${
                index === 0 ? 'animation-delay-200' :
                index === 1 ? 'animation-delay-400' :
                index === 2 ? 'animation-delay-600' :
                'animation-delay-800'
              } ${bannerVisible[index] ? 'visible' : ''}`}
            >
              <div
                className={`grid items-stretch md:grid-cols-2 ${index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                {/* Visual side */}
                <div className="relative h-72 md:h-[28rem] overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="absolute inset-0 h-full w-full object-cover animate-image-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                  {/* Decorative ring */}
                  <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-accent/10 blur-2xl animate-float"></div>
                  {/* Subtle overlay animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-1000"></div>
                </div>

                {/* Content side */}
                <div className="flex items-center">
                  <div className="px-6 py-8 md:p-10 lg:p-14 animate-content-fade">
                    <div className="mb-4 inline-flex items-center rounded-full border border-accent px-3 py-1 text-xs font-medium text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground">
                      {collection.priceRange}
                    </div>
                    <h3 className="font-serif-elegant text-3xl md:text-4xl font-semibold text-primary tracking-tight mb-3 transition-colors duration-300 hover:text-accent">
                      {collection.name}
                    </h3>
                    <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-prose leading-relaxed">
                      {collection.description}
                    </p>
                    <div className="flex gap-3">
                      <Button className="btn-luxury transition-all duration-300 hover:scale-105">Explore</Button>
                      <Button variant="outline" className="transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground">Learn more</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;