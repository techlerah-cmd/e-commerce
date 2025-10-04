import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-primary via-primary-glow to-primary">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <div className="mb-16">
          <h2 className="font-serif-elegant text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Begin Your <span className="text-gradient-gold">Elegance</span> Journey
          </h2>
          <p className="font-sans-clean text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover the perfect saree that tells your story. From traditional ceremonies 
            to modern celebrations, find your signature style.
          </p>
          <Button className="bg-accent hover:bg-accent-glow text-accent-foreground font-semibold px-12 py-4 text-lg rounded-full shadow-glow hover:shadow-xl transition-all duration-300 hover:scale-105">
            Shop Full Collection
          </Button>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-accent" />
            <h3 className="font-serif-elegant text-2xl font-semibold text-primary-foreground">
              Stay in Style
            </h3>
          </div>
          <p className="font-sans-clean text-primary-foreground/80 mb-6 max-w-md mx-auto">
            Get exclusive access to new collections, styling tips, and special offers
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email"
              className="bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-accent focus:ring-accent"
            />
            <Button className="bg-accent hover:bg-accent-glow text-accent-foreground font-semibold px-8 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
          
          <p className="font-sans-clean text-xs text-primary-foreground/60 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;