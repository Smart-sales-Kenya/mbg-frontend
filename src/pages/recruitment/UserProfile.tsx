"use client";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Linkedin, CheckCircle, Clock, XCircle, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

// Environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: get CSRF token
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

interface ProfileData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin_profile: string;
  years_experience: string;
  industries: string;
  status: string;
  submitted_at: string;
  role_interests?: Array<{
    id: number;
    role: string;
  }>;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
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

  useEffect(() => {
    const fetchProfileData = async () => {
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
            const errorMsg = Object.values(data).flat().join(" ") || "Failed to fetch profile data!";
            toast.error(errorMsg);
          }
          return;
        }

        // Get the most recent submission
        if (data.length > 0) {
          const submission = data[0];
          setProfileData({
            id: submission.id,
            full_name: submission.full_name,
            email: submission.email,
            phone: submission.phone,
            location: submission.location,
            linkedin_profile: submission.linkedin_profile,
            years_experience: submission.years_experience,
            industries: submission.industries,
            status: submission.status,
            submitted_at: submission.submitted_at,
            role_interests: submission.role_interests || []
          });
        } else {
          setProfileData(null);
        }

      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const getInitials = (fullName: string) => {
    return fullName?.split(' ').map(name => name.charAt(0)).join('').toUpperCase() || 'U';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'reviewed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'reviewed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/recruitment/user-dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600">No profile information found</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't submitted a sales capability form yet.</p>
              <Button onClick={() => navigate('/recruitment/form')}>
                Create Your Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/recruitment/user-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Professional Profile</h1>
              <p className="text-gray-600">Your application information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid gap-6">
            {/* Profile Summary Card */}
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {getInitials(profileData.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{profileData.full_name}</CardTitle>
                <CardDescription>
                  {profileData.location} • Submitted on {new Date(profileData.submitted_at).toLocaleDateString()}
                </CardDescription>
                {profileData.linkedin_profile && (
                  <div className="mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={profileData.linkedin_profile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>View LinkedIn Profile</span>
                      </a>
                    </Button>
                  </div>
                )}
              </CardHeader>
            </Card>

            {/* Personal Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your contact details and basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Full Name */}
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900 mt-1">{profileData.full_name}</p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start space-x-4">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <p className="text-gray-900 mt-1">{profileData.email}</p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="text-gray-900 mt-1">{profileData.phone}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-50 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="text-gray-900 mt-1">{profileData.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>
                  Your experience and role preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Years of Experience */}
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Years of Experience</label>
                    <p className="text-gray-900 mt-1">{getExperienceLabel(profileData.years_experience)}</p>
                  </div>
                </div>

                {/* Industries */}
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-50 p-2 rounded-lg">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <span className="text-teal-600 font-bold text-sm">I</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Industries</label>
                    <p className="text-gray-900 mt-1">{profileData.industries}</p>
                  </div>
                </div>

                {/* Role Interests */}
                {profileData.role_interests && profileData.role_interests.length > 0 && (
                  <div className="flex items-start space-x-4">
                    <div className="bg-pink-50 p-2 rounded-lg">
                      <div className="h-5 w-5 flex items-center justify-center">
                        <span className="text-pink-600 font-bold text-sm">R</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Role Interests</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {profileData.role_interests.map((interest) => (
                          <span 
                            key={interest.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                          >
                            {interest.role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Current status of your submission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center justify-between p-4 border rounded-lg ${getStatusColor(profileData.status)}`}>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(profileData.status)}
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <p className="font-semibold">{getStatusText(profileData.status)}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Submitted: {new Date(profileData.submitted_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Actions</CardTitle>
                <CardDescription>
                  Manage your professional profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigate('/recruitment/form')}
                    className="flex-1"
                  >
                    Update Profile Information
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/recruitment/user-dashboard')}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;