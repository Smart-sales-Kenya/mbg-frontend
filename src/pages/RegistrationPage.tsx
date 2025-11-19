import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Event } from "@/types/events";
import { ArrowRight, CheckCircle, Loader2, Home, Calendar } from "lucide-react";

interface RegistrationForm {
  full_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  industry: string;
  experience_level: string;
  goals: string;
  heard_about: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EventRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const event: Event | undefined = location.state?.event;

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [registered, setRegistered] = useState<boolean>(false);
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegistrationForm>({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    industry: "",
    experience_level: "beginner",
    goals: "",
    heard_about: "other",
  });

  // Check for payment callback parameters on component mount
  useEffect(() => {
    const orderTrackingId = searchParams.get('OrderTrackingId');
    
    if (orderTrackingId) {
      console.log("🔄 Payment callback detected, redirecting to backend handler");
      
      // // Let the backend handle the payment verification and redirect
      // const callbackUrl = `${API_BASE_URL}/api/payments/pesapal-callback/?OrderTrackingId=${orderTrackingId}`;
      // window.location.href = callbackUrl;
    }
  }, [searchParams]);

  useEffect(() => {
    if (!event) {
      toast.error("Event data is missing. Please select an event first.");
      navigate("/events");
      return;
    }
    setLoading(false);
  }, [event, navigate]);

  // Poll for payment status if we have a registration but payment isn't completed
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (registered && registrationId && !paymentCompleted && !event?.is_free) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/payments/status/${registrationId}/`);
          if (response.ok) {
            const statusData = await response.json();
            console.log("🔄 Payment status check:", statusData);
            
            if (statusData.payment_status === 'completed') {
              setPaymentCompleted(true);
              toast.success("Payment completed successfully!");
              clearInterval(interval);
              
              // Clear any pending registration from storage
              sessionStorage.removeItem('pendingRegistration');
              
              // Redirect to homepage after 3 seconds
              setTimeout(() => {
                navigate("/");
              }, 3000);
            } else if (statusData.payment_status === 'failed') {
              toast.error("Payment failed. Please try again.");
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error("Error checking payment status:", error);
        }
      }, 5000);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [registered, registrationId, paymentCompleted, event?.is_free, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof RegistrationForm) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const initiatePayment = async (registrationId: string) => {
    try {
      setProcessingPayment(true);
      
      const response = await fetch(`${API_BASE_URL}/api/payments/initiate/${registrationId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = "Payment initiation failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const paymentData = await response.json();
      
      if (paymentData.payment_url) {
        // Store registration ID in session storage for checking when user returns
        sessionStorage.setItem('pendingRegistration', registrationId);
        
        console.log("🔗 Redirecting to PesaPal:", paymentData.payment_url);
        
        // Redirect to PesaPal payment page
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error("No payment URL received");
      }
      
    } catch (err) {
      console.error("Payment initiation error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to initiate payment. Please try again.");
      setProcessingPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    // Validate required fields
    if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.company.trim() || !formData.job_title.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const requestBody = {
        event: event.id,
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        job_title: formData.job_title.trim(),
        industry: formData.industry.trim() || "",
        experience_level: formData.experience_level,
        goals: formData.goals.trim() || "",
        heard_about: formData.heard_about,
      };

      console.log("Sending registration request:", requestBody);

      const response = await fetch(`${API_BASE_URL}/api/events/${event.id}/registrations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = "Registration failed";
        try {
          const errorData = await response.json();
          console.error("Backend validation errors:", errorData);
          errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
        } catch {
          try {
            const errorText = await response.text();
            errorMessage = errorText || `HTTP error! status: ${response.status}`;
          } catch {
            errorMessage = `HTTP error! status: ${response.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Registration successful:", result);
      
      setRegistrationId(result.id);
      setRegistered(true);
      
      toast.success("Registration successful!");

      // Automatically initiate payment for paid events
      if (!event.is_free && result.id) {
        await initiatePayment(result.id);
      }
      
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualPayment = async () => {
    if (!registrationId) {
      toast.error("Registration ID not found.");
      return;
    }
    await initiatePayment(registrationId);
  };

  const navigateToEvents = () => {
    navigate("/events");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  // Check for pending registration when component mounts
  useEffect(() => {
    const pendingRegistration = sessionStorage.getItem('pendingRegistration');
    if (pendingRegistration && !registrationId) {
      setRegistrationId(pendingRegistration);
      setRegistered(true);
      setProcessingPayment(true);
      console.log("🔄 Found pending registration:", pendingRegistration);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-xl font-semibold">Loading Event Details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="container mx-auto px-4 py-20 max-w-2xl text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The event information is missing. Please go back and try again.
          </p>
          <Button onClick={() => navigate("/events")}>
            Back to Events
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (registered) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-2xl w-full text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            {paymentCompleted ? (
              <>
                <h1 className="text-3xl font-bold">Payment Completed!</h1>
                <p className="text-muted-foreground text-lg">
                  Thank you for registering and completing payment for <strong>{event.title}</strong>
                </p>
                
                <div className="bg-green-50 p-6 rounded-lg space-y-3">
                  <div className="flex items-center justify-center gap-2 text-green-700">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Redirecting you to homepage...</span>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={navigateToHome} className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Go to Home Now
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold">Registration Confirmed!</h1>
                <p className="text-muted-foreground text-lg">
                  Thank you for registering for <strong>{event.title}</strong>
                </p>

                <div className="bg-muted p-6 rounded-lg space-y-4 max-w-md mx-auto">
                  <h3 className="font-semibold text-lg">Event Details</h3>
                  <div className="text-left space-y-2">
                    <p className="text-sm"><strong>Event:</strong> {event.title}</p>
                    <p className="text-sm"><strong>Date:</strong> {event.start_date}</p>
                    <p className="text-sm"><strong>Location:</strong> {event.location}</p>
                    <p className="text-sm">
                      <strong>Investment:</strong>{" "}
                      {event.is_free ? (
                        <span className="text-green-600 font-bold">Free</span>
                      ) : (
                        <span className="text-accent font-bold">{event.currency} {event.investment_amount}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 justify-center pt-4 flex-wrap">
                  {event.is_free ? (
                    <>
                      <Button variant="outline" onClick={navigateToEvents}>
                        View More Events
                      </Button>
                      <Button onClick={navigateToHome}>
                        Back to Home
                      </Button>
                    </>
                  ) : (
                    <>
                      {processingPayment ? (
                        <div className="space-y-4 w-full">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing payment...</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            If you completed payment, we'll automatically detect it and redirect you to the homepage.
                          </p>
                          <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={handleManualPayment}>
                              Retry Payment
                            </Button>
                            <Button onClick={navigateToHome} variant="secondary">
                              Go to Home
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Button variant="outline" onClick={navigateToEvents}>
                            View More Events
                          </Button>
                          <Button onClick={handleManualPayment} className="flex items-center gap-2">
                            Proceed to Payment <ArrowRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="container mx-auto px-4 py-20 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Register for Event</h1>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h2 className="text-xl text-muted-foreground">{event.title}</h2>
            {event.is_free ? (
              <Badge variant="secondary" className="text-green-600 font-bold">Free Event</Badge>
            ) : (
              <Badge variant="secondary" className="text-accent font-bold">
                {event.currency} {event.investment_amount}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Event Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Event Details</h3>
            <p className="text-sm">{event.title}</p>
            <p className="text-sm text-muted-foreground">
              {event.start_date} • {event.location}
            </p>
            <p className="text-sm font-semibold mt-2">
              {event.is_free ? "Free Event" : `Investment: ${event.currency} ${event.investment_amount}`}
            </p>
            {!event.is_free && (
              <p className="text-xs text-muted-foreground mt-2">
                You will be redirected to PesaPal to complete payment after registration
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000 000"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Professional Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Company Name"
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job_title">Job Title *</Label>
                  <Input
                    id="job_title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    placeholder="Job Title"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Industry"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select
                  value={formData.experience_level}
                  onValueChange={handleSelectChange("experience_level")}
                  disabled={submitting}
                >
                  <SelectTrigger id="experience_level">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (Less than 1 year)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="goals">Goals & Expectations</Label>
                <Textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Share your goals and what you hope to learn from this event..."
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heard_about">How did you hear about us?</Label>
                <Select
                  value={formData.heard_about}
                  onValueChange={handleSelectChange("heard_about")}
                  disabled={submitting}
                >
                  <SelectTrigger id="heard_about">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="email">Email Newsletter</SelectItem>
                    <SelectItem value="friend">Friend/Colleague</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                className="flex-1"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventRegistrationPage;