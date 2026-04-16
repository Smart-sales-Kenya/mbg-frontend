import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Briefcase, 
  Users, 
  Award, 
  Mic, 
  GraduationCap,
  Clock,
  Calendar,
  CheckCircle,
  ArrowLeft,
  Users as UsersIcon,
  DollarSign,
  Zap,
  BarChart
} from "lucide-react";

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
  is_custom: boolean; // Added custom field
  icon_name?: string;
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProgramDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPrograms, setRelatedPrograms] = useState<Program[]>([]);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/program/list/`);
        const data: Program[] = await res.json();
        
        const foundProgram = data.find(p => p.id === id);
        if (foundProgram) {
          setProgram(foundProgram);
          
          // Find related programs (same category)
          const related = data
            .filter(p => p.id !== id && p.category.id === foundProgram.category.id)
            .slice(0, 3);
          setRelatedPrograms(related);
        } else {
          console.error("Program not found");
        }
      } catch (err) {
        console.error("Failed to fetch program details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [id]);

  const handleRegisterClick = () => {
    if (program) {
      navigate(`/programs/${program.id}/register`, {
        state: { program }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading program details...</p>
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
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full text-center p-8">
            <CardContent className="space-y-4">
              <h2 className="text-2xl font-bold">Program Not Found</h2>
              <p className="text-muted-foreground">
                The program you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/programs")} className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Programs
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = program.icon_name ? iconMap[program.icon_name] : BookOpen;
  const displayPrice = program.is_custom ? "Custom Pricing" : program.price;
  const priceLabel = program.is_custom ? "Pricing" : "Investment";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-primary-foreground hover:bg-white/20 mb-8"
            onClick={() => navigate("/programs")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Programs
          </Button>
          
          <div className="max-w-4xl">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className="bg-white/20 hover:bg-white/30 border-0">
                    {program.category.name}
                  </Badge>
                  {program.is_custom && (
                    <Badge className="bg-white/30 hover:bg-white/40 border-0">
                      Custom Program
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{program.title}</h1>
                <p className="text-xl text-primary-foreground/90 max-w-3xl">
                  {program.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Program Details */}
            <div className="lg:col-span-2">
              <Card className="shadow-elegant mb-8">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">{program.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{priceLabel}</p>
                        <p className="font-semibold text-accent text-lg">{displayPrice}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-8" />

                  {/* Custom Program Note */}
                  {program.is_custom && (
                    <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-sm font-bold">!</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-1">Custom Program</h4>
                          <p className="text-sm text-blue-600">
                            This is a tailored program designed specifically for your organization's needs. 
                            Pricing and duration are customized based on your requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Program Focus */}
                  {program.focus && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Target className="h-6 w-6 text-primary" />
                        Program Focus
                      </h3>
                      <p className="text-muted-foreground">{program.focus}</p>
                    </div>
                  )}

                  {/* Key Outcomes */}
                  {program.outcome && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <BarChart className="h-6 w-6 text-primary" />
                        Key Outcomes
                      </h3>
                      <p className="text-muted-foreground">{program.outcome}</p>
                    </div>
                  )}

                  {/* Skills You'll Gain */}
                  {program.skills && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="h-6 w-6 text-primary" />
                        Skills You'll Gain
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {program.skills.split(',').map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Program Format */}
                  {program.format && (
                    <div>
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-primary" />
                        Program Format
                      </h3>
                      <p className="text-muted-foreground">{program.format}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Registration & Info */}
            <div>
              <Card className="shadow-elegant sticky top-8">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">
                      {program.is_custom ? "Request Custom Program" : "Ready to Transform?"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {program.is_custom 
                        ? "Get a tailored solution for your organization" 
                        : "Secure your spot in the next cohort"}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{program.is_custom ? "Program Type" : "Program Fee"}</span>
                      <span className="font-bold text-lg text-accent">
                        {displayPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Duration</span>
                      <span className="font-semibold">{program.duration}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleRegisterClick}
                    variant={program.is_custom ? "outline" : "hero"}
                    className="w-full mb-4"
                    size="lg"
                  >
                    {program.is_custom ? "Request Custom Quote" : "Register Now"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {program.is_custom
                      ? "We'll contact you within 24 hours to discuss your requirements"
                      : "By registering, you agree to our Terms of Service and Privacy Policy"}
                  </p>

                  <Separator className="my-6" />

                  {/* Program Highlights */}
                  <div className="space-y-3">
                    <h4 className="font-semibold">Program Highlights</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">Hands-on, practical training</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">Industry expert facilitators</span>
                      </li>
                      {program.is_custom ? (
                        <>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm">Tailored to your organization</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm">Flexible scheduling</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm">Post-program support</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-sm">Certificate of completion</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Programs */}
          {relatedPrograms.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 text-center">
                Related Programs
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPrograms.map((related) => {
                  const RelatedIcon = related.icon_name ? iconMap[related.icon_name] : BookOpen;
                  const relatedDisplayPrice = related.is_custom ? "Custom Pricing" : related.price;
                  
                  return (
                    <Card key={related.id} className="shadow-elegant hover:shadow-hover transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <RelatedIcon className="h-6 w-6 text-primary" />
                          </div>
                          {related.is_custom ? (
                            <Badge variant="secondary">Custom</Badge>
                          ) : (
                            related.badge && related.badge !== 'OpenBook' && (
                              <Badge variant="secondary">{related.badge}</Badge>
                            )
                          )}
                        </div>
                        <h3 className="font-bold mb-2">{related.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {related.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm">{related.duration}</span>
                          <span className="font-bold text-accent">
                            {relatedDisplayPrice}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/programs/${related.id}`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProgramDetails;