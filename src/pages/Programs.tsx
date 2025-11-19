import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Target, TrendingUp, Briefcase, Users, Award, Mic, GraduationCap } from "lucide-react";

interface ProgramCategory {
  id: number;
  name: string;
  slug: string;
}

interface Program {
  id: string;  // Changed from number to string to match your CharField
  title: string;
  category: ProgramCategory;
  duration: string;
  price: string;
  description: string;
  focus: string;  // Made required since model has default=''
  outcome: string; // Made required since model has default=''
  skills: string;  // Made required since model has default=''
  format: string;  // Made required since model has default=''
  badge: string;   // Made required since model has default='OpenBook'
  icon_name?: string; // Optional since it's not in your model
  features?: { id: number; description: string }[];
}

const iconMap: Record<string, any> = {
  BookOpen,
  Target,
  TrendingUp,
  Briefcase,
  Users,
  Award,
  Mic,
  GraduationCap
};

// ✅ Use .env variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/program/list/`);
        const data: Program[] = await res.json();
        setPrograms(data);
      } catch (err) {
        console.error("Failed to fetch programs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleRegisterClick = (program: Program) => {
    // Navigate to program registration page with program data
    navigate('/register-program', {
      state: {
        program: program
      }
    });
  };

  

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Transform Your Sales Performance</h1>
            <p className="text-xl text-primary-foreground/90">
              Choose from our comprehensive range of sales training, enablement, and recruitment programs designed to drive sustainable growth
            </p>
          </div>
        </div>
      </section>

      <section id="programs" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Programs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Build foundational sales capabilities and drive performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program) => {
              const Icon = program.icon_name ? iconMap[program.icon_name] : BookOpen;
              return (
                <Card key={program.id} className="shadow-elegant hover:shadow-hover transition-all flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      {program.badge && program.badge !== 'OpenBook' && (
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
                    
                    {program.focus && program.focus.trim() && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold mb-1">Focus:</p>
                        <p className="text-sm text-muted-foreground">{program.focus}</p>
                      </div>
                    )}
                    
                    {program.skills && program.skills.trim() && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold mb-1">Skills:</p>
                        <p className="text-sm text-muted-foreground">{program.skills}</p>
                      </div>
                    )}
                    
                    {program.outcome && program.outcome.trim() && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold mb-1">Outcome:</p>
                        <p className="text-sm text-muted-foreground">{program.outcome}</p>
                      </div>
                    )}
                    
                    {program.format && program.format.trim() && (
                      <div className="mb-2">
                        <p className="text-sm font-semibold mb-1">Format:</p>
                        <p className="text-sm text-muted-foreground">{program.format}</p>
                      </div>
                    )}

                    <div className="mt-auto">
                      <Button 
                        variant="default" 
                        className="w-full" 
                        onClick={() => handleRegisterClick(program)}
                      >
                        Register Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Programs;