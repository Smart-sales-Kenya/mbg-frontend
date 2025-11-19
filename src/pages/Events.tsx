import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Loader2, ArrowRight } from "lucide-react";
import { eventService } from "@/services/eventService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Event } from "@/types/events";

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEvents();
        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
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

  const upcomingEvents = events
    .filter((e) => e.status !== "completed" && e.registration_open)
    .map(formatEventData);

  const pastEvents = events.filter((e) => e.status === "completed").map(formatEventData);


  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Events Schedule</h1>
            <p className="text-xl text-primary-foreground/90">
              Join our upcoming programs, workshops, and events to accelerate your sales growth
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-lg text-muted-foreground">Register now to secure your spot</p>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="shadow-elegant hover:shadow-hover transition-all flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      {event.badgeLabel && <Badge variant="secondary">{event.badgeLabel}</Badge>}
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent" />
                        <span>{event.formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-accent" />
                        <span>{event.formattedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-accent" />
                        <span>{event.participants_limit} Participants</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                        {event.duration}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(() => {
                          const txt = (event.description || "").replace(/\s+/g, " ").trim();
                          return txt.length > 40 ? `${txt.slice(0, 50)}…` : txt;
                        })()}
                      </p>
                    </div>
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Investment:</span>
                        <span className="text-lg font-bold text-accent">{event.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Status:</span>
                        <Badge variant={event.statusLabel === "Open for Registration" ? "default" : "secondary"}>
                          {event.statusLabel}
                        </Badge>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          Learn More
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Past Events</h2>
            <p className="text-lg text-muted-foreground">Highlights from our recent programs and events</p>
          </div>

          {pastEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No past events to display.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pastEvents.map((event) => (
                <Card key={event.id} className="shadow-elegant">
                  <CardContent className="pt-6 text-center">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      Completed {new Date(event.end_date || event.start_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                    <p className="text-sm text-accent font-medium">{event.participants_limit} Participants</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seasonal Programs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Seasonal Programs</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We run regular monthly programs to ensure continuous learning opportunities. 
              Our 16-week sales program starts every quarter, with monthly workshops and webinars 
              scheduled throughout the year.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-elegant">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Quarterly Programs</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li>• 16-Week Sales Program (Jan, Apr, Jul, Oct)</li>
                    <li>• 6-Month Strategic Transformation (Jan, Jul)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Monthly Events</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li>• Sales Process Workshops</li>
                    <li>• Leadership Webinars</li>
                    <li>• Networking Events</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="shadow-elegant">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">Annual Events</h3>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li>• <span className="font-semibold text-primary">SPENCON</span> — Sales Planning and Execution Conference</li>
                    <li>• Brings together top sales leaders and professionals across Africa</li>
                    <li>• Focused on strategy, innovation, and performance excellence</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
