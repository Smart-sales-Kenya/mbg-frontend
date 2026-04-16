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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: get CSRF token from cookies
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

const Register = () => {
  const [authMode, setAuthMode] = useState<"login" | "register" | "reset">("login");
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker",
  });

  // ---------------- CSRF ----------------
  const fetchCsrfToken = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/get-csrf-token/`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("CSRF token fetch error:", error);
    }
  };

  // ---------------- REGISTER ----------------
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
      await fetchCsrfToken();

      const response = await fetch(`${API_BASE_URL}/accounts/auth/registration/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
        body: JSON.stringify({
          username: authData.username,
          email: authData.email,
          password1: authData.password,
          password2: authData.confirmPassword,
          role: authData.role,
        }),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        toast.error("Server error: Endpoint not found.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data).flat().join(" ") || "Registration failed!";
        toast.error(errorMsg);
        return;
      }

      toast.success("Account created! Check your email for verification.");
      setAuthMode("login");
      setAuthData({ username: "", email: "", password: "", confirmPassword: "", role: "job_seeker" });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authData.email, password: authData.password }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        toast.error("Server error: Check API endpoint.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        // Try login with username if email fails
        if (data.detail && data.detail.includes("credentials")) {
          const retryResponse = await fetch(`${API_BASE_URL}/api/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: authData.email, password: authData.password }),
          });
          const retryData = await retryResponse.json();
          if (!retryResponse.ok) {
            toast.error(retryData.detail || "Login failed! Check credentials.");
            return;
          }
          if (retryData.access) localStorage.setItem("access_token", retryData.access);
          if (retryData.refresh) localStorage.setItem("refresh_token", retryData.refresh);
          await fetchAndRedirect(retryData.access);
          return;
        }
        toast.error(data.detail || "Login failed! Check credentials.");
        return;
      }

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      await fetchAndRedirect(data.access);

    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH USER & REDIRECT ----------------
  const fetchAndRedirect = async (accessToken: string) => {
    try {
      const userResponse = await fetch(`${API_BASE_URL}/api/accounts/get-current-user/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      });

      if (!userResponse.ok) throw new Error("Failed to fetch user data");

      const userData = await userResponse.json();
      localStorage.setItem("user_data", JSON.stringify(userData));

      const isAdmin = userData.is_staff || userData.is_superuser || userData.role === "admin";
      window.location.href = isAdmin ? "/admin/dashboard" : "/recruitment/form";

    } catch (error) {
      console.error("User fetch error:", error);
      window.location.href = "/recruitment/form";
    }
  };

  // ---------------- PASSWORD RESET ----------------
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
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") || "" },
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

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="bg-black text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Create your account, log in, or reset your password — your journey begins here.
          </p>
        </div>
      </section>

      {/* Auth Card */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card className="shadow-lg border border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-semibold">
                  {authMode === "login" ? "Login" : authMode === "register" ? "Create Account" : "Reset Password"}
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  {authMode === "login"
                    ? "Enter your email and password"
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

                  {/* Login */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={authData.email}
                        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      />
                      <Label>Password</Label>
                      <Input
                        type="password"
                        required
                        placeholder="Enter your password"
                        value={authData.password}
                        onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                      />
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register */}
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <Label>Username</Label>
                      <Input
                        type="text"
                        required
                        placeholder="JohnDoe"
                        value={authData.username}
                        onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
                      />
                      <Label>Email</Label>
                      <Input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={authData.email}
                        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      />
                      <Label>Account Type</Label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={authData.role}
                        onChange={(e) => setAuthData({ ...authData, role: e.target.value })}
                      >
                        <option value="job_seeker">Job Seeker</option>
                      </select>
                      <Label>Password</Label>
                      <Input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Minimum 6 characters"
                        value={authData.password}
                        onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                      />
                      <Label>Confirm Password</Label>
                      <Input
                        type="password"
                        required
                        minLength={6}
                        placeholder="Re-enter password"
                        value={authData.confirmPassword}
                        onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })}
                      />
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Registering..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Reset */}
                  <TabsContent value="reset">
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={authData.email}
                        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      />
                      <Button type="submit" className="w-full" disabled={loading}>
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
