import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The quality and craftsmanship of my saree from Lerah exceeded all my expectations. It's truly a work of art that I'll treasure forever.",
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5652-scaled.jpeg?fit=100%2C100&ssl=1"
  },
  {
    id: 2,
    name: "Ananya Patel",
    location: "Delhi",
    rating: 5,
    text: "Wearing a Lerah saree makes me feel connected to my heritage while embracing modern elegance. The attention to detail is remarkable.",
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5693-scaled.jpeg?fit=100%2C100&ssl=1"
  },
  {
    id: 3,
    name: "Kavitha Reddy",
    location: "Bangalore",
    rating: 5,
    text: "From the moment I opened the package, I knew this was something special. The fabric, the embroidery, everything is perfect.",
    image: "https://i0.wp.com/siahbyahadishika.com/wp-content/uploads/2025/07/MATH5686-scaled.jpeg?fit=100%2C100&ssl=1"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif-elegant text-4xl md:text-5xl font-bold text-primary mb-4">
            What Our <span className="text-gradient-gold">Customers</span> Say
          </h2>
          <p className="font-sans-clean text-lg text-muted-foreground max-w-2xl mx-auto">
            Stories of elegance, tradition, and the joy of wearing authentic craftsmanship
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card-luxury p-6 text-center">
              {/* Rating Stars */}
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <Star key={index} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="font-sans-clean text-muted-foreground italic mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <div className="font-serif-elegant font-semibold text-primary">
                    {testimonial.name}
                  </div>
                  <div className="font-sans-clean text-sm text-muted-foreground">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-serif-elegant text-2xl font-bold text-gradient-purple mb-2">4.9/5</div>
            <div className="font-sans-clean text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div>
            <div className="font-serif-elegant text-2xl font-bold text-gradient-purple mb-2">1000+</div>
            <div className="font-sans-clean text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div>
            <div className="font-serif-elegant text-2xl font-bold text-gradient-purple mb-2">100%</div>
            <div className="font-sans-clean text-sm text-muted-foreground">Authentic Products</div>
          </div>
          <div>
            <div className="font-serif-elegant text-2xl font-bold text-gradient-purple mb-2">24/7</div>
            <div className="font-sans-clean text-sm text-muted-foreground">Customer Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;