import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleLogin } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";

import { useAuth } from "@/contexts/AuthContext";
import { useAPICall } from "@/hooks/useApiCall";
import toast from "react-hot-toast";
import { API_ENDPOINT } from "@/config/backend";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { makeApiCall, fetching, fetchType } = useAPICall();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await makeApiCall(
      "POST",
      API_ENDPOINT.LOGIN,
      formData,
      "application/json",
      null,
      "login"
    );
    if (response.status == 200) {
      login(response.data.user, response.data.token);
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } else {
      toast.error("Login failed! Please check your credentials.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Please enter your email to reset password.");
      return;
    }
    const response = await makeApiCall(
      "post",
      API_ENDPOINT.FORGOT_PASSWORD,
      {
        email: formData.email,
      },
      "application/json",
      null,
      "forgotPassword"
    );
    if (response.status == 200) {
      toast.success("Reset link has been sent to your email");
    } else {
      toast.error("User with this email not exist");
    }
  };
  const handleGoogleLogin = async (credentialResponse) => {
    const { credential } = credentialResponse;
    const response = await makeApiCall(
      "POST",
      API_ENDPOINT.GOOGLE_LOGIN,
      { token: credential },
      "application/json",
      null,
      "login"
    );
    if (response.status == 200) {
      login(response.data.user, response.data.token);
      toast.success("Login successful!");
      navigate("/", { replace: true });
    } else {
      toast.error("Login failed! Please check your credentials.");
    }
  };
  return (
    <>
      <Header />
      <div className="container px-4 max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <span></span>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline flex items-center cursor-pointer"
                  disabled={fetching}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                  {fetching && fetchType == "forgotPassword" && (
                    <div className="pl-2 flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  )}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={fetching}
                loading={fetching && fetchType == "login"}
              >
                Login
              </Button>
              <div className="w-full sm:w-auto">
                <div className="w-full">
                  {" "}
                  {/* container forces the width */}
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log("Login Failed")}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    /* remove width prop or use a px number: width={320} */
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
