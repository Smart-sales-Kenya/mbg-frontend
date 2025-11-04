import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { ArrowRight, Users, Target, TrendingUp, Award, BookOpen, Briefcase } from "lucide-react";
import heroImage from "@/assets/hero-training.jpg";

const Home = () => {
  const testimonials = [
    {
      company: "Multichoice",
      text: "MBG's training transformed our sales approach. The results were immediate and measurable.",
      author: "Sales Director"
    },
    {
      company: "WorkPay",
      text: "Outstanding program that helped us build a world-class sales team from the ground up.",
      author: "CEO"
    },
    {
      company: "ISBI",
      text: "The strategic transformation program exceeded our expectations. Highly recommended.",
      author: "Head of Sales"
    }
  ];

  const programs = [
    {
      icon: BookOpen,
      title: "16-Week Sales Program",
      description: "Comprehensive training for business owners and sales managers to build a high-performing commercial engine",
      price: "Ksh 76,560",
      link: "/programs#training"
    },
    {
      icon: Target,
      title: "Sales Process Workshop",
      description: "One-day intensive workshop to design and document your sales process",
      price: "Ksh 12,760",
      link: "/programs#training"
    },
    {
      icon: TrendingUp,
      title: "Strategic Transformation",
      description: "6-month program moving teams from order-taking to strategic selling",
      price: "Custom",
      link: "/programs#enablement"
    },
    {
      icon: Award,
      title: "Sales Masterclass",
      description: "1-2 day intensive with tools, frameworks, and real-world cases",
      price: "Custom",
      link: "/programs#events"
    }
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Trained Professionals" },
    { icon: Briefcase, value: "50+", label: "Companies Served" },
    { icon: Target, value: "95%", label: "Client Satisfaction" },
    { icon: TrendingUp, value: "10+", label: "Years Experience" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative gradient-hero text-primary-foreground">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={heroImage} 
            alt="Sales Training" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Master Sales. Drive Growth. Transform Your Business.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              Leading Sales Capability Training and Coaching across Africa
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/programs">
                  Explore Programs <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-10 w-10 mx-auto mb-3 text-accent" />
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Building Sales Excellence Across Africa
            </h2>
            <p className="text-lg text-muted-foreground">
              Mastering Business Growth (MBG) is Africa's premier sales capability training and coaching company. 
              We partner with businesses to transform their sales teams, processes, and results through proven 
              methodologies and hands-on coaching.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-elegant hover:shadow-hover transition-all">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower businesses with world-class sales capabilities that drive sustainable growth and market leadership.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-elegant hover:shadow-hover transition-all">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Approach</h3>
                <p className="text-muted-foreground">
                  Practical, results-driven training that combines strategy, process, and execution for measurable impact.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-elegant hover:shadow-hover transition-all">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Our Impact</h3>
                <p className="text-muted-foreground">
                  Trusted by leading organizations across Africa to build high-performing sales teams and sustainable growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of sales training and enablement programs designed to transform your team's performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <Card key={index} className="shadow-elegant hover:shadow-hover transition-all group">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                      <Icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{program.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-accent">{program.price}</span>
                      <Link to={program.link} className="text-sm text-primary hover:text-accent transition-colors font-medium">
                        Learn More →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/programs">
                View All Programs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Leading Organizations
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our clients say about working with MBG
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-elegant">
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <svg className="h-8 w-8 text-accent/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-accent">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Sales Performance?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join hundreds of businesses that have accelerated their growth with MBG's proven training programs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/programs">
                Get Started Today
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/contact">
                Schedule a Consultation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
