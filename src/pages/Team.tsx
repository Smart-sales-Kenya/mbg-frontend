import { useEffect, useState } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Linkedin, Mail } from "lucide-react";

const Team = () => {
  const [leadership, setLeadership] = useState([]);
  const [supportTeam, setSupportTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/team/");
        if (!response.ok) throw new Error("Failed to fetch team data");
        const data = await response.json();

        const leaders = data.filter((m) => m.category === "leadership");
        const support = data.filter((m) => m.category === "support");

        setLeadership(leaders);
        setSupportTeam(support);
      } catch (error) {
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading team members...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Team</h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Experienced professionals dedicated to transforming sales capabilities across Africa
          </p>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Visionary leadership driving sales excellence
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-10">
            {leadership.map((member) => (
              <Card key={member.id} className="shadow-elegant hover:shadow-hover transition-all">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    <div className="flex justify-center">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="rounded-lg w-full h-auto object-cover shadow-elegant"
                      />
                    </div>
                    <div className="md:col-span-2 text-center md:text-left">
                      <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                      <p className="text-accent font-medium mb-4">{member.role}</p>
                      <p className="text-muted-foreground mb-6">{member.bio}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                          >
                            <Linkedin className="h-5 w-5" />
                            <span className="text-sm">LinkedIn</span>
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                          >
                            <Mail className="h-5 w-5" />
                            <span className="text-sm">Email</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Support Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dedicated professionals ensuring exceptional service delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportTeam.map((member) => (
              <Card key={member.id} className="shadow-elegant hover:shadow-hover transition-all">
                <CardContent className="p-6 text-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-lg w-48 h-48 object-cover mx-auto mb-4 shadow-elegant"
                  />
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-accent font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-6">{member.bio}</p>

                  <div className="flex justify-center gap-4">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="text-sm">LinkedIn</span>
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                      >
                        <Mail className="h-5 w-5" />
                        <span className="text-sm">Email</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're always looking for talented individuals passionate about sales training and business growth. 
            Check out our current opportunities.
          </p>
          <a
            href="/recruitment"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground hover:bg-[hsl(var(--accent-hover))] rounded-md font-semibold transition-all shadow-elegant hover:shadow-hover"
          >
            View Career Opportunities
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
