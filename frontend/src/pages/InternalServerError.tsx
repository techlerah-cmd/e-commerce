import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InternalServerError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error("500 Error: Internal server error");
  }, []);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center p-8 rounded-xl shadow-card bg-[hsl(var(--card))]">
          <h1 className="mb-4 pb-3 text-6xl font-serif-elegant text-gradient-purple ">
            500
          </h1>
          <p className="mb-2 text-2xl font-sans-clean text-[hsl(var(--foreground))]">
            Internal Server Error
          </p>
          <p className="mb-6 text-[hsl(var(--muted-foreground))]">
            Something went wrong on our end. Please try again later.
          </p>
          <button onClick={() => navigate("/")} className="btn-luxury text-lg">
            Return to Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InternalServerError;
