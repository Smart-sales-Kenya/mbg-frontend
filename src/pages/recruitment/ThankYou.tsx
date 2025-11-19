import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, Mail, Linkedin, Home } from "lucide-react";

const ThankYou = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-20 bg-muted/30 flex-1 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-elegant text-center">
              <CardHeader>
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="text-3xl mb-2">Thank You for Your Submission!</CardTitle>
                <CardDescription className="text-base">
                  Your sales capability profile has been successfully received
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-6 rounded-lg space-y-3 text-left">
                  <h3 className="font-semibold text-lg mb-3">What Happens Next?</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <span className="text-accent font-bold">1.</span>
                      <p className="text-sm text-muted-foreground">
                        Our team will review your profile within 2-3 business days
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-accent font-bold">2.</span>
                      <p className="text-sm text-muted-foreground">
                        We'll match your capabilities with current and upcoming opportunities
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-accent font-bold">3.</span>
                      <p className="text-sm text-muted-foreground">
                        You'll receive an email confirmation and updates on potential matches
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    A confirmation email has been sent to the address you provided. 
                    Please check your inbox (and spam folder) for further details.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Stay Connected</h4>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Join Newsletter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Linkedin className="h-4 w-4" />
                      Follow on LinkedIn
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Link to="/">
                    <Button className="gap-2">
                      <Home className="h-4 w-4" />
                      Return to Homepage
                    </Button>
                  </Link>
                </div>

                <div className="pt-4">
                  <p className="text-xs text-muted-foreground">
                    Questions? Contact us at <a href="mailto:recruitment@mbg.com" className="text-accent hover:underline">recruitment@mbg.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;
