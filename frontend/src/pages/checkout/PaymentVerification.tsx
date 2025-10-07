/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  AlertCircle,
  Copy,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const PaymentVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { makeApiCall } = useAPICall();
  const { authToken } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "failed" | "timeout"
  >("verifying");
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [transactionId, setTransactionId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [attemptCount, setAttemptCount] = useState(0);

  // Get transaction ID from location state
  useEffect(() => {
    const state = location.state as { transaction_id?: string };

    if (!state || !state.transaction_id) {
      toast.error("No transaction found");
      navigate("/cart");
      return;
    }

    setTransactionId(state.transaction_id);
  }, [location.state, navigate]);

  // Polling function
  useEffect(() => {
    if (!transactionId || verificationStatus !== "verifying") return;

    let isCancelled = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const pollPayment = async () => {
      if (isCancelled) return;

      try {
        const response = await makeApiCall(
          "GET",
          API_ENDPOINT.VERIFY_RAZORPAY_PAYMENT(transactionId),
          {},
          "application/json",
          authToken,
          "verifyPayment"
        );

        if (isCancelled) return;

        if (response.status === 200) {
          setVerificationStatus("success");
          setOrderId(response.data.order_id || "");
          toast.success("Payment verified successfully!");
          return;
        } else if (response.status === 404) {
          setVerificationStatus("failed");
          toast.error("Payment verification failed");
          return;
        } else {
          setAttemptCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Verification error:", error);
        if (!isCancelled) setAttemptCount((prev) => prev + 1);
      }

      if (!isCancelled) {
        timeoutId = setTimeout(pollPayment, 10000);
      }
    };

    pollPayment();

    return () => {
      isCancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [transactionId, verificationStatus, makeApiCall, authToken]);

  // Countdown timer
  useEffect(() => {
    if (verificationStatus !== "verifying") return;

    const timerId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setVerificationStatus("timeout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [verificationStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const copyTransactionId = () => {
    navigator.clipboard.writeText(transactionId);
    toast.success("Transaction ID copied to clipboard");
  };

  // Styles use your design system variables:
  // page bg: --background, card: --card, foreground: --foreground, primary: --primary, accent: --accent
  // Buttons: .btn-luxury, .btn-outline-luxury

  // Verifying State
  if (verificationStatus === "verifying") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex items-center justify-center px-4 py-12">
          <Card className="max-w-md w-full bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-card">
            <CardContent className="pt-6 p-6">
              <div className="text-center space-y-6">
                {/* Animated Loader */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 text-[hsl(var(--primary))] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-[hsl(var(--primary))]/80" />
                    </div>
                  </div>
                </div>

                {/* Status Text */}
                <div>
                  <h2 className="text-2xl font-serif-elegant text-[hsl(var(--primary))] mb-2">
                    Verifying Payment
                  </h2>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Please wait while we confirm your payment...
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="bg-[hsl(var(--muted))]/30 rounded-lg p-4 border border-[hsl(var(--border))]">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-[hsl(var(--primary))]" />
                    <span className="text-sm font-medium text-[hsl(var(--primary))]">
                      Time Remaining
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-[hsl(var(--primary))] font-mono">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-[hsl(var(--border))] rounded-full h-2">
                      <div
                        className="bg-[hsl(var(--primary))] h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(timeRemaining / 180) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="bg-[hsl(var(--muted))]/20 rounded-lg p-4 text-left border border-[hsl(var(--border))]">
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">
                    Transaction ID
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono text-[hsl(var(--foreground))] break-all">
                      {transactionId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyTransactionId}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Attempt Counter */}
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Verification attempt: {attemptCount + 1}
                </p>

                {/* Info Message */}
                <div className="flex items-start gap-2 text-left bg-[hsl(var(--primary))]/10 p-3 rounded-lg border border-[hsl(var(--primary))]/20">
                  <AlertCircle className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <p className="text-xs text-[hsl(var(--primary))]">
                    We're checking with the payment gateway. This usually takes
                    a few seconds. Please don't close this page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  // Success State
  if (verificationStatus === "success") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex items-center justify-center px-4 py-12">
          <Card className="max-w-md w-full bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-luxury">
            <CardContent className="pt-6 p-6">
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full animate-pulse opacity-30"
                      style={{ background: "hsla(44 95% 48% / 0.12)" }}
                    />
                    <div className="relative bg-[hsl(var(--muted))]/30 rounded-full p-4">
                      <CheckCircle2 className="h-16 w-16 text-[hsl(var(--accent))]" />
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <div>
                  <h2 className="text-2xl font-serif-elegant text-[hsl(var(--primary))] mb-2">
                    Thank You for Your Order!
                  </h2>
                  <p className="text-[hsl(var(--muted-foreground))]">
                    Your payment has been confirmed successfully.
                  </p>
                </div>

                {/* Order Details */}
                <div className="bg-[hsl(var(--muted))]/20 rounded-lg p-4 border border-[hsl(var(--border))]">
                  <div className="space-y-2 text-sm">
                    {orderId && (
                      <div className="flex justify-between">
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Order ID:
                        </span>
                        <span className="font-semibold text-[hsl(var(--primary))]">
                          #{orderId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[hsl(var(--muted-foreground))]">
                        Transaction ID:
                      </span>
                      <span className="font-mono text-xs text-[hsl(var(--foreground))]">
                        {transactionId.substring(0, 20)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Success Info */}
                <div className="bg-[hsl(var(--primary))]/8 rounded-lg p-4 border border-[hsl(var(--primary))]/20 text-muted-foreground">
                  <p className="text-sm text-muted-foreground">
                    📦 You can track your order from the Orders page.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full btn-luxury"
                    onClick={() => navigate("/my-orders")}
                  >
                    View My Orders
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full btn-outline-luxury"
                    onClick={() => navigate("/collections")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  // Failed or Timeout State
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex items-center justify-center px-4 pb-12">
        <Card className="max-w-md w-full bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-card">
          <CardContent className="pt-6 p-6">
            <div className="text-center space-y-6">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="bg-[hsl(var(--destructive))]/10 rounded-full p-4">
                  <XCircle className="h-16 w-16 text-[hsl(var(--destructive))]" />
                </div>
              </div>

              {/* Error Message */}
              <div>
                <h2 className="text-2xl font-serif-elegant text-[hsl(var(--primary))] mb-2">
                  {verificationStatus === "timeout"
                    ? "Verification Timeout"
                    : "Payment Verification Failed"}
                </h2>
                <p className="text-[hsl(var(--muted-foreground))]">
                  {verificationStatus === "timeout"
                    ? "We couldn't verify your payment within the time limit."
                    : "We couldn't verify your payment at this moment."}
                </p>
              </div>

              {/* Transaction Info */}
              <div className="bg-[hsl(var(--muted))]/20 rounded-lg p-4 text-left border border-[hsl(var(--border))]">
                <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                  Transaction ID
                </p>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <code className="text-sm font-mono text-[hsl(var(--foreground))] break-all">
                    {transactionId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyTransactionId}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Please save this Transaction ID for reference
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-[hsl(var(--accent))]/8 rounded-lg p-4 border border-[hsl(var(--accent))]/20 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-[hsl(var(--accent))] shrink-0 mt-0.5" />
                  <div className="text-sm text-[hsl(var(--foreground))]">
                    <p className="font-semibold mb-1">
                      If your payment was successful:
                    </p>
                    <p>
                      Please contact our support team with the Transaction ID
                      above. We'll verify and process your order manually.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full btn-outline-luxury"
                  onClick={() => navigate("/contact")}
                >
                  Contact Support
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/cart")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Button>
              </div>

              {/* Support Info */}
              <div className="text-xs text-[hsl(var(--muted-foreground))]">
                <p>Need help? Email us at support@lerahsaree.com</p>
                <p>or call +91-XXXXXXXXXX</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
};

export default PaymentVerification;
