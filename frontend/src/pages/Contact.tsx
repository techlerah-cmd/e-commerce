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
        toast.success(
          "Message sent successfully! We'll get back to you within 24 hours."
        );
        // Reset form
        // setFormData({
        //   firstName: "",
        //   lastName: "",
        //   email: "",
        //   phone: "",
        //   subject: "",
        //   message: "",
        // });
      } else {
        toast.error(
          "Failed to send message. Please try again."
        );
      }
   
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Showroom",
      details: ["123 Heritage Lane", "Mumbai, Maharashtra 400001", "India"],
      description:
        "Experience our collection in person at our elegant showroom in the heart of Mumbai.",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 11 2345 6789"],
      description:
        "Speak directly with our saree experts for personalized assistance and styling advice.",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "hello@lerahroyalelegance.com",
        "orders@lerahroyalelegance.com",
      ],
      description:
        "Send us your queries and we'll respond within 24 hours with detailed information.",
    },
    {
      icon: Clock,
      title: "Showroom Hours",
      details: [
        "Monday - Saturday: 10:00 AM - 8:00 PM",
        "Sunday: 11:00 AM - 6:00 PM",
      ],
      description:
        "Visit us during our convenient hours. We're closed on major festivals.",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        {/* Hero Section */}
        <section className="relative py-20 px-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif-elegant text-4xl md:text-6xl font-bold text-primary mb-6">
              Get in <span className="text-gradient-gold">Touch</span>
            </h1>
            <p className="font-sans-clean text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
                className={`animate-fade-up ${formVisible ? "visible" : ""}`}
              >
                <Card className="card-luxury p-8">
                  <CardHeader>
                    <CardTitle className="font-serif-elegant text-2xl text-primary mb-2">
                      Send us a Message
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you within
                      24 hours.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Your first name"
                            className="border-border focus:border-accent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Your last name"
                            className="border-border focus:border-accent"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your.email@example.com"
                          className="border-border focus:border-accent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Phone
                        </label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="border-border focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Subject
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What can we help you with?"
                          className="border-border focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us about your saree needs, special occasions, or any questions you have..."
                          className="min-h-32 border-border focus:border-accent resize-none"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="btn-luxury w-full text-lg py-4"
                        disabled={fetching}
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
                  <h2 className="font-serif-elegant text-3xl font-bold text-primary mb-4">
                    Connect With Us
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
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
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif-elegant text-xl font-semibold text-primary mb-2">
                            {info.title}
                          </h3>
                          <div className="space-y-1 mb-3">
                            {info.details.map((detail, idx) => (
                              <p
                                key={idx}
                                className="font-sans-clean text-muted-foreground"
                              >
                                {detail}
                              </p>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
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

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif-elegant text-3xl md:text-4xl font-bold text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg">
                Quick answers to common questions about our sarees and services.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How do I choose the right saree size?",
                  answer:
                    "Our sarees come in standard 5.5-6 meter lengths. We provide detailed size guides and our experts can help you select the perfect fit based on your height and draping preference.",
                },
                {
                  question: "Do you offer customization services?",
                  answer:
                    "Yes! We offer blouse customization, minor alterations, and can work with you to create bespoke pieces. Contact us to discuss your specific requirements.",
                },
                {
                  question: "What is your return and exchange policy?",
                  answer:
                    "We offer a 7-day return policy for unused sarees with original tags. Exchanges are available within 15 days. Custom pieces are non-returnable but we ensure perfect fit.",
                },
                {
                  question: "How long does shipping take?",
                  answer:
                    "Standard shipping takes 3-5 business days within India. Express shipping (1-2 days) is available for urgent orders. International shipping takes 7-14 business days.",
                },
                {
                  question: "Do you have a bridal consultation service?",
                  answer:
                    "Absolutely! Our bridal specialists offer personalized consultations to help you find the perfect wedding saree. Book an appointment at our showroom for the best experience.",
                },
              ].map((faq, index) => (
                <Card key={index} className="card-luxury p-6">
                  <h3 className="font-serif-elegant text-lg font-semibold text-primary mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
