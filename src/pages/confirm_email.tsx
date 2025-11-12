"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ConfirmEmailPageProps {
  params: { key: string };
}

const ConfirmEmailPage = ({ params }: ConfirmEmailPageProps) => {
  const { key } = params;
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/accounts/confirm-email/${key}/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    confirmEmail();
  }, [key]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="py-20 bg-background flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card className="shadow-lg border border-border/50 text-center">
              <CardHeader>
                <CardTitle>Email Confirmation</CardTitle>
              </CardHeader>
              <CardContent>
                {status === "loading" && <p>Confirming your email, please wait...</p>}

                {status === "success" && (
                  <>
                    <CardDescription className="mb-4">
                      Thank you! Your email has been successfully confirmed. You can now log in.
                    </CardDescription>
                    <Button
                      onClick={() => (window.location.href = "/auth")}
                      className="w-full"
                    >
                      Go to Login
                    </Button>
                  </>
                )}

                {status === "error" && (
                  <>
                    <CardDescription className="mb-4 text-red-600">
                      This confirmation link is invalid or has already been used.
                    </CardDescription>
                    <Button
                      onClick={() => (window.location.href = "/auth")}
                      className="w-full"
                      variant="outline"
                    >
                      Go to Login
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ConfirmEmailPage;
