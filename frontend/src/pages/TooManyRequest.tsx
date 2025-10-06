import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TooManyRequest = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">429</h1>
        <p className="mb-4 text-xl text-gray-600">Too Many Requests</p>
        <p className="mb-4 text-gray-500">
          You've made too many requests. Please wait a moment before trying
          again.
        </p>
        <p className="mb-4 text-sm text-gray-400">
          Redirecting to home in {countdown} seconds...
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 underline hover:text-blue-700"
        >
          Return to Home Now
        </button>
      </div>
    </div>
  );
};

export default TooManyRequest;
