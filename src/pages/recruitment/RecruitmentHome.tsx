import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, TrendingUp, Award, Briefcase, CheckCircle } from "lucide-react";

const RecruitmentHome = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('access_token');
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
    
    // Listen for storage changes
    window.addEventListener('storage', checkAuthStatus);
    
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  // Handle navigation based on auth status
  const handleAuthNavigation = (e: React.MouseEvent, path: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/register');
    } else {
      navigate(path);
    }
  };
// Add this to your useEffect or create a separate check
useEffect(() => {
  const checkAuthStatus = () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user_data');
    setIsLoggedIn(!!token);
    
    // Check if user is admin and redirect
    if (token && user) {
      const userData = JSON.parse(user);
      const isAdmin = userData.is_staff || userData.is_superuser || userData.role === 'admin';
      if (isAdmin) {
        navigate('/admin/dashboard');
        return;
      }
    }
  };

  checkAuthStatus();
  
  // Listen for storage changes
  window.addEventListener('storage', checkAuthStatus);
  
  return () => window.removeEventListener('storage', checkAuthStatus);
}, [navigate]);
  const benefits = [
    {
      icon: Target,
      title: "Showcase Your Expertise",
      description: "Share your sales experience and capabilities with leading organizations"
    },
    {
      icon: Users,
      title: "Get Matched to Roles",
      description: "Be automatically matched to current or future sales opportunities"
    },
    {
      icon: TrendingUp,
      title: "Join Elite Network",
      description: "Become part of our high-performing sales talent pool"
    },
    {
      icon: Award,
      title: "Career Growth",
      description: "Access roles from Sales Rep to National Sales Manager"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Share your sales experience, capabilities, and achievements"
    },
    {
      number: "02",
      title: "Get Assessed",
      description: "Our platform evaluates your business development, account management, and leadership skills"
    },
    {
      number: "03",
      title: "Match & Connect",
      description: "Be matched to opportunities that align with your strengths and career goals"
    }
  ];

  // If user is logged in, show a different message or redirect
  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        
        {/* Hero Section for Logged In Users */}
        <section className="gradient-hero text-primary-foreground py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome Back!
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
                Ready to complete your sales capability profile or update your information?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8"
                  onClick={(e) => handleAuthNavigation(e, "/recruitment/form")}
                >
                  Complete Your Profile
                </Button>
                <Link to="/recruitment/roles">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    Explore Available Roles
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions for Logged In Users */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="text-center shadow-elegant hover:shadow-hover transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl mb-2">Your Profile</CardTitle>
                  <CardDescription>
                    Complete or update your sales capability information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={(e) => handleAuthNavigation(e, "/recruitment/form")}
                  >
                    Manage Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="text-center shadow-elegant hover:shadow-hover transition-all">
                <CardHeader>
                  <CardTitle className="text-2xl mb-2">Role Matches</CardTitle>
                  <CardDescription>
                    View opportunities that match your skills and experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/recruitment/roles" className="w-full">
                    <Button className="w-full" variant="outline">
                      View Matches
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  // Original content for non-logged in users
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Showcase Your Sales Capability
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Join our network of high-performing sales professionals and be matched to the right opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-8"
                onClick={(e) => handleAuthNavigation(e, "/recruitment/form")}
              >
                Start Now
              </Button>
              <Link to="/recruitment/roles">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  Explore Roles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground">
              We're building Africa's premier sales talent pool, connecting exceptional sales professionals 
              with organizations seeking proven capability in business development, account management, 
              and sales leadership across FMCG, beverages, and financial services sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Join Our Platform?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center shadow-elegant hover:shadow-hover transition-all">
                  <CardContent className="pt-6">
                    <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                      <Icon className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl font-bold text-accent/20 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto shadow-elegant bg-gradient-to-br from-primary to-primary-hover text-primary-foreground">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Ready to Get Started?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Complete your sales capability profile in just 10 minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap gap-3 justify-center text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Quick & Easy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Secure & Confidential</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Free to Join</span>
                </div>
              </div>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg px-12"
                onClick={(e) => handleAuthNavigation(e, "/recruitment/form")}
              >
                Submit Your Capability Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecruitmentHome;