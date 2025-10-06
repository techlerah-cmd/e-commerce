import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InternalServerError = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error("500 Error: Internal server error");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">500</h1>
        <p className="mb-4 text-xl text-gray-600">Internal Server Error</p>
        <p className="mb-4 text-gray-500">
          Something went wrong on our end. Please try again later.
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 underline hover:text-blue-700"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default InternalServerError;
