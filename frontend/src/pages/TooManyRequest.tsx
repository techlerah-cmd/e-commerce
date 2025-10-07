import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TooManyRequest = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    console.error("429 Error: Too many requests");

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="flex  min-h-[50%] items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center p-8 rounded-xl shadow-card bg-[hsl(var(--card))]">
          <h1 className="mb-4 pb-5 text-6xl font-serif-elegant text-gradient-purple ">
            429
          </h1>
          <p className="mb-2 text-2xl font-sans-clean text-[hsl(var(--foreground))]">
            Too Many Requests
          </p>
          <p className="mb-4 text-[hsl(var(--muted-foreground))]">
            You've made too many requests. Please wait a moment before trying
            again.
          </p>
          <p className="mb-6 text-sm text-[hsl(var(--muted-foreground))]">
            Redirecting to home in {countdown} seconds...
          </p>
          <button onClick={() => navigate("/")} className="btn-luxury text-sm">
            Return to Home Now
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TooManyRequest;
