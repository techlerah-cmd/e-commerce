import React, { useEffect, useState } from "react";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { useAPICall } from "@/hooks/useApiCall";
import toast from "react-hot-toast";
import { API_ENDPOINT } from "@/config/backend";
import { Eye, EyeOff } from "lucide-react"; // optional icons — replace if not available

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // at least 8 chars, one letter, one number

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { makeApiCall, fetching, fetchType } = useAPICall();

  // token param (you said "ref" in DB — read ref param; fallback to "token")
  const token = searchParams.get("ref") ?? searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!token) {
      // redirect to login if no token/ref present
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const validate = () => {
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters and include at least one letter and one number."
      );
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // show optimistic toast
    const payload = {
      token: token,
      password: password,
    };

    const res = await makeApiCall(
      "POST",
      API_ENDPOINT.RESET_PASSWORD,
      payload,
      "application/json",
      null,
      "resetPassword"
    );

    if (res.status === 200) {
      toast.success(
        "Password reset successful. Please login with your new password."
      );
      navigate("/login", { replace: true });
    } else {
      toast.error("Token is Invalid or expired.");
    }
  };

  // If navigate already redirected due to missing token, we don't render the form.
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <Header />
      <div className="container px-4 max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Create a new password
            </CardTitle>
            <CardDescription>
              Choose a strong password for your account. This link will expire
              soon.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="password">New password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-70"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Must contain letters and numbers.
                </p>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-70"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 font-medium">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={fetching && fetchType === "resetPassword"}
              >
                {fetching && fetchType === "resetPassword"
                  ? "Resetting..."
                  : "Reset password"}
              </Button>

              {/* Back to login button */}
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResetPasswordPage;