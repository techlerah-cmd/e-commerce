import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider
    clientId={
      "994004763673-v7tr50ntojtgo1h7ltv1jfpt0uhtsqj0.apps.googleusercontent.com"
    }
  >
    <App />
  </GoogleOAuthProvider>
);
