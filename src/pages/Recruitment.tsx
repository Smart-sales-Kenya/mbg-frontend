import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Briefcase, Users, Target, TrendingUp } from "lucide-react";

const Recruitment = () => {
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  
  const [authData, setAuthData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Login functionality coming soon!");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authData.password !== authData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    if (authData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    
    toast.success("Registration functionality coming soon!");
  };

  const handleGoogleSignIn = () => {
    toast.success("Google sign-in coming soon!");
  };

  const benefits = [
    {
      icon: Target,
      title: "Automated Validation",
      description: "Education and work history verification"
    },
    {
      icon: Users,
      title: "Skill Ranking",
      description: "Comprehensive assessment and scoring"
    },
    {
      icon: TrendingUp,
      title: "AI Recommendations",
      description: "Smart candidate matching and insights"
    },
    {
      icon: Briefcase,
      title: "Background Checks",
      description: "Thorough verification process"
    }
  ];

  const currentOpenings = [
    {
      title: "Sales Executive - FMCG",
      location: "Nairobi",
      type: "Full-time",
      experience: "2-5 years",
      description: "Looking for experienced sales professionals in the FMCG sector with proven track record in B2B sales."
    },
    {
      title: "Sales Manager - Enterprise",
      location: "Nairobi",
      type: "Full-time",
      experience: "5+ years",
      description: "Seeking a strategic sales leader to manage and grow enterprise accounts across East Africa."
    },
    {
      title: "Business Development Representative",
      location: "Remote",
      type: "Full-time",
      experience: "1-3 years",
      description: "Dynamic individual to identify and pursue new business opportunities in the B2B space."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sales Recruitment & Outsourcing
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Find top-performing sales talent or kickstart your sales career with MBG
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Comprehensive Recruitment Solutions</h2>
            <p className="text-lg text-muted-foreground text-center mb-8">
              Our recruitment service helps companies find and manage top-performing salespeople through 
              end-to-end recruitment, onboarding, and performance tracking. We reduce hiring risk and 
              accelerate team ramp-up time.
            </p>
            <div className="grid md:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="text-center shadow-elegant">
                    <CardContent className="pt-6">
                      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-3 mx-auto">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Current Openings */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Current Openings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentOpenings.map((job, index) => (
                <Card key={index} className="shadow-elegant hover:shadow-hover transition-all">
                  <CardHeader>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>📍 {job.location}</span>
                      <span>•</span>
                      <span>⏰ {job.type}</span>
                      <span>•</span>
                      <span>📊 {job.experience}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>
                    <Button variant="default" className="w-full" onClick={() => {
                      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Auth Section */}
          <div id="application-form" className="max-w-2xl mx-auto">
            <Card className="shadow-elegant">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Join MBG Recruitment Hub</CardTitle>
                <CardDescription className="text-base mt-2">
                  Create an account or login to submit your application
                </CardDescription>
              </CardHeader>
              <CardContent className="max-w-md mx-auto">
                <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "register")}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
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
                          onChange={(e) => setAuthData({...authData, email: e.target.value})}
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
                          onChange={(e) => setAuthData({...authData, password: e.target.value})}
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg">
                        Login
                      </Button>
                      
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        size="lg"
                        onClick={handleGoogleSignIn}
                      >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign in with Google
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="register-name">Full Name *</Label>
                        <Input 
                          id="register-name"
                          type="text"
                          required
                          placeholder="John Doe"
                          value={authData.fullName}
                          onChange={(e) => setAuthData({...authData, fullName: e.target.value})}
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
                          onChange={(e) => setAuthData({...authData, email: e.target.value})}
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
                          onChange={(e) => setAuthData({...authData, password: e.target.value})}
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
                          onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg">
                        Create Account
                      </Button>
                      
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full" 
                        size="lg"
                        onClick={handleGoogleSignIn}
                      >
                        <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Sign up with Google
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

export default Recruitment;
