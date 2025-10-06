import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import Coupons from "./pages/admin/Coupons";
import Orders from "./pages/admin/Orders";
import CheckoutShipping from "./pages/checkout/CheckoutShipping";
import CheckoutPayment from "./pages/checkout/CheckoutPayment";
import CheckoutReview from "./pages/checkout/CheckoutReview";
import PaymentVerification from "./pages/checkout/PaymentVerification";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useAPICall } from "./hooks/useApiCall";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "./config/backend";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import LoginPage from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import TooManyRequest from "./pages/TooManyRequest";
import InternalServerError from "./pages/InternalServerError";
import Policy from "./pages/Policy";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  console.log("user", user, isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user.is_admin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const UserVerification = ({ children }) => {
  const navigate = useNavigate();
  const { makeApiCall } = useAPICall();
  const [fetching, setFetching] = useState(false);
  const { authToken, login, setIsCheckedUser } = useAuth();
  useEffect(() => {
    const checkUser = async () => {
      if (authToken) {
        const response = await makeApiCall(
          "GET",
          API_ENDPOINT.VERIFY_USER,
          null,
          "application/json",
          authToken
        );
        if (response.status === 200) {
          const user = response.data;
          login(user);
        } else {
          // if (
          //   !(
          //     pathname in
          //     [
          //       "/",
          //       "/login",
          //       "/learning",
          //       "/landing/:type/:id",
          //       "/checkout/:type/:id",
          //     ]
          //   )
          // ) {
          //   navigate("/login");
          // }
        }
      }
      setIsCheckedUser(true);
      setFetching(false);
    };
    checkUser();
  }, []);
  // if (fetching) {
  //   return <LoadingScreen />;
  // }
  return <>{children}</>;
};

const AppRouters = () => {
  const { isCheckedUser } = useAuth();
  const { pathname } = useLocation();
  if (
    !isCheckedUser &&
    (pathname.includes("admin") || pathname.includes("checkout"))
  ) {
    return (
      <div className="py-4">
        <LoadingScreen />;
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/collections" element={<Collections />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/too-many-requests" element={<TooManyRequest />} />
      <Route path="/internal-server-error" element={<InternalServerError />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/login" element={<LoginPage />} />
      Checkout routes
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout/payment-verification"
        element={
          <ProtectedRoute>
            <PaymentVerification />
          </ProtectedRoute>
        }
      />
      Admin routes
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminProtectedRoute>
            <AddProduct />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/coupons"
        element={
          <AdminProtectedRoute>
            <Coupons />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminProtectedRoute>
            <Orders />
          </AdminProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <UserVerification>
            <AppRouters />
          </UserVerification>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
