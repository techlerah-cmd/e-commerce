import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="flex  items-center justify-center bg-[hsl(var(--background))]">
        <div className="text-center p-8 max-w-lg rounded-xl bg-[hsl(var(--card))] shadow-card">
          <h1 className="mb-4 text-6xl font-serif-elegant text-gradient-purple pb-3 ">
            404
          </h1>

          <p className="mb-2 text-2xl font-sans-clean text-[hsl(var(--foreground))]">
            Oops! Page not found
          </p>

          <p className="mb-6 text-[hsl(var(--muted-foreground))]">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="btn-luxury px-6 py-3"
              aria-label="Return to home"
            >
              Return to Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="btn-outline-luxury px-4 py-3"
              aria-label="Go back"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
