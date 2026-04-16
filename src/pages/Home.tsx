import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import {
  ArrowRight,
  Users,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import heroImage from "@/assets/hero-training.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as SwiperNav, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// ✅ Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Testimonial {
  author: string;
  company: string;
  logo: string;
  text: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  start_time: string;
  end_time?: string;
  location: string;
  investment_amount?: number;
  is_free: boolean;
  status: string;
  registration_open: boolean;
  participants_limit: number;
  duration: string;
  category?: string;
  image_url?: string;
}

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
  is_custom: boolean;
  icon_name?: string;
}

const Home = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<Event | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingPrograms, setLoadingPrograms] = useState<boolean>(true);

  useEffect(() => {
    // Fetch testimonials
    axios
      .get(`${API_BASE_URL}/api/testimonials/`)
      .then((res) => setTestimonials(res.data))
      .catch((err) => console.error("Error fetching testimonials:", err));

    // Fetch events and get the first upcoming event
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/events/`);
        const events = response.data || [];
        
        // Get the first upcoming event (non-completed and registration open)
        const upcomingEvent = events.find((e: Event) => 
          e.status !== "completed" && e.registration_open
        );
        
        setFeaturedEvent(upcomingEvent || null);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch programs
    const fetchPrograms = async () => {
      try {
        setLoadingPrograms(true);
        const response = await axios.get(`${API_BASE_URL}/api/program/list/`);
        const data: Program[] = response.data || [];
        
        // Limit to 4 programs, you can add filtering logic here if needed
        // For example: show only non-custom programs, or sort by something
        const limitedPrograms = data.slice(0, 4);
        setPrograms(limitedPrograms);
      } catch (err) {
        console.error("Error fetching programs:", err);
      } finally {
        setLoadingPrograms(false);
      }
    };

    fetchEvents();
    fetchPrograms();
  }, []);

  const formatEventData = (event: Event) => {
    const formattedDate = event.start_date
      ? new Date(event.start_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Date TBD";

    const formattedTime = event.start_time
      ? `${event.start_time.slice(0, 5)} - ${event.end_time ? event.end_time.slice(0, 5) : ""}`
      : "Time TBD";

    const price = event.is_free ? "Free" : `Ksh ${event.investment_amount?.toLocaleString() || "Custom"}`;

    const statusMap: Record<string, string> = {
      open: "Open for Registration",
      closed: "Registration Closed",
      invite: "Invite Only",
      early_bird: "Early Bird Available",
      completed: "Completed",
    };

    return {
      ...event,
      formattedDate,
      formattedTime,
      price,
      statusLabel: statusMap[event.status] || event.status,
      badgeLabel: event.category ? event.category.charAt(0).toUpperCase() + event.category.slice(1) : undefined,
    };
  };

  const stats = [
    { icon: Users, value: "500+", label: "Trained Professionals" },
    { icon: Briefcase, value: "50+", label: "Companies Served" },
    { icon: Target, value: "95%", label: "Client Satisfaction" },
    { icon: TrendingUp, value: "10+", label: "Years Experience" },
  ];

  // Updated SPENCON images with all 5 speakers
  const spenconImages = [
    { 
      src: "/spencon/Mike.jpg", 
      alt: "Mike Mbungu at SPENCON",
      name: "Mike Mbungu",
      title: "Head of Sales KWAL",
      topic: "Accelerating your distributors to drive your 2026 results",
      dateInfo: "February 4th 2026",
      eventName: "Sales Planning and Execution Conference (SPENCON)",
      socialMedia: "f    in    @smartsales",
      joinText: "Join me and over 100+ business owners and sales leaders"
    },
    { 
      src: "/spencon/Edward Ndegwa.jpg", 
      alt: "Edward Ndegwa at SPENCON",
      name: "Edward Ndegwa",
      title: "Mwalimu Wa Sales",
      rating: "⭐⭐⭐⭐⭐",
      topic: "How the right sales drivers can unlock results in 2026",
      dateInfo: "February 4th 2026",
      eventName: "Sales Planning and Execution Conference (SPENCON)",
      socialMedia: "f    X    in    @smartsales",
      contact: "CALL/WHATSAPP 0707 955 317",
      website: "www.smartsales.co.ke",
      joinText: "Join me and over 100+ business owners and sales leaders",
      tagline: "email ACTions | BIG results | mag",
      company: "Mastering Business Growth"
    },
    { 
      src: "/spencon/Flora - SPENCON 2026.jpg", 
      alt: "Flora Mutahi at SPENCON",
      name: "Flora Mutahi",
      title: "Managing Director Melvin Marsh International",
      rating: "✔ ✔ ✔ ✔ ✔",
      topic: "Building a Sales Engine in a Manufacturing World",
      dateInfo: "February 4th 2026",
      eventName: "Sales Planning and Execution Conference (SPENCON)",
      socialMedia: "f X in @ @smartsales",
      contact: "CALL/WHATSAPP 0707 955 317",
      website: "www.smartsales.co.ke",
      joinText: "Join me and over 100+ business owners and sales leaders on February 4th 2026"
    },
    { 
      src: "/spencon/Sehar - SPENCON 2026.jpg", 
      alt: "Sehar Neky at SPENCON",
      name: "Sehar Neky",
      title: "Managing Partner HYRE Africa",
      topic: "Closing Top Sales Talent in a Competitive Market",
      dateInfo: "February 4th 2026",
      eventName: "Sales Planning and Execution Conference (SPENCON)",
      socialMedia: "f    in    @smartsales",
      contact: "CALL/WHATSAPP 0707 955 317",
      website: "www.smartsales.co.ke",
      joinText: "Join me and over 100+ business owners and sales leaders on February 4th 2026"
    },
    { 
      src: "/spencon/Alexander- SPENCON 2026.jpg", 
      alt: "Alexander Odhiambo at SPENCON",
      name: "Alexander Odhiambo",
      title: "CEO Solutech Ltd",
      rating: "✔ ✔ ✔ ✔ ✔",
      topic: "How can AI support sales in FMCG?",
      dateInfo: "February 4th 2026",
      eventName: "Sales Planning and Execution Conference (SPENCON)",
      socialMedia: "f    X    in    @smartsales",
      contact: "CALL/WHATSAPP 0707 955 317",
      website: "www.smartsales.co.ke",
      joinText: "Join me and over 100+ business owners and sales leaders on February 4th 2026"
    },
  ];

  // Icon mapping for programs
  const iconMap: Record<string, any> = {
    BookOpen,
    Target,
    TrendingUp,
    Award,
    Briefcase,
    Users,
  };

  // Helper function to get appropriate icon for program
  const getProgramIcon = (program: Program) => {
    if (program.icon_name && iconMap[program.icon_name]) {
      return iconMap[program.icon_name];
    }
    return BookOpen; // Default icon
  };

  // Helper function to get price display
  const getPriceDisplay = (program: Program) => {
    if (program.is_custom) {
      return "Custom Pricing";
    }
    return program.price || "Contact for Pricing";
  };

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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance">
              Master Sales.<br />
              Consistently Hit Targets.<br />
              Transform Your Business.
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
              <Button
                variant="outline"
                size="lg"
                asChild
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link to="/contact">Contact Us</Link>
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
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Featured Event Section */}
      {featuredEvent && (
        <section className="py-12 md:py-20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <Badge variant="secondary" className="mb-3 md:mb-4 text-xs md:text-sm">
                Featured Event
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                Don't Miss Our Next Event
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Join industry leaders and transform your sales approach
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <Card className="shadow-elegant hover:shadow-hover transition-all overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Event Details */}
                  <CardContent className="p-4 md:p-8 flex-1">
                    <div className="mb-6">
                      <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4">
                        {featuredEvent.title}
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-foreground font-medium block">Date:</span>
                            <span className="text-muted-foreground">
                              {formatEventData(featuredEvent).formattedDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-foreground font-medium block">Time:</span>
                            <span className="text-muted-foreground">
                              {formatEventData(featuredEvent).formattedTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-foreground font-medium block">Attendees:</span>
                            <span className="text-muted-foreground">
                              {featuredEvent.participants_limit} Participants
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-foreground font-medium block">Location:</span>
                            <span className="text-muted-foreground">
                              {featuredEvent.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Speakers Section */}
                      <div className="bg-muted/30 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-lg mb-2">Event Highlights:</h4>
                        <p className="text-muted-foreground">
                        {featuredEvent.description ? (
                          featuredEvent.description.length > 200
                            ? `${featuredEvent.description.slice(0, 200)}...`
                            : featuredEvent.description
                        ) : "Description coming soon."}
                        </p>
                      </div>

                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Join us for this transformative event to learn from industry leaders 
                        and gain actionable strategies to drive your sales results.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">Investment:</span>
                        <span className="text-xl font-bold text-accent">
                          {formatEventData(featuredEvent).price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">Status:</span>
                        <Badge variant={
                          formatEventData(featuredEvent).statusLabel === "Open for Registration" 
                            ? "default" 
                            : "secondary"
                        }>
                          {formatEventData(featuredEvent).statusLabel}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button className="w-full" size="lg" asChild>
                          <Link to={`/events/${featuredEvent.id}`}>
                            Register Now <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full" size="lg" asChild>
                          <Link to={`/events/${featuredEvent.id}`}>
                            Learn More
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="text-center text-sm text-muted-foreground pt-2">
                        <p>Limited seats available. Secure your spot today!</p>
                      </div>
                    </div>
                  </CardContent>

                  {/* SPENCON Speakers Carousel - Updated with all 5 speakers */}
                  <div className="p-4 md:p-8 bg-muted/30 flex-1 flex items-center justify-center">
                    <div className="w-full max-w-lg">
                      <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        pagination={{ 
                          clickable: true,
                          bulletClass: 'swiper-pagination-bullet bg-primary/30',
                          bulletActiveClass: 'swiper-pagination-bullet-active bg-accent'
                        }}
                        className="rounded-lg overflow-hidden shadow-lg"
                      >
                        {spenconImages.map((image, index) => (
                          <SwiperSlide key={index}>
                            <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-gray-100 rounded-lg">
                              {/* Speaker Image */}
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center top' }}
                              />
                              
                              {/* Dark Overlay for text readability */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
                              
                              {/* Speaker Information Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                                {/* Speaker Name and Title */}
                                <div className="mb-3">
                                  <h4 className="text-xl md:text-2xl font-bold mb-1">
                                    {image.name}
                                  </h4>
                                  <p className="text-sm md:text-base opacity-90 mb-1">
                                    {image.title}
                                  </p>
                                  {image.rating && (
                                    <div className="text-yellow-400 text-sm mb-2">
                                      {image.rating}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Topic Box */}
                                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 md:p-4 mb-3">
                                  <p className="text-xs md:text-sm font-semibold mb-1 text-accent">
                                    Speaking Topic:
                                  </p>
                                  <p className="text-sm md:text-base font-medium mb-2">
                                    {image.topic}
                                  </p>
                                  <div className="text-xs md:text-sm opacity-80">
                                    <p>{image.joinText}</p>
                                    <p className="mt-1">{image.dateInfo}</p>
                                  </div>
                                </div>
                                
                                {/* Event and Contact Info */}
                                <div className="space-y-2 text-xs md:text-sm opacity-80">
                                  <p className="font-medium">{image.eventName}</p>
                                  {image.tagline && (
                                    <p className="text-accent font-medium">{image.tagline}</p>
                                  )}
                                  {image.company && (
                                    <p className="font-medium">{image.company}</p>
                                  )}
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-mono">{image.socialMedia}</span>
                                    {image.contact && (
                                      <span className="bg-black/40 px-2 py-1 rounded text-xs">
                                        {image.contact}
                                      </span>
                                    )}
                                  </div>
                                  {image.website && (
                                    <p className="text-center pt-1">{image.website}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      
                      <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Meet our distinguished speakers for SPENCON 2026
                        </p>
                        <div className="flex justify-center space-x-2 mt-2">
                          {spenconImages.map((_, idx) => (
                            <div key={idx} className="h-2 w-2 rounded-full bg-accent"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* SPENCON Section (when no featured event from API) */}
      {!featuredEvent && !loading && (
        <section className="py-12 md:py-20 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <Badge variant="secondary" className="mb-3 md:mb-4 text-xs md:text-sm">
                Upcoming Conference
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                Sales Planning & Execution Conference 2026
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Join over 100+ business owners and sales leaders for a transformative event
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <Card className="shadow-elegant hover:shadow-hover transition-all overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  {/* Conference Details */}
                  <CardContent className="p-4 md:p-8 flex-1">
                    <div className="mb-6">
                      <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4">
                        SPENCON 2026
                      </h3>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-foreground font-medium block">Date:</span>
                            <span className="text-muted-foreground">February 4th, 2026</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-foreground font-medium block">Time:</span>
                            <span className="text-muted-foreground">Full Day Conference</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="text-foreground font-medium block">Attendees:</span>
                            <span className="text-muted-foreground">100+ Business Owners & Sales Leaders</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-lg mb-2">Featured Speakers:</h4>
                        <ul className="space-y-3">
                          {spenconImages.map((speaker, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="h-2 w-2 bg-accent rounded-full mt-2 mr-3"></div>
                              <span>
                                <strong>{speaker.name}</strong> - {speaker.title}<br/>
                                <em>Topic: {speaker.topic}</em>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Transform your sales approach with insights from industry leaders. 
                        Learn practical strategies for distributor acceleration, sales driver 
                        optimization, AI in sales, talent acquisition, manufacturing sales engines, 
                        and execution excellence to achieve your 2026 targets.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">Registration:</span>
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                          Coming Soon
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button className="w-full" size="lg" asChild>
                          <a href="https://www.smartsales.co.ke/" target="_blank" rel="noopener noreferrer">
                            Get Tickets <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="outline" className="w-full" size="lg" asChild>
                          <a href="tel:0707955317">
                            Call Now: 0707 955 317
                          </a>
                        </Button>
                      </div>
                      
                      <div className="text-center text-sm text-muted-foreground pt-2">
                        <p>Follow us: @smartsales on social media</p>
                        <p>Website: www.smartsales.co.ke</p>
                      </div>
                    </div>
                  </CardContent>

                  {/* SPENCON Speakers Carousel */}
                  <div className="p-4 md:p-8 bg-muted/30 flex-1 flex items-center justify-center">
                    <div className="w-full max-w-lg">
                      <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        pagination={{ 
                          clickable: true,
                          bulletClass: 'swiper-pagination-bullet bg-primary/30',
                          bulletActiveClass: 'swiper-pagination-bullet-active bg-accent'
                        }}
                        className="rounded-lg overflow-hidden shadow-lg"
                      >
                        {spenconImages.map((image, index) => (
                          <SwiperSlide key={index}>
                            <div className="relative aspect-[3/4] md:aspect-[4/5] overflow-hidden bg-gray-100 rounded-lg">
                              {/* Speaker Image */}
                              <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: 'center top' }}
                              />
                              
                              {/* Dark Overlay for text readability */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
                              
                              {/* Speaker Information Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                                {/* Speaker Name and Title */}
                                <div className="mb-3">
                                  <h4 className="text-xl md:text-2xl font-bold mb-1">
                                    {image.name}
                                  </h4>
                                  <p className="text-sm md:text-base opacity-90 mb-1">
                                    {image.title}
                                  </p>
                                  {image.rating && (
                                    <div className="text-yellow-400 text-sm mb-2">
                                      {image.rating}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Topic Box */}
                                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 md:p-4 mb-3">
                                  <p className="text-xs md:text-sm font-semibold mb-1 text-accent">
                                    Speaking Topic:
                                  </p>
                                  <p className="text-sm md:text-base font-medium mb-2">
                                    {image.topic}
                                  </p>
                                  <div className="text-xs md:text-sm opacity-80">
                                    <p>{image.joinText}</p>
                                    <p className="mt-1">{image.dateInfo}</p>
                                  </div>
                                </div>
                                
                                {/* Event and Contact Info */}
                                <div className="space-y-2 text-xs md:text-sm opacity-80">
                                  <p className="font-medium">{image.eventName}</p>
                                  {image.tagline && (
                                    <p className="text-accent font-medium">{image.tagline}</p>
                                  )}
                                  {image.company && (
                                    <p className="font-medium">{image.company}</p>
                                  )}
                                  <div className="flex justify-between items-center pt-2">
                                    <span className="font-mono">{image.socialMedia}</span>
                                    {image.contact && (
                                      <span className="bg-black/40 px-2 py-1 rounded text-xs">
                                        {image.contact}
                                      </span>
                                    )}
                                  </div>
                                  {image.website && (
                                    <p className="text-center pt-1">{image.website}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      
                      <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          Meet our distinguished speakers for SPENCON 2026
                        </p>
                        <div className="flex justify-center space-x-2 mt-2">
                          {spenconImages.map((_, idx) => (
                            <div key={idx} className="h-2 w-2 rounded-full bg-accent"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
              <div className="h-8 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              Building Sales Excellence Across Africa
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Mastering Business Growth (MBG) is Africa's premier sales
              capability training and coaching company. We partner with
              businesses to transform their sales teams, processes, and results
              through proven methodologies and hands-on coaching.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="shadow-elegant hover:shadow-hover transition-all">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">Our Mission</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  To empower businesses with world-class sales capabilities that
                  drive sustainable growth and market leadership.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-hover transition-all">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">Our Approach</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Practical, results-driven training that combines strategy,
                  process, and execution for measurable impact.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant hover:shadow-hover transition-all">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">Our Impact</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Trusted by leading organizations across Africa to build
                  high-performing sales teams and sustainable growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dynamic Programs Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Our Programs</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of sales training and enablement programs
              designed to transform your team's performance
            </p>
          </div>
          
          {loadingPrograms ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="shadow-elegant">
                  <CardContent className="pt-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-12 w-12 rounded-lg bg-muted mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                      <div className="h-6 bg-muted rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {programs.map((program) => {
                const Icon = getProgramIcon(program);
                const displayPrice = getPriceDisplay(program);
                
                return (
                  <Card
                    key={program.id}
                    className="shadow-elegant hover:shadow-hover transition-all group"
                  >
                    <CardContent className="pt-6">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                        <Icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                      </div>
                      <h3 className="text-base md:text-lg font-semibold mb-2">
                        {program.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-4">
                        {program.description.length > 120
                          ? `${program.description.slice(0, 120)}...`
                          : program.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-base md:text-lg font-bold text-accent">
                          {displayPrice}
                        </span>
                        {program.is_custom && (
                          <Badge variant="outline" className="text-xs">
                            Custom
                          </Badge>
                        )}
                      </div>
                      <div className="mt-4">
                        <Link
                          to={`/programs/${program.id}`}
                          className="text-xs md:text-sm text-primary hover:text-accent transition-colors font-medium inline-flex items-center"
                        >
                          Learn More <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No programs available at the moment.</p>
            </div>
          )}
          
          <div className="text-center mt-8 md:mt-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/programs">View All Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Trusted by Leading Organizations
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              See what our clients say about working with MBG
            </p>
          </div>

          <Swiper
            modules={[SwiperNav, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 3500 }}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <Card className="shadow-lg rounded-2xl border border-gray-100 h-full">
                  <CardContent className="pt-8 pb-10 px-6 text-center">
                    <div className="flex justify-center mb-6">
                      <img
                        src={testimonial.logo}
                        alt={`${testimonial.company} logo`}
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                    <svg
                      className="h-8 w-8 text-accent/20 mx-auto mb-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-sm md:text-base text-muted-foreground mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div>
                      <div className="font-semibold text-base md:text-lg">{testimonial.author}</div>
                      <div className="text-xs md:text-sm text-accent">{testimonial.company}</div>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Sales Performance?
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join hundreds of businesses that have accelerated their growth with
            MBG's proven training programs
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/programs">Get Started Today</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;