import { useState, useEffect } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Helper function to get CSRF token from browser cookies.
 * Django automatically sets it if you have `{% csrf_token %}` in templates
 * or `CSRF_COOKIE_HTTPONLY=False` in settings.
 */
function getCSRFToken() {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  return "";
}

const Contact = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch CSRF token on mount
  useEffect(() => {
    const token = getCSRFToken();
    if (token) {
      setCsrfToken(token);
    } else {
      // Optional: request CSRF token from Django endpoint
      fetch(`${API_BASE_URL}/api/get-csrf-token/`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setCsrfToken(data.csrfToken))
        .catch(() => console.warn("Could not fetch CSRF token."));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include", // ensures cookies (including csrf) are sent
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit message");
      }

      const data = await response.json();
      toast.success(data.message || "Message sent successfully!");

      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Ready to grow your business? Let's start the conversation.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            {[{
              icon: <MapPin className="h-5 w-5 text-accent" />,
              title: "Office Address",
              text: (
                <>
                  Pine Tree Plaza, Kaburu Drive<br />
                  Off Ngong Road<br />
                  Nairobi, Kenya
                </>
              )
            },
            {
              icon: <Phone className="h-5 w-5 text-accent" />,
              title: "Phone",
              text: (
                <>
                 Office  WhatsApp +254 707 955 317 <br />  Edward +254 734 516 091
                </>
              )
            },
            {
              icon: <Mail className="h-5 w-5 text-accent" />,
              title: "Email",
              text: (
                <>
                  info@smartsales.co.ke<br /> info@smartsales.co.ke
                </>
              )
            },
            {
              icon: <Clock className="h-5 w-5 text-accent" />,
              title: "Business Hours",
              text: (
                <>
                  Mon - Fri: 8:00 AM - 6:00 PM<br />
                  Sat: 9:00 AM - 2:00 PM<br />
                  Sun: Closed
                </>
              )
            }].map((item, idx) => (
              <Card key={idx} className="shadow-elegant">
                <CardContent className="pt-6 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="bg-accent/5 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Join MBG Sellers Community</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with fellow sales professionals on WhatsApp.
              </p>
              <Button variant="hero" className="w-full">
                Join on WhatsApp
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(val) =>
                          setFormData({ ...formData, subject: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="program">Program Inquiry</SelectItem>
                          <SelectItem value="recruitment">Recruitment</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Visit Our Office</h2>
          <p className="text-muted-foreground mb-6">
            Pine Tree Plaza, Kaburu Drive, Off Ngong Road, Nairobi
          </p>
          <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-elegant">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.811280259089!2d36.7659499738673!3d-1.296994835629109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a625f207fb3%3A0xaec14f07f52eb27b!2sPine%20Tree%20Plaza%2C%20Kaburu%20Drive%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1730727612001!5m2!1sen!2ske"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Grow Your Business with MBG
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Transform your sales capabilities and drive sustainable growth.
          </p>
          <Button variant="hero" size="lg">
            Train with Us
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;