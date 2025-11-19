import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2 } from "lucide-react";
import { toast } from "sonner";
import { eventService } from "@/services/eventService";
import { Event } from "@/types/events";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

 useEffect(() => {
  const fetchEvent = async () => {
    if (!id) return; // Exit early if no id

    try {
      setLoading(true);
      const data = await eventService.getEvent(id); // use string ID directly
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  fetchEvent();
}, [id]);


const handleRegister = () => {
  if (!event) {
    toast.error("Event not loaded yet.");
    return;
  }
  // Always pass the ID, state is optional
  navigate(`/events/${event.id}/register`, { state: { event } });
};



  const handleShare = async () => {
    if (!event) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.tagline || "",
          url: window.location.href,
        });
        toast.success("Event shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (time?: string) =>
    time
      ? new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "N/A";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Loading event details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-lg">Event not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero / Header */}
      <section className="gradient-hero text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => navigate("/events")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex-1">
                {event.category && (
                  <Badge variant="secondary" className="mb-4">
                    {event.category}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                {event.subtitle && (
                  <h2 className="text-xl md:text-2xl font-semibold mb-4 text-primary-foreground/90">
                    {event.subtitle}
                  </h2>
                )}
                {event.tagline && (
                  <p className="text-lg text-primary-foreground/90 opacity-90">{event.tagline}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Event Meta */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/20 rounded-lg">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Date</p>
                  <p className="font-semibold">
                    {formatDate(event.start_date)} - {event.end_date ? formatDate(event.end_date) : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/20 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Time</p>
                  <p className="font-semibold">
                    {formatTime(event.start_time)} - {formatTime(event.end_time)} Daily
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/20 rounded-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Location</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-foreground/20 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm opacity-80">Capacity</p>
                  <p className="font-semibold">{event.participants_limit} Participants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {event.image && (
                <Card>
                  <CardContent className="p-0">
                    <img src={event.image} alt={event.title} className="w-full h-64 object-cover rounded-lg" />
                  </CardContent>
                </Card>
              )}

              {/* About Section */}
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">About {event.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">{event.description}</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-accent mb-2">
                      {event.is_free
                        ? "FREE"
                        : `${event.currency} ${event.investment_amount?.toLocaleString()}`}
                    </div>
                    <Badge>
                      {event.registration_open ? "Open for Registration" : "Registration Closed"}
                    </Badge>
                  </div>

                  <Button variant="hero" size="lg" className="w-full" onClick={handleRegister}>
                    Register Now
                  </Button>

                  <div className="mt-6 text-sm space-y-3">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{event.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">{event.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
             
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetails;
