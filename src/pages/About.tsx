import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Target, TrendingUp, Users } from "lucide-react";
import aboutImage from "@/assets/about-team.jpg";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We deliver world-class training programs that drive measurable results and sustainable growth."
    },
    {
      icon: Users,
      title: "Partnership",
      description: "We work alongside our clients as trusted partners in their journey to sales excellence."
    },
    {
      icon: TrendingUp,
      title: "Growth Mindset",
      description: "We believe in continuous improvement and helping teams reach their full potential."
    },
    {
      icon: Award,
      title: "Integrity",
      description: "We operate with honesty, transparency, and accountability in everything we do."
    }
  ];

  const partners = [
    "Multichoice",
    "Muthokinju",
    "WorkPay",
    "ISBI"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Sales Excellence Across Africa
            </h1>
            <p className="text-xl text-primary-foreground/90">
              At MBG, we transform businesses through proven sales training methodologies and dedicated coaching that delivers real, measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <img 
                src={aboutImage} 
                alt="MBG Team" 
                className="rounded-lg shadow-elegant w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Mastering Business Growth (MBG) was founded with a clear mission: to build sales capability 
                  that drives sustainable business growth across Africa. We recognized that many organizations 
                  struggled not from lack of products or markets, but from inadequate sales structures, 
                  processes, and capabilities.
                </p>
                <p>
                  Over the years, we've worked with businesses of all sizes—from ambitious SMEs to established 
                  corporations—helping them transform their sales approach from reactive order-taking to 
                  strategic, value-based selling.
                </p>
                <p>
                  Today, MBG stands as a trusted partner to leading organizations across multiple sectors, 
                  with a track record of delivering measurable improvements in sales performance, team capability, 
                  and business growth.
                </p>
              </div>
            </div>
          </div>

          {/* Philosophy */}
          <div className="bg-muted/30 rounded-lg p-8 md:p-12 mb-20">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Philosophy</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-center text-muted-foreground">
              <p className="text-lg">
                We believe that sales is not just about closing deals—it's about building relationships, 
                understanding customer needs, and delivering value consistently.
              </p>
              <p className="text-lg">
                Our approach combines strategic thinking with practical execution. We don't just teach 
                theory; we work alongside your team to implement systems, processes, and behaviors that 
                drive real results.
              </p>
              <p className="text-lg font-semibold text-foreground">
                Growth • Performance • Capability
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="shadow-elegant hover:shadow-hover transition-all text-center">
                    <CardContent className="pt-6">
                      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CEO Profile */}
          <div className="bg-secondary/50 rounded-lg p-8 md:p-12 mb-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Meet Our Founder</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-semibold mb-2">Edward Ndegwa</h3>
                  <p className="text-accent mb-4 font-medium">CEO & Lead Facilitator</p>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Edward Ndegwa is a seasoned sales capability expert with over a decade of experience 
                      transforming sales organizations across Africa. His passion for building high-performing 
                      sales teams and sustainable growth strategies has made him a sought-after coach and trainer.
                    </p>
                    <p>
                      Through MBG, Edward has trained hundreds of sales professionals and worked with leading 
                      organizations to implement strategic sales transformations. His practical, results-driven 
                      approach combines deep industry knowledge with proven methodologies.
                    </p>
                    <p>
                      Edward is also a regular speaker at sales conferences and webinars, sharing insights on 
                      modern sales leadership, strategic selling, and team performance optimization.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-primary/5 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-primary mb-2">10+</div>
                    <div className="text-sm text-muted-foreground">Years of Experience</div>
                    <div className="text-4xl font-bold text-accent mb-2 mt-4">500+</div>
                    <div className="text-sm text-muted-foreground">Professionals Trained</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partners */}
          <div>
            <h2 className="text-3xl font-bold mb-12 text-center">Trusted By Leading Organizations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partners.map((partner, index) => (
                <div key={index} className="flex items-center justify-center p-6 bg-muted/30 rounded-lg">
                  <span className="text-xl font-bold text-primary">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
