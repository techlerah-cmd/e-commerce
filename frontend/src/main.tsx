import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider
    clientId={
      "788948193473-c1hbm6gpv4nvhkk1i1il6ca3q2aa0tqi.apps.googleusercontent.com"
    }
  >
    <App />
  </GoogleOAuthProvider>
);
