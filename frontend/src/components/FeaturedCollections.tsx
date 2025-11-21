import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const collections = [
  {
    id: 1,
    name: "Everyday Elegance",
    filter: "everyday_elegance",
    description:
      "Light, graceful sarees for daily wear and small celebrations.",
    priceRange: "₹1,000 – ₹5,000",
    image: "assets/images/everyday_cover.JPG",
  },
  {
    id: 2,
    name: "Occasion Charm",
    filter: "occasion_charm",
    description: "Perfect for festive gatherings, office events, or gifting.",
    priceRange: "₹5,000 – ₹10,000",
    image: "assets/images/occashion_charm_main.JPG",
  },
  {
    id: 3,
    name: "The Bridal Edit",
    filter: "the_bridal_edit",
    description:
      "Curated for brides and weddings — luxurious, heirloom-worthy sarees.",
    priceRange: "₹10,000 – ₹2,00,000",
    image: "assets/images/bridal_edit.JPG",
  },
  {
    id: 4,
    name: "Designer’s Choice",
    filter: "designer_choice",
    description: "Rare weaves, exclusive crafts, and premium masterpieces.",
    priceRange: "Premium Selection",
    image: "assets/images/designer_main.JPG",
  },
];

const FeaturedCollections = () => {
  const [bannerVisible, setBannerVisible] = useState<boolean[]>(() =>
    Array(collections.length).fill(false)
  );
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gradient-to-b from-[hsl(var(--ast-global-color-5))] to-[hsl(var(--ast-global-color-4))]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {collections.map((collection, index) => (
          <div
            key={collection.id}
            ref={(el) => {
              if (el && !bannerVisible[index]) {
                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting) {
                      setBannerVisible((prev) => {
                        const newState = [...prev];
                        newState[index] = true;
                        return newState;
                      });
                      observer.disconnect();
                    }
                  },
                  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
                );
                observer.observe(el);
              }
            }}
            className={`relative overflow-hidden ${
              bannerVisible[index]
                ? "animate-banner-slide visible"
                : "opacity-0"
            }`}
          >
            <div className="w-full h-80 md:h-[28rem] lg:h-[32rem] relative">
              {/* Image */}
              <img
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-full object-cover object-top z-[1]"
                loading="lazy"
              />

              {/* Black overlay */}
              <div className="absolute inset-0 bg-black/40 z-[2]" />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--ast-global-color-8))/70] via-[hsl(var(--ast-global-color-7))/40] to-transparent z-[3]" />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end items-start p-4 md:p-6 lg:p-8 text-primary z-[4]">
                <div className="mb-3 inline-flex items-center rounded-full border-[hsl(var(--ast-global-color-2))] px-3 py-1 text-xs font-medium text-primary bg-secondary/80 backdrop-blur-sm">
                  {collection.priceRange}
                </div>

                <h3 className="font-serif-elegant text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight mb-2">
                  {collection.name}
                </h3>

                <p className="text-sm md:text-base mb-4 max-w-prose leading-relaxed">
                  {collection.description}
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={() =>
                      navigate("/collections", {
                        state: { filter: collection.filter },
                      })
                    }
                    className="btn-luxury text-sm md:text-base px-4 py-2"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollections;
