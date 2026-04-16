import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, ArrowRight, Loader2, ArrowLeft, Mail, Phone, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProgramCategory {
  id: number;
  name: string;
  slug: string;
}

interface Program {
  id: string;
  title: string;
  category: ProgramCategory;
  duration: string;
  price: string;
  description: string;
  focus: string;
  outcome: string;
  skills: string;
  format: string;
  badge: string;
  is_custom: boolean; // Added this
  icon_name?: string;
}

interface RegistrationForm {
  full_name: string;
  email: string;
  phone_number: string;
  company_name?: string;
  role?: string;
  team_size?: string;
  challenges?: string;
}

interface RegistrationResponse {
  id: string;
  registration_id: string;
  program_title: string;
  price: string;
  message: string;
  payment_required: boolean;
  next_step: string;
  payment_id?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// CSRF token utility
const getCSRFToken = async (): Promise<string | null> => {
  try {
    console.log("🛡️ Fetching CSRF token...");
    const response = await fetch(`${API_BASE_URL}/api/get-csrf-token/`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ CSRF token received:", data.csrfToken ? "Yes" : "No");
      return data.csrfToken || null;
    } else {
      console.error('❌ CSRF token response not OK:', response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to get CSRF token:', error);
    return null;
  }
};

// Fallback function to extract CSRF token from cookies
const getCSRFFromCookies = (): string | null => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue || null;
};

const RegisterProgram = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const programFromState = location.state?.program as Program | undefined;
  const [program, setProgram] = useState<Program | undefined>(programFromState);
  const [loading, setLoading] = useState(!programFromState);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const [formData, setFormData] = useState<RegistrationForm>({
    full_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    role: "",
    team_size: "",
    challenges: "",
  });

  // Check if program is custom
  const isCustomProgram = program?.is_custom || false;
  const isPaid = !isCustomProgram && program?.price && 
                 !program.price.toLowerCase().includes("free") && 
                 program.price.toLowerCase() !== "custom pricing";

  // Check for payment callback parameters
  useEffect(() => {
    const status = searchParams.get('status');
    const orderTrackingId = searchParams.get('order_tracking_id');
    const paymentId = searchParams.get('payment_id');
    const message = searchParams.get('message');
    
    if (status && orderTrackingId && !isCustomProgram) {
      console.log("🔄 Program Payment callback detected:", { status, orderTrackingId, paymentId, message });
      
      // Handle the payment result
      handlePaymentResult(status, orderTrackingId, paymentId, message);
      
      // Clean up URL parameters
      const cleanParams = new URLSearchParams(searchParams);
      cleanParams.delete('status');
      cleanParams.delete('order_tracking_id');
      cleanParams.delete('payment_id');
      cleanParams.delete('message');
      setSearchParams(cleanParams);
    }
  }, [searchParams, setSearchParams, isCustomProgram]);

  const handlePaymentResult = (status: string, orderTrackingId: string, paymentId: string | null, message: string | null) => {
    console.log("💰 Handling payment result:", { status, orderTrackingId, paymentId, message });
    
    if (status === 'completed') {
      setPaymentCompleted(true);
      toast.success(message || "Payment completed successfully!");
      
      // Clear storage
      sessionStorage.removeItem('pendingProgramPayment');
      sessionStorage.removeItem('pendingProgramRegistration');
      sessionStorage.removeItem('pendingProgramOrderTracking');
      
      // Redirect to payment success page
      setTimeout(() => {
        navigate("/payment-success", { 
          state: { 
            programTitle: program?.title,
            registrationId: registrationId,
            paymentId: paymentId,
            type: 'program'
          }
        });
      }, 2000);
    } else if (status === 'failed') {
      toast.error(message || "Payment failed. Please try again.");
      setProcessingPayment(false);
    } else if (status === 'pending') {
      toast.info(message || "Payment is still processing");
      // Continue polling for status
      if (paymentId) {
        setPaymentId(paymentId);
      }
    } else if (status === 'error') {
      toast.error(message || "An error occurred during payment processing");
      setProcessingPayment(false);
    }
  };

  // Poll for payment status if we have a payment ID but payment isn't completed
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const currentPaymentId = paymentId || sessionStorage.getItem('pendingProgramPayment');
    
    if (registered && currentPaymentId && !paymentCompleted && isPaid && !isCustomProgram) {
      console.log("🔄 Starting payment status polling for:", currentPaymentId);
      
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/program-payments/status/${currentPaymentId}/`);
          if (response.ok) {
            const statusData = await response.json();
            console.log("🔄 Program payment status check:", statusData);
            
            if (statusData.payment_status === 'completed') {
              setPaymentCompleted(true);
              toast.success("Payment completed successfully!");
              clearInterval(interval);
              
              sessionStorage.removeItem('pendingProgramPayment');
              sessionStorage.removeItem('pendingProgramRegistration');
              sessionStorage.removeItem('pendingProgramOrderTracking');
              
              // Redirect to payment success page
              navigate("/program-payment-result", { 
                state: { 
                  programTitle: program?.title,
                  registrationId: registrationId,
                  paymentId: currentPaymentId,
                  type: 'program'
                }
              });
            } else if (statusData.payment_status === 'failed') {
              toast.error("Payment failed. Please try again.");
              clearInterval(interval);
              sessionStorage.removeItem('pendingProgramPayment');
              sessionStorage.removeItem('pendingProgramOrderTracking');
            }
            // For pending status, just continue polling
          }
        } catch (error) {
          console.error("Error checking program payment status:", error);
        }
      }, 5000);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [registered, paymentId, paymentCompleted, isPaid, navigate, program, registrationId, isCustomProgram]);

  // Fetch program details if not in state
  useEffect(() => {
    const fetchProgram = async () => {
      if (!programFromState && id) {
        try {
          console.log("📡 Fetching program details for ID:", id);
          const res = await fetch(`${API_BASE_URL}/api/program/list/`);
          if (!res.ok) {
            throw new Error(`Failed to fetch programs: ${res.status}`);
          }
          const data: Program[] = await res.json();
          const foundProgram = data.find(p => p.id === id);
          if (foundProgram) {
            setProgram(foundProgram);
            console.log("✅ Found program:", foundProgram.title);
          } else {
            console.error("❌ Program not found with ID:", id);
            toast.error("Program not found");
          }
        } catch (err) {
          console.error("Failed to fetch program:", err);
          toast.error("Failed to load program details");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id, programFromState]);

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
      
      console.log("🚀 Initiating program payment for registration:", registrationId);
      
      // Try to get CSRF token from API first
      let csrfToken = await getCSRFToken();
      
      // Fallback to cookie if API fails
      if (!csrfToken) {
        console.log("🔄 Trying to get CSRF token from cookies...");
        csrfToken = getCSRFFromCookies();
      }
      
      if (!csrfToken) {
        console.warn("⚠️ No CSRF token available, proceeding without it");
      } else {
        console.log("✅ Using CSRF token for request");
      }
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/program-payments/initiate/${registrationId}/`, {
        method: "POST",
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage = "Payment initiation failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorData.detail || JSON.stringify(errorData);
        } catch {
          errorMessage = `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const paymentData = await response.json();
      console.log("✅ Program payment initiation response:", paymentData);
      
      if (paymentData.payment_url) {
        if (paymentData.payment_id) {
          sessionStorage.setItem('pendingProgramPayment', paymentData.payment_id);
          setPaymentId(paymentData.payment_id);
        }
        
        if (paymentData.order_tracking_id) {
          sessionStorage.setItem('pendingProgramOrderTracking', paymentData.order_tracking_id);
        }
        
        console.log("🔗 Redirecting to PesaPal for program payment:", paymentData.payment_url);
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error("No payment URL received from server");
      }
      
    } catch (err) {
      console.error("Program payment initiation error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to initiate payment. Please try again.");
      setProcessingPayment(false);
      sessionStorage.removeItem('pendingProgramPayment');
      sessionStorage.removeItem('pendingProgramOrderTracking');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;

    if (!formData.full_name.trim() || !formData.email.trim() || !formData.phone_number.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Additional validation for custom programs
    if (isCustomProgram) {
      if (!formData.company_name?.trim()) {
        toast.error("Company name is required for custom programs.");
        return;
      }
      if (!formData.role?.trim()) {
        toast.error("Your role is required for custom programs.");
        return;
      }
      if (!formData.team_size?.trim()) {
        toast.error("Team size is required for custom programs.");
        return;
      }
      if (!formData.challenges?.trim()) {
        toast.error("Please describe the challenges you want to address.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const requestBody = {
        program: program.id,
        ...formData
      };

      console.log("📤 Sending program registration request:", requestBody);

      // Get CSRF token for registration request
      const csrfToken = await getCSRFToken();
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }
      
      // Use the program ID from URL
      const res = await fetch(`${API_BASE_URL}/api/program/${id}/register/`, {
        method: "POST",
        headers,
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        let errorMessage = "Registration failed";
        try {
          const errorData = await res.json();
          console.error("Backend validation errors:", errorData);
          errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData);
        } catch {
          try {
            const errorText = await res.text();
            errorMessage = errorText || `HTTP error! status: ${res.status}`;
          } catch {
            errorMessage = `HTTP error! status: ${res.status}`;
          }
        }
        throw new Error(errorMessage);
      }

      const result: RegistrationResponse = await res.json();
      console.log("✅ Registration response:", result);
      
      const newRegistrationId = result.registration_id || result.id;
      setRegistrationId(newRegistrationId);
      setRegistered(true);
      
      toast.success("Registration successful!");

      sessionStorage.setItem('pendingProgramRegistration', newRegistrationId);

      // Only initiate payment for non-custom paid programs
      if (isPaid && newRegistrationId && !isCustomProgram) {
        console.log("💰 Auto-initiating payment for registration:", newRegistrationId);
        await initiatePayment(newRegistrationId);
      }
      
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit registration. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualPayment = async () => {
    const currentRegistrationId = registrationId || sessionStorage.getItem('pendingProgramRegistration');
    if (!currentRegistrationId) {
      toast.error("Registration ID not found. Please contact support.");
      return;
    }
    console.log("🔄 Manual payment initiation for registration:", currentRegistrationId);
    await initiatePayment(currentRegistrationId);
  };

  // Check for pending registration when component mounts
  useEffect(() => {
    const pendingRegistration = sessionStorage.getItem('pendingProgramRegistration');
    const pendingPayment = sessionStorage.getItem('pendingProgramPayment');
    const pendingOrderTracking = sessionStorage.getItem('pendingProgramOrderTracking');
    
    if (pendingRegistration) {
      setRegistrationId(pendingRegistration);
      setRegistered(true);
      console.log("🔄 Found pending program registration:", pendingRegistration);
    }
    
    if (pendingPayment) {
      setPaymentId(pendingPayment);
      console.log("🔄 Found pending program payment:", pendingPayment);
    }

    if (pendingOrderTracking) {
      console.log("🔄 Found pending program order tracking:", pendingOrderTracking);
    }
  }, []);

  const handleBackToDetails = () => {
    if (program) {
      navigate(`/programs/${program.id}`, { state: { program } });
    } else {
      navigate("/programs");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xl font-semibold">Loading Program Details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <Card className="max-w-md w-full text-center p-8 shadow-elegant">
            <CardContent className="space-y-6">
              <div className="text-4xl">❓</div>
              <h2 className="text-2xl font-bold">Program Not Found</h2>
              <p className="text-muted-foreground">
                The program you're trying to register for doesn't exist or has been removed.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate("/programs")} className="w-full">
                  Browse All Programs
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (registered) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <Card className="max-w-2xl w-full shadow-elegant">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {isCustomProgram ? "Custom Program Request Received!" : "Registration Confirmed!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                Thank you for {isCustomProgram ? "requesting a custom" : "registering for"}{" "}
                <strong>{program.title}</strong>
              </p>

              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Program Details</h3>
                <div className="text-left space-y-2">
                  <p className="text-sm"><strong>Program:</strong> {program.title}</p>
                  <p className="text-sm"><strong>Duration:</strong> {program.duration}</p>
                  <p className="text-sm">
                    <strong>{isCustomProgram ? "Pricing" : "Investment"}:</strong>{" "}
                    <span className="text-accent font-bold">
                      {isCustomProgram ? "Custom Pricing" : program.price}
                    </span>
                  </p>
                  {registrationId && (
                    <p className="text-sm"><strong>Registration ID:</strong> {registrationId}</p>
                  )}
                  {paymentId && !isCustomProgram && (
                    <p className="text-sm"><strong>Payment ID:</strong> {paymentId}</p>
                  )}
                </div>
              </div>

              {/* Custom Program Success Message */}
              {isCustomProgram && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-blue-800">What happens next?</h4>
                      <div className="text-sm text-blue-700 space-y-2 text-left">
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>You'll receive a confirmation email with your registration details.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Our team will contact you within 1-2 business days to discuss your specific requirements.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>We'll work with you to create a customized program tailored to your organization's needs.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    We're excited to create a tailored solution for you!
                  </p>
                </div>
              )}

              {/* Paid Non-Custom Program Success Message */}
              {!isCustomProgram && isPaid && (
                <div className="space-y-4">
                  {paymentCompleted ? (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-700 font-semibold">
                        ✅ Payment Completed! Redirecting to success page...
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Your registration is pending payment. Complete your payment to secure your spot.
                      </p>
                      
                      {processingPayment && (
                        <div className="flex items-center justify-center gap-2 text-blue-600">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Redirecting to payment...</span>
                        </div>
                      )}
                      
                      <div className="flex gap-4 justify-center pt-4 flex-wrap">
                        <Button variant="outline" onClick={handleBackToDetails}>
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Program
                        </Button>
                        <Button 
                          variant="default" 
                          onClick={handleManualPayment}
                          disabled={processingPayment}
                        >
                          {processingPayment ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Proceed to Payment"
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Free Non-Custom Program Success Message */}
              {!isCustomProgram && !isPaid && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-700">
                      Your registration is complete! You'll receive further details via email.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center pt-4 flex-wrap">
                <Button variant="outline" onClick={handleBackToDetails}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Program
                </Button>
                <Button variant="default" onClick={() => navigate("/programs")}>
                  View More Programs
                </Button>
                {isCustomProgram && (
                  <Button variant="outline" onClick={() => navigate("/contact")}>
                    Contact Us
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header with back button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 -ml-2"
              onClick={handleBackToDetails}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Program Details
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {isCustomProgram ? "Request Custom Program" : "Register for Program"}
              </h1>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <h2 className="text-xl text-muted-foreground">{program.title}</h2>
                <Badge variant="secondary" className="text-accent font-bold">
                  {isCustomProgram ? "Custom Pricing" : program.price}
                </Badge>
                {isCustomProgram && (
                  <Badge variant="outline">Custom Program</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Program Summary */}
          <Card className="shadow-elegant mb-6">
            <CardHeader>
              <CardTitle>Program Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm"><strong>Duration:</strong> {program.duration}</p>
              <p className="text-sm"><strong>Focus:</strong> {program.focus || "Not specified"}</p>
              {isCustomProgram && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700">
                    This is a custom program tailored to your organization's needs. 
                    Pricing and duration will be determined based on your requirements.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>
                {isCustomProgram ? "Custom Program Request Details" : "Registration Details"}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-normal">
                {isCustomProgram 
                  ? "Tell us about your needs so we can create a tailored solution"
                  : `Fill in your details to register for ${program.title}`}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Label htmlFor="email">Email Address *</Label>
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

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number *</Label>
                    <Input 
                      id="phone_number" 
                      name="phone_number" 
                      type="tel" 
                      value={formData.phone_number} 
                      onChange={handleChange} 
                      placeholder="+254 700 000 000" 
                      required 
                      disabled={submitting} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_name">
                      Company Name {isCustomProgram && "*"}
                    </Label>
                    <Input 
                      id="company_name" 
                      name="company_name" 
                      value={formData.company_name} 
                      onChange={handleChange} 
                      placeholder="Your Company Ltd" 
                      disabled={submitting} 
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">
                      Your Role {isCustomProgram && "*"}
                    </Label>
                    <Input 
                      id="role" 
                      name="role" 
                      value={formData.role} 
                      onChange={handleChange} 
                      placeholder="Sales Manager" 
                      disabled={submitting} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team_size">
                      Team Size {isCustomProgram && "*"}
                    </Label>
                    <Select 
                      value={formData.team_size} 
                      onValueChange={handleSelectChange("team_size")} 
                      disabled={submitting}
                    >
                      <SelectTrigger id="team_size">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 people</SelectItem>
                        <SelectItem value="5-10">5-10 people</SelectItem>
                        <SelectItem value="10-20">10-20 people</SelectItem>
                        <SelectItem value="20+">20+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">
                    {isCustomProgram 
                      ? "What specific challenges would you like the custom program to address? *" 
                      : "What challenges would you like to address?"}
                  </Label>
                  <Textarea 
                    id="challenges" 
                    name="challenges" 
                    value={formData.challenges} 
                    onChange={handleChange} 
                    placeholder={
                      isCustomProgram 
                        ? "Tell us about your organization's specific needs, challenges, and goals..." 
                        : "Tell us about your current sales challenges and goals..."
                    } 
                    rows={4} 
                    disabled={submitting} 
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    {isCustomProgram 
                      ? "Our team will contact you within 1-2 business days to discuss your requirements and provide a customized solution."
                      : isPaid 
                        ? `After registration, you'll be redirected to complete the payment of ${program.price}.`
                        : "You'll receive confirmation and further details via email."}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleBackToDetails} 
                    className="flex-1" 
                    disabled={submitting}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
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
                        {isCustomProgram ? "Submitting Request..." : "Submitting..."}
                      </>
                    ) : isCustomProgram ? (
                      "Submit Custom Program Request"
                    ) : isPaid ? (
                      <>
                        Register & Pay {program.price}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterProgram;