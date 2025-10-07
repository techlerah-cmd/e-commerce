import {
  Facebook,
  Instagram,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <h3 className="font-serif-elegant text-3xl font-bold mb-4">
                Lerah <span className="text-gradient-gold">Royal Elegance</span>
              </h3>
              <p className="font-sans-clean text-primary-foreground/80 leading-relaxed mb-6 max-w-md">
                Where every saree is personally handpicked by our founders and
                designers, ensuring each piece carries a story worth treasuring
                for a lifetime.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent-glow transition-colors duration-300"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent-glow transition-colors duration-300"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:bg-accent-glow transition-colors duration-300"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-serif-elegant text-lg font-semibold mb-4">
                Quick Links
              </h4>
              <nav className="space-y-2">
                <Link
                  to="/"
                  className="block font-sans-clean text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/collections"
                  className="block font-sans-clean text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                >
                  Collections
                </Link>

                <Link
                  to="/contact"
                  className="block font-sans-clean text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                >
                  Contact
                </Link>
                <Link
                  to="/policy"
                  className="block font-sans-clean text-primary-foreground/80 hover:text-accent transition-colors duration-300"
                >
                  Policy
                </Link>
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-serif-elegant text-lg font-semibold mb-4">
                Contact Us
              </h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="font-sans-clean text-primary-foreground/80 text-sm">
                    123 Heritage Lane
                    <br />
                    Mumbai, Maharashtra 400001
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="font-sans-clean text-primary-foreground/80 text-sm">
                    +91 8921223049
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="font-sans-clean text-primary-foreground/80 text-sm">
                    hello@lerahroyalelegance.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/20 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans-clean text-primary-foreground/60 text-sm text-center md:text-left flex items-center gap-2">
              © 2024 Lerah Royal Elegance. All rights reserved. Crafted with{" "}
              <Heart className="w-4 h-4 text-accent fill-accent" /> for timeless
              elegance.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="font-sans-clean text-primary-foreground/60 hover:text-accent transition-colors duration-300 text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-sans-clean text-primary-foreground/60 hover:text-accent transition-colors duration-300 text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="font-sans-clean text-primary-foreground/60 hover:text-accent transition-colors duration-300 text-sm"
              >
                Returns
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
