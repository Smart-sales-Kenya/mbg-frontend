"use client";

import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: get CSRF token
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

const Register = () => {
  const [authMode, setAuthMode] = useState<"login" | "register" | "reset">("login");
  const [authData, setAuthData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  // --- Register User ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authData.password !== authData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (authData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/auth/registration/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
        body: JSON.stringify({
          username: authData.fullName,
          email: authData.email,
          password1: authData.password,
          password2: authData.confirmPassword,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data).flat().join(" ");
        toast.error(errorMsg);
        return;
      }

      toast.success("Account created successfully!");
      setAuthMode("login");
      setAuthData({ fullName: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Login User ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
        body: JSON.stringify({
          email: authData.email,
          password: authData.password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data).flat().join(" ") || "Login failed!";
        toast.error(errorMsg);
        return;
      }

      toast.success("Logged in successfully!");
      setAuthData({ fullName: "", email: "", password: "", confirmPassword: "" });
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Password Reset ---
  const fetchCsrfToken = async () => {
    await fetch(`${API_BASE_URL}/api/get-csrf-token/`, {
      credentials: "include",
    });
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authData.email) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await fetchCsrfToken();
      const response = await fetch(`${API_BASE_URL}/accounts/auth/password/reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
        body: JSON.stringify({ email: authData.email }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data).flat().join(" ") || "Password reset failed!";
        toast.error(errorMsg);
        return;
      }

      toast.success("Password reset email sent! Check your inbox.");
      setAuthData({ ...authData, email: "" });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Google Sign-In ---
  const handleGoogleSignIn = () => {
    window.location.href = `${API_BASE_URL}/api`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Create your account, log in, or reset your password — your journey begins here.
          </p>
        </div>
      </section>

      {/* Auth Forms */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card className="shadow-lg border border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-semibold">
                  {authMode === "login"
                    ? "Login"
                    : authMode === "register"
                    ? "Create an Account"
                    : "Reset Password"}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {authMode === "login"
                    ? "Enter your credentials to continue"
                    : authMode === "register"
                    ? "Fill in your details to get started"
                    : "Enter your email to receive a reset link"}
                </CardDescription>
              </CardHeader>

              <CardContent className="max-w-md mx-auto">
                <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as any)}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                    <TabsTrigger value="reset">Reset Password</TabsTrigger>
                  </TabsList>

                  {/* Login Form */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email Address *</Label>
                        <Input
                          id="login-email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={authData.email}
                          onChange={(e) =>
                            setAuthData({ ...authData, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="login-password">Password *</Label>
                        <Input
                          id="login-password"
                          type="password"
                          required
                          placeholder="Enter your password"
                          value={authData.password}
                          onChange={(e) =>
                            setAuthData({ ...authData, password: e.target.value })
                          }
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                      <div className="text-center mt-2 text-sm">
                        <button
                          type="button"
                          className="underline text-primary"
                          onClick={() => setAuthMode("reset")}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={handleGoogleSignIn}
                      >
                        Continue with Google
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="register-name">Username *</Label>
                        <Input
                          id="register-name"
                          type="text"
                          required
                          placeholder="eg. JohnDoe"
                          value={authData.fullName}
                          onChange={(e) =>
                            setAuthData({ ...authData, fullName: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-email">Email Address *</Label>
                        <Input
                          id="register-email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={authData.email}
                          onChange={(e) =>
                            setAuthData({ ...authData, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-password">Password *</Label>
                        <Input
                          id="register-password"
                          type="password"
                          required
                          minLength={6}
                          placeholder="Minimum 6 characters"
                          value={authData.password}
                          onChange={(e) =>
                            setAuthData({ ...authData, password: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm Password *</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          required
                          minLength={6}
                          placeholder="Re-enter your password"
                          value={authData.confirmPassword}
                          onChange={(e) =>
                            setAuthData({
                              ...authData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button type="submit" className="bg-black w-full" size="lg" disabled={loading}>
                        {loading ? "Registering..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Password Reset Form */}
                  <TabsContent value="reset">
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div>
                        <Label htmlFor="reset-email">Email Address *</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={authData.email}
                          onChange={(e) =>
                            setAuthData({ ...authData, email: e.target.value })
                          }
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;
