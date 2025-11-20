import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const logo = "/logo.jpg";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in and get user data
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user_data');
      setIsLoggedIn(!!token);
      if (user) {
        setUserData(JSON.parse(user));
      }
    };

    checkAuthStatus();
    
    // Listen for storage changes (login/logout from other tabs)
    window.addEventListener('storage', checkAuthStatus);
    
    // Check auth status when location changes
    const unsubscribe = () => window.removeEventListener('storage', checkAuthStatus);
    return unsubscribe;
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  // Handle navigation based on auth status
  const handleRecruitmentClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate('/register');
    }
    setMobileMenuOpen(false);
  };

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      navigate('/recruitment/user-dashboard');
    } else {
      navigate('/register');
    }
    setMobileMenuOpen(false);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call your logout endpoint
      const response = await fetch('/api/accounts/auth/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
      });

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        
        // Update state
        setIsLoggedIn(false);
        setUserData(null);
        
        // Redirect to home page
        navigate('/');
        setMobileMenuOpen(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      setIsLoggedIn(false);
      setUserData(null);
      navigate('/');
      setMobileMenuOpen(false);
    }
  };

  // Handle profile navigation
  const handleProfileClick = () => {
    navigate('/recruitment/user-profile');
    setMobileMenuOpen(false);
  };

  // Handle settings navigation
  const handleSettingsClick = () => {
    navigate('/recruitment/settings');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="MBG Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-foreground"
              }`}
            >
              About Us
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Products & Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/programs"
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">All Programs</div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Explore our complete range of sales training and enablement programs
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/programs"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Training Programs</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              16-week programs, workshops, and customized training
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/programs#enablement"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Sales Enablement</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Execution support and strategic transformation
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/programs#events"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Events & Masterclasses</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Talks, webinars, and intensive masterclasses
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Recruitment Hub with auth check */}
            <Link
              to="/recruitment"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/recruitment") ? "text-primary" : "text-foreground"
              }`}
            >
              Recruitment Hub
            </Link>
            
            <Link
              to="/team"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/team") ? "text-primary" : "text-foreground"
              }`}
            >
              Our Team
            </Link>
            <Link
              to="/events"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/events") ? "text-primary" : "text-foreground"
              }`}
            >
              Events
            </Link>
            <Link
              to="/gallery"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/gallery") ? "text-primary" : "text-foreground"
              }`}
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/contact") ? "text-primary" : "text-foreground"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* CTA Button or User Profile Dropdown */}
          <div className="hidden lg:block">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {userData?.first_name || userData?.username || "Profile"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {userData?.first_name && userData?.last_name 
                      ? `${userData.first_name} ${userData.last_name}`
                      : userData?.username || "My Account"
                    }
                    {userData?.email && (
                      <p className="text-xs font-normal text-muted-foreground mt-1">
                        {userData.email}
                      </p>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSettingsClick}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="hero" onClick={handleAuthButtonClick}>
                Register
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2">
            <Link
              to="/"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/programs"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products & Services
            </Link>
            
            {/* Mobile Recruitment Hub with auth check */}
            {isLoggedIn ? (
              <Link
                to="/recruitment"
                className="block py-2 text-sm font-medium hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recruitment Hub
              </Link>
            ) : (
              <button
                onClick={handleRecruitmentClick}
                className="block py-2 text-sm font-medium hover:text-primary w-full text-left"
              >
                Recruitment Hub
              </button>
            )}
            
            <Link
              to="/team"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Team
            </Link>
            <Link
              to="/events"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              to="/gallery"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-sm font-medium hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-2 border-t">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                    Welcome, {userData?.first_name || userData?.username || "User"}!
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleProfileClick}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleSettingsClick}
                  >
                   
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="hero" 
                  className="w-full" 
                  onClick={handleAuthButtonClick}
                >
                  Register
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;