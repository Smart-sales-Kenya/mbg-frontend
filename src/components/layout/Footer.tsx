import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic here
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">MBG</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Mastering Business Growth - Leading Sales Capability Training and Coaching across Africa
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/MasteringBusinessGrowth/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/masteringbusinessgrowth/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/MBG_ke/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/edward-ndegwa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@MasteringBusinessGrowth"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@SmartsalesKenya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/programs" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link to="/recruitment" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Programs</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/programs#training" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  16-Week Sales Program
                </Link>
              </li>
              <li>
                <Link to="/programs#training" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  Sales Process Workshop
                </Link>
              </li>
              <li>
                <Link to="/programs#enablement" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  Strategic Transformation
                </Link>
              </li>
              <li>
                <Link to="/programs#events" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  Sales Masterclass
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Subscribe to get updates on new programs and events
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                required
              />
              <Button type="submit" variant="accent" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Mastering Business Growth. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
