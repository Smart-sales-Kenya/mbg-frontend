"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  TrendingUp,
  Award,
  Home,
  Edit,
  User,
  Building,
  Users,
  Target
} from "lucide-react";

// Environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: get CSRF token
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

interface SubmissionData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_profile: string;
  years_experience: string;
  industries: string;
  has_team_experience: string;
  team_size: number | null;
  bd_confidence: number;
  am_confidence: number;
  sm_confidence: number | null;
  achievements: string;
  education: string;
  certifications: string;
  status: string;
  submitted_at: string;
  role_interests: Array<{
    id: number;
    role: string;
  }>;
  // Additional fields for editing
  bd_approach?: string;
  bd_tools?: string;
  bd_example?: string;
  am_approach?: string;
  am_challenges?: string;
  am_experience?: string;
  sm_experience?: string;
  sm_performance?: string;
  sm_tools?: string;
  targets?: string;
  awards?: string;
  resume?: string;
  consent?: boolean;
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [mySubmission, setMySubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/get-csrf-token/`, {
        credentials: "include",
      });
    } catch (error) {
      console.error("CSRF token fetch error:", error);
    }
  };

  const fetchSubmissionData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Get CSRF token first
      await fetchCsrfToken();

      const response = await fetch(`${API_BASE_URL}/api/sales-capability/submissions/`, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
        credentials: "include",
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        toast.error("Server error: Check API endpoint configuration.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle different types of errors
        if (data.detail) {
          toast.error(data.detail);
        } else if (data.non_field_errors) {
          toast.error(data.non_field_errors.join(' '));
        } else {
          const errorMsg = Object.values(data).flat().join(" ") || "Failed to fetch submission data!";
          toast.error(errorMsg);
        }
        return;
      }

      // Get the most recent submission
      if (data.length > 0) {
        setMySubmission(data[0]);
      } else {
        setMySubmission(null);
      }

    } catch (error) {
      console.error("Error fetching submission data:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissionData();
  }, [navigate]);

  const handleEditSubmission = () => {
    if (mySubmission) {
      // Navigate to form with existing data for editing
      navigate('/recruitment/form', { 
        state: { 
          submissionId: mySubmission.id,
          existingData: mySubmission 
        } 
      });
    }
  };

  const handleDeleteSubmission = async () => {
    if (!mySubmission || !confirm("Are you sure you want to delete your submission? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      await fetchCsrfToken();

      const response = await fetch(`${API_BASE_URL}/api/sales-capability/submissions/${mySubmission.id}/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Submission deleted successfully!");
        setMySubmission(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Failed to delete submission");
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getConfidenceLabel = (rating: number) => {
    const labels: { [key: number]: string } = {
      1: 'Beginner',
      2: 'Developing',
      3: 'Competent',
      4: 'Proficient',
      5: 'Expert'
    };
    return labels[rating] || 'Not rated';
  };

  const getConfidencePercentage = (rating: number) => {
    return (rating / 5) * 100;
  };

  const getExperienceLabel = (years: string) => {
    const experienceMap: { [key: string]: string } = {
      '0-1': '0-1 years',
      '1-3': '1-3 years',
      '3-6': '3-6 years',
      '6-10': '6-10 years',
      '10+': '10+ years',
    };
    return experienceMap[years] || years;
  };

  const getEducationLabel = (education: string) => {
    const educationMap: { [key: string]: string } = {
      'high-school': 'High School',
      'diploma': 'Diploma',
      'bachelors': "Bachelor's Degree",
      'masters': "Master's Degree",
      'phd': 'PhD',
    };
    return educationMap[education] || education;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'reviewed':
        return 'Under Review';
      default:
        return 'Pending Review';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getRoleIcon = (role: string) => {
    if (role.includes('Manager')) return <Users className="h-4 w-4" />;
    if (role.includes('Representative')) return <User className="h-4 w-4" />;
    if (role.includes('Operations')) return <Building className="h-4 w-4" />;
    return <Target className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Clock className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!mySubmission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Submission Found</CardTitle>
            <CardDescription>You haven't submitted an application yet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => navigate('/recruitment/form')}
            >
              Submit Application
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <Home className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Application</h1>
                <p className="text-muted-foreground mt-1">Track your sales capability submission</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/recruitment/user-profile')}
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button
                onClick={handleEditSubmission}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Submission
              </Button>
              <Badge className={`text-lg px-4 py-2 border ${getStatusColor(mySubmission.status)}`}>
                <Clock className="h-4 w-4 mr-2" />
                {getStatusText(mySubmission.status)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Status Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            Your application was submitted on {formatDate(mySubmission.submitted_at)}. 
            {mySubmission.status === 'pending' && ' Our team will review it and get back to you soon!'}
            {mySubmission.status === 'reviewed' && ' Your application is currently under review by our team.'}
            {mySubmission.status === 'accepted' && ' Congratulations! Your application has been accepted.'}
            {mySubmission.status === 'rejected' && ' Thank you for your application. We appreciate your interest.'}
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-semibold">{mySubmission.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{mySubmission.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {mySubmission.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {mySubmission.location}
                    </p>
                  </div>
                </div>
                {mySubmission.linkedin_profile && (
                  <div>
                    <p className="text-sm text-muted-foreground">LinkedIn Profile</p>
                    <a 
                      href={mySubmission.linkedin_profile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                    >
                      <Building className="h-4 w-4" />
                      View Profile →
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Interests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Role Interests
                </CardTitle>
                <CardDescription>Positions you're interested in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {mySubmission.role_interests?.map((interest) => (
                    <div key={interest.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        {getRoleIcon(interest.role)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{interest.role}</p>
                        <p className="text-sm text-muted-foreground">
                          {interest.role.includes('Manager') && 'Leadership and team management role'}
                          {interest.role.includes('Representative') && 'Individual contributor sales role'}
                          {interest.role.includes('Operations') && 'Sales process and analytics role'}
                          {interest.role.includes('Territory') && 'Regional sales management role'}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-center py-4">No role interests specified</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Experience & Industries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience & Industries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Years of Experience</p>
                    <p className="font-semibold">{getExperienceLabel(mySubmission.years_experience)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Management</p>
                    <p className="font-semibold">
                      {mySubmission.has_team_experience === 'yes' 
                        ? `Yes (${mySubmission.team_size || 'N/A'} reports)` 
                        : 'No'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industries Worked In</p>
                  <p className="font-semibold">{mySubmission.industries}</p>
                </div>
              </CardContent>
            </Card>

            {/* Capability Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Capability Ratings
                </CardTitle>
                <CardDescription>Self-assessed confidence levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mySubmission.bd_confidence && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Business Development</span>
                      <span className="text-sm text-muted-foreground">
                        {getConfidenceLabel(mySubmission.bd_confidence)} ({mySubmission.bd_confidence}/5)
                      </span>
                    </div>
                    <Progress value={getConfidencePercentage(mySubmission.bd_confidence)} className="h-3" />
                  </div>
                )}
                {mySubmission.am_confidence && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Account Management</span>
                      <span className="text-sm text-muted-foreground">
                        {getConfidenceLabel(mySubmission.am_confidence)} ({mySubmission.am_confidence}/5)
                      </span>
                    </div>
                    <Progress value={getConfidencePercentage(mySubmission.am_confidence)} className="h-3" />
                  </div>
                )}
                {mySubmission.sm_confidence && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Sales Management</span>
                      <span className="text-sm text-muted-foreground">
                        {getConfidenceLabel(mySubmission.sm_confidence)} ({mySubmission.sm_confidence}/5)
                      </span>
                    </div>
                    <Progress value={getConfidencePercentage(mySubmission.sm_confidence)} className="h-3" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            {mySubmission.achievements && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Top Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-sm leading-relaxed">
                    {mySubmission.achievements}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Education & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Education & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Highest Education Level</p>
                  <p className="font-semibold">
                    {getEducationLabel(mySubmission.education)}
                  </p>
                </div>
                {mySubmission.certifications && (
                  <div>
                    <p className="text-sm text-muted-foreground">Certifications</p>
                    <p className="font-semibold">{mySubmission.certifications}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(mySubmission.submitted_at)}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${mySubmission.status === 'reviewed' ? '' : 'opacity-50'}`}>
                  <div className={`rounded-full p-2 ${mySubmission.status === 'reviewed' ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Under Review</p>
                    <p className="text-xs text-muted-foreground">
                      {mySubmission.status === 'reviewed' ? 'In Progress' : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 ${mySubmission.status === 'accepted' || mySubmission.status === 'rejected' ? '' : 'opacity-50'}`}>
                  <div className={`rounded-full p-2 ${
                    mySubmission.status === 'accepted' ? 'bg-green-600' : 
                    mySubmission.status === 'rejected' ? 'bg-red-600' : 'bg-gray-300'
                  }`}>
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">Decision</p>
                    <p className="text-xs text-muted-foreground">
                      {mySubmission.status === 'accepted' ? 'Accepted' : 
                       mySubmission.status === 'rejected' ? 'Not Selected' : 'Awaiting'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleEditSubmission}
                  className="w-full justify-start"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Submission
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/recruitment/user-profile')}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/')}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleDeleteSubmission}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Delete Submission
                </Button>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-900">What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-green-900">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Our team is reviewing your application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>We'll contact you via email or phone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">•</span>
                    <span>Keep an eye on your inbox for updates</span>
                  </li>
                  {mySubmission.status === 'pending' && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      <span>You can edit your submission anytime</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  If you have any questions about your application, please contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>recruitment@company.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>+1 (555) 123-4567</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;