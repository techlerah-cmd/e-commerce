import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Policy = () => {
  const [policyRef, isPolicyVisible] = useScrollAnimation(0.1);
  const [sectionsVisible, setSectionsVisible] = useState({
    privacy: false,
    terms: false,
    refund: false,
    shipping: false,
    returns: false,
  });

  useEffect(() => {
    if (isPolicyVisible) {
      const timers = [
        setTimeout(
          () => setSectionsVisible((prev) => ({ ...prev, privacy: true })),
          200
        ),
        setTimeout(
          () => setSectionsVisible((prev) => ({ ...prev, terms: true })),
          400
        ),
        setTimeout(
          () => setSectionsVisible((prev) => ({ ...prev, refund: true })),
          600
        ),
        setTimeout(
          () => setSectionsVisible((prev) => ({ ...prev, shipping: true })),
          800
        ),
        setTimeout(
          () => setSectionsVisible((prev) => ({ ...prev, returns: true })),
          1000
        ),
      ];

      return () => timers.forEach(clearTimeout);
    }
  }, [isPolicyVisible]);

  const sections = [
    {
      id: "privacy",
      title: "Privacy Policy",
      content: (
        <div className="space-y-4 text-muted-foreground">
          <p>
            At LÈRAH, we are committed to protecting your privacy
            and ensuring the security of your personal information. This Privacy
            Policy explains how we collect, use, and safeguard your data.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            Information We Collect
          </h4>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support. This
            includes your name, email address, shipping address, payment
            information, and communication preferences.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            How We Use Your Information
          </h4>
          <ul className="list-disc list-inside space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Provide customer service and support</li>
            <li>Send you important updates about your orders</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Improve our products and services</li>
            <li>Prevent fraud and ensure security</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground">
            Information Sharing
          </h4>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information only in the following
            circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>With service providers who help us operate our business</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With your explicit consent</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground">
            Data Security
          </h4>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h4 className="text-lg font-semibold text-foreground">Your Rights</h4>
          <p>
            You have the right to access, update, or delete your personal
            information. You may also opt out of marketing communications at any
            time.
          </p>
        </div>
      ),
    },
    {
      id: "terms",
      title: "Terms of Service",
      content: (
        <div className="space-y-4 text-muted-foreground">
          <p>
            Welcome to LÈRAH. By accessing and using our website
            and services, you agree to be bound by these Terms of Service.
            Please read them carefully.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            Acceptance of Terms
          </h4>
          <p>
            By using our website, you acknowledge that you have read,
            understood, and agree to be bound by these terms and conditions.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            Use of Our Services
          </h4>
          <ul className="list-disc list-inside space-y-2">
            <li>You must be at least 18 years old to use our services</li>
            <li>You agree to provide accurate and complete information</li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account
            </li>
            <li>
              You agree not to use our services for any illegal or unauthorized
              purpose
            </li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground">
            Product Information
          </h4>
          <p>
            We strive to provide accurate product descriptions and images.
            However, we do not guarantee that product descriptions or other
            content on our site is accurate, complete, or error-free.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            Pricing and Payment
          </h4>
          <p>
            All prices are subject to change without notice. Payment is due at
            the time of purchase. We accept major credit cards and other payment
            methods as indicated on our website.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            Limitation of Liability
          </h4>
          <p>
            LÈRAH shall not be liable for any indirect,
            incidental, special, or consequential damages arising out of or in
            connection with your use of our services.
          </p>
        </div>
      ),
    },
    {
      id: "exchange",
      title: "Exchange Policy",
      content: (
        <div className="space-y-4 text-muted-foreground">
          <p>
            At LÈRAH, we want you to be satisfied with your
            purchase. Our exchange policy allows you to exchange items for a
            different size, color, or style.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            Eligibility for Exchange
          </h4>
          <ul className="list-disc list-inside space-y-2">
            <li>Items must be unused and in original packaging</li>
            <li>All tags and labels must be attached</li>
            <li>Items must not be altered or damaged</li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground">
            How to Exchange
          </h4>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Contact our customer service team to obtain an exchange
              authorization
            </li>
            <li>Pack the item securely in its original packaging</li>
            <li>Include the exchange authorization number and order details</li>
            <li>Ship the package using a trackable shipping service</li>
          </ol>

          <h4 className="text-lg font-semibold text-foreground">
            Exchange Processing
          </h4>
          <p>
            Exchanges are processed within 5-7 business days of receiving your
            package. You can exchange for a different size, color, or style of
            equal or lesser value.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            Shipping Costs
          </h4>
          <p>
            Shipping costs for exchanges are the responsibility of the customer
            unless the item is defective or we made an error in shipping.
          </p>

          <h4 className="text-lg font-semibold text-foreground">Contact Us</h4>
          <p>
            For exchanges or questions about our policy, please contact our
            customer service team at support@lerahroyalelegance.com or call us
            at +91-8921223049.
          </p>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "Shipping Policy",
      content: (
        <div className="space-y-4 text-muted-foreground">
          <p>
            We offer fast and reliable shipping to ensure your LÈRAH purchases arrive safely and on time. All orders are shipped
            for free, regardless of order value.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            Shipping Methods
          </h4>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Standard Shipping:</strong> 5-7 business days
            </li>
            <li>
              <strong>Express Shipping:</strong> 2-3 business days
            </li>
            <li>
              <strong>Overnight Shipping:</strong> 1 business day
            </li>
          </ul>

          <h4 className="text-lg font-semibold text-foreground">
            Order Processing
          </h4>
          <p>
            Orders are typically processed within 1-2 business days. You will
            receive a confirmation email with tracking information once your
            order ships.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            International Shipping
          </h4>
          <p>
            We ship to select international destinations. International orders
            may be subject to customs duties, taxes, and import fees, which are
            the responsibility of the recipient.
          </p>

          <h4 className="text-lg font-semibold text-foreground">
            Shipping Restrictions
          </h4>
          <p>
            Some items may have shipping restrictions due to size, weight, or
            destination regulations. These will be clearly indicated on the
            product page.
          </p>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <section className="relative py-20 px-6 bg-secondary">
        <div className="text-center ">
          <h1 className="text-4xl md:text-5xl font-serif-elegant text-gradient-purple mb-4">
            Our Policies
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Transparency and trust are at the heart of our relationship with
            you. Please review our policies to understand how we serve you.
          </p>
        </div>
      </section>
      <main className="min-h-screen  ">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}

          {/* Policy Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <Card
                key={section.id}
                className={`card-luxury transition-all duration-700 `}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-serif-elegant text-secondary">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>{section.content}</CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <Card className="card-luxury max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Have Questions About Our Policies?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Our customer service team is here to help. Contact us for any
                  clarifications or concerns regarding our policies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="mailto:admin@lerah.in"
                    className="btn-luxury text-center"
                  >
                    Email Support
                  </a>
                  <a
                    href="tel:+91-8921223049"
                    className="btn-outline-luxury text-center"
                  >
                    Call Us
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Policy;
