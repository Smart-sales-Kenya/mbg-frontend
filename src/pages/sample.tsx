import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  id: number;
  title: string;
  category: string;
  start_date: string;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location: string;
  participants_limit: number;
  duration?: string | null;
  description: string;
  investment_amount?: string | null;
  currency: string;
  is_free: boolean;
  status: string;
  registration_open: boolean;
  image?: string | null;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    industry: "",
    experience: "",
    expectations: "",
    hearAbout: "",
  });

  useEffect(() => {
    axios
      .get<Event[]>("http://127.0.0.1:8000/api/events/")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
    setSubmitSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!selectedEvent) return;
    setIsSubmitting(true);

    try {
      await axios.post(`http://127.0.0.1:8000/api/events/${selectedEvent.id}/registrations/`, {
        ...formData,
        event: selectedEvent.id,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setIsDialogOpen(false);
        setSubmitSuccess(false);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          position: "",
          industry: "",
          experience: "",
          expectations: "",
          hearAbout: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Error submitting registration:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSubmitSuccess(false);
  };
const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime && !endTime) return "All day";

    const format = (time: string) => {
      const [hour, minute] = time.split(":");
      const date = new Date();
      date.setHours(parseInt(hour), parseInt(minute));
      return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    };

    return `${format(startTime)} - ${format(endTime)}`;
  };
  const formatDateRange = (startDate: string, endDate?: string | null) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    const start = new Date(startDate).toLocaleDateString(undefined, options);

    if (endDate) {
      const end = new Date(endDate).toLocaleDateString(undefined, options);
      return `${start} - ${end}`;
    }
    return start;
  };  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-500">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Events & Training Schedule
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Join our upcoming programs, workshops, and events to accelerate your sales growth
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-lg text-muted-foreground">
              Register now to secure your spot
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {events.length > 0 ? (
              events.map((event) => (
                <Card key={event.id} className="shadow-elegant hover:shadow-hover transition-all flex flex-col">
                   <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <Badge variant="secondary">
                      {event.category || "Event"}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span>
                        {formatDateRange(event.start_date, event.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span>{formatTimeRange(event.start_time, event.end_time)}</span>
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
                        {event.duration || "Program"}
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Investment:</span>
                        <span className="text-lg font-bold text-accent">
                          {event.is_free
                            ? "Free"
                            : `${event.currency} ${event.investment_amount}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Status:</span>
                        <Badge variant={event.status === "open" ? "default" : "secondary"}>
                          {event.status}
                        </Badge>
                      </div>
                      {event.registration_open ? (
                        <Button
                          variant="hero"
                          className="w-full"
                          onClick={() => handleRegister(event)}
                        >
                          Register Now
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" disabled>
                          Registration Closed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">No events available.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedEvent?.title || "Event Registration"}
            </DialogTitle>
            <DialogDescription>
              Fill in your details to register for this event. We'll send you a confirmation email shortly.
            </DialogDescription>
          </DialogHeader>

          {submitSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Registration Successful!</h3>
              <p className="text-muted-foreground">
                Thank you for registering. We'll send you a confirmation email with event details.
              </p>
            </div>
          ) : (
            <>
              {/* Personal Information */}
              <div className="space-y-4 mt-4">
                <Label>Full Name *</Label>
                <Input name="fullName" value={formData.fullName} onChange={handleInputChange} />
                <Label>Email *</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} />
                <Label>Phone *</Label>
                <Input name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>

              {/* Company Info */}
              <div className="space-y-4 mt-4">
                <Label>Company *</Label>
                <Input name="company" value={formData.company} onChange={handleInputChange} />
                <Label>Position *</Label>
                <Input name="position" value={formData.position} onChange={handleInputChange} />
              </div>

              {/* Additional */}
              <div className="space-y-4 mt-4">
                <Label>Expectations</Label>
                <Textarea name="expectations" value={formData.expectations} onChange={handleInputChange} />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Complete Registration"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
