import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import toast from "react-hot-toast";

const Contact = () => {
  const [contactRef, isContactVisible] = useScrollAnimation(0.1);
  const [formVisible, setFormVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const { makeApiCall, fetching } = useAPICall();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (isContactVisible) {
      const formTimer = setTimeout(() => setFormVisible(true), 200);
      const infoTimer = setTimeout(() => setInfoVisible(true), 400);

      return () => {
        clearTimeout(formTimer);
        clearTimeout(infoTimer);
      };
    }
  }, [isContactVisible]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.message
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const response = await makeApiCall(
        "POST",
        API_ENDPOINT.CONTACT_US,
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        },
        "application/json",
        undefined,
        "contact"
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Message sent! We'll get back to you within 24 hours.");
        // Reset form for a clear UX
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: [
        "Bhoomika PRA 253 D1 Ashramom Road Aaramada PO Punnakkamugal  TVPM 695032",
      ],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 8921223049"],
      description:
        "Speak directly with our saree experts for personalized assistance and styling advice.",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["admin@lerah.in"],
      description:
        "Send us your queries and we'll respond within 24 hours with detailed information.",
    },
  ];

  return (
    <>
      <Header />
      <div
        className="min-h-screen"
        style={{ backgroundColor: "hsl(var(--background, 41 100% 95%))" }}
      >
        {/* Hero Section */}
        <section className="relative py-20 px-6 bg-secondary">
          <div className="max-w-4xl mx-auto text-center ">
            <h1 className="text-4xl md:text-5xl font-serif-elegant text-gradient-purple mb-4">
              Get in <span className="">Touch</span>
            </h1>
            <p className="font-sans-clean text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-muted">
              We'd love to hear from you. Whether you're looking for the perfect
              saree or have questions about our collection, we're here to help.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section ref={contactRef} className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div
                className={`animate-fade-up ${formVisible ? "visible" : ""} `}
              >
                <Card className="card-luxury p-8 " style={{}}>
                  <CardHeader>
                    <CardTitle
                      className="font-serif-elegant text-2xl mb-2"
                      style={{ color: "hsl(var(--secondary))" }}
                    >
                      Send us a Message
                    </CardTitle>
                    <p style={{ color: "hsl(var(--muted-foreground))" }}>
                      Fill out the form below and we'll get back to you within
                      24 hours.
                    </p>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "hsl(var(--secondary))" }}
                          >
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Your first name"
                            className="border-border focus:border-accent"
                            style={{
                              backgroundColor: "hsl(var(--card))",
                              color: "hsl(var(--foreground))",
                            }}
                            required
                            aria-label="First name"
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "hsl(var(--secondary))" }}
                          >
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Your last name"
                            className="border-border focus:border-accent"
                            style={{
                              backgroundColor: "hsl(var(--card))",
                              color: "hsl(var(--foreground))",
                            }}
                            required
                            aria-label="Last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "hsl(var(--secondary))" }}
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="border-border focus:border-accent"
                          style={{
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--foreground))",
                          }}
                          required
                          aria-label="Email"
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "hsl(var(--secondary))" }}
                        >
                          Phone
                        </label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 8921223049"
                          className="border-border focus:border-accent"
                          style={{
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--foreground))",
                          }}
                          aria-label="Phone"
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "hsl(var(--secondary))" }}
                        >
                          Subject
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What can we help you with?"
                          className="border-border focus:border-accent"
                          style={{
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--foreground))",
                          }}
                          aria-label="Subject"
                        />
                      </div>

                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: "hsl(var(--secondary))" }}
                        >
                          Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your saree needs, special occasions, or any questions you have..."
                          className="min-h-32 border-border focus:border-accent resize-none"
                          style={{
                            backgroundColor: "hsl(var(--card))",
                            color: "hsl(var(--foreground))",
                          }}
                          required
                          aria-label="Message"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="btn-luxury w-full text-lg py-4 !bg-secondary"
                        disabled={fetching}
                        aria-label="Send message"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        {fetching ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div
                className={`space-y-6 animate-fade-up ${
                  infoVisible ? "visible" : ""
                }`}
              >
                <div>
                  <h2
                    className="font-serif-elegant text-3xl font-bold mb-4"
                    style={{ color: "hsl(var(--secondary))" }}
                  >
                    Connect With Us
                  </h2>
                  <p style={{ color: "hsl(var(--muted-foreground))" }}>
                    Our team of saree experts is here to help you find the
                    perfect piece for any occasion. From daily wear to bridal
                    collections, we're passionate about making your saree
                    journey memorable.
                  </p>
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card
                      key={index}
                      className="card-luxury p-6 hover:shadow-luxury transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, hsl(var(--card) / 0.98), hsl(var(--card) / 0.94))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-secondary text-primary">
                          <info.icon className="w-6 h-6 text-white " />
                        </div>

                        <div className="flex-1">
                          <h3
                            className="font-serif-elegant text-xl font-semibold mb-2"
                            style={{ color: "hsl(var(--secondary))" }}
                          >
                            {info.title}
                          </h3>
                          <div className="space-y-1 mb-3">
                            {info.details.map((detail, idx) => (
                              <p
                                key={idx}
                                className="font-sans-clean"
                                style={{
                                  color: "hsl(var(--muted-foreground))",
                                }}
                              >
                                {detail}
                              </p>
                            ))}
                          </div>
                          <p style={{ color: "hsl(var(--muted-foreground))" }}>
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Contact;
