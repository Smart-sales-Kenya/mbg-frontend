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
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "job_seeker",
  });
  const [loading, setLoading] = useState(false);

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/get-csrf-token/`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("CSRF token fetch error:", error);
    }
  };

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

      // Check if response is HTML (404 page) instead of JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        toast.error("Server error: Endpoint not found. Check URL configuration.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle different types of errors
        if (data.username) {
          toast.error(`Username error: ${data.username.join(' ')}`);
        } else if (data.email) {
          toast.error(`Email error: ${data.email.join(' ')}`);
        } else if (data.password1) {
          toast.error(`Password error: ${data.password1.join(' ')}`);
        } else if (data.non_field_errors) {
          toast.error(data.non_field_errors.join(' '));
        } else {
          const errorMsg = Object.values(data).flat().join(" ") || "Registration failed!";
          toast.error(errorMsg);
        }
        return;
      }

      toast.success("Account created successfully! Please check your email for verification.");
      setAuthMode("login");
      setAuthData({ username: "", email: "", password: "", confirmPassword: "", role: "job_seeker" });
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Login User (Using JWT Token Endpoint) ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: authData.email,
          password: authData.password,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        toast.error("Server error: Check API endpoint configuration.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        // If email fails, try with username
        if (data.detail && data.detail.includes("credentials")) {
          const retryResponse = await fetch(`${API_BASE_URL}/api/token/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: authData.email,
              password: authData.password,
            }),
          });

          const retryData = await retryResponse.json();

          if (!retryResponse.ok) {
            toast.error(retryData.detail || "Login failed! Check your credentials.");
            return;
          }

          // Success with username fallback
          if (retryData.access) {
            localStorage.setItem('access_token', retryData.access);
            
            // Fetch and store user data immediately
            await fetchAndStoreUserData(retryData.access);
          }
          if (retryData.refresh) {
            localStorage.setItem('refresh_token', retryData.refresh);
          }

          toast.success("Logged in successfully!");
          setAuthData({ username: "", email: "", password: "", confirmPassword: "", role: "job_seeker" });
          return;
        }
        
        toast.error(data.detail || "Login failed! Check your credentials. Or Verify your email.");
        return;
      }

      // Success with email login
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        
        // Fetch and store user data immediately
        await fetchAndStoreUserData(data.access);
      }
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }

      toast.success("Logged in successfully!");
      setAuthData({ username: "", email: "", password: "", confirmPassword: "", role: "job_seeker" });
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 const fetchAndStoreUserData = async (accessToken: string) => {
  try {
    // Fetch user profile to get role - USE THE CORRECT ENDPOINT
    const userResponse = await fetch(`${API_BASE_URL}/api/get-current-user/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      
      // DEBUG: Log user data to see what's being returned
      console.log('User data from backend:', userData);
      
      // Store user data in localStorage
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Enhanced admin check - check both is_staff and role
      const isAdmin = userData.is_staff || userData.is_superuser || userData.role === 'admin';
      
      console.log('Admin check result:', {
        is_staff: userData.is_staff,
        is_superuser: userData.is_superuser,
        role: userData.role,
        final_isAdmin: isAdmin
      });

      // Redirect based on role
      setTimeout(() => {
        if (isAdmin) {
          window.location.href = "/admin/dashboard";
        } else {
          window.location.href = "/recruitment/form";
        }
      }, 1000);
    } else {
      console.error('Failed to fetch user data:', await userResponse.text());
      // Fallback: redirect to form if user info can't be fetched
      setTimeout(() => {
        window.location.href = "/recruitment/form";
      }, 1000);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Fallback: redirect to form
    setTimeout(() => {
      window.location.href = "/recruitment/form";
    }, 1000);
  }
};
  // --- Password Reset ---
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

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        toast.error("Server error: Endpoint not found. Check URL configuration.");
        return;
      }

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
                    ? "Enter your email and password to continue"
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

                      <Button type="submit" className="bg-black w-full" size="lg" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="register-username">Username *</Label>
                        <Input
                          id="register-username"
                          type="text"
                          required
                          placeholder="eg. JohnDoe"
                          value={authData.username}
                          onChange={(e) =>
                            setAuthData({ ...authData, username: e.target.value })
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
                        <Label htmlFor="user-role">Account Type *</Label>
                        <select
                          id="user-role"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                          value={authData.role}
                          onChange={(e) =>
                            setAuthData({ ...authData, role: e.target.value })
                          }
                        >
                          <option value="job_seeker">Job Seeker</option>
                        </select>
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