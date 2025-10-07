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
      // Double-check status before making API call
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

        // Don't process response if cancelled
        if (isCancelled) return;

        if (response.status === 200) {
          setVerificationStatus("success");
          setOrderId(response.data.order_id || "");
          toast.success("Payment verified successfully!");
          // Stop polling - payment verified
          return;
        } else if (response.status === 404) {
          setVerificationStatus("failed");
          toast.error("Payment verification failed");
          // Stop polling - payment failed
          return;
        } else {
          // Continue polling for other status codes
          setAttemptCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Verification error:", error);
        if (!isCancelled) {
          setAttemptCount((prev) => prev + 1);
        }
      }

      // Schedule next poll only if not cancelled and still in verifying state
      if (!isCancelled) {
        timeoutId = setTimeout(pollPayment, 10000);
      }
    };

    // Start first poll
    pollPayment();

    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [transactionId]);

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

  // Verifying State
  if (verificationStatus === "verifying") {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
          <Card className="max-w-md w-full border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                {/* Animated Loader */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Clock className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Status Text */}
                <div>
                  <h2 className="text-2xl font-serif-elegant text-primary mb-2">
                    Verifying Payment
                  </h2>
                  <p className="text-muted-foreground">
                    Please wait while we confirm your payment...
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">
                      Time Remaining
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-purple-600 font-mono">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(timeRemaining / 180) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-xs text-muted-foreground mb-1">
                    Transaction ID
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono text-primary break-all">
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
                <p className="text-xs text-muted-foreground">
                  Verification attempt: {attemptCount + 1}
                </p>

                {/* Info Message */}
                <div className="flex items-start gap-2 text-left bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-900">
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
        <main className="min-h-screen bg-secondary flex items-center justify-center px-4 py-12">
          <Card className="max-w-md w-full border-green-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-green-100 rounded-full p-4">
                      <CheckCircle2 className="h-16 w-16 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <div>
                  <h2 className="text-2xl font-serif-elegant text-primary mb-2">
                    Thank You for Your Order!
                  </h2>
                  <p className="text-muted-foreground">
                    Your payment has been confirmed successfully.
                  </p>
                </div>

                {/* Order Details */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="space-y-2 text-sm">
                    {orderId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID:</span>
                        <span className="font-semibold text-primary">
                          #{orderId}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Transaction ID:
                      </span>
                      <span className="font-mono text-xs text-primary">
                        {transactionId.substring(0, 20)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Success Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-left">
                  <p className="text-sm text-blue-900">
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
                    className="w-full"
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
      <main className="min-h-screen bg-secondary flex items-center justify-center px-4 pb-12">
        <Card className="max-w-md w-full border-red-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              {/* Error Icon */}
              <div className="flex justify-center">
                <div className="bg-red-100 rounded-full p-4">
                  <XCircle className="h-16 w-16 text-red-600" />
                </div>
              </div>

              {/* Error Message */}
              <div>
                <h2 className="text-2xl font-serif-elegant text-primary mb-2">
                  {verificationStatus === "timeout"
                    ? "Verification Timeout"
                    : "Payment Verification Failed"}
                </h2>
                <p className="text-muted-foreground">
                  {verificationStatus === "timeout"
                    ? "We couldn't verify your payment within the time limit."
                    : "We couldn't verify your payment at this moment."}
                </p>
              </div>

              {/* Transaction Info */}
              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="text-xs text-muted-foreground mb-2">
                  Transaction ID
                </p>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <code className="text-sm font-mono text-primary break-all">
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
                <p className="text-xs text-muted-foreground">
                  Please save this Transaction ID for reference
                </p>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-900">
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
                  className="w-full"
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
              <div className="text-xs text-muted-foreground">
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
