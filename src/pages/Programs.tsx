import { Link } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, TrendingUp, Briefcase, Users, Award, Mic, GraduationCap } from "lucide-react";

const Programs = () => {
  const trainingPrograms = [
    {
      icon: BookOpen,
      title: "16-Week MBG Sales Program",
      duration: "16 Weeks",
      price: "Ksh 76,560",
      badge: "Most Popular",
      description: "For business owners and sales managers ready to strengthen their commercial engine.",
      focus: "Building and managing a sales team, developing a sales strategy, creating a sales process, and setting up an annual sales plan.",
      outcome: "Clear sales structure, stronger team performance, and predictable results.",
      features: [
        "Comprehensive sales strategy development",
        "Team building and management techniques",
        "Sales process documentation",
        "Annual planning frameworks",
        "Ongoing support and coaching"
      ]
    },
    {
      icon: Target,
      title: "MBG Sales Process Workshop",
      duration: "1 Day",
      price: "Ksh 12,760",
      badge: "Quick Start",
      description: "A practical, high-energy workshop for SME owners and sales managers.",
      focus: "Designing and documenting your sales process step-by-step.",
      outcome: "A ready-to-use sales process that improves conversions and consistency.",
      features: [
        "Hands-on process design",
        "Sales funnel optimization",
        "Conversion improvement strategies",
        "Documentation templates",
        "Implementation roadmap"
      ]
    },
    {
      icon: Briefcase,
      title: "Customized MBG Program",
      duration: "Flexible",
      price: "Custom Pricing",
      badge: "Tailored",
      description: "Tailored for teams or organizations with specific sales performance needs.",
      focus: "Bespoke curriculum built around your industry, team structure, and growth goals.",
      outcome: "Measurable behavior change, aligned sales culture, and business growth.",
      features: [
        "Custom curriculum design",
        "Industry-specific content",
        "Team-specific challenges",
        "Flexible delivery format",
        "Dedicated support team"
      ]
    }
  ];

  const enablementPrograms = [
    {
      icon: TrendingUp,
      title: "Sales Execution Support Program",
      duration: "Ongoing",
      price: "Custom Pricing",
      description: "For organizations looking to strengthen sales execution and performance consistency.",
      focus: "Building high-performing teams, aligning sales strategy, and simplifying execution.",
      skills: "Sales planning, coaching, trade execution, and CRM/SFA adoption.",
      outcome: "Improved distributor output, stronger team discipline, and steady revenue growth.",
      features: [
        "Team performance optimization",
        "Strategic alignment workshops",
        "CRM implementation support",
        "Ongoing coaching sessions",
        "Performance tracking systems"
      ]
    },
    {
      icon: Award,
      title: "Strategic Sales Capability Transformation",
      duration: "6 Months",
      price: "Custom Pricing",
      description: "For sales teams ready to move from order-taking to strategic selling.",
      focus: "Mindset → Sales Tools → Strategic Execution.",
      skills: "Value-based selling, account management, deal strategy, and CRM mastery.",
      outcome: "Stronger pipelines, higher win rates, and sustainable growth.",
      features: [
        "Mindset transformation workshops",
        "Strategic selling frameworks",
        "Account planning tools",
        "Deal strategy sessions",
        "CRM optimization"
      ]
    },
    {
      icon: Users,
      title: "Sales Recruitment & Outsourcing",
      duration: "Project-based",
      price: "Custom Pricing",
      description: "Helping companies find and manage top-performing salespeople.",
      focus: "End-to-end recruitment, onboarding, and performance tracking for sales hires.",
      outcome: "Competent sales teams with reduced hiring risk and faster ramp-up time.",
      features: [
        "Candidate sourcing and screening",
        "Skills assessment and validation",
        "Onboarding support",
        "Performance management",
        "Team integration coaching"
      ]
    }
  ];

  const eventPrograms = [
    {
      icon: Mic,
      title: "Sales Leadership Talk / Webinar",
      duration: "Under 2 Hours",
      price: "Custom Pricing",
      description: "For business owners and leaders seeking quick, actionable insights.",
      focus: "Modern sales leadership, mindset shifts, and performance culture.",
      format: "Interactive talk or webinar with live Q&A.",
      outcome: "Fresh ideas to inspire teams and drive immediate improvement.",
      features: [
        "Engaging presentations",
        "Live Q&A sessions",
        "Actionable takeaways",
        "Leadership insights",
        "Team motivation strategies"
      ]
    },
    {
      icon: GraduationCap,
      title: "Sales Masterclass",
      duration: "1-2 Days",
      price: "Custom Pricing",
      description: "For sales teams and managers ready for immersive, practical learning.",
      focus: "End-to-end sales strategy, process design, and value-based execution.",
      format: "1-2 day intensive session with tools, frameworks, and real-world cases.",
      outcome: "Clear, actionable sales frameworks that boost team results.",
      features: [
        "Intensive training sessions",
        "Real-world case studies",
        "Practical tools and templates",
        "Group exercises",
        "Implementation planning"
      ]
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
              Transform Your Sales Performance
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Choose from our comprehensive range of sales training, enablement, and recruitment programs designed to drive sustainable growth
            </p>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section id="training" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sales Training Programs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build foundational sales capabilities and processes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainingPrograms.map((program, index) => {
              const Icon = program.icon;
              return (
                <Card key={index} className="shadow-elegant hover:shadow-hover transition-all flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {program.badge && (
                        <Badge variant="secondary">{program.badge}</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{program.duration}</span>
                      <span className="text-accent font-bold">{program.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-sm font-semibold mb-1">Focus:</p>
                        <p className="text-sm text-muted-foreground">{program.focus}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Outcome:</p>
                        <p className="text-sm text-muted-foreground">{program.outcome}</p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Button variant="hero" className="w-full" asChild>
                        <Link to="/contact">Get Started</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enablement Programs */}
      <section id="enablement" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Sales Enablement & Execution</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Drive strategic execution and sustainable performance improvement
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enablementPrograms.map((program, index) => {
              const Icon = program.icon;
              return (
                <Card key={index} className="shadow-elegant hover:shadow-hover transition-all flex flex-col">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{program.duration}</span>
                      <span className="text-accent font-bold">{program.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-sm font-semibold mb-1">Focus:</p>
                        <p className="text-sm text-muted-foreground">{program.focus}</p>
                      </div>
                      {program.skills && (
                        <div>
                          <p className="text-sm font-semibold mb-1">Skills:</p>
                          <p className="text-sm text-muted-foreground">{program.skills}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold mb-1">Outcome:</p>
                        <p className="text-sm text-muted-foreground">{program.outcome}</p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Button variant="default" className="w-full" asChild>
                        <Link to="/contact">Learn More</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Event Programs */}
      <section id="events" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Events & Masterclasses</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Inspire your team with engaging talks and intensive learning experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {eventPrograms.map((program, index) => {
              const Icon = program.icon;
              return (
                <Card key={index} className="shadow-elegant hover:shadow-hover transition-all flex flex-col">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{program.duration}</span>
                      <span className="text-accent font-bold">{program.price}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-sm font-semibold mb-1">Focus:</p>
                        <p className="text-sm text-muted-foreground">{program.focus}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Format:</p>
                        <p className="text-sm text-muted-foreground">{program.format}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Outcome:</p>
                        <p className="text-sm text-muted-foreground">{program.outcome}</p>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <Button variant="default" className="w-full" asChild>
                        <Link to="/contact">Book Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not Sure Which Program is Right for You?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Let's discuss your specific needs and recommend the best solution for your team
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contact">Schedule a Consultation</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programs;
