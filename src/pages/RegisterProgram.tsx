import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, ArrowRight, Loader2, Home } from "lucide-react";
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
    const response = await fetch(`${API_BASE_URL}/api/get-csrf-token/`, {
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.csrfToken;
    }
    return null;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
};

const RegisterProgram = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get program data from navigation state
  const program = location.state?.program as Program | undefined;
  
  const [loading, setLoading] = useState(!program);
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

  const isPaid = program?.price && program.price !== "Custom Pricing" && !program.price.toLowerCase().includes("free");

  // Check for payment callback parameters
  useEffect(() => {
    const orderTrackingId = searchParams.get('OrderTrackingId');
    const orderMerchantReference = searchParams.get('OrderMerchantReference');
    
    if (orderTrackingId) {
      console.log("🔄 Program Payment callback detected:", { orderTrackingId, orderMerchantReference });
      
      // Verify payment status with backend
      verifyPaymentStatus(orderTrackingId);
      
      // Clean up URL parameters
      const cleanParams = new URLSearchParams(searchParams);
      cleanParams.delete('OrderTrackingId');
      cleanParams.delete('OrderMerchantReference');
      setSearchParams(cleanParams);
    }
  }, [searchParams, setSearchParams]);

  const verifyPaymentStatus = async (orderTrackingId: string) => {
    try {
      console.log("🔍 Verifying program payment status for:", orderTrackingId);
      
      const response = await fetch(`${API_BASE_URL}/api/program-payments/pesapal-callback/?OrderTrackingId=${orderTrackingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Program payment verification result:", result);
        
        if (result.payment_status === 'completed') {
          setPaymentCompleted(true);
          toast.success("Payment completed successfully!");
          
          // Clear storage
          sessionStorage.removeItem('pendingProgramPayment');
          sessionStorage.removeItem('pendingProgramRegistration');
          
          // Redirect to homepage after 3 seconds
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      } else {
        console.error("❌ Program payment verification failed");
      }
    } catch (error) {
      console.error("❌ Error verifying program payment:", error);
    }
  };

  useEffect(() => {
    if (!program) {
      toast.error("Program Not Selected. Please select a program to register.");
      navigate("/programs");
      return;
    }
    
    setLoading(false);
  }, [program, navigate]);

  // Poll for payment status if we have a payment ID but payment isn't completed
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const currentPaymentId = paymentId || sessionStorage.getItem('pendingProgramPayment');
    
    if (registered && currentPaymentId && !paymentCompleted && isPaid) {
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
              
              setTimeout(() => {
                navigate("/");
              }, 3000);
            } else if (statusData.payment_status === 'failed') {
              toast.error("Payment failed. Please try again.");
              clearInterval(interval);
              sessionStorage.removeItem('pendingProgramPayment');
            } else if (statusData.pesapal_status) {
              const pesapalStatusCode = statusData.pesapal_status.status_code;
              if (pesapalStatusCode === 1 || pesapalStatusCode === '1') {
                setPaymentCompleted(true);
                toast.success("Payment completed successfully!");
                clearInterval(interval);
                
                sessionStorage.removeItem('pendingProgramPayment');
                sessionStorage.removeItem('pendingProgramRegistration');
                
                setTimeout(() => {
                  navigate("/");
                }, 3000);
              }
            }
          }
        } catch (error) {
          console.error("Error checking program payment status:", error);
        }
      }, 5000);

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [registered, paymentId, paymentCompleted, isPaid, navigate]);

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
      
      // Get CSRF token first
      const csrfToken = await getCSRFToken();
      
      if (!csrfToken) {
        throw new Error("Failed to get CSRF token");
      }
      
      const response = await fetch(`${API_BASE_URL}/api/program-payments/initiate/${registrationId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
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

    setSubmitting(true);

    try {
      const requestBody = {
        program: program.id,
        ...formData
      };

      console.log("Sending program registration request:", requestBody);

      // Get CSRF token for registration request too
      const csrfToken = await getCSRFToken();
      
      const res = await fetch(`${API_BASE_URL}/api/program/${program.id}/register/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(csrfToken && { "X-CSRFToken": csrfToken })
        },
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

      if (isPaid && newRegistrationId) {
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
    
    if (pendingRegistration) {
      setRegistrationId(pendingRegistration);
      setRegistered(true);
      console.log("🔄 Found pending program registration:", pendingRegistration);
    }
    
    if (pendingPayment) {
      setPaymentId(pendingPayment);
      console.log("🔄 Found pending program payment:", pendingPayment);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-xl font-semibold">Loading Program Details...</p>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full text-center p-6">
            <CardContent>
              <p className="text-lg mb-4">No program selected</p>
              <Button onClick={() => navigate("/programs")}>
                Back to Programs
              </Button>
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
              <CardTitle className="text-2xl">Registration Confirmed!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Thank you for registering for <strong>{program.title}</strong>
              </p>

              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Program Details</h3>
                <div className="text-left space-y-2">
                  <p className="text-sm"><strong>Program:</strong> {program.title}</p>
                  <p className="text-sm"><strong>Duration:</strong> {program.duration}</p>
                  <p className="text-sm">
                    <strong>Investment:</strong>{" "}
                    <span className="text-accent font-bold">{program.price}</span>
                  </p>
                  {registrationId && (
                    <p className="text-sm"><strong>Registration ID:</strong> {registrationId}</p>
                  )}
                </div>
              </div>

              {isPaid ? (
                <div className="space-y-4">
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
                    <Button variant="outline" onClick={() => navigate("/programs")}>
                      View More Programs
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
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Our team will reach out to you within 1-2 business days to discuss your specific requirements and provide a customized quote.
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center pt-4 flex-wrap">
                    <Button variant="outline" onClick={() => navigate("/programs")}>
                      View More Programs
                    </Button>
                    <Button variant="default" onClick={() => navigate("/")}>
                      Back to Home
                    </Button>
                  </div>
                </div>
              )}
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
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Register for Program</h1>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <h2 className="text-xl text-muted-foreground">{program.title}</h2>
              <Badge variant="secondary" className="text-accent font-bold">
                {program.price}
              </Badge>
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
              <p className="text-sm"><strong>Outcome:</strong> {program.outcome || "Not specified"}</p>
              {program.skills && (
                <p className="text-sm"><strong>Skills:</strong> {program.skills}</p>
              )}
              {program.format && (
                <p className="text-sm"><strong>Format:</strong> {program.format}</p>
              )}
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>Registration Details</CardTitle>
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
                    <Label htmlFor="company_name">Company Name</Label>
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
                    <Label htmlFor="role">Your Role</Label>
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
                    <Label htmlFor="team_size">Team Size</Label>
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
                  <Label htmlFor="challenges">What challenges would you like to address?</Label>
                  <Textarea 
                    id="challenges" 
                    name="challenges" 
                    value={formData.challenges} 
                    onChange={handleChange} 
                    placeholder="Tell us about your current sales challenges and goals..." 
                    rows={4} 
                    disabled={submitting} 
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/programs")} 
                    className="flex-1" 
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
                    ) : isPaid ? "Register & Proceed to Payment" : "Submit Registration"}
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