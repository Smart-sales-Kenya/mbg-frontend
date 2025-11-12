"use client";

import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

interface PasswordResetConfirmProps {
  params: {
    uid: string;
    token: string;
  };
}

const PasswordResetConfirm = ({ params }: PasswordResetConfirmProps) => {
  const { uid, token } = params;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/auth/password/reset/confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
        body: JSON.stringify({
          uid,
          token,
          new_password1: password,
          new_password2: confirmPassword,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = Object.values(data).flat().join(" ") || "Reset failed!";
        toast.error(errorMsg);
        return;
      }

      toast.success("Password has been reset successfully!");
      // No router push; you can show a message or link back to login
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card className="shadow-lg border border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-semibold">Reset Your Password</CardTitle>
              </CardHeader>

              <CardContent className="max-w-md mx-auto">
                <form onSubmit={handleResetConfirm} className="space-y-4">
                  <div>
                    <Label htmlFor="password">New Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password *</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PasswordResetConfirm;
