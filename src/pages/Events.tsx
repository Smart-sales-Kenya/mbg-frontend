import { useState } from "react";
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

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    industry: "",
    experience: "",
    expectations: "",
    hearAbout: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleRegister = (index) => {
    setSelectedEvent(index);
    setIsDialogOpen(true);
    setSubmitSuccess(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        industry: "",
        experience: "",
        expectations: "",
        hearAbout: ""
      });
      setIsDialogOpen(false);
      setSubmitSuccess(false);
    }, 3000);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSubmitSuccess(false);
  };

  const upcomingEvents = [
    {
      title: "MBG Sales Program - Cohort 12",
      date: "Starting February 15, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Pine Tree Plaza, Nairobi",
      type: "16-Week Program",
      capacity: "20 Participants",
      status: "Open for Registration",
      description: "Comprehensive 16-week sales training program for business owners and sales managers. Build your commercial engine from strategy to execution.",
      price: "Ksh 76,560",
      badge: "Popular"
    },
    {
      title: "Sales Process Workshop",
      date: "March 8, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Pine Tree Plaza, Nairobi",
      type: "1-Day Workshop",
      capacity: "30 Participants",
      status: "Open for Registration",
      description: "Design and document your sales process in one intensive day. Walk away with a ready-to-use framework.",
      price: "Ksh 12,760",
      badge: "Quick Start"
    },
    {
      title: "Sales Leadership Webinar",
      date: "February 28, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Online (Zoom)",
      type: "2-Hour Webinar",
      capacity: "100 Participants",
      status: "Open for Registration",
      description: "Modern sales leadership strategies and mindset shifts for driving team performance.",
      price: "Free",
      badge: "Online"
    },
    {
      title: "MBG Graduation Ceremony - Cohort 11",
      date: "March 22, 2025",
      time: "3:00 PM - 6:00 PM",
      location: "Nairobi Conference Center",
      type: "Graduation",
      capacity: "Invitation Only",
      status: "Invite Only",
      description: "Celebrating the achievements of our latest graduating cohort. Guest speakers and networking session included.",
      price: "Invitation Only",
      badge: "Special Event"
    },
    {
      title: "Sales Masterclass: Strategic Selling",
      date: "April 12-13, 2025",
      time: "9:00 AM - 5:00 PM",
      location: "Pine Tree Plaza, Nairobi",
      type: "2-Day Intensive",
      capacity: "25 Participants",
      status: "Early Bird Available",
      description: "Intensive masterclass covering end-to-end sales strategy, process design, and value-based execution with real-world cases.",
      price: "Custom Pricing",
      badge: "Intensive"
    }
  ];

  const pastEvents = [
    {
      title: "MBG Sales Program - Cohort 11",
      date: "Completed January 2025",
      participants: "18 Graduates"
    },
    {
      title: "End of Year Sales Summit",
      date: "December 2024",
      participants: "150 Attendees"
    },
    {
      title: "Sales Process Workshop",
      date: "November 2024",
      participants: "28 Participants"
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
              Events & Training Schedule
            </h1>
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
            <p className="text-lg text-muted-foreground">
              Register now to secure your spot
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-hover transition-all flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    {event.badge && (
                      <Badge variant="secondary">{event.badge}</Badge>
                    )}
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-accent" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent" />
                      <span>{event.capacity}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
                      {event.type}
                    </div>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Investment:</span>
                      <span className="text-lg font-bold text-accent">{event.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Status:</span>
                      <Badge variant={event.status === "Open for Registration" ? "default" : "secondary"}>
                        {event.status}
                      </Badge>
                    </div>
                    {event.status === "Open for Registration" || event.status === "Early Bird Available" ? (
                      <Button variant="hero" className="w-full" onClick={() => handleRegister(index)}>
                        Register Now
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>
                        {event.status}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Past Events</h2>
            <p className="text-lg text-muted-foreground">
              Highlights from our recent programs and events
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pastEvents.map((event, index) => (
              <Card key={index} className="shadow-elegant">
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                  <p className="text-sm text-accent font-medium">{event.participants}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Monthly Training Programs
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We run regular monthly programs to ensure continuous learning opportunities. 
              Our 16-week sales program starts every quarter, with monthly workshops and webinars 
              scheduled throughout the year.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
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
            </div>
          </div>
        </div>
      </section>



      <Footer />

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedEvent !== null ? upcomingEvents[selectedEvent].title : "Event Registration"}
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
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 700 000 000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Professional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your Company Name"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Job Title/Position *</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="Sales Manager"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select
                      name="industry"
                      value={formData.industry}
                      onValueChange={(value) => handleSelectChange("industry", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Sales Experience *</Label>
                  <Select
                    name="experience"
                    value={formData.experience}
                    onValueChange={(value) => handleSelectChange("experience", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                      <SelectItem value="1-3">1-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-10">5-10 years</SelectItem>
                      <SelectItem value="10-plus">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Additional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="expectations">What do you hope to gain from this event?</Label>
                  <Textarea
                    id="expectations"
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleInputChange}
                    placeholder="Share your goals and expectations..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hearAbout">How did you hear about us?</Label>
                  <Select
                    name="hearAbout"
                    value={formData.hearAbout}
                    onValueChange={(value) => handleSelectChange("hearAbout", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="referral">Referral from friend/colleague</SelectItem>
                      <SelectItem value="email">Email newsletter</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Event Details Summary */}
              {selectedEvent !== null && (
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold">Event Summary</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Date:</strong> {upcomingEvents[selectedEvent].date}</p>
                    <p><strong>Time:</strong> {upcomingEvents[selectedEvent].time}</p>
                    <p><strong>Location:</strong> {upcomingEvents[selectedEvent].location}</p>
                    <p><strong>Investment:</strong> {upcomingEvents[selectedEvent].price}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={closeDialog}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Submitting..." : "Complete Registration"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;